import { beforeEach, describe, expect, it, vi } from "vitest";
import { FundStatus } from "@prisma/client";

const mocks = vi.hoisted(() => {
  const tx = {
    fund: { findUnique: vi.fn() },
    house: { findUnique: vi.fn() },
    user: { findFirst: vi.fn() },
    payment: { findFirst: vi.fn(), create: vi.fn() },
    receipt: { create: vi.fn(), count: vi.fn() },
    $queryRaw: vi.fn(),
  };
  return {
    tx,
    prismaHouse: { findUnique: vi.fn() },
    prismaUser: { findFirst: vi.fn() },
    transaction: vi.fn(async (fn: (client: typeof tx) => Promise<unknown>) =>
      fn(tx),
    ),
    requireCashPaymentAccess: vi.fn(),
    validateCashPaymentInput: vi.fn(),
    generateReceiptNumber: vi.fn(),
    createAuditLog: vi.fn(),
    isFundOpenForPayment: vi.fn(() => true),
    getFundAmountPerHouse: vi.fn(),
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    house: { findUnique: mocks.prismaHouse.findUnique },
    user: { findFirst: mocks.prismaUser.findFirst },
    $transaction: mocks.transaction,
  },
}));
vi.mock("@/lib/db/transaction", () => ({
  withSerializableRetry: (operation: () => Promise<unknown>) => operation(),
}));
vi.mock("../lib/cash-payment-access", () => ({
  requireCashPaymentAccess: mocks.requireCashPaymentAccess,
}));
vi.mock("../lib/cash-payment-validators", () => ({
  validateCashPaymentInput: mocks.validateCashPaymentInput,
}));
vi.mock("@/lib/audit", () => ({
  createAuditLog: mocks.createAuditLog,
  AuditEntityType: { PAYMENT: "PAYMENT" },
}));
vi.mock("../../fund-management/lib/fund-lifecycle", () => ({
  isFundOpenForPayment: mocks.isFundOpenForPayment,
}));
vi.mock("../../fund-management/lib/fund-target", () => ({
  getFundAmountPerHouse: mocks.getFundAmountPerHouse,
}));

import { recordCashPaymentAction } from "./record-cash-payment.action";

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const values: Record<string, string> = {
    houseId: "h1",
    payerUserId: "p1",
    amount: "1000",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireCashPaymentAccess.mockResolvedValue({
    collector: {
      user: {
        id: "collector-u1",
        name: "C",
        role: "COLLECTOR",
        villageId: "v1",
        houseId: null,
      },
      villageId: "v1",
      assignment: { id: "assign1" },
    },
    villageId: "v1",
    fund: { id: "fund1", name: "Fund 1", targetAmount: 1000 },
  });
  mocks.getFundAmountPerHouse.mockResolvedValue({
    ok: true,
    amountPerHouse: 1000,
    numberOfHouse: 1,
  });
  mocks.validateCashPaymentInput.mockReturnValue({
    ok: true,
    data: { houseId: "h1", payerUserId: "p1", amount: 1000 },
  });
  mocks.prismaHouse.findUnique.mockResolvedValue({
    id: "h1",
    villageId: "v1",
    isActive: true,
  });
  mocks.prismaUser.findFirst.mockResolvedValue({ id: "p1" });

  mocks.tx.fund.findUnique.mockResolvedValue({
    id: "fund1",
    status: FundStatus.ACTIVE,
    targetAmount: 1000,
    startDate: new Date(),
    endDate: new Date(),
  });
  mocks.tx.house.findUnique.mockResolvedValue({
    id: "h1",
    villageId: "v1",
    isActive: true,
  });
  mocks.tx.user.findFirst.mockResolvedValue({ id: "p1" });
  mocks.isFundOpenForPayment.mockReturnValue(true);
  mocks.generateReceiptNumber.mockResolvedValue("VFC-20260101-0001");
});

describe("recordCashPaymentAction", () => {
  it("rejects cash payment when an existing KPAY payment with PENDING status exists for the same house and fund", async () => {
    mocks.tx.payment.findFirst.mockResolvedValue({
      id: "existing-kpay-payment-id",
    });

    const result = await recordCashPaymentAction(form());

    expect(result).toEqual({
      success: false,
      formError:
        "A valid or pending payment already exists for this fund and house.",
    });

    expect(mocks.tx.payment.create).not.toHaveBeenCalled();
    expect(mocks.tx.receipt.create).not.toHaveBeenCalled();
    expect(mocks.createAuditLog).not.toHaveBeenCalled();
  });
});
