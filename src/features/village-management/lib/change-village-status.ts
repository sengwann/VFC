import "server-only";

import { AuditActionType } from "@prisma/client";

import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import {
  LIFECYCLE_TARGET_STATUS,
  canTransition,
  type VillageLifecycleAction,
} from "./village-lifecycle-rules";

export type ChangeVillageStatusOutcome = "ok" | "not_found" | "not_allowed";

/*
 * Shared lifecycle transaction for suspend, reactivate and deactivate. The
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
  action: VillageLifecycleAction;
  actorUserId: string;
  reason: string | null;
}): Promise<ChangeVillageStatusOutcome> {
  const { villageId, action, actorUserId, reason } = params;

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
