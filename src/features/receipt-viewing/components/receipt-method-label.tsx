"use client";

import { useTranslation } from "@/lib/i18n/provider";

/** Renders a translated payment-method name (falls back to the raw value). */
export function ReceiptMethodLabel({ method }: { method: string }) {
  const { t } = useTranslation();

  if (method === "KPAY") {
    return <>{t("receipts.method.kpay")}</>;
  }
  if (method === "CASH") {
    return <>{t("receipts.method.cash")}</>;
  }
  return <>{method}</>;
}
