"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TranslationKey } from "@/lib/i18n/en";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount } from "@/lib/utils";
import { ChartEmptyState } from "./chart-empty-state";
import { fill } from "./fill";

interface PaidVsPendingData {
  label: string;
  count: number;
  amount: number;
}

const COLORS = ["var(--success)", "var(--warning)"];
const LABELS: Record<string, TranslationKey> = {
  Paid: "dashboard.chart.paid",
  Pending: "dashboard.chart.pending",
};

export function PaidVsPendingChart({ data }: { data: PaidVsPendingData[] }) {
  const { t } = useTranslation();
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  if (totalCount === 0) {
    return <ChartEmptyState message={t("dashboard.chart.emptyPayments")} />;
  }

  const rows = data.map((item) => ({
    ...item,
    label: LABELS[item.label] ? t(LABELS[item.label]) : item.label,
  }));

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div aria-hidden="true" className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart accessibilityLayer={false}>
            <Pie
              cx="50%"
              cy="50%"
              data={rows}
              dataKey="count"
              innerRadius={46}
              nameKey="label"
              outerRadius={70}
              paddingAngle={3}
              stroke="var(--card)"
            >
              {rows.map((row, index) => (
                <Cell fill={COLORS[index % COLORS.length]} key={row.label} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border-strong)",
                background: "var(--card)",
                color: "var(--card-foreground)",
                fontSize: "13px",
              }}
              formatter={(value, name) => [
                fill(t("dashboard.chart.paymentsCount"), {
                  count: Number(value),
                }),
                String(name),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2">
        {rows.map((row, index) => (
          <li
            className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
            key={row.label}
          >
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-sm text-muted-foreground">
                {fill(t("dashboard.chart.paymentsCount"), {
                  count: row.count,
                })}
              </p>
            </div>
            <p className="shrink-0 font-semibold tabular-nums">
              {formatAmount(row.amount)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
