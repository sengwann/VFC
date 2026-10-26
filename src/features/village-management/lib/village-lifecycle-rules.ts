/*
 * Pure village lifecycle transition table. It has no imports, so it can be unit
 * tested directly with the Node test runner (same approach as
 * src/lib/auth/safe-redirect.ts). The server-only wrappers live in
 * village-lifecycle.ts.
 *
 * Transitions:
 *   suspend    ACTIVE                 -> SUSPENDED
 *   reactivate SUSPENDED              -> ACTIVE
 *   deactivate ACTIVE | SUSPENDED     -> DEACTIVATED (final)
 */

export type VillageLifecycleStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export type VillageLifecycleAction = "suspend" | "reactivate" | "deactivate";

export const LIFECYCLE_ALLOWED_FROM: Record<
  VillageLifecycleAction,
  readonly VillageLifecycleStatus[]
> = {
  suspend: ["ACTIVE"],
  reactivate: ["SUSPENDED"],
  deactivate: ["ACTIVE", "SUSPENDED"],
};

export const LIFECYCLE_TARGET_STATUS: Record<
  VillageLifecycleAction,
  VillageLifecycleStatus
> = {
  suspend: "SUSPENDED",
  reactivate: "ACTIVE",
  deactivate: "DEACTIVATED",
};

export function canTransition(
  action: VillageLifecycleAction,
  status: VillageLifecycleStatus,
): boolean {
  return LIFECYCLE_ALLOWED_FROM[action].includes(status);
}