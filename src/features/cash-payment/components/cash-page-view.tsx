"use client";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount } from "@/lib/utils";
import { CashPaymentForm } from "./cash-payment-form";
import type { HouseOption } from "./cash-payment-form";
import { CashPaymentList } from "./cash-payment-list";
import type { CashPaymentListItem } from "./cash-payment-list";
import { formatMessage } from "./format-message";

export type CashPerHouse =
  | { ok: true; amountPerHouse: number; numberOfHouse: number }
  | { ok: false; error: string };

export interface CashPageViewProps {
  fund: { name: string; targetAmount: number } | null;
  perHouse: CashPerHouse | null;
  houses: HouseOption[];
  payments: CashPaymentListItem[];
}

export function CashPageView({
  fund,
  perHouse,
  houses,
  payments,
}: CashPageViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        description={t("cashPay.description")}
        meta={
          fund ? (
            <Badge dot variant="success">
              {formatMessage(t("cashPay.fundBadge"), { name: fund.name })}
            </Badge>
          ) : null
        }
        title={t("cashPay.title")}
      />

      {!fund ? (
        <EmptyState
          description={t("cashPay.noFundBody")}
          title={t("cashPay.noFundTitle")}
        />
      ) : (
        <div className="space-y-6 lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3 sm:pb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("cashPay.fund.eyebrow")}
                </p>
                <CardTitle as="h2">{fund.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {perHouse?.ok ? (
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm font-medium text-accent-foreground">
                      {t("cashPay.fund.minPerHouse")}
                    </p>
                    <p className="mt-1 text-3xl font-semibold tabular-nums text-accent-foreground">
                      {formatAmount(perHouse.amountPerHouse)}
                    </p>
                    <p className="mt-1 text-xs text-accent-foreground/80">
                      {formatMessage(t("cashPay.fund.formula"), {
                        count: perHouse.numberOfHouse,
                      })}
                    </p>
                  </div>
                ) : null}

                <dl className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">
                    {t("cashPay.fund.total")}
                  </dt>
                  <dd className="font-semibold tabular-nums">
                    {formatAmount(fund.targetAmount)}
                  </dd>
                </dl>

                <p className="text-sm text-muted-foreground">
                  {t("cashPay.fund.note")}
                </p>
              </CardContent>
            </Card>

            {perHouse?.ok ? (
              <CashPaymentForm
                houses={houses}
                minimumAmount={perHouse.amountPerHouse}
              />
            ) : (
              <Alert tone="danger" title={t("cashPay.fund.unavailableTitle")}>
                {perHouse && !perHouse.ok ? perHouse.error : null}
              </Alert>
            )}
          </div>

          <Section
            description={t("cashPay.list.description")}
            id="recent-cash-payments"
            title={t("cashPay.list.title")}
          >
            <CashPaymentList payments={payments} />
          </Section>
        </div>
      )}
    </div>
  );
}
