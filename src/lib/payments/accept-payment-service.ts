import "server-only";
import { AuditActionType, PaymentStatus, ReceiptStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { generateReceiptNumber } from "@/lib/receipts/receipt-number";
import { createAuditLog, AuditEntityType } from "@/lib/audit";

export interface AcceptPaymentParams {
  paymentId: string;
  villageId: string;
  actorUserId: string;
  collectorUserId: string | null;
  fundId: string;
  houseId: string;
  amount: number;
  paymentMethod: string;
  auditReason?: string;
}

/**
 * Shared domain logic for accepting a payment.
 * Must be called inside a Prisma transaction.
 */
export async function acceptPaymentInTransaction(
  tx: Prisma.TransactionClient,
  params: AcceptPaymentParams,
) {
  const {
    paymentId,
    villageId,
    actorUserId,
    collectorUserId,
    fundId,
    houseId,
    amount,
    paymentMethod,
    auditReason,
  } = params;

  // 1. Generate sequential receipt number
  const receiptNumber = await generateReceiptNumber(tx);

  // 2. Create ACTIVE receipt
  const receipt = await tx.receipt.create({
    data: {
      receiptNumber,
      paymentId,
      villageId,
      status: ReceiptStatus.ACTIVE,
    },
  });

  // 3. Update Payment to ACCEPTED
  await tx.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.ACCEPTED,
      collectorUserId: collectorUserId,
    },
  });

  // 4. Create Audit Log
  const metadata: Prisma.InputJsonObject = {
    amount,
    paymentMethod,
    fundId,
    houseId,
    receiptId: receipt.id,
    receiptNumber,
    ...(auditReason ? { reason: auditReason } : {}),
  };

  await createAuditLog(tx, {
    actionType: AuditActionType.ACCEPT,
    entityType: AuditEntityType.PAYMENT,
    entityId: paymentId,
    villageId,
    actorUserId,
    metadata,
  });

  return receipt;
}
