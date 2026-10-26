import "server-only";

import { redirect } from "next/navigation";

import { isSerializationConflict } from "../../../lib/db/transaction";
import {
  changeVillageStatus,
  type ChangeVillageStatusOutcome,
} from "./change-village-status";
import {
  LIFECYCLE_ERROR_BUSY,
  LIFECYCLE_ERROR_PARAM,
  LIFECYCLE_ERROR_REASON_TOO_LONG,
  parseLifecycleInput,
} from "./lifecycle-input";
import type { VillageLifecycleAction } from "./village-lifecycle-rules";

const VILLAGES_LIST_PATH = "/admin/villages";

function getVillageDetailPath(villageId: string): string {
  return `${VILLAGES_LIST_PATH}/${encodeURIComponent(villageId)}`;
}

/*
 * Shared body of the three lifecycle server actions. The action files stay thin
 * and call requireSystemAdmin() themselves; this runs after that check.
 * A missing village goes to the list, anything else (including a transition
 * that is not allowed) goes to the detail page. A serialization conflict that
 * is still failing after the retries goes to the detail page with an error
 * param; any other error is rethrown.
 */
export async function runVillageLifecycleAction(params: {
  action: VillageLifecycleAction;
  formData: FormData;
  actorUserId: string;
}): Promise<never> {
  const input = parseLifecycleInput(params.formData);

  if (!input.ok) {
    if (input.error === "REASON_TOO_LONG") {
      redirect(
        `${getVillageDetailPath(input.villageId)}?${LIFECYCLE_ERROR_PARAM}=${LIFECYCLE_ERROR_REASON_TOO_LONG}`,
      );
    }

    redirect(VILLAGES_LIST_PATH);
  }

  let outcome: ChangeVillageStatusOutcome | "busy";

  try {
    outcome = await changeVillageStatus({
      villageId: input.villageId,
      action: params.action,
      actorUserId: params.actorUserId,
      reason: input.reason,
    });
  } catch (error) {
    if (!isSerializationConflict(error)) {
      throw error;
    }

    outcome = "busy";
  }

  if (outcome === "busy") {
    redirect(
      `${getVillageDetailPath(input.villageId)}?${LIFECYCLE_ERROR_PARAM}=${LIFECYCLE_ERROR_BUSY}`,
    );
  }

  if (outcome === "not_found") {
    redirect(VILLAGES_LIST_PATH);
  }

  redirect(getVillageDetailPath(input.villageId));
}
