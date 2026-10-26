"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount } from "@/lib/utils";
import type { CollectorChartData } from "../lib/collector-analytics";
import { CollectionTrendChart } from "./collection-trend-chart";
import type { CollectorDashboardData } from "./dashboard-types";
import { fill } from "./fill";
import { PaidVsPendingChart } from "./paid-vs-pending-chart";
import { StatCard } from "./stat-card";

export function CollectorOverview({
  data,
  period,
}: {
  data: CollectorDashboardData;
  period: { year: number; month: number };
}) {
  const { t } = useTranslation();
  const periodLabel = `${period.year}-${String(period.month).padStart(2, "0")}`;

  return (
    <Section
      description={fill(t("dashboard.collector.period"), {
        period: periodLabel,
      })}
      title={t("dashboard.collector.title")}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label={t("dashboard.collector.accepted")}
          tone="success"
          value={data.acceptedCount}
        />
        <StatCard
          label={t("dashboard.collector.rejected")}
          tone={data.rejectedCount > 0 ? "danger" : "default"}
          value={data.rejectedCount}
        />
        <StatCard
          label={t("dashboard.collector.cash")}
          value={data.cashCount}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild className="w-full sm:w-auto" variant="outline">
          <Link href="/village/cash">{t("dashboard.collector.record")}</Link>
        </Button>
      </div>
    </Section>
  );
}

export function CollectorInsights({ data }: { data: CollectorChartData }) {
  const { t } = useTranslation();

  return (
    <Section title={t("dashboard.collector.summaryTitle")}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={t("dashboard.collector.totalCollected")}
          tone="success"
          value={formatAmount(data.summary.totalCollected)}
        />
        <StatCard
          label={t("dashboard.collector.pendingAmount")}
          tone="warning"
          value={formatAmount(data.summary.totalPendingAmount)}
        />
        <StatCard
          label={t("dashboard.collector.completed")}
          value={data.summary.acceptedCount}
        />
        <StatCard
          label={t("dashboard.collector.pendingCollections")}
          tone={data.summary.pendingCount > 0 ? "warning" : "default"}
          value={data.summary.pendingCount}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3 sm:pb-3">
            <CardTitle as="h3">{t("dashboard.charts.trendTitle")}</CardTitle>
            <CardDescription>{t("dashboard.charts.trendDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <CollectionTrendChart data={data.collectionOverTime} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 sm:pb-3">
            <CardTitle as="h3">
              {t("dashboard.charts.paidPendingTitle")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.charts.paidPendingDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaidVsPendingChart data={data.paidVsPending} />
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
