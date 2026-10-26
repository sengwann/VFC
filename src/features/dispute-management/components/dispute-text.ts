import type { DisputeStatus } from "@prisma/client";
import type { BadgeVariant } from "@/components/ui/badge";
import type { TranslationKey } from "@/lib/i18n/en";

/** Replaces {name} placeholders in a translated string. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export const DISPUTE_STATUS_LABEL: Record<DisputeStatus, TranslationKey> = {
  OPEN: "disputes.status.open",
  UNDER_REVIEW: "disputes.status.underReview",
  RESOLVED: "disputes.status.resolved",
  REJECTED: "disputes.status.rejected",
};

export const DISPUTE_STATUS_TONE: Record<DisputeStatus, BadgeVariant> = {
  OPEN: "warning",
  UNDER_REVIEW: "info",
  RESOLVED: "success",
  REJECTED: "danger",
};
