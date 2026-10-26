"use client";

import type { DisputeStatus } from "@prisma/client";
import { PageHeader } from "@/components/ui/page-header";
import { useTranslation } from "@/lib/i18n/provider";
import { DisputeFilters } from "./dispute-filters";
import { DisputeList, type DisputeListItem } from "./dispute-list";
import { fill } from "./dispute-text";

export function DisputesView({
  disputes,
  activeStatus,
  isChief,
}: {
  disputes: DisputeListItem[];
  activeStatus?: DisputeStatus;
  isChief: boolean;
}) {
  const { t } = useTranslation();
  const count = disputes.length;

  return (
    <div className="space-y-6">
      <PageHeader
        description={
          isChief
            ? t("disputes.list.description.chief")
            : t("disputes.list.description.own")
        }
        title={t("disputes.list.title")}
      />

      <div className="space-y-3">
        <DisputeFilters active={activeStatus} />
        {count > 0 ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {fill(
              t(
                count === 1
                  ? "disputes.list.countOne"
                  : "disputes.list.countOther",
              ),
              { count },
            )}
          </p>
        ) : null}
      </div>

      <DisputeList
        disputes={disputes}
        hasFilter={Boolean(activeStatus)}
        showRaiser={isChief}
      />
    </div>
  );
}
