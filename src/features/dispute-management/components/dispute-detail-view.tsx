"use client";

import { Alert, type AlertTone } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircleIcon, XCircleIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/en";
import {
  DisputeDetailCard,
  type DisputeDetailData,
} from "./dispute-detail-card";
import { DisputeProgress } from "./dispute-progress";
import { DisputeStatusBadge } from "./dispute-status-badge";
import { RejectDisputeForm } from "./reject-dispute-form";
import { ResolveDisputeForm } from "./resolve-dispute-form";
import { StartReviewForm } from "./start-review-form";

const NEXT_KEY: Record<DisputeDetailData["status"], TranslationKey> = {
  OPEN: "disputes.next.open",
  UNDER_REVIEW: "disputes.next.underReview",
  RESOLVED: "disputes.next.resolved",
  REJECTED: "disputes.next.rejected",
};

const NEXT_TONE: Record<DisputeDetailData["status"], AlertTone> = {
  OPEN: "info",
  UNDER_REVIEW: "info",
  RESOLVED: "success",
  REJECTED: "warning",
};

export function DisputeDetailView({
  dispute,
  isChief,
  canStartReview,
  canResolveOrReject,
}: {
  dispute: DisputeDetailData;
  isChief: boolean;
  canStartReview: boolean;
  canResolveOrReject: boolean;
}) {
  const { t } = useTranslation();
  const decided =
    dispute.status === "RESOLVED" || dispute.status === "REJECTED";
  const hasActions = isChief && (canStartReview || canResolveOrReject);

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/village/disputes"
        backLabel={t("disputes.back")}
        description={
          isChief
            ? t("disputes.detail.description.chief")
            : t("disputes.detail.description.own")
        }
        meta={<DisputeStatusBadge status={dispute.status} />}
        title={t("disputes.detail.title")}
      />

      <DisputeProgress status={dispute.status} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <DisputeDetailCard dispute={dispute} />

        <div className="space-y-4">
          {!isChief ? (
            <Alert
              title={t("disputes.next.title")}
              tone={NEXT_TONE[dispute.status]}
            >
              {t(NEXT_KEY[dispute.status])}
            </Alert>
          ) : null}

          {isChief && decided ? (
            <Alert title={t("disputes.closed.title")} tone="info">
              {t("disputes.closed.body")}
            </Alert>
          ) : null}

          {hasActions ? (
            <Section title={t("disputes.actions.title")}>
              <div className="space-y-4">
                {canStartReview ? (
                  <Card className="border-info-border bg-info-soft/60">
                    <CardHeader>
                      <CardTitle as="h3">
                        {t("disputes.review.title")}
                      </CardTitle>
                      <CardDescription>
                        {t("disputes.review.body")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StartReviewForm disputeId={dispute.id} />
                    </CardContent>
                  </Card>
                ) : null}

                {canResolveOrReject ? (
                  <>
                    <Card className="border-success-border">
                      <CardHeader>
                        <CardTitle
                          as="h3"
                          className="flex items-center gap-2 text-success-strong"
                        >
                          <CheckCircleIcon className="size-5 shrink-0" />
                          {t("disputes.resolve.title")}
                        </CardTitle>
                        <CardDescription>
                          {t("disputes.resolve.body")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResolveDisputeForm disputeId={dispute.id} />
                      </CardContent>
                    </Card>

                    <Card className="border-danger-border">
                      <CardHeader>
                        <CardTitle
                          as="h3"
                          className="flex items-center gap-2 text-danger-strong"
                        >
                          <XCircleIcon className="size-5 shrink-0" />
                          {t("disputes.reject.title")}
                        </CardTitle>
                        <CardDescription>
                          {t("disputes.reject.body")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RejectDisputeForm disputeId={dispute.id} />
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
