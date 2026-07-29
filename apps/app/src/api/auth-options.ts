import { isWebCookieSessionToken, WEB_COOKIE_SESSION_TOKEN } from "@munib-tracker/api-client";

export { isWebCookieSessionToken, WEB_COOKIE_SESSION_TOKEN };

/**
 * Options for {@link apiFetch} / Orval callers: omit Bearer for web cookie sessions
 * so HttpOnly cookies authenticate the request.
 */
export function apiAuthOptions(accessToken: string | undefined): { accessToken?: string } {
  if (!accessToken || isWebCookieSessionToken(accessToken)) {
    return {};
  }
  return { accessToken };
}

/** Authorization headers for Image / non-fetch loads (omit for cookie sessions). */
export function apiAuthHeaders(
  accessToken: string | undefined,
): Record<string, string> | undefined {
  if (!accessToken || isWebCookieSessionToken(accessToken)) {
    return undefined;
  }
  return { Authorization: `Bearer ${accessToken}` };
}
