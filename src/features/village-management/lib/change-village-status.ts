import "server-only";

import { AuditActionType } from "@prisma/client";

import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import {
  LIFECYCLE_TARGET_STATUS,
  canTransition,
  isAdminLifecycleAction,
  type AdminLifecycleAction,
} from "./village-lifecycle-rules";

export type ChangeVillageStatusOutcome =
  | "ok"
  | "not_found"
  | "not_allowed"
  /** Suspend refused: the village has an approved deactivation request. */
  | "blocked_by_deactivation";

/*
 * Shared lifecycle transaction for the System Admin actions suspend and
 * reactivate. Deactivation is NOT possible here, by type and at runtime: a
 * village is deactivated only by the deactivation workflow after an approved
 * request reaches its deadline. The
 * read, the transition check, the status update and the audit entry commit or
 * roll back together under Serializable isolation. It returns an outcome
 * instead of redirecting, so no redirect() is thrown inside the transaction.
 *
 * The update is conditional on the status that was read (defense in depth on
 * top of Serializable). If it matches no row, nothing is written and the
 * outcome is "not_allowed".
 *
 * Callers must already have authenticated a SYSTEM_ADMIN (requireSystemAdmin).
 */
export async function changeVillageStatus(params: {
  villageId: string;
  action: AdminLifecycleAction;
  actorUserId: string;
  reason: string | null;
}): Promise<ChangeVillageStatusOutcome> {
  const { villageId, action, actorUserId, reason } = params;

  // Defense in depth: the type already excludes "deactivate", but this also
  // holds for a caller that bypasses the types.
  if (!isAdminLifecycleAction(action)) {
    return "not_allowed";
  }

  return withSerializableRetry(() =>
    prisma.$transaction(
      async (tx): Promise<ChangeVillageStatusOutcome> => {
        const village = await tx.village.findUnique({
          where: {
            id: villageId,
          },
          select: {
            id: true,
            villageCode: true,
            name: true,
            status: true,
          },
        });

        if (!village) {
          return "not_found";
        }

        if (!canTransition(action, village.status)) {
          return "not_allowed";
        }

        // Q5: a village in its deactivation countdown cannot be suspended, so
        // the Chief can always cancel before the deadline. This is checked
        // BEFORE any write. A concurrent approval is safe without a lock here:
        // it updates this same village row, so under Serializable one of the
        // two transactions fails with 40001 and is retried into the other's
        // result (an approval on a SUSPENDED village is refused).
        if (action === "suspend") {
          const approved = await tx.villageDeactivationRequest.count({
            where: { villageId: village.id, status: "APPROVED" },
          });

          if (approved > 0) {
            return "blocked_by_deactivation";
          }
        }

        const newStatus = LIFECYCLE_TARGET_STATUS[action];

        const updated = await tx.village.updateMany({
          where: {
            id: village.id,
            status: village.status,
          },
          data: {
            status: newStatus,
          },
        });

        if (updated.count !== 1) {
          return "not_allowed";
        }

        await createAuditLog(tx, {
          actionType: AuditActionType.STATUS_CHANGE,
          entityType: AuditEntityType.VILLAGE,
          entityId: village.id,
          villageId: village.id,
          actorUserId,
          metadata: {
            villageCode: village.villageCode,
            name: village.name,
            previousStatus: village.status,
            newStatus,
            ...(reason ? { reason } : {}),
          },
        });

        return "ok";
      },
      {
        isolationLevel: "Serializable",
      },
    ),
  );
}
