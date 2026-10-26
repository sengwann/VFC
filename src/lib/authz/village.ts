import "server-only";

import { notFound } from "next/navigation";
import { Prisma, VillageStatus } from "@prisma/client";

import { prisma } from "../prisma";

import { requireSystemAdmin } from "./roles";
import type { VillageLifecycleContext } from "./authz.types";

export async function requireVillageLifecycleAccess(
  villageId: string,
): Promise<VillageLifecycleContext> {
  await requireSystemAdmin();

  const village = await prisma.village.findUnique({
    where: {
      id: villageId,
    },
    select: {
      id: true,
      villageCode: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!village) {
    return notFound();
  }

  return village;
}

/**
 * Call INSIDE a write transaction. Takes a shared row lock on the village and
 * reports whether it is ACTIVE. Concurrent house writes do not block each
 * other (FOR SHARE), but a suspend/deactivate that takes FOR UPDATE on the
 * same row (B03, separate chat) will wait for them, and the other way round.
 * Returns false when the village is missing or not ACTIVE; the caller ends the
 * transaction and then calls redirectForbidden().
 */
export async function lockActiveVillage(
  tx: Prisma.TransactionClient,
  villageId: string,
): Promise<boolean> {
  const rows = await tx.$queryRaw<{ status: string }[]>`
    SELECT "status"::text AS "status"
    FROM "Village"
    WHERE "id" = ${villageId}
    FOR SHARE
  `;

  return rows[0]?.status === VillageStatus.ACTIVE;
}
