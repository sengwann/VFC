import { DisputeStatus } from "@prisma/client";
import { DisputesView } from "@/features/dispute-management/components/disputes-view";
import { requireDisputeAccess } from "@/features/dispute-management/lib/dispute-access";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Disputes | Village Fund Collection System",
};

export default async function DisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { user, villageId, accessLevel } = await requireDisputeAccess();

  const { status } = await searchParams;

  const statusFilter = Object.values(DisputeStatus).includes(
    status as DisputeStatus,
  )
    ? (status as DisputeStatus)
    : undefined;

  const isChief = accessLevel === "village";

  const disputes = await prisma.dispute.findMany({
    where: {
      villageId,
      ...(accessLevel === "own" ? { raisedByUserId: user.id } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      description: true,
      createdAt: true,
      raisedBy: {
        select: {
          name: true,
        },
      },
      payment: {
        select: {
          amount: true,
          fund: {
            select: {
              name: true,
            },
          },
          house: {
            select: {
              houseNumber: true,
            },
          },
        },
      },
    },
  });

  return (
    <DisputesView
      activeStatus={statusFilter}
      disputes={disputes}
      isChief={isChief}
    />
  );
}
