import { describe, expect, it } from "vitest";

import {
  LIFECYCLE_TARGET_STATUS,
  canTransition,
  type VillageLifecycleAction,
  type VillageLifecycleStatus,
} from "./village-lifecycle-rules";

const STATUSES: VillageLifecycleStatus[] = [
  "ACTIVE",
  "SUSPENDED",
  "DEACTIVATED",
];

const EXPECTED: Record<VillageLifecycleAction, VillageLifecycleStatus[]> = {
  suspend: ["ACTIVE"],
  reactivate: ["SUSPENDED"],
  deactivate: ["ACTIVE", "SUSPENDED"],
};

describe("canTransition", () => {
  for (const action of Object.keys(EXPECTED) as VillageLifecycleAction[]) {
    for (const status of STATUSES) {
      const allowed = EXPECTED[action].includes(status);

      it(`${action} from ${status} is ${allowed ? "allowed" : "blocked"}`, () => {
        expect(canTransition(action, status)).toBe(allowed);
      });
    }
  }

  it("never allows any action from DEACTIVATED (final)", () => {
    for (const action of Object.keys(EXPECTED) as VillageLifecycleAction[]) {
      expect(canTransition(action, "DEACTIVATED")).toBe(false);
    }
  });
});

describe("LIFECYCLE_TARGET_STATUS", () => {
  it("maps each action to its target status", () => {
    expect(LIFECYCLE_TARGET_STATUS).toEqual({
      suspend: "SUSPENDED",
      reactivate: "ACTIVE",
      deactivate: "DEACTIVATED",
    });
  });
});
