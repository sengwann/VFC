/*
 * Village Deactivation Workflow transitions, each as one function that runs
 * INSIDE a transaction supplied by the caller (see village-deactivation-
 * service.ts, which opens the Serializable transaction and retries it). Keeping
 * them transaction-local lets them be unit tested with a fake client and lets
 * the worker and the actions share the exact same code.
 *
 * Concurrency design (verified on PostgreSQL 16, see the design notes):
 *  - approve, cancel and complete start with lockVillageForTransition, an
 *    UPDATE of the village row. It takes the row lock AND changes the row
 *    version, so a Serializable mutation or transition that started from an
 *    older snapshot fails with 40001 and is retried by withSerializableRetry.
 *  - every write to a request is conditional on the status that was read
 *    (and, for cancel/complete, on the deadline), so only one terminal outcome
 *    can ever be written.
 *  - the clock is the database clock (clock_timestamp()), never a browser or
 *    process timer. The deadline is read from the request, never recalculated.
 *
 * Nothing here redirects or throws for an expected outcome: it returns one, so
 * the audit entries written for a refused transition are committed with it.
 * Notifications are not sent here; they are informational and must never
 * block or alter a transition (Phase 6 sends them after commit).
 */

import { AuditActionType } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import type { DeactivationAuditMetadata } from "../../../lib/audit";
import {
  parseRequiredReason,
  type ReasonResult,
} from "./deactivation-input";
import {
  computeCooldownEndsAt,
  computeScheduledDeactivationAt,
  evaluateApproval,
  evaluateCancellation,
  evaluateCompletion,
  evaluateNewRequest,
  evaluateRejection,
  type CancellationBlockReason,
  type CompletionBlockReason,
  type DecisionBlockReason,
  type DeactivationRequestStatus,
  type DeactivationVillageStatus,
  type RequestBlockReason,
} from "./village-deactivation-rules";

type Tx = Prisma.TransactionClient;

export const COMPLETED_BY_WORKER = "SYSTEM:deactivation-worker";

/** The database clock. Whole milliseconds, which is what the columns store. */
export async function readDatabaseNow(tx: Tx): Promise<Date> {
  const rows = await tx.$queryRaw<{ now: Date }[]>`
    SELECT clock_timestamp() AS "now"
  `;

  return new Date(rows[0].now);
}

/**
 * Takes the village row lock and bumps its row version, then returns its
 * lifecycle status (null when the village does not exist). The timestamp is
 * written as UTC because the column is TIMESTAMP(3) without a time zone.
 */
export async function lockVillageForTransition(
  tx: Tx,
  villageId: string,
): Promise<DeactivationVillageStatus | null> {
  const rows = await tx.$queryRaw<{ status: string }[]>`
    UPDATE "Village"
    SET "updatedAt" = (now() AT TIME ZONE 'UTC')
    WHERE "id" = ${villageId}
    RETURNING "status"::text AS "status"
  `;

  return (rows[0]?.status as DeactivationVillageStatus | undefined) ?? null;
}

/** Shared lock only: for the submit check, which writes no village data. */
async function readVillageStatusShared(
  tx: Tx,
  villageId: string,
): Promise<DeactivationVillageStatus | null> {
  const rows = await tx.$queryRaw<{ status: string }[]>`
    SELECT "status"::text AS "status"
    FROM "Village"
    WHERE "id" = ${villageId}
    FOR SHARE
  `;

  return (rows[0]?.status as DeactivationVillageStatus | undefined) ?? null;
}

async function audit(
  tx: Tx,
  input: {
    actionType: AuditActionType;
    entityType?: AuditEntityType;
    entityId: string | null;
    villageId: string | null;
    actorUserId: string | null;
    metadata: DeactivationAuditMetadata;
  },
): Promise<void> {
  await createAuditLog(tx, {
    actionType: input.actionType,
    entityType: input.entityType ?? AuditEntityType.DEACTIVATION_REQUEST,
    entityId: input.entityId,
    villageId: input.villageId,
    actorUserId: input.actorUserId,
    metadata: input.metadata as Prisma.InputJsonValue,
  });
}

interface ActorRow {
  id: string;
  role: string;
  villageId: string | null;
  membershipStatus: string | null;
}

/** Re-reads the actor from the database: the session can be stale. */
async function isAuthorizedChief(
  tx: Tx,
  actorUserId: string,
  villageId: string,
): Promise<boolean> {
  const actor = (await tx.user.findUnique({
    where: { id: actorUserId },
    select: { id: true, role: true, villageId: true, membershipStatus: true },
  })) as ActorRow | null;

  return (
    actor !== null &&
    actor.role === "CHIEF" &&
    actor.villageId === villageId &&
    actor.membershipStatus === "ACTIVE"
  );
}

async function isAuthorizedAdmin(tx: Tx, actorUserId: string): Promise<boolean> {
  const actor = (await tx.user.findUnique({
    where: { id: actorUserId },
    select: { id: true, role: true, villageId: true, membershipStatus: true },
  })) as ActorRow | null;

  return actor !== null && actor.role === "SYSTEM_ADMIN";
}

// ---------------------------------------------------------------- submit

export type SubmitOutcome =
  | { kind: "created"; requestId: string }
  | { kind: "invalid_reason"; error: Extract<ReasonResult, { ok: false }>["error"] }
  | { kind: "forbidden" }
  | { kind: "blocked"; reason: RequestBlockReason; cooldownEndsAt?: Date };

/**
 * The Chief submits a request for their own village. `villageId` comes from
 * the session, never from the form. A pending request changes nothing about
 * the village.
 */
export async function submitDeactivationRequestInTx(
  tx: Tx,
  params: {
    actorUserId: string;
    villageId: string;
    reason: unknown;
    now?: Date;
  },
): Promise<SubmitOutcome> {
  const { actorUserId, villageId } = params;
  const reason = parseRequiredReason(params.reason);

  if (!reason.ok) {
    return { kind: "invalid_reason", error: reason.error };
  }

  if (!(await isAuthorizedChief(tx, actorUserId, villageId))) {
    await audit(tx, {
      actionType: AuditActionType.CREATE,
      entityId: null,
      villageId,
      actorUserId,
      metadata: { outcome: "BLOCKED", blockReason: "FORBIDDEN" },
    });

    return { kind: "forbidden" };
  }

  const villageStatus = await readVillageStatusShared(tx, villageId);

  if (villageStatus === null) {
    return { kind: "blocked", reason: "VILLAGE_NOT_ACTIVE" };
  }

  const now = params.now ?? (await readDatabaseNow(tx));
  const existing = await tx.villageDeactivationRequest.findMany({
    where: { villageId },
    select: { status: true, cooldownEndsAt: true },
  });
  const cooldowns = existing
    .filter((row) => row.status === "REJECTED" && row.cooldownEndsAt)
    .map((row) => (row.cooldownEndsAt as Date).getTime());

  const evaluation = evaluateNewRequest({
    villageStatus,
    existingStatuses: existing.map(
      (row) => row.status as DeactivationRequestStatus,
    ),
    latestCooldownEndsAt:
      cooldowns.length > 0 ? new Date(Math.max(...cooldowns)) : null,
    now,
  });

  if (!evaluation.ok) {
    if (evaluation.reason === "COOLDOWN_ACTIVE") {
      // Cooldown rejections are part of the audit trail (rules, section 10).
      await audit(tx, {
        actionType: AuditActionType.CREATE,
        entityId: null,
        villageId,
        actorUserId,
        metadata: {
          outcome: "BLOCKED",
          blockReason: "COOLDOWN_ACTIVE",
          cooldownEndsAt: evaluation.cooldownEndsAt?.toISOString(),
        },
      });
    }

    return {
      kind: "blocked",
      reason: evaluation.reason,
      cooldownEndsAt: evaluation.cooldownEndsAt,
    };
  }

  const created = await tx.villageDeactivationRequest.create({
    data: {
      villageId,
      requesterUserId: actorUserId,
      reason: reason.reason,
    },
    select: { id: true },
  });

  await audit(tx, {
    actionType: AuditActionType.CREATE,
    entityId: created.id,
    villageId,
    actorUserId,
    metadata: {
      requestId: created.id,
      requesterUserId: actorUserId,
      reason: reason.reason,
      outcome: "SUCCESS",
      newStatus: "PENDING",
    },
  });

  return { kind: "created", requestId: created.id };
}

// --------------------------------------------------------------- approve

export type ApproveOutcome =
  | {
      kind: "approved";
      requestId: string;
      villageId: string;
      approvedAt: Date;
      scheduledDeactivationAt: Date;
    }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "blocked"; reason: DecisionBlockReason };

/**
 * A System Admin approves a PENDING request on an ACTIVE village. The approval
 * and the deadline are written in one statement, so there is never an approved
 * request without a deadline. It does NOT change Village.status: read-only
 * mode comes from the APPROVED request itself.
 */
export async function approveDeactivationRequestInTx(
  tx: Tx,
  params: { requestId: string; actorUserId: string; now?: Date },
): Promise<ApproveOutcome> {
  const { requestId, actorUserId } = params;

  if (!(await isAuthorizedAdmin(tx, actorUserId))) {
    await audit(tx, {
      actionType: AuditActionType.APPROVE,
      entityId: requestId,
      villageId: null,
      actorUserId,
      metadata: {
        requestId,
        outcome: "BLOCKED",
        blockReason: "FORBIDDEN",
      },
    });

    return { kind: "forbidden" };
  }

  const request = await tx.villageDeactivationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, villageId: true, status: true },
  });

  if (!request) {
    return { kind: "not_found" };
  }

  const villageStatus = await lockVillageForTransition(tx, request.villageId);

  if (villageStatus === null) {
    return { kind: "not_found" };
  }

  const evaluation = evaluateApproval({
    status: request.status as DeactivationRequestStatus,
    villageStatus,
  });

  if (!evaluation.ok) {
    return { kind: "blocked", reason: evaluation.reason };
  }

  const approvedAt = params.now ?? (await readDatabaseNow(tx));
  const scheduledDeactivationAt = computeScheduledDeactivationAt(approvedAt);

  const updated = await tx.villageDeactivationRequest.updateMany({
    where: { id: request.id, status: "PENDING" },
    data: {
      status: "APPROVED",
      approvedByUserId: actorUserId,
      approvedAt,
      scheduledDeactivationAt,
    },
  });

  if (updated.count !== 1) {
    return { kind: "blocked", reason: "NOT_PENDING" };
  }

  await audit(tx, {
    actionType: AuditActionType.APPROVE,
    entityId: request.id,
    villageId: request.villageId,
    actorUserId,
    metadata: {
      requestId: request.id,
      outcome: "SUCCESS",
      previousStatus: "PENDING",
      newStatus: "APPROVED",
      approvedAt: approvedAt.toISOString(),
      scheduledDeactivationAt: scheduledDeactivationAt.toISOString(),
    },
  });

  // Read-only activation, recorded on the village so its history shows it.
  await audit(tx, {
    actionType: AuditActionType.UPDATE,
    entityType: AuditEntityType.VILLAGE,
    entityId: request.villageId,
    villageId: request.villageId,
    actorUserId,
    metadata: {
      requestId: request.id,
      readOnly: true,
      scheduledDeactivationAt: scheduledDeactivationAt.toISOString(),
    },
  });

  return {
    kind: "approved",
    requestId: request.id,
    villageId: request.villageId,
    approvedAt,
    scheduledDeactivationAt,
  };
}

// ---------------------------------------------------------------- reject

export type RejectOutcome =
  | {
      kind: "rejected";
      requestId: string;
      villageId: string;
      rejectedAt: Date;
      cooldownEndsAt: Date;
    }
  | { kind: "invalid_reason"; error: Extract<ReasonResult, { ok: false }>["error"] }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "blocked"; reason: DecisionBlockReason };

/**
 * A System Admin rejects a PENDING request. The reason is required. The
 * village stays ACTIVE and fully operational; the Chief may submit again only
 * after the cooldown.
 */
export async function rejectDeactivationRequestInTx(
  tx: Tx,
  params: {
    requestId: string;
    actorUserId: string;
    reason: unknown;
    cooldownMs: number;
    now?: Date;
  },
): Promise<RejectOutcome> {
  const { requestId, actorUserId } = params;
  const reason = parseRequiredReason(params.reason);

  if (!reason.ok) {
    return { kind: "invalid_reason", error: reason.error };
  }

  if (!(await isAuthorizedAdmin(tx, actorUserId))) {
    await audit(tx, {
      actionType: AuditActionType.REJECT,
      entityId: requestId,
      villageId: null,
      actorUserId,
      metadata: { requestId, outcome: "BLOCKED", blockReason: "FORBIDDEN" },
    });

    return { kind: "forbidden" };
  }

  const request = await tx.villageDeactivationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, villageId: true, status: true },
  });

  if (!request) {
    return { kind: "not_found" };
  }

  const evaluation = evaluateRejection({
    status: request.status as DeactivationRequestStatus,
  });

  if (!evaluation.ok) {
    return { kind: "blocked", reason: evaluation.reason };
  }

  const rejectedAt = params.now ?? (await readDatabaseNow(tx));
  const cooldownEndsAt = computeCooldownEndsAt(rejectedAt, params.cooldownMs);

  const updated = await tx.villageDeactivationRequest.updateMany({
    where: { id: request.id, status: "PENDING" },
    data: {
      status: "REJECTED",
      rejectedByUserId: actorUserId,
      rejectedAt,
      rejectionReason: reason.reason,
      cooldownEndsAt,
    },
  });

  if (updated.count !== 1) {
    return { kind: "blocked", reason: "NOT_PENDING" };
  }

  await audit(tx, {
    actionType: AuditActionType.REJECT,
    entityId: request.id,
    villageId: request.villageId,
    actorUserId,
    metadata: {
      requestId: request.id,
      outcome: "SUCCESS",
      previousStatus: "PENDING",
      newStatus: "REJECTED",
      rejectedAt: rejectedAt.toISOString(),
      rejectionReason: reason.reason,
      cooldownEndsAt: cooldownEndsAt.toISOString(),
    },
  });

  return {
    kind: "rejected",
    requestId: request.id,
    villageId: request.villageId,
    rejectedAt,
    cooldownEndsAt,
  };
}

// ---------------------------------------------------------------- cancel

export type CancelOutcome =
  | { kind: "cancelled"; requestId: string; villageId: string; cancelledAt: Date }
  | { kind: "invalid_reason"; error: Extract<ReasonResult, { ok: false }>["error"] }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "blocked"; reason: CancellationBlockReason };

/**
 * The Chief cancels an APPROVED request strictly before its deadline. The
 * village lifecycle status is not touched: a village that is SUSPENDED stays
 * SUSPENDED, and cancelling never reactivates anything. The deadline is part
 * of the write's WHERE, so a cancellation cannot land at or after it even if
 * the worker has not run yet.
 */
export async function cancelDeactivationRequestInTx(
  tx: Tx,
  params: {
    requestId: string;
    actorUserId: string;
    /** The Chief's own village (from the session). */
    villageId: string;
    reason: unknown;
    now?: Date;
  },
): Promise<CancelOutcome> {
  const { requestId, actorUserId, villageId } = params;
  const reason = parseRequiredReason(params.reason);

  if (!reason.ok) {
    return { kind: "invalid_reason", error: reason.error };
  }

  if (!(await isAuthorizedChief(tx, actorUserId, villageId))) {
    await audit(tx, {
      actionType: AuditActionType.CANCEL,
      entityId: requestId,
      villageId,
      actorUserId,
      metadata: { requestId, outcome: "BLOCKED", blockReason: "FORBIDDEN" },
    });

    return { kind: "forbidden" };
  }

  const request = await tx.villageDeactivationRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      villageId: true,
      status: true,
      scheduledDeactivationAt: true,
    },
  });

  // Another village's request looks like "not found".
  if (!request || request.villageId !== villageId) {
    return { kind: "not_found" };
  }

  await lockVillageForTransition(tx, villageId);

  const now = params.now ?? (await readDatabaseNow(tx));
  const evaluation = evaluateCancellation({
    status: request.status as DeactivationRequestStatus,
    scheduledDeactivationAt: request.scheduledDeactivationAt,
    now,
  });

  if (!evaluation.ok) {
    if (evaluation.reason === "DEADLINE_REACHED") {
      await audit(tx, {
        actionType: AuditActionType.CANCEL,
        entityId: request.id,
        villageId,
        actorUserId,
        metadata: {
          requestId: request.id,
          outcome: "BLOCKED",
          blockReason: "DEADLINE_REACHED",
          scheduledDeactivationAt:
            request.scheduledDeactivationAt?.toISOString(),
        },
      });
    }

    return { kind: "blocked", reason: evaluation.reason };
  }

  const updated = await tx.villageDeactivationRequest.updateMany({
    where: {
      id: request.id,
      status: "APPROVED",
      scheduledDeactivationAt: { gt: now },
    },
    data: {
      status: "CANCELLED",
      cancelledByUserId: actorUserId,
      cancelledAt: now,
      cancellationReason: reason.reason,
    },
  });

  if (updated.count !== 1) {
    return { kind: "blocked", reason: "NOT_APPROVED" };
  }

  await audit(tx, {
    actionType: AuditActionType.CANCEL,
    entityId: request.id,
    villageId,
    actorUserId,
    metadata: {
      requestId: request.id,
      outcome: "SUCCESS",
      previousStatus: "APPROVED",
      newStatus: "CANCELLED",
      cancelledAt: now.toISOString(),
      cancellationReason: reason.reason,
    },
  });

  // Read-only deactivation, recorded on the village.
  await audit(tx, {
    actionType: AuditActionType.UPDATE,
    entityType: AuditEntityType.VILLAGE,
    entityId: villageId,
    villageId,
    actorUserId,
    metadata: { requestId: request.id, readOnly: false },
  });

  return {
    kind: "cancelled",
    requestId: request.id,
    villageId,
    cancelledAt: now,
  };
}

// -------------------------------------------------------------- complete

export type CompleteOutcome =
  | {
      kind: "completed";
      requestId: string;
      villageId: string;
      completedAt: Date;
      previousVillageStatus: DeactivationVillageStatus;
    }
  | { kind: "not_found" }
  | { kind: "blocked"; reason: CompletionBlockReason };

/**
 * The system completes an APPROVED request whose stored deadline has been
 * reached: the village becomes DEACTIVATED, the request COMPLETED and the audit
 * entries are written in the same transaction. Calling it again, or for a
 * request that was cancelled, changes nothing and returns blocked.
 */
export async function completeDeactivationRequestInTx(
  tx: Tx,
  params: { requestId: string; completedBy?: string; now?: Date },
): Promise<CompleteOutcome> {
  const { requestId } = params;
  const completedBy = params.completedBy ?? COMPLETED_BY_WORKER;

  const request = await tx.villageDeactivationRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      villageId: true,
      status: true,
      scheduledDeactivationAt: true,
    },
  });

  if (!request) {
    return { kind: "not_found" };
  }

  const villageStatus = await lockVillageForTransition(tx, request.villageId);

  if (villageStatus === null) {
    return { kind: "not_found" };
  }

  const now = params.now ?? (await readDatabaseNow(tx));
  const evaluation = evaluateCompletion({
    status: request.status as DeactivationRequestStatus,
    scheduledDeactivationAt: request.scheduledDeactivationAt,
    villageStatus,
    now,
  });

  if (!evaluation.ok) {
    return { kind: "blocked", reason: evaluation.reason };
  }

  const updated = await tx.villageDeactivationRequest.updateMany({
    where: {
      id: request.id,
      status: "APPROVED",
      scheduledDeactivationAt: { lte: now },
    },
    data: {
      status: "COMPLETED",
      completedAt: now,
      completedBy,
    },
  });

  if (updated.count !== 1) {
    return { kind: "blocked", reason: "NOT_APPROVED" };
  }

  const deactivated = await tx.village.updateMany({
    where: { id: request.villageId, status: { in: ["ACTIVE", "SUSPENDED"] } },
    data: { status: "DEACTIVATED" },
  });

  if (deactivated.count !== 1) {
    // Cannot happen after the status was read under the village lock; if it
    // does, roll the whole completion back rather than leave it half done.
    throw new Error("DEACTIVATION_VILLAGE_UPDATE_FAILED");
  }

  await audit(tx, {
    actionType: AuditActionType.COMPLETE,
    entityId: request.id,
    villageId: request.villageId,
    actorUserId: null,
    metadata: {
      requestId: request.id,
      outcome: "SUCCESS",
      previousStatus: "APPROVED",
      newStatus: "COMPLETED",
      completedAt: now.toISOString(),
      completedBy,
      scheduledDeactivationAt: request.scheduledDeactivationAt?.toISOString(),
    },
  });

  await audit(tx, {
    actionType: AuditActionType.STATUS_CHANGE,
    entityType: AuditEntityType.VILLAGE,
    entityId: request.villageId,
    villageId: request.villageId,
    actorUserId: null,
    metadata: {
      requestId: request.id,
      previousStatus: villageStatus,
      newStatus: "DEACTIVATED",
      completedBy,
    },
  });

  return {
    kind: "completed",
    requestId: request.id,
    villageId: request.villageId,
    completedAt: now,
    previousVillageStatus: villageStatus,
  };
}
