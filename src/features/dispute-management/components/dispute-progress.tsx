"use client";

import { Check, X } from "lucide-react";
import type { DisputeStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const STAGE: Record<DisputeStatus, number> = {
  OPEN: 0,
  UNDER_REVIEW: 1,
  RESOLVED: 2,
  REJECTED: 2,
};

export function DisputeProgress({ status }: { status: DisputeStatus }) {
  const { t } = useTranslation();
  const stage = STAGE[status];

  const finalLabel =
    status === "RESOLVED"
      ? t("disputes.status.resolved")
      : status === "REJECTED"
        ? t("disputes.status.rejected")
        : t("disputes.progress.decision");

  const labels = [
    t("disputes.progress.raised"),
    t("disputes.status.underReview"),
    finalLabel,
  ];

  return (
    <Card className="p-4 sm:p-6">
      <ol
        aria-label={t("disputes.progress.label")}
        className="grid grid-cols-3"
      >
        {labels.map((label, i) => {
          const isDone = i < stage;
          const isCurrent = i === stage;
          const isFinalDecided = i === 2 && stage === 2;
          const isRejected = isFinalDecided && status === "REJECTED";

          return (
            <li
              aria-current={isCurrent ? "step" : undefined}
              className="relative flex min-w-0 flex-col items-center gap-2 px-1 text-center"
              key={i}
            >
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[-50%] top-4 h-0.5 w-full",
                    i <= stage ? "bg-primary" : "bg-border-strong",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  isRejected &&
                    "border-danger bg-danger text-destructive-foreground",
                  !isRejected &&
                    (isDone || isFinalDecided) &&
                    "border-primary bg-primary text-primary-foreground",
                  !isRejected &&
                    !isDone &&
                    !isFinalDecided &&
                    isCurrent &&
                    "border-primary bg-card text-primary ring-4 ring-accent",
                  !isDone &&
                    !isCurrent &&
                    "border-border-strong bg-card text-muted-foreground",
                )}
              >
                {isRejected ? (
                  <X aria-hidden className="size-4" />
                ) : isDone || isFinalDecided ? (
                  <Check aria-hidden className="size-4" />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "break-words text-xs font-medium",
                  isDone || isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
