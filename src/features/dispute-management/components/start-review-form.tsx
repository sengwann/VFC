"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/provider";
import { startDisputeReviewAction } from "../actions/start-dispute-review.action";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button className="w-full" loading={pending} type="submit">
      {pending ? t("disputes.review.submitting") : t("disputes.review.submit")}
    </Button>
  );
}

export function StartReviewForm({ disputeId }: { disputeId: string }) {
  return (
    <form action={startDisputeReviewAction}>
      <input name="disputeId" type="hidden" value={disputeId} />
      <SubmitButton />
    </form>
  );
}
