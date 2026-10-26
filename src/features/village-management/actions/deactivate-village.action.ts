"use server";

import { requireSystemAdmin } from "../../../lib/authz";
import { runVillageLifecycleAction } from "../lib/run-lifecycle-action";

export async function deactivateVillageAction(
  formData: FormData,
): Promise<void> {
  const admin = await requireSystemAdmin();

  await runVillageLifecycleAction({
    action: "deactivate",
    formData,
    actorUserId: admin.id,
  });
}