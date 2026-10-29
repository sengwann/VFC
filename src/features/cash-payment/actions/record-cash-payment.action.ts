"use server";

import {
  AuditActionType,
  FundStatus,
  MembershipStatus,
    PaymentStatus,
  Prisma,
  ReceiptStatus,
} from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { createAuditLog, AuditEntityType } from "../../../lib/audit";
import { isFundOpenForPayment } from "../../fund-management/lib/fund-lifecycle";
import { getFundAmountPerHouse } from "../../fund-management/lib/fund-target";
import { generateReceiptNumber } from "@/lib/receipts/receipt-number";
import { guardVillageWrite } from "@/lib/authz/village";
import {
  VILLAGE_READ_ONLY_CODE,
  VILLAGE_READ_ONLY_MESSAGE,
  type VillageReadOnlyCode,
} from "../../village-deactivation/lib/village-deactivation-rules";
import { requireCashPaymentAccess } from "../lib/cash-payment-access";
import {
  validateCashPaymentInput,
  type CashPaymentField,
} from "../lib/cash-payment-validators";

export type RecordCashPaymentActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      /** Set when the village is read-only (approved deactivation). */
      code?: VillageReadOnlyCode;
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

  // Per-house minimum = ceil(fund.targetAmount / numberOfHouse)
  const perHouse = await getFundAmountPerHouse(
    prisma,
    villageId,
    fund.targetAmount,
  );
  if (!perHouse.ok) {
    return { success: false, formError: perHouse.error };
  }
  const minimumAmount = perHouse.amountPerHouse;

  const validation = validateCashPaymentInput(formData, minimumAmount);
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
    return { success: false, formError: "Selected house is not available." };
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
          // First statement of the transaction: nothing below may run, and
          // nothing may commit, once the village is read-only.
          const guard = await guardVillageWrite(tx, villageId);

          if (!guard.ok) {
            throw new Error(guard.reason);
          }

          const currentFund = await tx.fund.findUnique({
            where: { id: fund.id },
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

          const txPerHouse = await getFundAmountPerHouse(
            tx,
            villageId,
            currentFund.targetAmount,
          );
          if (!txPerHouse.ok) {
            throw new Error("NO_ELIGIBLE_HOUSES");
          }
          if (amount < txPerHouse.amountPerHouse) {
            throw new Error("AMOUNT_BELOW_TARGET");
          }

          const currentHouse = await tx.house.findUnique({
            where: { id: houseId },
            select: { id: true, villageId: true, isActive: true },
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
            select: { id: true },
          });
          if (!currentPayer) {
            throw new Error("PAYER_NOT_ELIGIBLE");
          }

          const existingPayment = await tx.payment.findFirst({
            where: {
              fundId: fund.id,
              houseId,
              villageId,
              status: PaymentStatus.ACCEPTED,
            },
            select: { id: true },
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
              fundId: fund.id,
              houseId,
              payerUserId,
              receiptNumber,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === VILLAGE_READ_ONLY_CODE) {
        return {
          success: false,
          formError: VILLAGE_READ_ONLY_MESSAGE,
          code: VILLAGE_READ_ONLY_CODE,
        };
      }
      if (error.message === "NO_ELIGIBLE_HOUSES") {
        return {
          success: false,
          formError:
            "Cannot calculate the per-house amount because the village has no active houses.",
        };
      }
      if (error.message === "AMOUNT_BELOW_TARGET") {
        return {
          success: false,
          fieldErrors: {
            amount: `Amount must be at least ${minimumAmount.toLocaleString()}.`,
          },
        };
      }
      if (error.message === "DUPLICATE_PAYMENT") {
        return {
          success: false,
          formError:
            "A valid payment already exists for this fund and house.",
        };
      }
      if (error.message === "FUND_NOT_ACTIVE") {
        return { success: false, formError: "This fund is no longer active." };
      }
      if (error.message === "FUND_NOT_OPEN") {
        return {
          success: false,
          formError: "This fund is not open for payment today.",
        };
      }
      if (error.message === "HOUSE_NOT_AVAILABLE") {
        return {
          success: false,
          fieldErrors: { houseId: "Selected house is not available." },
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
