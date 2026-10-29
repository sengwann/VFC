"use server";

import { AuditActionType, FundStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireChief } from "../../../lib/authz";
import { validateFundInput, type FundField } from "../lib/fund-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { guardVillageWrite } from "../../../lib/authz/village";
import {
  VILLAGE_READ_ONLY_CODE,
  VILLAGE_READ_ONLY_MESSAGE,
  type VillageReadOnlyCode,
} from "../../village-deactivation/lib/village-deactivation-rules";

export type UpdateFundActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      formError?: string;
      /** Set when the village is read-only (approved deactivation). */
      code?: VillageReadOnlyCode;
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
    // The guard, the guarded update and its audit entry commit together.
    const outcome = await prisma.$transaction(async (tx) => {
      const guard = await guardVillageWrite(tx, villageId);

      if (!guard.ok) {
        return guard.reason;
      }

      const updated = await tx.fund.updateMany({
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
        return "NOT_DRAFT" as const;
      }

      await createAuditLog(tx, {
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

      return "UPDATED" as const;
    });

    if (outcome === "VILLAGE_READ_ONLY") {
      return {
        success: false,
        formError: VILLAGE_READ_ONLY_MESSAGE,
        code: VILLAGE_READ_ONLY_CODE,
      };
    }

    if (outcome === "VILLAGE_INACTIVE") {
      return {
        success: false,
        formError: "Unable to update fund. Please try again.",
      };
    }

    if (outcome === "NOT_DRAFT") {
      return {
        success: false,
        formError: "Only draft funds can be edited.",
      };
    }

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
