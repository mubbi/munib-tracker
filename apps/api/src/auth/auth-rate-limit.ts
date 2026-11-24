import { isRateLimited, resetMemoryRateLimits } from "../common/durable-rate-limit";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

/**
 * Per-identity (IP, device or token prefix) fixed windows for the auth routes.
 * One row per limiter — the `kind` is also the Redis bucket name
 * (`auth:<kind>:<identity>`), so renaming one resets its counters.
 */
export const AUTH_RATE_LIMITS = {
  guest: { limit: 30, windowMs: HOUR_MS },
  refresh: { limit: 60, windowMs: 15 * MINUTE_MS },
  oauth: { limit: 30, windowMs: HOUR_MS },
  "delete-account": { limit: 3, windowMs: 15 * MINUTE_MS },
  "reset-app-data": { limit: 3, windowMs: 15 * MINUTE_MS },
  "tv-pair-create": { limit: 20, windowMs: HOUR_MS },
  "tv-pair-poll": { limit: 120, windowMs: 15 * MINUTE_MS },
  "tv-pair-claim": { limit: 30, windowMs: HOUR_MS },
} as const satisfies Record<string, { limit: number; windowMs: number }>;

export type AuthRateLimitKind = keyof typeof AUTH_RATE_LIMITS;

/** `true` when `identity` is over the `kind` quota (counts this call when not). */
export function isAuthRateLimited(kind: AuthRateLimitKind, identity: string): Promise<boolean> {
  return isRateLimited({ key: `auth:${kind}:${identity}`, ...AUTH_RATE_LIMITS[kind] });
}

// Named limiters: the call sites (and their specs, which spy on them) stay explicit.
export const isAuthGuestRateLimited = (identity: string) => isAuthRateLimited("guest", identity);
export const isAuthRefreshRateLimited = (identity: string) =>
  isAuthRateLimited("refresh", identity);
export const isAuthOAuthRateLimited = (identity: string) => isAuthRateLimited("oauth", identity);
export const isAuthDeleteAccountRateLimited = (identity: string) =>
  isAuthRateLimited("delete-account", identity);
export const isAuthResetAppDataRateLimited = (identity: string) =>
  isAuthRateLimited("reset-app-data", identity);
export const isAuthTvPairCreateRateLimited = (identity: string) =>
  isAuthRateLimited("tv-pair-create", identity);
export const isAuthTvPairPollRateLimited = (identity: string) =>
  isAuthRateLimited("tv-pair-poll", identity);
export const isAuthTvPairClaimRateLimited = (identity: string) =>
  isAuthRateLimited("tv-pair-claim", identity);

export function resetAuthRateLimits(): void {
  resetMemoryRateLimits();
}
