"use server";

import { redirect } from "next/navigation";
import { AuditActionType, FundStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { requireChief } from "../../../lib/authz";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { guardVillageWrite } from "../../../lib/authz/village";
import {
  VILLAGE_READ_ONLY_CODE,
  withReadOnlyError,
} from "../../village-deactivation/lib/village-deactivation-rules";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function activateFundAction(formData: FormData): Promise<void> {
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

  if (fund.status !== FundStatus.DRAFT) {
    redirect(`/village/funds/${fundId}`);
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const guard = await guardVillageWrite(tx, villageId);

          if (!guard.ok) {
            throw new Error(guard.reason);
          }

          const currentFund = await tx.fund.findUnique({
            where: {
              id: fundId,
            },
            select: {
              id: true,
              status: true,
            },
          });

          if (!currentFund || currentFund.status !== FundStatus.DRAFT) {
            throw new Error("INVALID_FUND_STATE");
          }

          const existingActiveFund = await tx.fund.findFirst({
            where: {
              villageId,
              status: FundStatus.ACTIVE,
            },
            select: {
              id: true,
            },
          });

          if (existingActiveFund) {
            throw new Error("ACTIVE_FUND_EXISTS");
          }

          await tx.fund.update({
            where: {
              id: fundId,
            },
            data: {
              status: FundStatus.ACTIVE,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.STATUS_CHANGE,
            entityType: AuditEntityType.FUND,
            entityId: fundId,
            villageId,
            actorUserId: user.id,
            metadata: {
              name: fund.name,
              previousStatus: FundStatus.DRAFT,
              newStatus: FundStatus.ACTIVE,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
  } catch (error) {
    if (error instanceof Error && error.message === VILLAGE_READ_ONLY_CODE) {
      redirect(withReadOnlyError(`/village/funds/${fundId}`));
    }

    redirect(`/village/funds/${fundId}`);
  }

  redirect(`/village/funds/${fundId}`);
}
