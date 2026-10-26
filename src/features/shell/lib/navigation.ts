import { LanguagePreference, MembershipStatus, UserRole } from "@prisma/client";
import type { SessionUser } from "../../../lib/auth/auth.types";
import type { NotificationSummary } from "../../notifications/lib/notification-service";
import { getT } from "../../../lib/i18n/translations";

export type NavIconName =
  | "home"
  | "landmark"
  | "scroll-text"
  | "building"
  | "users"
  | "user-cog"
  | "wallet"
  | "credit-card"
  | "receipt"
  | "shield-check"
  | "banknote";

export type NavBadgeVariant = "default" | "alert";

export interface NavItem {
  label: string;
  href?: string;
  iconName: NavIconName;
  disabled?: boolean;
  badge?: string;
  badgeVariant?: NavBadgeVariant;
}

export interface ShellNavigation {
  sidebarItems: NavItem[];
  mobileItems: NavItem[];
}

function formatBadgeCount(count: number): string {
  if (count > 99) {
    return "99+";
  }
  return String(count);
}

export function buildPlatformNavigation(
  language: LanguagePreference,
): ShellNavigation {
  const t = getT(language);

  const dashboard: NavItem = {
    label: t("nav.dashboard"),
    href: "/admin/dashboard",
    iconName: "home",
  };
  const villages: NavItem = {
    label: t("nav.villages"),
    href: "/admin/villages",
    iconName: "landmark",
  };
  const platformAudit: NavItem = {
    label: t("nav.platformAudit"),
    href: "/admin/audit",
    iconName: "scroll-text",
  };

  return {
    sidebarItems: [dashboard, villages, platformAudit],
    mobileItems: [dashboard, villages, platformAudit],
  };
}

export function buildVillageNavigation(params: {
  user: SessionUser;
  isActiveCollector: boolean;
  isHeadOfHouse: boolean;
  notifications?: NotificationSummary;
  language: LanguagePreference;
}): ShellNavigation {
  const { user, isActiveCollector, isHeadOfHouse, notifications, language } =
    params;
  const t = getT(language);
  const activeMembership = user.membershipStatus === MembershipStatus.ACTIVE;
  const isChief = user.role === UserRole.CHIEF;

  const chiefSummary = notifications?.chief ?? null;
    const pendingHeadlessMembers =
    isChief && chiefSummary ? chiefSummary.pendingHeadlessMembers : 0;
  const pendingMembers =
    isHeadOfHouse && notifications?.headOfHouse
      ? notifications.headOfHouse.pendingMembers
      : 0;

  const dashboard: NavItem = {
    label: t("nav.dashboard"),
    href: "/village/dashboard",
    iconName: "home",
  };
  const sidebarItems: NavItem[] = [dashboard];
  const mobileItems: NavItem[] = [dashboard];

  const houses: NavItem = {
    label: t("nav.houses"),
    href: "/village/houses",
    iconName: "building",
    badge:
      pendingHeadlessMembers > 0
        ? formatBadgeCount(pendingHeadlessMembers)
        : undefined,
    badgeVariant: pendingHeadlessMembers > 0 ? "alert" : undefined,
  };
  const members: NavItem = {
    label: t("nav.members"),
    href: "/village/household",
    iconName: "users",
    badge: pendingMembers > 0 ? formatBadgeCount(pendingMembers) : undefined,
    badgeVariant: pendingMembers > 0 ? "alert" : undefined,
  };
  const collectors: NavItem = {
    label: t("nav.collectors"),
    href: "/village/collectors",
    iconName: "user-cog",
  };
  const funds: NavItem = {
    label: t("nav.funds"),
    href: "/village/funds",
    iconName: "wallet",
  };
  const receipts: NavItem = activeMembership
    ? {
        label: t("nav.receipts"),
        href: "/village/receipts",
        iconName: "receipt",
      }
    : {
        label: t("nav.receipts"),
        iconName: "receipt",
        disabled: true,
        badge: "Pending",
      };
  const cash: NavItem = isActiveCollector
    ? { label: t("nav.cash"), href: "/village/cash", iconName: "banknote" }
    : {
        label: t("nav.cash"),
        iconName: "banknote",
        disabled: true,
        badge: "Module 18",
      };
    const audit: NavItem = {
    label: t("nav.auditLog"),
    href: "/village/audit",
    iconName: "scroll-text",
  };

  if (user.role === UserRole.CHIEF) {
    sidebarItems.push(houses, collectors, funds, receipts, audit);
  }
  if (isHeadOfHouse) {
    sidebarItems.push(members);
  }
  if (user.role === UserRole.VILLAGER) {
    sidebarItems.push(receipts);
  }
  if (isActiveCollector) {
    sidebarItems.push(cash);
  }
  if (user.role === UserRole.CHIEF) {
    mobileItems.push(houses, funds, receipts);
    if (isHeadOfHouse) {
      mobileItems.push(members);
    } else {
      mobileItems.push(collectors);
    }
  } else if (user.role === UserRole.VILLAGER && activeMembership) {
    mobileItems.push(receipts);
  }
  return {
    sidebarItems,
    mobileItems: mobileItems.slice(0, 5),
  };
}