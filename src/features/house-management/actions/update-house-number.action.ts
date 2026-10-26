"use server";

import { notFound } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { redirectForbidden } from "@/lib/authz/authz.errors";
import { lockActiveVillage } from "@/lib/authz/village";
import { lockHouse } from "@/lib/authz/house";
import { validateHouseNumber, type HouseField } from "../lib/house-validators";
import type { HouseErrorCode } from "../lib/house-error-text";
import { canEditHouseNumber } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export type UpdateHouseActionResult =
  | { success: true }
  | {
      success: false;
      /** "generic" means: show the translated generic error in the form. */
      /** "stale" means: the house may have changed or no longer exists; ask
       *  the user to refresh and retry. */
      formError?: "generic" | "stale";
      fieldErrors?: Partial<Record<HouseField, HouseErrorCode>>;
    };

export async function updateHouseNumberAction(
  houseId: string,
  formData: FormData,
): Promise<UpdateHouseActionResult> {
  const { user, villageId } = await requireChief();

  const rules = canEditHouseNumber();
  if (!rules.allowed) {
    return { success: false, formError: "generic" };
  }

  const rawHouseNumber = formData.get("houseNumber");
  const validation = validateHouseNumber(
    typeof rawHouseNumber === "string" ? rawHouseNumber : "",
  );

  if (!validation.ok) {
    return { success: false, fieldErrors: validation.fieldErrors };
  }

  const { houseNumber } = validation.data;

  let outcome:
    | "updated"
    | "unchanged"
    | "not_found"
    | "conflict"
    | "village_inactive";

  try {
    outcome = await prisma.$transaction(async (tx) => {
      if (!(await lockActiveVillage(tx, villageId))) {
        return "village_inactive" as const;
      }

      // B05 hardening: village-then-house lock ordering. Lock the house row
      // so the rename serializes with deactivation/reactivation and
      // membership-changing operations on the same house.
      const lockedHouse = await lockHouse(tx, houseId);

      if (!lockedHouse) {
        return "not_found" as const;
      }

      // Scoped by village: a house from another village looks like "not found".
      const house = await tx.house.findFirst({
        where: { id: houseId, villageId },
        select: { id: true, houseNumber: true },
      });

      if (!house) return "not_found" as const;
      if (house.houseNumber === houseNumber) return "unchanged" as const;

      // Guarded write: only succeeds if the number is still the one we read,
      // so the audit "previousHouseNumber" is always accurate.
      const { count } = await tx.house.updateMany({
        where: { id: house.id, villageId, houseNumber: house.houseNumber },
        data: { houseNumber },
      });

      if (count !== 1) return "conflict" as const;

      await createAuditLog(tx, {
        actionType: AuditActionType.UPDATE,
        entityType: AuditEntityType.HOUSE,
        entityId: house.id,
        villageId,
        actorUserId: user.id,
        metadata: {
          houseNumber,
          previousHouseNumber: house.houseNumber,
        },
      });

      return "updated" as const;
    });
  } catch (error) {
    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return {
        success: false,
        fieldErrors: { houseNumber: "duplicate" },
      };
    }

    // OWNER-APPROVED: P2025 is surfaced as a refresh-and-retry form error.
    // Do not describe every P2025 as a concurrent modification.
    if (prismaError.code === "P2025") {
      return { success: false, formError: "stale" };
    }

    return { success: false, formError: "generic" };
  }

  if (outcome === "village_inactive") return redirectForbidden();
  if (outcome === "not_found") return notFound();
  // Another rename won the race, or the row changed under us; ask the user
  // to refresh and retry with fresh data.
  if (outcome === "conflict") return { success: false, formError: "stale" };

  return { success: true };
}
