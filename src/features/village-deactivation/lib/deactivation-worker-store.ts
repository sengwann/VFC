import type { Prisma } from "@prisma/client";

import type { WorkerStore } from "./deactivation-worker";

/*
 * The worker's database access (raw SQL because it needs FOR UPDATE SKIP LOCKED
 * and the database clock). Timestamps are TIMESTAMP(3) in UTC, so "now" is
 * clock_timestamp() converted to UTC, the same source readDatabaseNow uses.
 *
 * Nothing here touches Village or changes request status; completion happens
 * only through completeDeactivationRequest.
 */

type Client = Prisma.TransactionClient;

const NOW_UTC = `(clock_timestamp() AT TIME ZONE 'UTC')`;

export function createPrismaWorkerStore(client: Client): WorkerStore {
  return {
    async readNow() {
      const rows = await client.$queryRawUnsafe<{ now: Date }[]>(
        `SELECT ${NOW_UTC} AS now`,
      );
      return rows[0].now;
    },

    async claimDueRequests(limit, leaseSeconds) {
      const rows = await client.$queryRawUnsafe<{ id: string }[]>(
        `UPDATE "VillageDeactivationRequest" AS r
            SET "processingAttempts" = r."processingAttempts" + 1,
                "lastProcessingAt" = ${NOW_UTC},
                "updatedAt" = ${NOW_UTC}
          WHERE r.id IN (
            SELECT id FROM "VillageDeactivationRequest"
             WHERE status = 'APPROVED'
               AND "scheduledDeactivationAt" <= ${NOW_UTC}
               AND ("lastProcessingAt" IS NULL
                    OR "lastProcessingAt" < ${NOW_UTC} - make_interval(secs => $2))
             ORDER BY "scheduledDeactivationAt", id
             LIMIT $1
             FOR UPDATE SKIP LOCKED
          )
          RETURNING r.id`,
        limit,
        leaseSeconds,
      );
      return rows.map((row) => row.id);
    },

    async recordFailure(requestId, message, options) {
      await client.$executeRawUnsafe(
        `UPDATE "VillageDeactivationRequest"
            SET "lastProcessingError" = $2,
                "lastProcessingAt" = CASE WHEN $3 THEN NULL ELSE "lastProcessingAt" END,
                "updatedAt" = ${NOW_UTC}
          WHERE id = $1 AND status = 'APPROVED'`,
        requestId,
        message,
        options.retryNow,
      );
    },

    async listReconcileRequestIds(limit, windowSeconds) {
      const rows = await client.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM "VillageDeactivationRequest"
          WHERE status IN ('PENDING', 'APPROVED')
             OR "updatedAt" > ${NOW_UTC} - make_interval(secs => $2)
          ORDER BY "updatedAt" DESC, id
          LIMIT $1`,
        limit,
        windowSeconds,
      );
      return rows.map((row) => row.id);
    },
  };
}
