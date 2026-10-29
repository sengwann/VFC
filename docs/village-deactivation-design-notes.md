# Village Deactivation Workflow: design notes (Phase 1)

Status: Phase 1 only (schema, migrations, pure rules, input, config, test setup).
Nothing is wired into the UI or any server action yet.

## State model

- `Village.status` (ACTIVE / SUSPENDED / DEACTIVATED) is the lifecycle state.
- `VillageDeactivationRequest.status` (PENDING / APPROVED / REJECTED / CANCELLED / COMPLETED) is the workflow state.
- Read-only means "this village has an APPROVED request". It is not a lifecycle status.
- Transitions live in `src/features/village-deactivation/lib/village-deactivation-rules.ts`.
- The countdown is fixed: `scheduledDeactivationAt = approvedAt + 24h`, written once and enforced by a CHECK constraint.
- The deadline is one instant. Cancel needs `now < deadline`; completion needs `now >= deadline`. Exactly one is possible at any moment, and the CHECK constraints use the same boundary.

## What the database enforces (migration `20261028233100_village_deactivation`)

- One PENDING or APPROVED request per village (partial unique index).
- Per-status field shape (CHECK): required fields are asserted `IS NOT NULL`, because a CHECK passes on NULL.
- Non-blank reasons, `processingAttempts >= 0`, cooldown not before rejection.
- RESTRICT foreign keys: requests and notifications are never deleted with their village or users.
- Notification `dedupeKey` is unique, so delivery is idempotent.
- Timestamps are `TIMESTAMP(3)` in UTC. Raw SQL must use `now() AT TIME ZONE 'UTC'`, not bare `now()`, when compared with these columns.

`CANCEL` and `COMPLETE` are added to `AuditActionType` in their own migration (`20261028233000_add_audit_cancel_complete`), because PostgreSQL cannot use a new enum value in the transaction that adds it.

## Mutation guard design (Phase 2, validated on PostgreSQL 16)

The guard must be two statements inside the mutation's transaction:

1. `SELECT status FROM "Village" WHERE id = $1 FOR SHARE` (existing `lockActiveVillage` pattern),
2. a separate `EXISTS` on an APPROVED request for that village.

A one-statement guard, or a lock-only approval, let a transaction with a stale snapshot commit after read-only began. Approve, cancel and complete therefore start with `UPDATE "Village" SET "updatedAt" = now()` (takes the row lock and bumps the row version), run as Serializable through the existing `withSerializableRetry`. A mutation that started before approval then fails with 40001 and retries into the guard. Lock order stays village, then house.

## Phase 2: the guard and the mutation inventory

`guardVillageWrite(tx, villageId)` in `src/lib/authz/village.ts` replaces `lockActiveVillage` (removed; there is exactly one guard). It returns `{ ok: true }` or `{ ok: false, reason }` where reason is `VILLAGE_INACTIVE` (existing behavior) or `VILLAGE_READ_ONLY`. The decision itself is the pure `evaluateVillageWrite` in `village-deactivation-rules.ts`.

How blocked writes answer (machine-readable, reads untouched):

- Actions that return a result object return `{ success: false, code: "VILLAGE_READ_ONLY", ... }` plus an English fallback message.
- Actions that redirect go back to the same page with `?error=VILLAGE_READ_ONLY`.
- Nothing is gated at route, layout or page level; a test fails if `guardVillageWrite` appears under `src/app`.

The 21 guarded entry points: record cash payment, void payment, assign collector, deactivate collector assignment, activate / close / create / update fund, create / deactivate / reactivate / rename house, approve member, reject member, change head, chief approve first member, chief reject pending member, remove member, submit rejoin request, register villager, update profile.

Decisions applied: Q1 (profile edits blocked while read-only; password, language and sign-out stay allowed) and Q3 (fund create, update and close run in one transaction with the guard and the audit entry).

Behavior changes to know about:

- Before Phase 2, assign/deactivate collector, record/void payment, activate/close/create/update fund, remove member and rejoin did not check the village row at all (the session check made it unreachable in practice). They now also refuse an inactive village inside the transaction.
- Profile edits only block on read-only; an inactive village keeps today's behavior there.
- Registration and rejoin now take the village row lock before the house lock, the same order as every other flow.
- `src/lib/authz/village.ts` imports the pure rules file from the feature folder (no cycle: the rules file has no imports).

Exempt server actions (listed with reasons in `village-write-guard-coverage.test.ts`): login, logout, change password, language settings, village-code lookup, payment-status search, create village, and the three System Admin lifecycle actions (suspend is blocked during the countdown in Phase 4; direct deactivation is removed in Phase 3).

## Q5: suspension during the countdown (decided)

Conflict: a SUSPENDED village blocks Chief access, so suspending during an APPROVED request would leave the Chief unable to cancel before the deadline. Rules 6.6 and 8.5 keep suspension and cancellation separate.

Decision: suspension is blocked while the village has an APPROVED request. Chief cancellation therefore always stays possible, and the rules about suspension are not otherwise changed.

Implementation (Phase 4, not done yet): in `changeVillageStatus`, after the village-row UPDATE, refuse `suspend` with a new outcome (for example `BLOCKED_BY_DEACTIVATION`) when an APPROVED request exists. `reactivate` is unaffected. Approval already requires an ACTIVE village, so an approved request can never sit on a suspended village. Completion still accepts a SUSPENDED village defensively. The guard check runs under the same Serializable transaction and village-row lock as approval, so approve and suspend cannot both commit.

## Worker (Phase 7)

`scripts/deactivation-worker.ts`, loop mode plus `--once`, `FOR UPDATE SKIP LOCKED`, no HTTP cron route, host independent. `server-only` throws under plain Node/tsx, so the worker must import only modules that do not import it, or run with the `react-server` condition.

## Configuration (all optional; a bad value throws)

| Variable | Default | Range |
| --- | --- | --- |
| `DEACTIVATION_REJECTION_COOLDOWN_HOURS` | 24 | > 0 and <= 720 |
| `DEACTIVATION_REMINDER_HOURS` | `12,1` | each > 0 and < 24 |
| `DEACTIVATION_WORKER_INTERVAL_SECONDS` | 60 | 5 to 3600 |
| `DEACTIVATION_WORKER_BATCH_SIZE` | 25 | 1 to 200 |

## Integration tests

Needs a separate PostgreSQL database whose name has a "test" word (for example `vfc_test`).

```
# example: local Docker
docker run -d --name vfc-pg-test -e POSTGRES_PASSWORD=postgres -p 5433:5432 postgres:16

export TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vfc_test
npm run db:test:prepare      # creates the database if missing, runs prisma migrate deploy
npm run test:integration
```

The helper refuses to run when `TEST_DATABASE_URL` is unset, is the same database as `DATABASE_URL`, has no "test" word in the name, is on a non-local host (unless `TEST_DATABASE_ALLOW_REMOTE=1`), or when `NODE_ENV=production`. It never truncates or resets. Tests use unique ids and delete only their own rows. Without `TEST_DATABASE_URL` the integration tests are skipped, so `npm test` still works.

## Known side effects of Phase 1

- The audit filter dropdown lists enum values from Prisma, so `CANCEL` and `COMPLETE` appear there as raw names until Phase 8 adds labels (same as the existing `LOGIN_THROTTLED`).
- The `DEACTIVATION_REQUEST` audit entity type and its metadata type are deferred to Phase 4. Adding the entity now would also add an unlabeled entry to the entity filter.
