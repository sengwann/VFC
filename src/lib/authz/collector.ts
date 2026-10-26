import "server-only";

import { VillageStatus } from "@prisma/client";

import { prisma } from "../prisma";
import { requireAuthenticatedUser } from "../auth/guards";
import type { SessionUser } from "../auth/auth.types";

import { redirectForbidden } from "./authz.errors";
import { getVillageContext, hasActiveMembership } from "./context";
import type { CollectorContext } from "./authz.types";

const YANGON_TIME_ZONE = "Asia/Yangon";

/**
 * Returns the current year and month in Asia/Yangon time.
 *
 * Replit servers normally run in UTC, so using `new Date().getFullYear()`
 * would return the previous month for the first 6.5 hours of a new month
 * in Yangon. That would let the previous month's collector keep cash
 * authority and deny the new one. All period logic in this app uses
 * Yangon time.
 */
export function getCurrentPeriod(): {
  year: number;
  month: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: YANGON_TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const yearPart = parts.find((part) => part.type === "year");
  const monthPart = parts.find((part) => part.type === "month");

  return {
    year: Number(yearPart?.value),
    month: Number(monthPart?.value),
  };
}

async function isVillageActive(villageId: string): Promise<boolean> {
  const village = await prisma.village.findUnique({
    where: { id: villageId },
    select: { status: true },
  });

  return village?.status === VillageStatus.ACTIVE;
}

export async function getActiveCollectorContext(
  user: SessionUser,
): Promise<CollectorContext | null> {
  const villageContext = getVillageContext(user);

  if (!villageContext) {
    return null;
  }

  if (!hasActiveMembership(user)) {
    return null;
  }

  // Defensive: if guards.ts does not already block inactive villages,
  // this prevents collectors from continuing to collect cash there.
  if (!(await isVillageActive(villageContext.villageId))) {
    return null;
  }

  const { year, month } = getCurrentPeriod();

  const assignment = await prisma.collectorAssignment.findFirst({
    where: {
      userId: user.id,
      villageId: villageContext.villageId,
      year,
      month,
      isActive: true,
    },
    select: {
      id: true,
      villageId: true,
      year: true,
      month: true,
    },
  });

  if (!assignment) {
    return null;
  }

  if (assignment.villageId !== villageContext.villageId) {
    return null;
  }

  return {
    user,
    villageId: villageContext.villageId,
    assignment: {
      id: assignment.id,
      villageId: assignment.villageId,
      year: assignment.year,
      month: assignment.month,
    },
  };
}

export async function requireActiveCollector(): Promise<CollectorContext> {
  const user = await requireAuthenticatedUser();

  const context = await getActiveCollectorContext(user);

  if (!context) {
    return redirectForbidden();
  }

  return context;
}
