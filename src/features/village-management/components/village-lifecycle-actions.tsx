import type { LanguagePreference } from "@prisma/client";
import { VillageStatus } from "@prisma/client";

import { Alert } from "@/components/ui/alert";
import { Field, Textarea } from "@/components/ui/field";
import type { TranslationKey } from "@/lib/i18n/en";
import { getT } from "@/lib/i18n/translations";
import { reactivateVillageAction } from "../actions/reactivate-village.action";
import { suspendVillageAction } from "../actions/suspend-village.action";
import { REASON_MAX_LENGTH } from "../lib/lifecycle-input";
import {
  canDeactivateVillage,
  canReactivateVillage,
  canSuspendVillage,
} from "../lib/village-lifecycle";
import { fillTemplate } from "../lib/fill-template";
import { DeactivateVillageDialog } from "./deactivate-village-dialog";
import { LifecycleSubmitButton } from "./lifecycle-submit-button";

const STATUS_DESCRIPTION_KEYS: Record<VillageStatus, TranslationKey> = {
  [VillageStatus.ACTIVE]: "adminVillages.statusDesc.active",
  [VillageStatus.SUSPENDED]: "adminVillages.statusDesc.suspended",
  [VillageStatus.DEACTIVATED]: "adminVillages.statusDesc.deactivated",
};

/*
 * Server component. Which actions appear is still decided by the
 * canSuspend/canReactivate/canDeactivate rules; the actions and their
 * `villageId` form field are unchanged. Each action also accepts an optional
 * `reason` (max REASON_MAX_LENGTH characters) that is saved in the audit entry.
 * Deactivate (final) is separated into its own zone and needs an explicit
 * confirmation.
 */
export function VillageLifecycleActions({
  status,
  villageId,
  villageCode,
  villageName,
  language,
}: {
  status: VillageStatus;
  villageId: string;
  villageCode: string;
  villageName: string;
  language: LanguagePreference;
}) {
  const t = getT(language);

  if (status === VillageStatus.DEACTIVATED) {
    return <Alert tone="info">{t(STATUS_DESCRIPTION_KEYS[status])}</Alert>;
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {t(STATUS_DESCRIPTION_KEYS[status])}
      </p>

      {canSuspendVillage(status) ? (
        <form action={suspendVillageAction} className="space-y-3">
          <input name="villageId" type="hidden" value={villageId} />
          <p className="text-sm text-muted-foreground">
            {t("adminVillages.suspend.hint")}
          </p>
          <Field
            hint={t("adminVillages.reason.hint")}
            id="suspend-reason"
            label={t("adminVillages.reason.label")}
          >
            <Textarea maxLength={REASON_MAX_LENGTH} name="reason" rows={2} />
          </Field>
          <LifecycleSubmitButton
            className="w-full border-warning-border bg-warning-soft text-warning-strong hover:bg-warning-soft active:bg-warning-soft"
            variant="outline"
          >
            {t("adminVillages.suspend.button")}
          </LifecycleSubmitButton>
        </form>
      ) : null}

      {canReactivateVillage(status) ? (
        <form action={reactivateVillageAction} className="space-y-3">
          <input name="villageId" type="hidden" value={villageId} />
          <p className="text-sm text-muted-foreground">
            {t("adminVillages.reactivate.hint")}
          </p>
          <Field
            hint={t("adminVillages.reason.hint")}
            id="reactivate-reason"
            label={t("adminVillages.reason.label")}
          >
            <Textarea maxLength={REASON_MAX_LENGTH} name="reason" rows={2} />
          </Field>
          <LifecycleSubmitButton className="w-full">
            {t("adminVillages.reactivate.button")}
          </LifecycleSubmitButton>
        </form>
      ) : null}

      {canDeactivateVillage(status) ? (
        <div className="space-y-3 rounded-lg border border-danger-border bg-danger-soft/40 p-4">
          <h3 className="text-sm font-semibold text-danger-strong">
            {t("adminVillages.deactivate.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("adminVillages.deactivate.hint")}
          </p>
          <DeactivateVillageDialog
            labels={{
              trigger: t("adminVillages.deactivate.button"),
              title: t("adminVillages.deactivate.confirmTitle"),
              body: fillTemplate(t("adminVillages.deactivate.confirmBody"), {
                name: villageName,
                code: villageCode,
              }),
              confirm: t("adminVillages.deactivate.confirm"),
              cancel: t("common.cancel"),
              reasonLabel: t("adminVillages.reason.label"),
              reasonHint: t("adminVillages.reason.hint"),
            }}
            villageId={villageId}
          />
        </div>
      ) : null}
    </div>
  );
}
