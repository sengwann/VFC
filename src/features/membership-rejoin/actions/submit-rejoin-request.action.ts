"use server";

import { redirect } from "next/navigation";
import { AuditActionType, MembershipStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { lockHouse } from "../../../lib/authz/house";
import { requireRejoinContext } from "../lib/rejoin-access";
import {
  getFormDataString,
  normalizeHouseNumber,
} from "../lib/rejoin-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { revalidateVillageShell } from "../../shell/lib/shell-revalidation";

export async function submitRejoinRequestAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId } = await requireRejoinContext();

  const rawHouseNumber = getFormDataString(formData, "houseNumber");
  const houseNumber = normalizeHouseNumber(rawHouseNumber);

  if (!houseNumber) {
    redirect("/rejoin");
  }

  const house = await prisma.house.findUnique({
    where: {
      villageId_houseNumber: {
        villageId,
        houseNumber,
      },
    },
    select: {
      id: true,
      villageId: true,
      isActive: true,
    },
  });

  if (!house || !house.isActive || house.villageId !== villageId) {
    redirect("/rejoin");
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const currentUser = await tx.user.findUnique({
            where: {
              id: user.id,
            },
            select: {
              id: true,
              membershipStatus: true,
            },
          });

          if (
            !currentUser ||
            (currentUser.membershipStatus !== MembershipStatus.REJECTED &&
              currentUser.membershipStatus !== MembershipStatus.REMOVED)
          ) {
            throw new Error("INVALID_REJOIN_STATE");
          }

          // B05 hardening: lock the house row FIRST and treat the locked
          // row's isActive as authoritative for the write below. This
          // serializes the PENDING membership being created here against
          // concurrent house deactivation. Lock-ordering note: this flow
          // does not take the village row lock; tenancy is enforced by
          // requireRejoinContext plus the villageId checks, unchanged.
          const lockedHouse = await lockHouse(tx, house.id);

          if (!lockedHouse || !lockedHouse.isActive) {
            throw new Error("HOUSE_NOT_AVAILABLE");
          }

          const currentHouse = await tx.house.findUnique({
            where: {
              id: house.id,
            },
            select: {
              id: true,
              villageId: true,
            },
          });

          if (!currentHouse || currentHouse.villageId !== villageId) {
            throw new Error("HOUSE_NOT_AVAILABLE");
          }

          // A rejoin request is always PENDING and never makes the user Head
          // of House. If the house has a head, that head approves the request.
          // If the house has no head yet, the Village Chief decides.
          const newMembershipStatus = MembershipStatus.PENDING;

          await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              houseId: house.id,
              membershipStatus: newMembershipStatus,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.STATUS_CHANGE,
            entityType: AuditEntityType.USER,
            entityId: user.id,
            villageId,
            actorUserId: user.id,
            metadata: {
              previousMembershipStatus: currentUser.membershipStatus,
              newMembershipStatus,
              houseId: house.id,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
  } catch {
    redirect("/rejoin");
  }

  revalidateVillageShell();

  redirect("/village/dashboard");
}
