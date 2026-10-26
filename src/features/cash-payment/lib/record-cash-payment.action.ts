"use server";

import {
  AuditActionType,
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ReceiptStatus,
  FundStatus,
} from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { isFundOpenForPayment } from "../../fund-management/lib/fund-lifecycle";
import { prisma } from "../../../lib/prisma";
import { createAuditLog, AuditEntityType } from "../../../lib/audit";
import { requireCashPaymentAccess } from "../lib/cash-payment-access";
import {
  validateCashPaymentInput,
  type CashPaymentField,
} from "../lib/cash-payment-validators";
import { generateReceiptNumber } from "@/lib/receipts/receipt-number";

export type RecordCashPaymentActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<CashPaymentField, string>>;
    };

export async function recordCashPaymentAction(
  formData: FormData,
): Promise<RecordCashPaymentActionResult> {
  const { collector, villageId, fund } = await requireCashPaymentAccess();

  if (!fund) {
    return {
      success: false,
      formError: "No active fund is available for payment recording.",
    };
  }

  const validation = validateCashPaymentInput(formData, fund.targetAmount);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { houseId, payerUserId, amount } = validation.data;

  const house = await prisma.house.findUnique({
    where: { id: houseId },
    select: { id: true, villageId: true, isActive: true },
  });

  if (!house || !house.isActive || house.villageId !== villageId) {
    return {
      success: false,
      formError: "Selected house is not available.",
    };
  }

  const payer = await prisma.user.findFirst({
    where: {
      id: payerUserId,
      houseId,
      villageId,
      membershipStatus: MembershipStatus.ACTIVE,
    },
    select: { id: true },
  });

  if (!payer) {
    return {
      success: false,
      formError:
        "Selected payer is not an active member of the selected house.",
    };
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const currentFund = await tx.fund.findUnique({
            where: {
              id: fund.id,
            },
            select: {
              id: true,
              status: true,
              targetAmount: true,
              startDate: true,
              endDate: true,
            },
          });

          if (!currentFund || currentFund.status !== FundStatus.ACTIVE) {
            throw new Error("FUND_NOT_ACTIVE");
          }

          if (!isFundOpenForPayment(currentFund)) {
            throw new Error("FUND_NOT_OPEN");
          }

          if (amount < currentFund.targetAmount) {
            throw new Error("AMOUNT_BELOW_TARGET");
          }

          const currentHouse = await tx.house.findUnique({
            where: {
              id: houseId,
            },
            select: {
              id: true,
              villageId: true,
              isActive: true,
            },
          });

          if (
            !currentHouse ||
            !currentHouse.isActive ||
            currentHouse.villageId !== villageId
          ) {
            throw new Error("HOUSE_NOT_AVAILABLE");
          }

          const currentPayer = await tx.user.findFirst({
            where: {
              id: payerUserId,
              houseId,
              villageId,
              membershipStatus: MembershipStatus.ACTIVE,
            },
            select: {
              id: true,
            },
          });

          if (!currentPayer) {
            throw new Error("PAYER_NOT_ELIGIBLE");
          }

          const existingPayment = await tx.payment.findFirst({
            where: {
              fundId: fund.id,
              houseId,
              villageId,
              status: {
                in: [PaymentStatus.ACCEPTED, PaymentStatus.PENDING],
              },
            },
            select: {
              id: true,
            },
          });

          if (existingPayment) {
            throw new Error("DUPLICATE_PAYMENT");
          }

          const receiptNumber = await generateReceiptNumber(tx);

          const payment = await tx.payment.create({
            data: {
              villageId,
              fundId: fund.id,
              houseId,
              payerUserId,
              collectorUserId: collector.user.id,
              paymentMethod: PaymentMethod.CASH,
              amount,
              status: PaymentStatus.ACCEPTED,
            },
          });

          await tx.receipt.create({
            data: {
              receiptNumber,
              paymentId: payment.id,
              villageId,
              status: ReceiptStatus.ACTIVE,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.ACCEPT,
            entityType: AuditEntityType.PAYMENT,
            entityId: payment.id,
            villageId,
            actorUserId: collector.user.id,
            metadata: {
              amount,
              paymentMethod: PaymentMethod.CASH,
              fundId: fund.id,
              houseId,
              payerUserId,
              receiptNumber,
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
    if (error instanceof Error) {
      if (error.message === "DUPLICATE_PAYMENT") {
        return {
          success: false,
          formError:
            "A valid or pending payment already exists for this fund and house.",
        };
      }

      if (error.message === "FUND_NOT_ACTIVE") {
        return {
          success: false,
          formError: "This fund is no longer active.",
        };
      }

      if (error.message === "FUND_NOT_OPEN") {
        return {
          success: false,
          formError: "This fund is not open for payment today.",
        };
      }
      if (error.message === "AMOUNT_BELOW_TARGET") {
        return {
          success: false,
          fieldErrors: {
            amount: `Amount must be at least ${fund.targetAmount.toLocaleString()}.`,
          },
        };
      }

      if (error.message === "HOUSE_NOT_AVAILABLE") {
        return {
          success: false,
          fieldErrors: {
            houseId: "Selected house is not available.",
          },
        };
      }

      if (error.message === "PAYER_NOT_ELIGIBLE") {
        return {
          success: false,
          fieldErrors: {
            payerUserId:
              "Selected payer is not an active member of the selected house.",
          },
        };
      }
    }

    return {
      success: false,
      formError: "Unable to record cash payment. Please try again.",
    };
  }
}
