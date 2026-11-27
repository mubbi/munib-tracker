import { OAUTH_CANCELLED } from "@/hooks/use-social-auth";

/** Catalog keys for the sign-in failures a person can act on (D-01 / F-01 / F-02). */
export type SocialAuthErrorKey =
  | "login.errorNotReady"
  | "login.errorProviderUnavailable"
  | "login.errorOffline"
  | "login.errorOAuthReturn"
  | "login.errorRateLimited"
  | "login.errorRejected"
  | "login.errorAccountClosed"
  | "login.errorServer"
  | "login.error";

/** `?error=` values the OAuth return routes pass to the login screen (D-32). */
export const OAUTH_RETURN_ERROR = "oauth_failed";

const PROVIDER_UNAVAILABLE = /not configured|not available/i;
const NOT_READY = /not ready|pkce|verifier/i;
const SESSION_EXPIRED = /session expired|missing authorization code/i;
const ACCOUNT_CLOSED = /account (has been )?closed/i;
const OFFLINE =
  /network request failed|failed to fetch|networkerror|network error|offline|timed? ?out|load failed/i;

/**
 * Maps a sign-in failure to a translated, user-facing catalog key. The raw
 * `Error.message` is developer copy and is never rendered (it stays available to
 * logs / Sentry). Returns `null` when the person dismissed the provider sheet —
 * that is not an error worth surfacing.
 */
export function socialAuthErrorKey(error: unknown): SocialAuthErrorKey | null {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  if (message === OAUTH_CANCELLED) return null;
  // API failures (`ApiError` from the generated client) carry the HTTP status.
  const status = httpStatusOf(error);
  if (status === 429) return "login.errorRateLimited";
  if (ACCOUNT_CLOSED.test(message)) return "login.errorAccountClosed";
  if (SESSION_EXPIRED.test(message)) return "login.errorOAuthReturn";
  if (status === 401 || status === 403) return "login.errorRejected";
  if (status != null && status >= 500) return "login.errorServer";
  if (PROVIDER_UNAVAILABLE.test(message)) return "login.errorProviderUnavailable";
  if (NOT_READY.test(message)) return "login.errorNotReady";
  if (OFFLINE.test(message)) return "login.errorOffline";
  return "login.error";
}

/** HTTP status of an API error (duck-typed: `ApiError.status`), or null. */
function httpStatusOf(error: unknown): number | null {
  if (!error || typeof error !== "object" || !("status" in error)) return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" && Number.isFinite(status) ? status : null;
}

/** Login `?error=` param → catalog key (unknown values fall back to the generic line). */
export function oauthReturnErrorKey(
  param: string | string[] | undefined,
): SocialAuthErrorKey | null {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) return null;
  return value === OAUTH_RETURN_ERROR ? "login.errorOAuthReturn" : "login.error";
}
