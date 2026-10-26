"use server";

import { redirect, notFound } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { redirectForbidden } from "@/lib/authz/authz.errors";
import { lockActiveVillage } from "@/lib/authz/village";
import { canReactivateHouse } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export async function reactivateHouseAction(houseId: string): Promise<void> {
  const { user, villageId } = await requireChief();

  const outcome = await prisma.$transaction(async (tx) => {
    if (!(await lockActiveVillage(tx, villageId))) {
      return "village_inactive" as const;
    }

    // Scoped by village: a house from another village looks like "not found".
    const house = await tx.house.findFirst({
      where: { id: houseId, villageId },
      select: { id: true, houseNumber: true, isActive: true },
    });

    if (!house) return "not_found" as const;

    const rules = canReactivateHouse({ isActive: house.isActive });
    if (!rules.allowed) return "noop" as const;

    // Guarded write: a double submit changes nothing the second time, so only
    // the request that really flipped the flag writes an audit entry.
    const { count } = await tx.house.updateMany({
      where: { id: house.id, villageId, isActive: false },
      data: { isActive: true },
    });

    if (count !== 1) return "noop" as const;

    await createAuditLog(tx, {
      actionType: AuditActionType.STATUS_CHANGE,
      entityType: AuditEntityType.HOUSE,
      entityId: house.id,
      villageId,
      actorUserId: user.id,
      metadata: {
        houseNumber: house.houseNumber,
        isActive: true,
      },
    });

    return "done" as const;
  });

  if (outcome === "village_inactive") {
    return redirectForbidden();
  }

  if (outcome === "not_found") {
    return notFound();
  }

  redirect(`/village/houses/${houseId}`);
}
