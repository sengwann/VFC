"use client";

import Link from "next/link";
import type { DisputeStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n/en";
import { useTranslation } from "@/lib/i18n/provider";

const OPTIONS: { status?: DisputeStatus; label: TranslationKey }[] = [
  { label: "disputes.filter.all" },
  { status: "OPEN", label: "disputes.status.open" },
  { status: "UNDER_REVIEW", label: "disputes.status.underReview" },
  { status: "RESOLVED", label: "disputes.status.resolved" },
  { status: "REJECTED", label: "disputes.status.rejected" },
];

export function DisputeFilters({ active }: { active?: DisputeStatus }) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("disputes.list.filterLabel")}>
      <ul className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const isActive = option.status === active;
          const href = option.status
            ? `/village/disputes?status=${option.status}`
            : "/village/disputes";
          return (
            <li key={option.label}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border-strong bg-card text-foreground hover:bg-muted",
                )}
                href={href}
              >
                {t(option.label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
