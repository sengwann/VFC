import "server-only";
import { FundStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireActiveCollector } from "../../../lib/authz";
import type { CollectorContext } from "../../../lib/authz";

export interface CashPaymentAccessContext {
  collector: CollectorContext;
  villageId: string;
  fund: {
    id: string;
    name: string;
    targetAmount: number;
  } | null;
}

export async function requireCashPaymentAccess(): Promise<CashPaymentAccessContext> {
  const collector = await requireActiveCollector();
  const villageId = collector.villageId;

  const fund = await prisma.fund.findFirst({
    where: {
      villageId,
      status: FundStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      targetAmount: true,
    },
  });

  return {
    collector,
    villageId,
    fund,
  };
}
