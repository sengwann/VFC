"use server";
import { revalidateVillageShell } from "@/features/shell/lib/shell-revalidation";
import { AuditActionType, DisputeStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "@/lib/db/transaction";
import { prisma } from "@/lib/prisma";
import { createAuditLog, AuditEntityType } from "@/lib/audit";
import { requireChief } from "@/lib/authz";
import { validateResolutionNote } from "../lib/dispute-validators";

export type RejectDisputeActionResult =
  | { success: true }
  | { success: false; error?: string; fieldErrors?: Record<string, string> };

export async function rejectDisputeAction(
  formData: FormData,
): Promise<RejectDisputeActionResult> {
  const { user, villageId } = await requireChief();
  const disputeId = formData.get("disputeId") as string;
  if (!disputeId) return { success: false, error: "Dispute not found." };

  const noteValidation = validateResolutionNote(
    formData.get("resolutionNote") as string,
  );
  if (!noteValidation.ok) {
    return {
      success: false,
      fieldErrors: { resolutionNote: noteValidation.error },
    };
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const dispute = await tx.dispute.findUnique({
            where: { id: disputeId },
            select: { id: true, villageId: true, status: true },
          });

          if (!dispute || dispute.villageId !== villageId) {
            throw new Error("DISPUTE_NOT_FOUND");
          }
          if (dispute.status !== DisputeStatus.UNDER_REVIEW) {
            throw new Error("INVALID_DISPUTE_STATE");
          }

          const updated = await tx.dispute.updateMany({
            where: {
              id: disputeId,
              villageId,
              status: DisputeStatus.UNDER_REVIEW,
            },
            data: {
              status: DisputeStatus.REJECTED,
              resolutionNote: noteValidation.data,
            },
          });

          if (updated.count !== 1) {
            throw new Error("INVALID_DISPUTE_STATE");
          }

          await createAuditLog(tx, {
            actionType: AuditActionType.STATUS_CHANGE,
            entityType: AuditEntityType.DISPUTE,
            entityId: disputeId,
            villageId,
            actorUserId: user.id,
            metadata: {
              previousStatus: DisputeStatus.UNDER_REVIEW,
              newStatus: DisputeStatus.REJECTED,
              resolutionNote: noteValidation.data,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "DISPUTE_NOT_FOUND") {
        return { success: false, error: "Dispute not found." };
      }
      if (error.message === "INVALID_DISPUTE_STATE") {
        return {
          success: false,
          error: "This dispute cannot be rejected in its current state.",
        };
      }
    }
    return {
      success: false,
      error: "Unable to reject dispute. Please try again.",
    };
  }

  revalidateVillageShell();
  return { success: true };
}
