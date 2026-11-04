/*
 * Fixed settings for password recovery. No imports, so it can be unit tested
 * directly. These are plain constants on purpose: a setting that can be
 * mistyped in an environment file is a setting that can silently weaken a
 * security rule. Change a value here, in a reviewed commit.
 */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** How long a reset code works after the Chief issues it. */
export const RECOVERY_CODE_TTL_HOURS = 72;
export const RECOVERY_CODE_TTL_MS = RECOVERY_CODE_TTL_HOURS * HOUR_MS;

/** How long a request can wait for a decision before it expires. */
export const RECOVERY_REQUEST_TTL_DAYS = 7;
export const RECOVERY_REQUEST_TTL_MS = RECOVERY_REQUEST_TTL_DAYS * DAY_MS;

/** Longest rejection or withdrawal note, in characters (the database agrees). */
export const RECOVERY_NOTE_MAX_LENGTH = 200;

/** Wrong codes allowed per request. The last one revokes the code. */
export const RECOVERY_MAX_FAILED_REDEEM_ATTEMPTS = 5;

/**
 * Codes one approver may issue per hour, even with a correct password. It
 * limits the damage of a stolen session that also knows the password.
 */
export const RECOVERY_MAX_ISSUES_PER_APPROVER_PER_HOUR = 10;

/**
 * Every outcome of the public request form takes at least this long, so the
 * time taken does not reveal whether an account exists. Tuned in Phase 10: it
 * must stay above the slowest real path.
 */
export const RECOVERY_RESPONSE_FLOOR_MS = 500;

/**
 * The only thing the public request form ever says, for every outcome
 * (unknown account, ineligible account, duplicate request, throttled, success).
 */
export const RECOVERY_GENERIC_RESPONSE =
  "If this account exists, the appropriate administrator has been notified.";
