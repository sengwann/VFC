"use client";

import type { ReactNode } from "react";
import type { DisputeStatus } from "@prisma/client";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/provider";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface DisputeDetailData {
  id: string;
  status: DisputeStatus;
  description: string;
  resolutionNote: string | null;
  createdAt: Date;
  raisedBy: { name: string };
  payment: {
    amount: number;
    paymentMethod: string;
    kpayTransactionId: string | null;
    kpayReceiverAccount: string | null;
    rejectionNote: string | null;
    createdAt: Date;
    fund: { name: string };
    house: { houseNumber: string };
    payer: { name: string };
    collector: { name: string } | null;
  };
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-medium text-foreground sm:text-right">
        {children}
      </dd>
    </div>
  );
}

export function DisputeDetailCard({ dispute }: { dispute: DisputeDetailData }) {
  const { t } = useTranslation();
  const { payment } = dispute;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle as="h2">{t("disputes.statement.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="divide-y">
            <Row label={t("disputes.field.raisedBy")}>
              {dispute.raisedBy.name}
            </Row>
            <Row label={t("disputes.field.date")}>
              {formatYangonDateTime(dispute.createdAt)}
            </Row>
          </dl>
          <p className="whitespace-pre-wrap break-words rounded-lg bg-muted p-3 text-sm text-foreground">
            {dispute.description}
          </p>
        </CardContent>
      </Card>

      {dispute.resolutionNote ? (
        <Card variant="muted">
          <CardHeader>
            <CardTitle as="h2">{t("disputes.note.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap break-words text-sm text-foreground">
              {dispute.resolutionNote}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle as="h2">{t("disputes.payment.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground">
              {t("disputes.payment.amount")}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {formatAmount(payment.amount)}
            </p>
            <p className="mt-0.5 break-words text-sm text-muted-foreground">
              {payment.fund.name}
            </p>
          </div>

          <dl className="divide-y">
            <Row label={t("disputes.payment.house")}>
              {payment.house.houseNumber}
            </Row>
            <Row label={t("disputes.payment.payer")}>{payment.payer.name}</Row>
            <Row label={t("disputes.payment.date")}>
              {formatYangonDateTime(payment.createdAt)}
            </Row>
          </dl>

          {payment.rejectionNote ? (
            <Alert
              role="note"
              title={t("disputes.payment.rejectionTitle")}
              tone="danger"
            >
              <p className="whitespace-pre-wrap break-words">
                {payment.rejectionNote}
              </p>
            </Alert>
          ) : null}

          <div className="space-y-3 border-t pt-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold">
                {t("disputes.proof.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("disputes.proof.note")}
              </p>
            </div>
            <dl className="divide-y">
              <Row label={t("disputes.proof.txn")}>
                <span className="break-all font-mono">
                  {payment.kpayTransactionId ?? t("disputes.notProvided")}
                </span>
              </Row>
              <Row label={t("disputes.proof.receiver")}>
                {payment.kpayReceiverAccount ?? t("disputes.notProvided")}
              </Row>
              <Row label={t("disputes.proof.collector")}>
                {payment.collector?.name ?? t("disputes.proof.unknown")}
              </Row>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
