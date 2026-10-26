import { describe, expect, it } from "vitest";

import { isSerializationConflict } from "./retry";

describe("isSerializationConflict", () => {
  it("detects Prisma 6 P2034", () => {
    expect(isSerializationConflict({ code: "P2034" })).toBe(true);
  });

  it("detects Prisma 7 adapter-pg DriverAdapterError", () => {
    expect(
      isSerializationConflict({
        name: "DriverAdapterError",
        cause: { kind: "TransactionWriteConflict" },
      }),
    ).toBe(true);
  });

  it("detects raw-SQL P2010 with driverAdapterError meta", () => {
    expect(
      isSerializationConflict({
        code: "P2010",
        meta: {
          driverAdapterError: { cause: { kind: "TransactionWriteConflict" } },
        },
      }),
    ).toBe(true);
  });

  it("does not retry unique-constraint violations", () => {
    expect(isSerializationConflict({ code: "P2002" })).toBe(false);
  });

  it("does not retry generic errors or non-objects", () => {
    expect(isSerializationConflict(new Error("boom"))).toBe(false);
    expect(isSerializationConflict(null)).toBe(false);
    expect(isSerializationConflict("P2034")).toBe(false);
  });
});
