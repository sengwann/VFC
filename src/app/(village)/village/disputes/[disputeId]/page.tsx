import { notFound } from "next/navigation";
import { DisputeDetailView } from "@/features/dispute-management/components/dispute-detail-view";
import {
  canResolveOrReject,
  canStartReview,
} from "@/features/dispute-management/lib/dispute-rules";
import {
  requireDisputeAccess,
  type DisputeAccessLevel,
} from "@/features/dispute-management/lib/dispute-access";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dispute Detail | Village Fund Collection System",
};

// ── Safe param extraction (Next.js 15+ params is a Promise) ───
type RouteParams = Record<string, string | string[] | undefined>;

async function extractDisputeId(rawParams: unknown): Promise<string> {
  if (!rawParams) return "";
  let params: RouteParams;
  const maybePromise = rawParams as { then?: unknown };
  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }
  const disputeId = params.disputeId;
  if (Array.isArray(disputeId)) return disputeId[0] ?? "";
  return disputeId ?? "";
}

// ── Access check ───────────────────────────────────────────────
function canAccessDisputeDetail(
  accessLevel: DisputeAccessLevel,
  dispute: { villageId: string; raisedByUserId: string },
  villageId: string,
  userId: string,
): boolean {
  if (dispute.villageId !== villageId) return false;
  if (accessLevel === "village") return true;
  return dispute.raisedByUserId === userId;
}

// ── Page ───────────────────────────────────────────────────────
export default async function DisputeDetailPage({
  params,
}: {
  params: unknown;
}) {
  const { user, villageId, accessLevel } = await requireDisputeAccess();

  const disputeId = await extractDisputeId(params);
  if (!disputeId) {
    notFound();
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    select: {
      id: true,
      villageId: true,
      status: true,
      description: true,
      resolutionNote: true,
      createdAt: true,
      raisedByUserId: true,
      raisedBy: { select: { name: true } },
      payment: {
        select: {
          id: true,
          amount: true,
          paymentMethod: true,
          kpayTransactionId: true,
          kpayReceiverAccount: true,
          rejectionNote: true,
          createdAt: true,
          fund: { select: { name: true } },
          house: { select: { houseNumber: true } },
          payer: { select: { name: true } },
          collector: { select: { name: true } },
        },
      },
    },
  });

  if (!dispute) {
    notFound();
  }

  if (!canAccessDisputeDetail(accessLevel, dispute, villageId, user.id)) {
    notFound();
  }

  const isChief = accessLevel === "village";

  return (
    <DisputeDetailView
      canResolveOrReject={canResolveOrReject(dispute.status)}
      canStartReview={canStartReview(dispute.status)}
      dispute={dispute}
      isChief={isChief}
    />
  );
}
