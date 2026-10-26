import "server-only";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface MonthlyCollection {
  month: string; // e.g., "2024-01"
  label: string; // e.g., "Jan 2024"
  amount: number;
  count: number;
}

export interface CollectorCollectionSummary {
  totalCollected: number;
  totalPendingAmount: number;
  acceptedCount: number;
  pendingCount: number;
  rejectedCount: number;
  cashCount: number;
}

export interface CollectorChartData {
  summary: CollectorCollectionSummary;
  collectionOverTime: MonthlyCollection[];
  paidVsPending: { label: string; count: number; amount: number }[];
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getMonthLabel(year: number, month: number): string {
  return `${MONTH_LABELS[month - 1]} ${year}`;
}

/**
 * Fetches collection analytics for the Collector dashboard.
 * All data is scoped to the collector's village.
 * Accepted/Rejected/Cash are scoped to this specific collector.
 * Pending totals remain village-wide so preserved legacy records stay visible.
 */
export async function getCollectorChartData(
  villageId: string,
  collectorUserId: string,
): Promise<CollectorChartData> {
  // Summary counts and totals
  const [
    acceptedResult,
    pendingResult,
    rejectedCount,
    cashCount,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        villageId,
        collectorUserId,
        status: PaymentStatus.ACCEPTED,
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.payment.aggregate({
      where: {
        villageId,
        status: PaymentStatus.PENDING,
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.payment.count({
      where: {
        villageId,
        collectorUserId,
        status: PaymentStatus.REJECTED,
      },
    }),
    prisma.payment.count({
      where: {
        villageId,
        collectorUserId,
        status: PaymentStatus.ACCEPTED,
        paymentMethod: PaymentMethod.CASH,
      },
    }),
  ]);

  const summary: CollectorCollectionSummary = {
    totalCollected: acceptedResult._sum.amount ?? 0,
    totalPendingAmount: pendingResult._sum.amount ?? 0,
    acceptedCount: acceptedResult._count.id,
    pendingCount: pendingResult._count.id,
    rejectedCount,
    cashCount,
  };

  // Collection over time: fetch accepted payments by this collector
  const acceptedPayments = await prisma.payment.findMany({
    where: {
      villageId,
      collectorUserId,
      status: PaymentStatus.ACCEPTED,
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by month
  const monthlyMap = new Map<string, { amount: number; count: number }>();
  for (const payment of acceptedPayments) {
    const date = payment.createdAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing = monthlyMap.get(key) ?? { amount: 0, count: 0 };
    monthlyMap.set(key, {
      amount: existing.amount + payment.amount,
      count: existing.count + 1,
    });
  }

  // Convert to sorted array (last 12 months max)
  const collectionOverTime: MonthlyCollection[] = Array.from(
    monthlyMap.entries(),
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, data]) => {
      const [yearStr, monthStr] = key.split("-");
      return {
        month: key,
        label: getMonthLabel(parseInt(yearStr), parseInt(monthStr)),
        amount: data.amount,
        count: data.count,
      };
    });

  // Paid vs Pending
  const paidVsPending = [
    {
      label: "Paid",
      count: summary.acceptedCount,
      amount: summary.totalCollected,
    },
    {
      label: "Pending",
      count: summary.pendingCount,
      amount: summary.totalPendingAmount,
    },
  ];

  return {
    summary,
    collectionOverTime,
    paidVsPending,
  };
}
