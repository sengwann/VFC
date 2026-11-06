# Agent Instructions for VFC

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Keywords: **MUST / MUST NOT** = mandatory. **Should** = recommendation. Source code and `prisma/schema.prisma` are the source of truth; if this file disagrees with them, trust the code and fix this file. Also read `CLAUDE.md` (mentoring workflow) and `README.md` (setup, env vars).

## 1. Project Overview

VFC is a village fund collection and administration app: a single Next.js 16 (App Router) + React 19 + TypeScript 5 application backed by PostgreSQL through Prisma 7 (`@prisma/adapter-pg`). Auth is a custom JWT cookie (`jose`) with `bcryptjs` password hashes. Styling is Tailwind CSS 4, tests are Vitest 5, package manager is npm. UI strings exist in English and Burmese (`src/lib/i18n/en.ts`, `my.ts`).

Roles: `SYSTEM_ADMIN` (no village), `CHIEF`, `VILLAGER`. There is also a standalone Node worker (`scripts/deactivation-worker.ts`) for the village deactivation workflow.

## 2. Architecture

- `src/app/` — routes only. Route groups: `(auth)` public auth pages, `(platform)` System Admin, `(village)` village users, `(protected)` signed-in pages, plus `change-password`, `dashboard`, `forbidden`. `change-password` MUST stay outside the guarded groups (documented in `auth.constants.ts`).
- `src/features/<feature>/` — feature code, typically `actions/` (server actions), `components/`, `lib/` (rules, validators, queries, services). Add new behavior to the matching feature folder.
- `src/lib/auth/` — session (`session.ts`), guards (`guards.ts`), password hashing/rules, login throttling, identifier normalization, client IP.
- `src/lib/authz/` — role and village access checks (`roles.ts`, `context.ts`, `village.ts`, `house.ts`, `collector.ts`, `tenant.ts`).
- `src/lib/audit/` — append-only audit log service.
- `src/lib/db/` — `withSerializableRetry` and unique-violation helpers. `src/lib/prisma.ts` — the shared Prisma client.
- `prisma/` — schema, migrations, `seed.ts`. `scripts/` — deactivation worker, test-db prepare, admin password reset, run via `tsx`. `prisma/seed.ts` and `reset-admin-password.ts` build their own Prisma client and import nothing from `src/`; the worker imports shared code from `src/` (hence `--conditions=react-server`).

Pure business rules live in `lib/` files with no I/O (for example `village-deactivation-rules.ts`, `deactivation-config.ts`, `recovery-code.ts`) and are unit tested directly. Keep new rules pure where practical.

## 3. Development Workflow

```bash
npm install                 # runs prisma generate
npm run dev                 # 0.0.0.0:5000
npm run lint
npm run typecheck
npm test                    # vitest run; *.integration.test.ts skipped without TEST_DATABASE_URL
npm run build
npm run db:migrate | db:deploy | db:generate | db:studio
npm run test:integration    # needs TEST_DATABASE_URL (after npm run db:test:prepare)
npm run worker:deactivation[:once]
```

Do not run `npm install`/upgrade/remove packages unless the task requires it. Env var names are listed in `README.md`; never print, commit or overwrite `.env*`.

**Typecheck:** it previously failed (29 errors: missing `TranslationKey` export, and `create-fund.action.ts` narrowing). Both were fixed, but a full `npm run typecheck` has not been re-run since; confirm locally. Report any failure you did not cause rather than hiding it.

## 4. Coding Conventions (observed)

- TypeScript strict mode; path alias `@/*` → `src/*` (relative imports are also used; follow the neighboring file). Avoid `any`.
- Server-only modules start with `import "server-only";`. Vitest aliases it to `test/stubs/server-only.ts`.
- Server actions return result objects (`{ success: true, ... }` / `{ success: false, formError | error | fieldErrors, code? }`) rather than throwing to the UI; follow the nearest existing action.
- Validation lives in `lib/*-validators.ts` / `*-input.ts` files next to the feature; form values are read with the existing FormData helpers.
- User-facing text goes through the i18n dictionaries, not hard-coded, where the surrounding code already does so. New keys MUST be added to both `en.ts` and `my.ts`.
- Tests are co-located (`*.test.ts`); integration tests use `describe.skipIf(!process.env.TEST_DATABASE_URL)`.
- Should: follow existing comment style — comments explain *why*, especially for security and concurrency.

## 5. Architecture Rules (MUST preserve)

1. **One village write guard.** Every village-scoped mutation calls `guardVillageWrite(tx, villageId)` (`src/lib/authz/village.ts`) inside its transaction before touching village data, and answers `VILLAGE_INACTIVE` / `VILLAGE_READ_ONLY` on `{ ok: false }`. `village-write-guard-coverage.test.ts` enforces an inventory; a new village-scoped writer must be added there deliberately. Do not create a second guard.
2. **Serializable + retry** for lifecycle/deactivation transitions: use `withSerializableRetry` (`src/lib/db/transaction.ts`) as existing transitions do.
3. **Password gate.** Protected pages and actions MUST use `requireAuthenticatedUser()` (or the role helpers built on it). `requireSessionUser` / `getCurrentUser` are allowed only in files listed in `password-gate-coverage.test.ts`.
4. **Village lifecycle** (`ACTIVE`/`SUSPENDED`/`DEACTIVATED`) and deactivation request status are separate states. "Read-only" means an `APPROVED` deactivation request exists; it is not a village status. The 24-hour countdown is fixed in code (`DEACTIVATION_COUNTDOWN_HOURS`), not configurable.
5. The deactivation worker is a plain Node process independent of the web host; keep it host-independent and idempotent (requests are claimed with `FOR UPDATE SKIP LOCKED`).

## 6. Database Rules

- Models: `Village`, `User`, `House`, `CollectorAssignment`, `Fund`, `Payment`, `Receipt`, `AuditLog`, `UserSettings`, `LoginThrottleState`, `VillageDeactivationRequest`, `Notification`, `PasswordRecoveryRequest`. Money is `Int`.
- MUST use Prisma migrations for schema changes; MUST NOT edit, delete or reorder existing migrations (`prisma/migrations/`, last inspected: `20261104090100_password_recovery`).
- MUST NOT run `migrate reset`, `db push`, `DROP`/`TRUNCATE`, or delete/reset the development database, or discard dev data, without explicit approval.
- Integration tests MUST use a separate disposable `TEST_DATABASE_URL` (name contains `test`, local host, not equal to `DATABASE_URL`); never point them at the dev database. `db:test:prepare` uses `migrate deploy` only.
- PostgreSQL cannot use a new enum value in the transaction that adds it: add enum values in their own migration (as `20261028233000_add_audit_cancel_complete` did).
- Many invariants are enforced by CHECK constraints and partial unique indexes that Prisma cannot model; read the migration SQL before changing related fields. Raw SQL comparing timestamp columns must use `now() AT TIME ZONE 'UTC'`.
- Foreign keys on deactivation requests, notifications and recovery requests are `RESTRICT`; do not change them to cascade.
- Regenerate Prisma Client (`npm run db:generate`) after schema changes. Schema changes need an explanation of data impact and approval first.

## 7. Authentication and Security Rules (MUST)

- Session: JWT (HS256) in the `vfcs_session` httpOnly, `sameSite=lax` cookie (secure in production), 7-day lifetime, carrying `sessionVersion`. A session is valid only if the user's current `sessionVersion` matches; non-admin users whose village is not `ACTIVE` are treated as signed out. To sign users out, call `revokeUserSessions` (increments `sessionVersion`).
- `AUTH_SECRET` MUST be ≥ 32 characters; code throws otherwise. Do not weaken or silently catch this.
- Never trust role, user id, or village id from the browser; take them from the session user. Enforce village isolation on every read and write.
- Sign-in identifiers (email/phone) MUST go through `src/lib/auth/identifiers.ts` normalization everywhere they are stored or looked up. Login and signup are throttled (`login-throttle.ts`); keep the generic invalid-credentials message (no account enumeration).
- Password recovery: a Chief-issued, one-time code; only an HMAC of the code is stored (never the code). Do not log or persist codes, passwords or hashes. `scripts/reset-admin-password.ts` is the last-resort System Admin path.
- Never expose `passwordHash`, `AUTH_SECRET`, tokens or recovery codes in responses, logs or tests.
- Audit: existing sensitive operations pass the transaction client to `createAuditLog` (should: do the same for new ones). `AuditLog` is append-only: never `update`/`delete` it. `tryCreateAuditLog` only for LOGIN/LOGOUT/LOGIN_THROTTLED.
- Payments are voided (status + audit), not deleted; do not silently modify or delete financial history.
- Unverified / needs owner confirmation: the seed creates a System Admin with a fixed password `00000000` and no forced change. Do not copy this pattern; do not use the seed against production.

## 8. Testing Requirements

Run, as relevant to what you changed, and report honestly what ran:

| Change area | Run |
| --- | --- |
| Any TypeScript change | `npm run typecheck` , `npm run lint` |
| Pure rules, validators, actions | `npm test` (or a single file via `npx vitest run <path>`) |
| Schema/migrations, guard, transitions, worker, throttle | `npm test` and `npm run test:integration` against a disposable `TEST_DATABASE_URL` |
| Routes, layouts, build config | `npm run build` |
| New protected page/action or village writer | check `password-gate-coverage` and `village-write-guard-coverage` tests |

Add or update tests for changed behavior (permissions, village isolation, amounts, duplicates, invalid input). Never claim a check passed unless you ran it; if dependencies or a database are unavailable, say so.

## 9. Git and Change Management

- Check `git status` first; do not discard or overwrite uncommitted work. Avoid destructive git commands.
- Do not commit or push unless asked. Keep diffs small; review `git diff` before finishing; do not touch unrelated files (including generated `tsconfig.tsbuildinfo` and `next-env.d.ts`).
- The `next dev` block at the top of this file is machine-managed; leave it as is.
- Ask before changes affecting security, money, user data, schema, or architecture.
- Teaching mode (from `CLAUDE.md`): the owner is learning; for non-trivial work explain the problem, plan, files, and how to test, in simple language.

## 10. Documentation Maintenance

- Update only documentation relevant to the changed functionality.
- Update `README.md` when setup, installation, environment variables, or major usage changes.
- Update `AGENTS.md` when project-wide development instructions or conventions change.
- Update feature documentation (`docs/`) when feature behavior, architecture, or API contracts change.
- Keep all documentation consistent with the actual implementation.
- Do not create unnecessary documentation.

## 11. Completion Checklist

- Requested behavior implemented; server-side auth and village isolation intact.
- Financial and database integrity preserved; migrations untouched unless approved.
- Relevant checks run and reported (including pre-existing failures); no secrets or unrelated changes.
