"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { getCurrentPeriod } from "../../../lib/authz";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { revalidateVillageShell } from "../../shell/lib/shell-revalidation";
import { requireHouseholdManagementAccess } from "../lib/household-access";
import { canRemoveActiveMember } from "../lib/membership-rules";
import {
  REMOVE_MEMBER_ERROR,
  removeMemberAndDeactivateAssignments,
} from "../lib/remove-member-transaction";

const KNOWN_REMOVE_MEMBER_ERRORS = new Set<string>(
  Object.values(REMOVE_MEMBER_ERROR),
);

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function removeMemberAction(formData: FormData): Promise<void> {
  const { user, house } = await requireHouseholdManagementAccess();

  const memberId = getFormDataString(formData, "memberId");
  if (!memberId) {
    redirect("/village/household");
  }

  const target = await prisma.user.findFirst({
    where: {
      id: memberId,
      houseId: house.id,
      villageId: house.villageId,
    },
    select: {
      id: true,
      membershipStatus: true,
    },
  });

  if (!target || !canRemoveActiveMember(target, house, user.id)) {
    redirect("/village/household");
  }

  const currentPeriod = getCurrentPeriod();
  let removed = false;

  // redirect() works by throwing, so it must stay outside this try/catch.
  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          await removeMemberAndDeactivateAssignments(tx, {
            actorUserId: user.id,
            houseId: house.id,
            villageId: house.villageId,
            targetUserId: target.id,
            currentPeriod,
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
    removed = true;
  } catch (error) {
    // Expected race outcomes (head changed, member already removed) are
    // handled silently, like the other household actions. Anything else is
    // logged so a real failure is not hidden.
    const isKnown =
      error instanceof Error && KNOWN_REMOVE_MEMBER_ERRORS.has(error.message);

    if (!isKnown) {
      console.error("removeMemberAction failed", error);
    }
  }

  if (removed) {
    revalidateVillageShell();
  }

  redirect("/village/household");
}
