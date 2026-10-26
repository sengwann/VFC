"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DisputeStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/lib/i18n/provider";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";
import { DisputeStatusBadge } from "./dispute-status-badge";
import { fill } from "./dispute-text";

export interface DisputeListItem {
  id: string;
  status: DisputeStatus;
  description: string;
  createdAt: Date;
  raisedBy: { name: string };
  payment: {
    amount: number;
    fund: { name: string };
    house: { houseNumber: string };
  };
}

export function DisputeList({
  disputes,
  showRaiser,
  hasFilter = false,
}: {
  disputes: DisputeListItem[];
  showRaiser: boolean;
  hasFilter?: boolean;
}) {
  const { t } = useTranslation();

  if (disputes.length === 0) {
    if (hasFilter) {
      return (
        <EmptyState
          action={
            <Button asChild variant="outline">
              <Link href="/village/disputes">{t("disputes.list.showAll")}</Link>
            </Button>
          }
          description={t("disputes.list.noMatchBody")}
          title={t("disputes.list.noMatchTitle")}
        />
      );
    }
    return (
      <EmptyState
        description={
          showRaiser
            ? t("disputes.list.emptyBody.chief")
            : t("disputes.list.emptyBody.own")
        }
        title={t("disputes.list.emptyTitle")}
      />
    );
  }

  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {disputes.map((d) => (
        <li key={d.id}>
          <Link
            className="block h-full rounded-xl"
            href={`/village/disputes/${d.id}`}
          >
            <Card className="h-full space-y-3 p-4 sm:p-5" interactive>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold tabular-nums leading-tight text-foreground">
                    {formatAmount(d.payment.amount)}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {d.payment.fund.name}
                  </p>
                </div>
                <div className="shrink-0">
                  <DisputeStatusBadge status={d.status} />
                </div>
              </div>

              <p className="line-clamp-2 whitespace-pre-line text-sm text-secondary-foreground">
                {d.description}
              </p>

              <div className="flex items-end justify-between gap-3">
                <p className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {fill(t("disputes.card.house"), {
                      number: d.payment.house.houseNumber,
                    })}
                  </span>
                  <span>{formatYangonDateTime(d.createdAt)}</span>
                  {showRaiser ? (
                    <span>
                      {fill(t("disputes.card.raisedBy"), {
                        name: d.raisedBy.name,
                      })}
                    </span>
                  ) : null}
                </p>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
