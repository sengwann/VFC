"use server";

import { redirect } from "next/navigation";
import { AuditActionType, FundStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireChief } from "../../../lib/authz";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

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

  const updated = await prisma.fund.updateMany({
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
    redirect(`/village/funds/${fundId}`);
  }

  await createAuditLog(prisma, {
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

  redirect(`/village/funds/${fundId}`);
}
