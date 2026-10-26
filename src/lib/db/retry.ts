type PrismaErrorShape = {
  code?: string;
  name?: string;
  cause?: { kind?: string };
  meta?: { driverAdapterError?: { cause?: { kind?: string } } };
};

/**
 * True when the error is a serializable write conflict that is safe to retry.
 *
 * Prisma 6 → P2034.
 * Prisma 7 + @prisma/adapter-pg at COMMIT → DriverAdapterError with
 *   cause.kind = "TransactionWriteConflict" (no code).
 * Raw SQL → P2010 with meta.driverAdapterError.
 */
export function isSerializationConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const e = error as PrismaErrorShape;

  if (e.code === "P2034") {
    return true;
  }

  if (e.meta?.driverAdapterError?.cause?.kind === "TransactionWriteConflict") {
    return true;
  }

  if (
    e.name === "DriverAdapterError" &&
    e.cause?.kind === "TransactionWriteConflict"
  ) {
    return true;
  }

  return false;
}
