import "server-only";
import { MembershipStatus, UserRole } from "@prisma/client";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { redirectForbidden } from "@/lib/authz/authz.errors";
import type { SessionUser } from "@/lib/auth/auth.types";

export type DisputeAccessLevel = "village" | "own";

export interface DisputeAccessContext {
  user: SessionUser;
  villageId: string;
  accessLevel: DisputeAccessLevel;
}

export async function requireDisputeAccess(): Promise<DisputeAccessContext> {
  const user = await requireAuthenticatedUser();

  if (user.role === UserRole.SYSTEM_ADMIN || !user.villageId) {
    return redirectForbidden();
  }

  const villageId = user.villageId;

  if (
    user.role === UserRole.CHIEF &&
    user.membershipStatus === MembershipStatus.ACTIVE
  ) {
    return { user, villageId, accessLevel: "village" };
  }

  if (
    user.role === UserRole.VILLAGER &&
    user.membershipStatus === MembershipStatus.ACTIVE
  ) {
    return { user, villageId, accessLevel: "own" };
  }

  return redirectForbidden();
}
