import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Mutation inventory for the Village Deactivation Workflow read-only rule.
 *
 * Every server action is either a village-scoped mutation that MUST call
 * guardVillageWrite inside its transaction (INVENTORY), or is deliberately
 * exempt with a reason (EXEMPT). A new server action fails this test until it
 * is classified on purpose, so a new write path cannot silently skip the
 * guard. This is a static scan: the behavior of the guard itself is covered by
 * village-deactivation-rules.test.ts, the action tests and the integration
 * tests.
 */
const INVENTORY = [
  // Payments
  "src/features/cash-payment/actions/record-cash-payment.action.ts",
  "src/features/cash-payment/actions/void-payment.action.ts",
  // Collectors
  "src/features/collector-assignment/actions/assign-collector.action.ts",
  "src/features/collector-assignment/actions/deactivate-collector-assignment.action.ts",
  // Funds
  "src/features/fund-management/actions/activate-fund.action.ts",
  "src/features/fund-management/actions/close-fund.action.ts",
  "src/features/fund-management/actions/create-fund.action.ts",
  "src/features/fund-management/actions/update-fund.action.ts",
  // Houses
  "src/features/house-management/actions/create-house.action.ts",
  "src/features/house-management/actions/deactivate-house.action.ts",
  "src/features/house-management/actions/reactivate-house.action.ts",
  "src/features/house-management/actions/update-house-number.action.ts",
  // Households and members
  "src/features/household-management/actions/approve-member.action.ts",
  "src/features/household-management/actions/change-head.action.ts",
  "src/features/household-management/actions/chief-approve-first-member.action.ts",
  "src/features/household-management/actions/chief-reject-pending-member.action.ts",
  "src/features/household-management/actions/reject-member.action.ts",
  "src/features/household-management/actions/remove-member.action.ts",
  // Joining a village
  "src/features/membership-rejoin/actions/submit-rejoin-request.action.ts",
  "src/features/villager-registration/actions/register-villager.action.ts",
  // Village-scoped profile edits (blocked while read-only)
  "src/features/user-settings/actions/update-profile.action.ts",
] as const;

const EXEMPT: Record<string, string> = {
  "src/features/auth/actions/login.action.ts":
    "Authentication must keep working; it writes no village records.",
  "src/features/auth/actions/logout.action.ts":
    "Sign-out must keep working.",
  "src/features/user-settings/actions/change-password.action.ts":
    "Password changes are a security operation the rules preserve.",
  "src/features/user-settings/actions/update-settings.action.ts":
    "Language preference only; preserved during read-only.",
  "src/features/villager-registration/actions/validate-village-code.action.ts":
    "Read-only lookup.",
  "src/features/fund-management/actions/search-payment-status.action.ts":
    "Read-only search.",
  "src/features/village-management/actions/create-village.action.ts":
    "Platform action that creates a new village; there is no village to guard yet.",
  "src/features/village-management/actions/suspend-village.action.ts":
    "System Admin lifecycle action; blocked during the countdown in Phase 4.",
  "src/features/village-management/actions/reactivate-village.action.ts":
    "System Admin lifecycle action.",
  "src/features/village-management/actions/deactivate-village.action.ts":
    "Direct deactivation is removed in Phase 3.",
};

const ROOT = path.resolve(__dirname, "../../..");

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    if (!/\.(ts|tsx)$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) {
      return [];
    }
    return [full];
  });
}

function relative(file: string): string {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

const files = listFiles(path.join(ROOT, "src")).map((file) => ({
  path: relative(file),
  text: readFileSync(file, "utf8"),
}));

const serverActions = files.filter((file) =>
  /^\s*["']use server["']/m.test(file.text),
);

describe("village mutation guard coverage", () => {
  it("has exactly 21 inventoried mutation entry points", () => {
    expect(new Set(INVENTORY).size).toBe(21);
  });

  it("classifies every server action as guarded or deliberately exempt", () => {
    const unclassified = serverActions
      .map((file) => file.path)
      .filter(
        (file) =>
          !(INVENTORY as readonly string[]).includes(file) && !(file in EXEMPT),
      );

    expect(unclassified).toEqual([]);
  });

  it("has no stale inventory or exemption entries", () => {
    const actionPaths = new Set(serverActions.map((file) => file.path));
    const stale = [...INVENTORY, ...Object.keys(EXEMPT)].filter(
      (file) => !actionPaths.has(file),
    );

    expect(stale).toEqual([]);
  });

  for (const file of INVENTORY) {
    it(`${file} calls guardVillageWrite inside a transaction`, () => {
      const text = files.find((candidate) => candidate.path === file)?.text;

      expect(text).toBeDefined();
      expect(text).toMatch(/import \{[^}]*\bguardVillageWrite\b[^}]*\} from/);

      const call = text!.indexOf("guardVillageWrite(tx,");
      const transaction = text!.indexOf("$transaction(");

      expect(call).toBeGreaterThan(-1);
      expect(transaction).toBeGreaterThan(-1);
      expect(call).toBeGreaterThan(transaction);
    });
  }

  it("keeps exactly one village guard: lockActiveVillage is gone", () => {
    const users = files
      .filter((file) => /\blockActiveVillage\b/.test(file.text))
      .map((file) => file.path);

    expect(users).toEqual([]);
  });

  it("never gates routes, layouts or pages (mutation-level enforcement only)", () => {
    const routeLevel = files
      .filter((file) => file.path.startsWith("src/app/"))
      .filter((file) => /\bguardVillageWrite\b/.test(file.text))
      .map((file) => file.path);

    expect(routeLevel).toEqual([]);
  });

  it("only the guard itself locks the village row FOR SHARE", () => {
    const lockers = files
      .filter((file) => /FROM "Village"[\s\S]{0,120}FOR SHARE/.test(file.text))
      .map((file) => file.path);

    expect(lockers).toEqual(["src/lib/authz/village.ts"]);
  });
});
