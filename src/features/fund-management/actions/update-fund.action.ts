"use server";

import { AuditActionType, FundStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireChief } from "../../../lib/authz";
import { validateFundInput, type FundField } from "../lib/fund-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

export type UpdateFundActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<FundField, string>>;
    };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function updateFundAction(
  formData: FormData,
): Promise<UpdateFundActionResult> {
  const { user, villageId } = await requireChief();

  const fundId = getFormDataString(formData, "fundId");
  if (!fundId) {
    return {
      success: false,
      formError: "Fund not found.",
    };
  }

  const validation = validateFundInput(formData);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { name, description, targetAmount, startDate, endDate } =
    validation.data;

  try {
    const updated = await prisma.fund.updateMany({
      where: {
        id: fundId,
        villageId,
        status: FundStatus.DRAFT,
      },
      data: {
        name,
        description,
        targetAmount,
        startDate,
        endDate,
      },
    });

    if (updated.count !== 1) {
      return {
        success: false,
        formError: "Only draft funds can be edited.",
      };
    }

    await createAuditLog(prisma, {
      actionType: AuditActionType.UPDATE,
      entityType: AuditEntityType.FUND,
      entityId: fundId,
      villageId,
      actorUserId: user.id,
      metadata: {
        name,
        targetAmount,
      },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      formError: "Unable to update fund. Please try again.",
    };
  }
}
