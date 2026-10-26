"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { FundStatus } from "@prisma/client";
import { Alert, type AlertTone } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/provider";

type FormAction = (formData: FormData) => void | Promise<void>;

function SubmitButton({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "default" | "destructive";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full"
      loading={pending}
      type="submit"
      variant={variant}
    >
      {children}
    </Button>
  );
}

/*
 * One lifecycle action with an inline two-step confirmation. The real submit
 * button only exists after the first tap, and it lives in the same <form> that
 * is bound to the server action, so the action receives exactly the same
 * FormData (fundId) as before.
 */
function ConfirmAction({
  action,
  fundId,
  label,
  hint,
  disabled = false,
  triggerVariant,
  confirmVariant,
  confirmTone,
  confirmTitle,
  confirmBody,
  confirmLabel,
}: {
  action: FormAction;
  fundId: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  triggerVariant: "default" | "outline";
  confirmVariant: "default" | "destructive";
  confirmTone: AlertTone;
  confirmTitle: string;
  confirmBody: string;
  confirmLabel: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <form action={action} className="space-y-3">
      <input name="fundId" type="hidden" value={fundId} />

      {open ? (
        <div className="space-y-3">
          <Alert title={confirmTitle} tone={confirmTone}>
            {confirmBody}
          </Alert>
          <div className="flex flex-col gap-2">
            <SubmitButton variant={confirmVariant}>{confirmLabel}</SubmitButton>
            <Button
              autoFocus
              className="w-full"
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            className="w-full"
            disabled={disabled}
            onClick={() => setOpen(true)}
            type="button"
            variant={triggerVariant}
          >
            {label}
          </Button>
          {hint ? (
            <p className="text-sm text-muted-foreground">{hint}</p>
          ) : null}
        </>
      )}
    </form>
  );
}

export function FundLifecycleControls({
  fundId,
  status,
  hasOtherActiveFund,
  canEdit,
  canActivate,
  canClose,
  activateAction,
  closeAction,
}: {
  fundId: string;
  status: FundStatus;
  hasOtherActiveFund: boolean;
  canEdit: boolean;
  canActivate: boolean;
  canClose: boolean;
  activateAction: FormAction;
  closeAction: FormAction;
}) {
  const { t } = useTranslation();

  if (status === "CLOSED") {
    return <Alert tone="info">{t("funds.lifecycle.closedNote")}</Alert>;
  }

  return (
    <div className="space-y-6">
      {canEdit ? (
        <div className="space-y-2">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/village/funds/${fundId}/edit`}>
              {t("funds.lifecycle.edit")}
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("funds.lifecycle.editHint")}
          </p>
        </div>
      ) : null}

      {canActivate ? (
        <div className="space-y-3">
          {hasOtherActiveFund ? (
            <Alert
              title={t("funds.lifecycle.activateBlockedTitle")}
              tone="warning"
            >
              {t("funds.lifecycle.activateBlockedBody")}
            </Alert>
          ) : null}
          <ConfirmAction
            action={activateAction}
            confirmBody={t("funds.lifecycle.activateConfirmBody")}
            confirmLabel={t("funds.lifecycle.activateConfirm")}
            confirmTitle={t("funds.lifecycle.activateConfirmTitle")}
            confirmTone="info"
            confirmVariant="default"
            disabled={hasOtherActiveFund}
            fundId={fundId}
            hint={
              hasOtherActiveFund ? undefined : t("funds.lifecycle.activateHint")
            }
            label={t("funds.lifecycle.activate")}
            triggerVariant="default"
          />
        </div>
      ) : null}

      {canClose ? (
        <ConfirmAction
          action={closeAction}
          confirmBody={t("funds.lifecycle.closeConfirmBody")}
          confirmLabel={t("funds.lifecycle.closeConfirm")}
          confirmTitle={t("funds.lifecycle.closeConfirmTitle")}
          confirmTone="warning"
          confirmVariant="destructive"
          fundId={fundId}
          hint={t("funds.lifecycle.closeHint")}
          label={t("funds.lifecycle.close")}
          triggerVariant="outline"
        />
      ) : null}
    </div>
  );
}
