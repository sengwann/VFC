import "server-only";

import { Prisma } from "@prisma/client";

import { withSerializableRetry } from "../../../lib/db/transaction";
import { isUniqueViolation } from "../../../lib/db/unique-violation";
import { prisma } from "../../../lib/prisma";
import {
  approveDeactivationRequestInTx,
  cancelDeactivationRequestInTx,
  completeDeactivationRequestInTx,
  rejectDeactivationRequestInTx,
  submitDeactivationRequestInTx,
  type ApproveOutcome,
  type CancelOutcome,
  type CompleteOutcome,
  type RejectOutcome,
  type SubmitOutcome,
} from "./deactivation-transitions";

/*
 * Entry points for the Village Deactivation Workflow. Each one runs its
 * transition in a Serializable transaction with the project's retry helper,
 * exactly like changeVillageStatus. Callers (the Phase 5 actions and the
 * Phase 7 worker) authenticate first; the transitions then re-check the actor
 * against the database.
 *
 * A serialization conflict that survives every retry is rethrown; callers map
 * it with isSerializationConflict, the same way run-lifecycle-action.ts does.
 */

const SERIALIZABLE = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
} as const;

export async function submitDeactivationRequest(params: {
  actorUserId: string;
  villageId: string;
  reason: unknown;
}): Promise<SubmitOutcome> {
  try {
    return await withSerializableRetry(() =>
      prisma.$transaction(
        (tx) => submitDeactivationRequestInTx(tx, params),
        SERIALIZABLE,
      ),
    );
  } catch (error) {
    // The partial unique index is the last line of defense against two
    // simultaneous submissions: the loser sees an unresolved request.
    if (isUniqueViolation(error)) {
      return { kind: "blocked", reason: "UNRESOLVED_REQUEST_EXISTS" };
    }

    throw error;
  }
}

export function approveDeactivationRequest(params: {
  requestId: string;
  actorUserId: string;
}): Promise<ApproveOutcome> {
  return withSerializableRetry(() =>
    prisma.$transaction(
      (tx) => approveDeactivationRequestInTx(tx, params),
      SERIALIZABLE,
    ),
  );
}

export function rejectDeactivationRequest(params: {
  requestId: string;
  actorUserId: string;
  reason: unknown;
  /** From parseDeactivationConfig(process.env).rejectionCooldownMs. */
  cooldownMs: number;
}): Promise<RejectOutcome> {
  return withSerializableRetry(() =>
    prisma.$transaction(
      (tx) => rejectDeactivationRequestInTx(tx, params),
      SERIALIZABLE,
    ),
  );
}

export function cancelDeactivationRequest(params: {
  requestId: string;
  actorUserId: string;
  villageId: string;
  reason: unknown;
}): Promise<CancelOutcome> {
  return withSerializableRetry(() =>
    prisma.$transaction(
      (tx) => cancelDeactivationRequestInTx(tx, params),
      SERIALIZABLE,
    ),
  );
}

/** Used by the Phase 7 worker; also safe to call twice (idempotent). */
export function completeDeactivationRequest(params: {
  requestId: string;
  completedBy?: string;
}): Promise<CompleteOutcome> {
  return withSerializableRetry(() =>
    prisma.$transaction(
      (tx) => completeDeactivationRequestInTx(tx, params),
      SERIALIZABLE,
    ),
  );
}
