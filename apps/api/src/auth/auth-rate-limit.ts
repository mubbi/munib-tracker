import { isRateLimited, resetMemoryRateLimits } from "../common/durable-rate-limit";

/** Guest creation: 30 / hour per IP (or device). */
const GUEST_LIMIT = 30;
const GUEST_WINDOW_MS = 60 * 60 * 1000;

/** Refresh: 60 / 15 min per IP (or token prefix). */
const REFRESH_LIMIT = 60;
const REFRESH_WINDOW_MS = 15 * 60 * 1000;

/** OAuth complete: 30 / hour per IP. */
const OAUTH_LIMIT = 30;
const OAUTH_WINDOW_MS = 60 * 60 * 1000;

function bucket(kind: string, identity: string): string {
  return `auth:${kind}:${identity}`;
}

export async function isAuthGuestRateLimited(identity: string): Promise<boolean> {
  return isRateLimited({
    key: bucket("guest", identity),
    limit: GUEST_LIMIT,
    windowMs: GUEST_WINDOW_MS,
  });
}

export async function isAuthRefreshRateLimited(identity: string): Promise<boolean> {
  return isRateLimited({
    key: bucket("refresh", identity),
    limit: REFRESH_LIMIT,
    windowMs: REFRESH_WINDOW_MS,
  });
}

export async function isAuthOAuthRateLimited(identity: string): Promise<boolean> {
  return isRateLimited({
    key: bucket("oauth", identity),
    limit: OAUTH_LIMIT,
    windowMs: OAUTH_WINDOW_MS,
  });
}

/** Delete account: 3 / 15 min per IP. */
const DELETE_ACCOUNT_LIMIT = 3;
const DELETE_ACCOUNT_WINDOW_MS = 15 * 60 * 1000;

export async function isAuthDeleteAccountRateLimited(identity: string): Promise<boolean> {
  return isRateLimited({
    key: bucket("delete-account", identity),
    limit: DELETE_ACCOUNT_LIMIT,
    windowMs: DELETE_ACCOUNT_WINDOW_MS,
  });
}

/** App-data reset: 3 / 15 min per IP. */
export async function isAuthResetAppDataRateLimited(identity: string): Promise<boolean> {
  return isRateLimited({
    key: bucket("reset-app-data", identity),
    limit: DELETE_ACCOUNT_LIMIT,
    windowMs: DELETE_ACCOUNT_WINDOW_MS,
  });
}

export function resetAuthRateLimits(): void {
  resetMemoryRateLimits();
}
