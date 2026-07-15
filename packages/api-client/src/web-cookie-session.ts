/**
 * Marker stored in the Expo web client instead of JWTs when the API issues
 * HttpOnly `mt_access_token` / `mt_refresh_token` cookies.
 *
 * Never send this value as `Authorization: Bearer …` — omit Bearer and rely on
 * `credentials: "include"` so the browser attaches the cookies.
 */
export const WEB_COOKIE_SESSION_TOKEN = "cookie" as const;

export function isWebCookieSessionToken(token: string | undefined | null): boolean {
  return token === WEB_COOKIE_SESSION_TOKEN;
}
