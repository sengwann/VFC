# VFC

VFC ("Village Fund Collection System") is a full-stack web application for village administration and fund collection. Chiefs manage a village's houses, members, funds and cash payments; a System Admin manages villages across the platform.

> **Status:** the project is in development and is not described as production-ready. This README reflects the repository as inspected; where something could not be verified it is marked **(unverified)**.

## Main Features

All of the following exist in the code (routes under `src/app`, logic under `src/features`):

- **Authentication** — email/phone sign-in, JWT session cookie, forced password change for new accounts, login throttling, village sign-up/registration.
- **Roles** — `SYSTEM_ADMIN`, `CHIEF`, `VILLAGER`, with village-level data isolation.
- **Platform administration (System Admin)** — village list/create/detail, village lifecycle (`ACTIVE`, `SUSPENDED`, `DEACTIVATED`), platform audit log, deactivation-request review, password-recovery overview.
- **Village management (Chief)** — houses, households and members (approve/reject/remove, change head of house), membership rejoin requests.
- **Funds** — create, edit, activate and close funds.
- **Cash payments and receipts** — record and void cash payments, view receipts.
- **Collector assignments** — assign and deactivate collectors.
- **Analytics and audit** — dashboards and a village audit log.
- **Village deactivation workflow** — request, approve/reject, 24-hour read-only countdown, cancel, automatic completion by a background worker, notifications.
- **Password recovery** — a member requests recovery; a Chief issues a one-time reset code; the member redeems it at `/reset-password`. A last-resort CLI exists for System Admins.
- **User settings and i18n** — profile and password settings; English (`en`) and Burmese (`my`) UI strings.

## Technology Stack

Verified from `package.json`:

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`, `pg`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Auth | `jose` (JWT, HS256), `bcryptjs` |
| Charts | `recharts` |
| Tests | Vitest 5 |
| Lint | ESLint 9 with `eslint-config-next` |
| Package manager | npm (`package-lock.json`) |

The Node.js version is **not pinned** in the repository (no `engines`, `.nvmrc`). Use a Node.js version supported by Next.js 16 and Prisma 7 (unverified which exact version the project targets).

## Project Structure

```
prisma/              schema.prisma, migrations/, seed.ts
scripts/             deactivation-worker.ts, db-test-prepare.ts, reset-admin-password.ts
docs/                village-deactivation design notes and final report
test/stubs/          server-only stub used by Vitest
src/app/             App Router. Route groups: (auth), (platform), (protected), (village)
                     plus change-password, dashboard, forbidden
src/components/ui/   shared UI components
src/features/        one folder per feature (actions/, components/, lib/)
src/lib/             auth/, authz/, audit/, db/, i18n/, receipts/, theme/, prisma.ts, env.ts, period.ts
src/test-support/    helpers for the disposable integration-test database
```

Feature folders: `analytics`, `audit`, `auth`, `cash-payment`, `collector-assignment`, `fund-management`, `house-management`, `household-management`, `membership-rejoin`, `notifications`, `password-recovery`, `receipt-viewing`, `shell`, `user-settings`, `village-deactivation`, `village-management`, `villager-registration`.

`remove_kpay.py` in the repository root is a one-off helper script and is not part of the application (its purpose was not investigated beyond its header).

## Prerequisites

- Node.js and npm
- A PostgreSQL database for development (and, optionally, a second disposable one for integration tests)

## Installation

```bash
git clone https://github.com/sengwann/VFC.git
cd VFC
npm install        # also runs `prisma generate` (postinstall)
```

## Environment Variables

There is no `.env.example` in the repository (`.env*` files are git-ignored). Create `.env` in the project root. Names below were found in the source; never commit values.

| Variable | Required | Used for |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection (app, Prisma CLI, seed, scripts) |
| `AUTH_SECRET` | Yes | Signs session JWTs and derives recovery/throttle keys. **At least 32 characters**, otherwise the app throws |
| `AUTH_TRUSTED_PROXY_HOPS` | No (default 1) | Number of trusted proxies when determining client IP |
| `NEXT_PUBLIC_APP_NAME` | No | Display name (falls back to "Village Fund Collection System") |
| `SEED_ADMIN_EMAIL` | No | Seed System Admin email (default `admin@example.com`) |
| `SEED_ALLOW_PRODUCTION` | No | Must be `1` to seed when `NODE_ENV=production` |
| `DEACTIVATION_REJECTION_COOLDOWN_HOURS` | No (24) | Cooldown after a rejected deactivation request |
| `DEACTIVATION_REMINDER_HOURS` | No (`12,1`) | Reminder offsets before the deadline |
| `DEACTIVATION_WORKER_INTERVAL_SECONDS` | No (60) | Worker loop interval |
| `DEACTIVATION_WORKER_BATCH_SIZE` | No (25) | Requests handled per worker pass |
| `TEST_DATABASE_URL` | Tests only | Disposable database for integration tests |
| `TEST_DATABASE_ALLOW_REMOTE` | Tests only | Set to `1` to allow a non-local test database host |
| `THROTTLE_TEST_DATABASE_URL` | Tests only | Referenced by the login-throttle integration test |
| `REPLIT_DEV_DOMAIN` | No | Added to Next.js `allowedDevOrigins` when set |

Deactivation settings are validated strictly: an invalid value throws instead of falling back.

## Database Setup

1. Set `DATABASE_URL` to an empty development database.
2. Apply migrations: `npm run db:migrate` (development, `prisma migrate dev`).
3. Optionally seed a System Admin: `npx prisma db seed` (configured in `prisma.config.ts`; runs `prisma/seed.ts`).

**Seed warning:** the seed creates/updates a System Admin with the fixed password `00000000` and does not set `mustChangePassword`. Use it on development databases only and change the password immediately.

Other commands: `npm run db:generate`, `npm run db:deploy` (apply committed migrations), `npm run db:studio`.

The schema models: `Village`, `User`, `House`, `CollectorAssignment`, `Fund`, `Payment`, `Receipt`, `AuditLog`, `UserSettings`, `LoginThrottleState`, `VillageDeactivationRequest`, `Notification`, `PasswordRecoveryRequest`. Money amounts are `Int` fields (`Fund.targetAmount`, `Payment.amount`).

## Development Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0:5000` |
| `npm run build` / `npm run start` | Production build / server on port 5000 |
| `npm run lint` | `eslint .` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | `vitest run` |
| `npm run test:watch` | Vitest watch mode |
| `npm run worker:deactivation` | Deactivation worker loop |
| `npm run worker:deactivation:once` | One worker pass (exit 0 = clean, 1 = failure/blocked) |
| `npm run admin:reset-password` | CLI last-resort System Admin password reset (see header of `scripts/reset-admin-password.ts`; needs `--email` and `--yes`) |

The deactivation worker is a separate Node process; automatic village deactivation and reminders only happen while it runs.

## Testing

- `npm test` runs every `src/**/*.test.ts` file. Integration tests (`*.integration.test.ts`) are **skipped unless `TEST_DATABASE_URL` is set**.
- For integration tests, set `TEST_DATABASE_URL` to a **separate, disposable, local** database whose name contains the word `test` and differs from `DATABASE_URL`, then run `npm run db:test:prepare` (creates it if needed and applies migrations with `migrate deploy`) and `npm run test:integration`.
- Some tests are static scans (for example the password-gate and village-write-guard coverage tests) that fail when new files bypass required guards.

**Verification status:** the dependencies are not installed in this inspection environment, so `lint`, `typecheck`, `test` and `build` were **not run** while writing this document.

## Production Build and Deployment

`npm run build`, then `npm run db:deploy`, then `npm run start`; run `npm run worker:deactivation` as a separate long-lived process (or schedule `worker:deactivation:once`). The worker is documented in its header as host-independent. No deployment platform configuration (Dockerfile, CI, etc.) exists in the repository; the hosting target is unknown and requires confirmation.

## Important Notes

- **`npm run typecheck` is currently failing** on `main`: 29 errors in 28 files. Most are `Module '"@/lib/i18n/en"' has no exported member 'TranslationKey'` (`src/lib/i18n/en.ts` only exports `en`); one is in `src/features/fund-management/actions/create-fund.action.ts:117` (`fundId` is `string | undefined`). Not fixed here because this task is documentation only. `docs/village-deactivation-final-report.md` states the authoring environment could not run `tsc`.
- Sessions are invalidated by incrementing `User.sessionVersion`; users of non-`ACTIVE` villages are treated as signed out.
- While a village has an `APPROVED` deactivation request it is read-only; mutations are blocked by a shared guard.
- Agent instructions live in `AGENTS.md` and `CLAUDE.md`.

## License

No license is specified. Contact the project owner before reusing the code.
