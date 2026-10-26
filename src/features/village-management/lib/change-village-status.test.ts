import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const tx = {
    village: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    user: {
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  };

  return {
    tx,
    transaction: vi.fn(async (fn: (client: typeof tx) => unknown) => fn(tx)),
    createAuditLog: vi.fn(async () => ({})),
  };
});

vi.mock("../../../lib/prisma", () => ({
  prisma: { $transaction: mocks.transaction },
}));

vi.mock("../../../lib/audit", () => ({
  AuditEntityType: { VILLAGE: "VILLAGE" },
  createAuditLog: mocks.createAuditLog,
}));

import { changeVillageStatus } from "./change-village-status";

const VILLAGE = {
  id: "v1",
  villageCode: "DEV101",
  name: "Test Village",
  status: "ACTIVE",
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.tx.village.findUnique.mockResolvedValue({ ...VILLAGE });
  mocks.tx.village.updateMany.mockResolvedValue({ count: 1 });
});

describe("changeVillageStatus", () => {
  it("returns not_found and writes nothing when the village is missing", async () => {
    mocks.tx.village.findUnique.mockResolvedValue(null);

    const outcome = await changeVillageStatus({
      villageId: "missing",
      action: "suspend",
      actorUserId: "admin",
      reason: null,
    });

    expect(outcome).toBe("not_found");
    expect(mocks.tx.village.updateMany).not.toHaveBeenCalled();
    expect(mocks.createAuditLog).not.toHaveBeenCalled();
  });

  it("returns not_allowed for a transition the table forbids", async () => {
    mocks.tx.village.findUnique.mockResolvedValue({
      ...VILLAGE,
      status: "DEACTIVATED",
    });

    const outcome = await changeVillageStatus({
      villageId: "v1",
      action: "reactivate",
      actorUserId: "admin",
      reason: null,
    });

    expect(outcome).toBe("not_allowed");
    expect(mocks.tx.village.updateMany).not.toHaveBeenCalled();
    expect(mocks.createAuditLog).not.toHaveBeenCalled();
  });

  it("updates only Village.status, conditioned on the status read, and audits it", async () => {
    const outcome = await changeVillageStatus({
      villageId: "v1",
      action: "deactivate",
      actorUserId: "admin",
      reason: "closed",
    });

    expect(outcome).toBe("ok");
    expect(mocks.tx.village.updateMany).toHaveBeenCalledWith({
      where: { id: "v1", status: "ACTIVE" },
      data: { status: "DEACTIVATED" },
    });
    expect(mocks.createAuditLog).toHaveBeenCalledTimes(1);

    const [, input] = mocks.createAuditLog.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
    ];
    expect(input).toMatchObject({
      actionType: "STATUS_CHANGE",
      entityType: "VILLAGE",
      entityId: "v1",
      villageId: "v1",
      actorUserId: "admin",
      metadata: {
        villageCode: "DEV101",
        name: "Test Village",
        previousStatus: "ACTIVE",
        newStatus: "DEACTIVATED",
        reason: "closed",
      },
    });
  });

  it("does not cascade: users are never touched", async () => {
    await changeVillageStatus({
      villageId: "v1",
      action: "deactivate",
      actorUserId: "admin",
      reason: null,
    });

    expect(mocks.tx.user.update).not.toHaveBeenCalled();
    expect(mocks.tx.user.updateMany).not.toHaveBeenCalled();
    expect(mocks.tx.village.update).not.toHaveBeenCalled();
  });

  it("omits reason from the audit metadata when none is given", async () => {
    await changeVillageStatus({
      villageId: "v1",
      action: "suspend",
      actorUserId: "admin",
      reason: null,
    });

    const [, input] = mocks.createAuditLog.mock.calls[0] as unknown as [
      unknown,
      { metadata: Record<string, unknown> },
    ];
    expect(input.metadata).not.toHaveProperty("reason");
  });

  it("returns not_allowed and writes no audit when the conditional update matches no row", async () => {
    mocks.tx.village.updateMany.mockResolvedValue({ count: 0 });

    const outcome = await changeVillageStatus({
      villageId: "v1",
      action: "suspend",
      actorUserId: "admin",
      reason: null,
    });

    expect(outcome).toBe("not_allowed");
    expect(mocks.createAuditLog).not.toHaveBeenCalled();
  });
});
