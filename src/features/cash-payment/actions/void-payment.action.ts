"use server";

import {
  AuditActionType,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ReceiptStatus,
} from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { createAuditLog, AuditEntityType } from "../../../lib/audit";
import { requireActiveCollector } from "../../../lib/authz";
import { validateVoidReason } from "../lib/cash-payment-validators";

export type VoidPaymentActionResult =
  | { success: true }
  | {
      success: false;
      error?: string;
      fieldErrors?: Record<string, string>;
    };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function voidPaymentAction(
  formData: FormData,
): Promise<VoidPaymentActionResult> {
  const { user, villageId } = await requireActiveCollector();

  const paymentId = getFormDataString(formData, "paymentId");
  if (!paymentId) {
    return { success: false, error: "Payment not found." };
  }

  const rawReason = getFormDataString(formData, "voidReason");
  const reasonValidation = validateVoidReason(rawReason);

  if (!reasonValidation.ok) {
    return {
      success: false,
      fieldErrors: { voidReason: reasonValidation.error },
    };
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      villageId: true,
      status: true,
      paymentMethod: true,
      amount: true,
      fundId: true,
      houseId: true,
      receipt: {
        select: { id: true },
      },
    },
  });

  if (!payment || payment.villageId !== villageId) {
    return { success: false, error: "Payment not found." };
  }

  if (payment.paymentMethod !== PaymentMethod.CASH) {
    return { success: false, error: "Only cash payments can be voided." };
  }

  if (payment.status !== PaymentStatus.ACCEPTED) {
    return { success: false, error: "Only accepted payments can be voided." };
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const currentPayment = await tx.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, status: true, villageId: true },
          });

          if (
            !currentPayment ||
            currentPayment.villageId !== villageId ||
            currentPayment.status !== PaymentStatus.ACCEPTED
          ) {
            throw new Error("PAYMENT_CANNOT_BE_VOIDED");
          }

          await tx.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.VOIDED,
              voidReason: reasonValidation.data,
            },
          });

          if (payment.receipt) {
            await tx.receipt.update({
              where: { id: payment.receipt.id },
              data: { status: ReceiptStatus.VOIDED },
            });
          }

          await createAuditLog(tx, {
            actionType: AuditActionType.VOID,
            entityType: AuditEntityType.PAYMENT,
            entityId: paymentId,
            villageId,
            actorUserId: user.id,
            metadata: {
              amount: payment.amount,
              paymentMethod: PaymentMethod.CASH,
              fundId: payment.fundId,
              houseId: payment.houseId,
              voidReason: reasonValidation.data,
              receiptId: payment.receipt?.id ?? null,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );

    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PAYMENT_CANNOT_BE_VOIDED"
    ) {
      return {
        success: false,
        error: "This payment cannot be voided.",
      };
    }
    return {
      success: false,
      error: "Unable to void payment. Please try again.",
    };
  }
}
