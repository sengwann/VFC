"use client";

import type { DisputeStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/provider";
import { DISPUTE_STATUS_LABEL, DISPUTE_STATUS_TONE } from "./dispute-text";

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  const { t } = useTranslation();
  return (
    <Badge dot variant={DISPUTE_STATUS_TONE[status]}>
      {t(DISPUTE_STATUS_LABEL[status])}
    </Badge>
  );
}
