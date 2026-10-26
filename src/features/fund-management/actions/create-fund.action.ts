"use server";

import { AuditActionType, FundStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import {
  validateCreateFundInput,
  type CreateFundField,
} from "../lib/fund-validators";
import { calculateAmountPerHouse } from "../lib/fund-target";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export type CreateFundActionResult =
  | { success: true; fundId: string }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<CreateFundField, string>>;
    };

export async function createFundAction(
  formData: FormData,
): Promise<CreateFundActionResult> {
  const { user, villageId } = await requireChief();

  const validation = validateCreateFundInput(formData);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { name, description, totalAmount, startDate, endDate } =
    validation.data;

  // numberOfHouse = total ACTIVE houses in this village (server-side source of truth)
  const numberOfHouse = await prisma.house.count({
    where: { villageId, isActive: true },
  });

  // amountPerHouse = ceil(totalAmount / numberOfHouse), with zero-division guard
  const perHouseResult = calculateAmountPerHouse(totalAmount, numberOfHouse);
  if (!perHouseResult.ok) {
    return { success: false, formError: perHouseResult.error };
  }
  const targetAmount = perHouseResult.amountPerHouse;

  try {
    const fund = await prisma.fund.create({
      data: {
        villageId,
        name,
        description,
        targetAmount,
        startDate,
        endDate,
        status: FundStatus.DRAFT,
      },
    });

    await createAuditLog(prisma, {
      actionType: AuditActionType.CREATE,
      entityType: AuditEntityType.FUND,
      entityId: fund.id,
      villageId,
      actorUserId: user.id,
      metadata: {
        name,
        totalAmount,
        numberOfHouse,
        targetAmount, // stored per-house amount (amountPerHouse)
        newStatus: FundStatus.DRAFT,
      },
    });

    return { success: true, fundId: fund.id };
  } catch {
    return {
      success: false,
      formError: "Unable to create fund. Please try again.",
    };
  }
}
