"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { useTranslation } from "@/lib/i18n/provider";
import { resolveDisputeAction } from "../actions/resolve-dispute.action";

export function ResolveDisputeForm({ disputeId }: { disputeId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await resolveDisputeAction(formData);
      if (result.success) {
        router.refresh();
      } else {
        const fe = result.fieldErrors ?? {};
        setFieldErrors(fe);
        setError(
          Object.keys(fe).length > 0
            ? t("disputes.form.fixFields")
            : (result.error ?? t("common.error")),
        );
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="disputeId" type="hidden" value={disputeId} />
      <Field
        error={fieldErrors.resolutionNote}
        hint={t("disputes.resolve.hint")}
        id={`resolve-note-${disputeId}`}
        label={t("disputes.resolve.label")}
        required
      >
        <Textarea
          name="resolutionNote"
          placeholder={t("disputes.resolve.placeholder")}
          rows={4}
        />
      </Field>
      {error ? (
        <Alert title={t("disputes.decision.errorTitle")} tone="danger">
          {error}
        </Alert>
      ) : null}
      <Button className="w-full" loading={isPending} type="submit">
        {isPending
          ? t("disputes.resolve.submitting")
          : t("disputes.resolve.submit")}
      </Button>
    </form>
  );
}
