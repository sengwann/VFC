"use server";

import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { redirectForbidden } from "@/lib/authz/authz.errors";
import { lockActiveVillage } from "@/lib/authz/village";
import { validateHouseNumber, type HouseField } from "../lib/house-validators";
import type { HouseErrorCode } from "../lib/house-error-text";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export type CreateHouseActionResult =
  | { success: true; houseId: string }
  | {
      success: false;
      /** "generic" means: show the translated generic error in the form. */
      formError?: "generic";
      fieldErrors?: Partial<Record<HouseField, HouseErrorCode>>;
    };

export async function createHouseAction(
  formData: FormData,
): Promise<CreateHouseActionResult> {
  const { user, villageId } = await requireChief();
  const rawHouseNumber = formData.get("houseNumber");
  const validation = validateHouseNumber(
    typeof rawHouseNumber === "string" ? rawHouseNumber : "",
  );

  if (!validation.ok) {
    return { success: false, fieldErrors: validation.fieldErrors };
  }

  const { houseNumber } = validation.data;

  let outcome:
    | { kind: "created"; houseId: string }
    | { kind: "village_inactive" };

  try {
    outcome = await prisma.$transaction(async (tx) => {
      // Village must still be ACTIVE when the write happens, not only when
      // the request started.
      if (!(await lockActiveVillage(tx, villageId))) {
        return { kind: "village_inactive" } as const;
      }

      const createdHouse = await tx.house.create({
        data: { villageId, houseNumber, isActive: true },
      });

      await createAuditLog(tx, {
        actionType: AuditActionType.CREATE,
        entityType: AuditEntityType.HOUSE,
        entityId: createdHouse.id,
        villageId,
        actorUserId: user.id,
        metadata: { houseNumber, isActive: true },
      });

      return { kind: "created", houseId: createdHouse.id } as const;
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return {
        success: false,
        fieldErrors: { houseNumber: "duplicate" },
      };
    }
    return { success: false, formError: "generic" };
  }

  if (outcome.kind === "village_inactive") {
    return redirectForbidden();
  }

  return { success: true, houseId: outcome.houseId };
}
