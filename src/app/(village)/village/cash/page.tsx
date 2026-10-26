import { MembershipStatus, PaymentMethod } from "@prisma/client";
import { CashPageView } from "../../../../features/cash-payment/components/cash-page-view";
import type { HouseOption } from "../../../../features/cash-payment/components/cash-payment-form";
import { requireCashPaymentAccess } from "../../../../features/cash-payment/lib/cash-payment-access";
import { getFundAmountPerHouse } from "../../../../features/fund-management/lib/fund-target";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Cash Payments | Village Fund Collection System",
};

export default async function CashPage() {
  const { villageId, fund } = await requireCashPaymentAccess();

  if (!fund) {
    return (
      <CashPageView fund={null} houses={[]} payments={[]} perHouse={null} />
    );
  }

  const perHouse = await getFundAmountPerHouse(
    prisma,
    villageId,
    fund.targetAmount,
  );

  const houses: HouseOption[] = await prisma.house.findMany({
    where: { villageId, isActive: true },
    orderBy: { houseNumber: "asc" },
    select: {
      id: true,
      houseNumber: true,
      members: {
        where: { membershipStatus: MembershipStatus.ACTIVE },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
    },
  });

  const recentPayments = await prisma.payment.findMany({
    where: { villageId, paymentMethod: PaymentMethod.CASH },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      voidReason: true,
      house: { select: { houseNumber: true } },
      payer: { select: { name: true } },
    },
  });

  return (
    <CashPageView
      fund={fund}
      houses={houses}
      payments={recentPayments}
      perHouse={perHouse}
    />
  );
}
