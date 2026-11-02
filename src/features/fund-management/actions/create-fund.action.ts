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
import { guardVillageWrite } from "@/lib/authz/village";
import {
  VILLAGE_READ_ONLY_CODE,
  VILLAGE_READ_ONLY_MESSAGE,
  type VillageReadOnlyCode,
} from "@/features/village-deactivation/lib/village-deactivation-rules";

export type CreateFundActionResult =
  | { success: true; fundId: string }
  | {
      success: false;
      formError?: string;
      /** Set when the village is read-only (approved deactivation). */
      code?: VillageReadOnlyCode;
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

  // One transaction: the guard, the house count the target is derived from,
  // the fund and its audit entry all commit together or not at all.
  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const guard = await guardVillageWrite(tx, villageId);

      if (!guard.ok) {
        return { kind: guard.reason } as const;
      }

      // numberOfHouse = total ACTIVE houses in this village (server-side source of truth)
      const numberOfHouse = await tx.house.count({
        where: { villageId, isActive: true },
      });

      // amountPerHouse = ceil(totalAmount / numberOfHouse), with zero-division guard
      const perHouseResult = calculateAmountPerHouse(totalAmount, numberOfHouse);
      if (!perHouseResult.ok) {
        return { kind: "per_house_error", error: perHouseResult.error } as const;
      }
      const targetAmount = perHouseResult.amountPerHouse;

      const fund = await tx.fund.create({
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

      await createAuditLog(tx, {
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

      return { kind: "created", fundId: fund.id } as const;
    });

    if (outcome.kind === "VILLAGE_READ_ONLY") {
      return {
        success: false,
        formError: VILLAGE_READ_ONLY_MESSAGE,
        code: VILLAGE_READ_ONLY_CODE,
      };
    }

    if (outcome.kind === "VILLAGE_INACTIVE") {
      return {
        success: false,
        formError: "Unable to create fund. Please try again.",
      };
    }

    if (outcome.kind === "per_house_error") {
      return { success: false, formError: outcome.error };
    }

    return { success: true, fundId: outcome.fundId };
  } catch {
    return {
      success: false,
      formError: "Unable to create fund. Please try again.",
    };
  }
}
