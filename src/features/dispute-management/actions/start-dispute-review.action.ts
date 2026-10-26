"use server";
import { redirect } from "next/navigation";
import { revalidateVillageShell } from "@/features/shell/lib/shell-revalidation";
import { AuditActionType, DisputeStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "@/lib/db/transaction";
import { prisma } from "@/lib/prisma";
import { createAuditLog, AuditEntityType } from "@/lib/audit";
import { requireChief } from "@/lib/authz";

export async function startDisputeReviewAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId } = await requireChief();
  const disputeId = formData.get("disputeId") as string;
  if (!disputeId) redirect("/village/disputes");

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
          if (dispute.status !== DisputeStatus.OPEN) {
            throw new Error("INVALID_DISPUTE_STATE");
          }

          const updated = await tx.dispute.updateMany({
            where: { id: disputeId, villageId, status: DisputeStatus.OPEN },
            data: { status: DisputeStatus.UNDER_REVIEW },
          });

          if (updated.count === 1) {
            await createAuditLog(tx, {
              actionType: AuditActionType.STATUS_CHANGE,
              entityType: AuditEntityType.DISPUTE,
              entityId: disputeId,
              villageId,
              actorUserId: user.id,
              metadata: {
                previousStatus: DisputeStatus.OPEN,
                newStatus: DisputeStatus.UNDER_REVIEW,
              },
            });
          }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch {
    // State changed concurrently, redirect to detail page to show current state
  }

  revalidateVillageShell();
  redirect(`/village/disputes/${disputeId}`);
}
