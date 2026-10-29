"use server";

import { redirect } from "next/navigation";
import { AuditActionType, FundStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireChief } from "../../../lib/authz";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { guardVillageWrite } from "../../../lib/authz/village";
import { redirectForbidden } from "../../../lib/authz/authz.errors";
import { withReadOnlyError } from "../../village-deactivation/lib/village-deactivation-rules";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function closeFundAction(formData: FormData): Promise<void> {
  const { user, villageId } = await requireChief();

  const fundId = getFormDataString(formData, "fundId");
  if (!fundId) {
    redirect("/village/funds");
  }

  const fund = await prisma.fund.findUnique({
    where: {
      id: fundId,
    },
    select: {
      id: true,
      villageId: true,
      name: true,
      status: true,
    },
  });

  if (!fund || fund.villageId !== villageId) {
    redirect("/village/funds");
  }

  if (fund.status !== FundStatus.ACTIVE) {
    redirect(`/village/funds/${fundId}`);
  }

  // The status change and its audit entry commit together, and only while
  // the village still accepts writes.
  const outcome = await withSerializableRetry(() =>
    prisma.$transaction(
      async (tx) => {
        const guard = await guardVillageWrite(tx, villageId);

        if (!guard.ok) {
          return guard.reason === "VILLAGE_READ_ONLY"
            ? ("village_read_only" as const)
            : ("village_inactive" as const);
        }

        const updated = await tx.fund.updateMany({
          where: {
            id: fundId,
            villageId,
            status: FundStatus.ACTIVE,
          },
          data: {
            status: FundStatus.CLOSED,
          },
        });

        if (updated.count !== 1) {
          return "not_active" as const;
        }

        await createAuditLog(tx, {
          actionType: AuditActionType.STATUS_CHANGE,
          entityType: AuditEntityType.FUND,
          entityId: fundId,
          villageId,
          actorUserId: user.id,
          metadata: {
            name: fund.name,
            previousStatus: FundStatus.ACTIVE,
            newStatus: FundStatus.CLOSED,
          },
        });

        return "closed" as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    ),
  );

  if (outcome === "village_read_only") {
    redirect(withReadOnlyError(`/village/funds/${fundId}`));
  }

  if (outcome === "village_inactive") {
    return redirectForbidden();
  }

  redirect(`/village/funds/${fundId}`);
}
