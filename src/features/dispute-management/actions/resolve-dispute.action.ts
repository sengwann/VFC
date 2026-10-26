"use server";
import { revalidateVillageShell } from "@/features/shell/lib/shell-revalidation";
import {
  AuditActionType,
  DisputeStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { withSerializableRetry } from "@/lib/db/transaction";
import { prisma } from "@/lib/prisma";
import { createAuditLog, AuditEntityType } from "@/lib/audit";
import { requireChief } from "@/lib/authz";
import { validateResolutionNote } from "../lib/dispute-validators";
import { acceptPaymentInTransaction } from "@/lib/payments/accept-payment-service";

export type ResolveDisputeActionResult =
  | { success: true }
  | { success: false; error?: string; fieldErrors?: Record<string, string> };

export async function resolveDisputeAction(
  formData: FormData,
): Promise<ResolveDisputeActionResult> {
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
          // 1. Fetch and validate dispute + payment
          const dispute = await tx.dispute.findUnique({
            where: { id: disputeId },
            select: {
              id: true,
              villageId: true,
              status: true,
              paymentId: true,
              payment: {
                select: {
                  id: true,
                  villageId: true,
                  status: true,
                  paymentMethod: true,
                  amount: true,
                  fundId: true,
                  houseId: true,
                  collectorUserId: true,
                },
              },
            },
          });

          if (!dispute || dispute.villageId !== villageId) {
            throw new Error("DISPUTE_NOT_FOUND");
          }
          if (dispute.status !== DisputeStatus.UNDER_REVIEW) {
            throw new Error("INVALID_DISPUTE_STATE");
          }

          const payment = dispute.payment;
          if (!payment || payment.villageId !== villageId) {
            throw new Error("PAYMENT_NOT_FOUND");
          }
          if (payment.status !== PaymentStatus.REJECTED) {
            throw new Error("INVALID_PAYMENT_STATE");
          }

          // 2. Update Dispute to RESOLVED
          await tx.dispute.update({
            where: { id: dispute.id },
            data: {
              status: DisputeStatus.RESOLVED,
              resolutionNote: noteValidation.data,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.STATUS_CHANGE,
            entityType: AuditEntityType.DISPUTE,
            entityId: dispute.id,
            villageId,
            actorUserId: user.id,
            metadata: {
              previousStatus: DisputeStatus.UNDER_REVIEW,
              newStatus: DisputeStatus.RESOLVED,
              resolutionNote: noteValidation.data,
            },
          });

          // 3. Accept the original Payment (generates receipt, updates status)
          await acceptPaymentInTransaction(tx, {
            paymentId: payment.id,
            villageId,
            actorUserId: user.id, // Chief is the actor resolving the dispute
            collectorUserId: payment.collectorUserId, // Preserve original collector
            fundId: payment.fundId,
            houseId: payment.houseId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            auditReason: `Dispute ${dispute.id} resolved in favor of villager`,
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
          error: "This dispute cannot be resolved in its current state.",
        };
      }
      if (error.message === "PAYMENT_NOT_FOUND") {
        return { success: false, error: "Associated payment not found." };
      }
      if (error.message === "INVALID_PAYMENT_STATE") {
        return {
          success: false,
          error: "The associated payment is no longer in a rejected state.",
        };
      }
    }
    return {
      success: false,
      error: "Unable to resolve dispute. Please try again.",
    };
  }

  revalidateVillageShell();
  return { success: true };
}
