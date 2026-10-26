"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { deactivateVillageAction } from "../actions/deactivate-village.action";
import { REASON_MAX_LENGTH } from "../lib/lifecycle-input";
import { LifecycleSubmitButton } from "./lifecycle-submit-button";

/*
 * Confirmation step for the final "Deactivate" action. Uses the native
 * <dialog> element (focus trap, Escape to close, inert background), the same
 * technique as the mobile menu. The form still posts the same villageId to the
 * same server action, plus an optional `reason` that is saved in the audit
 * entry. Cancel is auto-focused so Enter does not confirm by accident. All text
 * arrives already translated.
 */
export function DeactivateVillageDialog({
  villageId,
  labels,
}: {
  villageId: string;
  labels: {
    trigger: string;
    title: string;
    body: string;
    confirm: string;
    cancel: string;
    reasonLabel: string;
    reasonHint: string;
  };
}) {
  const titleId = useId();
  const reasonId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function openDialog() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Button
        aria-haspopup="dialog"
        className="w-full border-danger-border text-danger-strong hover:bg-danger-soft active:bg-danger-soft"
        onClick={openDialog}
        type="button"
        variant="outline"
      >
        {labels.trigger}
      </Button>

      <dialog
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border bg-card p-0 text-card-foreground shadow-md backdrop:bg-black/50 md:inset-0 md:m-auto md:h-fit md:max-w-md md:rounded-2xl"
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={() => {
          setOpen(false);
          // Do not keep a half-typed reason around after Cancel or Escape.
          formRef.current?.reset();
        }}
        ref={dialogRef}
      >
        <form
          action={deactivateVillageAction}
          className="space-y-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
          ref={formRef}
        >
          <input name="villageId" type="hidden" value={villageId} />

          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-strong"
            >
              <AlertTriangle className="size-5" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <h2 className="text-base font-semibold leading-snug" id={titleId}>
                {labels.title}
              </h2>
              <p className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                {labels.body}
              </p>
            </div>
          </div>

          <Field
            hint={labels.reasonHint}
            id={reasonId}
            label={labels.reasonLabel}
          >
            <Textarea maxLength={REASON_MAX_LENGTH} name="reason" rows={3} />
          </Field>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              autoFocus
              onClick={closeDialog}
              type="button"
              variant="outline"
            >
              {labels.cancel}
            </Button>
            <LifecycleSubmitButton variant="destructive">
              {labels.confirm}
            </LifecycleSubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
