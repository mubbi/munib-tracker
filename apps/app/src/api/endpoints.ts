import {
  type AuthSessionResponseDto,
  type AuthUserResponseDto,
  apiFetch,
  type SyncPullResponseDto,
  type SyncPushResponseDto,
  type SyncRecordDto,
  WEB_COOKIE_SESSION_TOKEN,
} from "@munib-tracker/api-client";

import { apiAuthOptions } from "@/api/auth-options";

/**
 * Thin typed wrappers over the API. We call `apiFetch` directly (rather than the
 * generated hooks) because the generated request functions can't attach a JSON
 * body, and because we need per-request bearer tokens. Paths omit the `/api/v1`
 * prefix — `getApiBaseUrl()` already includes it. Orval-generated paths that
 * include `/api/v1` are normalized in `apiFetch` / `resolveApiUrl`.
 */

type OAuthPayload = {
  code?: string;
  idToken?: string;
  accessToken?: string;
  identityToken?: string;
  codeVerifier?: string;
  email?: string;
  displayName?: string;
  redirectUri?: string;
};

export type OAuthProvider = "google" | "apple" | "facebook";

/** @deprecated Import from `@munib-tracker/api-client` or `@/api/auth-options`. */
export { WEB_COOKIE_SESSION_TOKEN };

export type WebAuthSessionResponse = {
  user: AuthUserResponseDto;
};

function isWebAuthSession(body: unknown): body is WebAuthSessionResponse {
  return (
    typeof body === "object" &&
    body != null &&
    "user" in body &&
    !("accessToken" in body) &&
    typeof (body as WebAuthSessionResponse).user === "object"
  );
}

/** Normalize native JWT body or web cookie `{ user }` into AuthSessionResponseDto. */
export function normalizeAuthSessionResponse(
  body: AuthSessionResponseDto | WebAuthSessionResponse,
): AuthSessionResponseDto {
  if (isWebAuthSession(body)) {
    return {
      accessToken: WEB_COOKIE_SESSION_TOKEN,
      accessTokenExpiresIn: 0,
      refreshToken: WEB_COOKIE_SESSION_TOKEN,
      accountType: body.user.accountType,
      userId: body.user.userId,
      provider: body.user.provider,
    };
  }
  return body;
}

export function requestGuestSession(deviceId: string): Promise<AuthSessionResponseDto> {
  return apiFetch<AuthSessionResponseDto>({
    url: "/auth/guest",
    method: "POST",
    body: JSON.stringify({ deviceId }),
  });
}

export async function completeOAuth(
  provider: OAuthProvider,
  payload: OAuthPayload,
): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>({
    url: `/auth/oauth/${provider}`,
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAuthSessionResponse(body);
}

/** Native Google: POST access token from on-device PKCE exchange. */
export async function authGoogle(accessToken: string): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>({
    url: "/auth/google",
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });
  return normalizeAuthSessionResponse(body);
}

/** Web Google: server-side code + PKCE exchange. */
export async function authGoogleOauth(payload: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>({
    url: "/auth/google/oauth",
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAuthSessionResponse(body);
}

/** Native Apple: identity token from expo-apple-authentication. */
export async function authApple(payload: {
  identityToken: string;
  displayName?: string;
}): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>({
    url: "/auth/apple",
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAuthSessionResponse(body);
}

/** Android / non-web Apple OAuth code exchange. */
export async function authAppleOauth(payload: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
  displayName?: string;
}): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>({
    url: "/auth/apple/oauth",
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAuthSessionResponse(body);
}

/** Web Apple: store PKCE session cookie before navigating to Apple authorize. */
export function authAppleOauthSession(payload: {
  codeVerifier: string;
  redirectUri: string;
  returnUrl: string;
}): Promise<void> {
  return apiFetch<void>({
    url: "/auth/apple/oauth/session",
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function linkAccount(
  accessToken: string,
  provider: OAuthProvider,
  payload: OAuthPayload,
): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>(
    { url: "/auth/link", method: "POST", body: JSON.stringify({ provider, ...payload }) },
    apiAuthOptions(accessToken),
  );
  return normalizeAuthSessionResponse(body);
}

export async function refreshSession(refreshToken: string): Promise<AuthSessionResponseDto> {
  const body = await apiFetch<AuthSessionResponseDto | WebAuthSessionResponse>({
    url: "/auth/refresh",
    method: "POST",
    body: JSON.stringify(refreshToken === WEB_COOKIE_SESSION_TOKEN ? {} : { refreshToken }),
  });
  return normalizeAuthSessionResponse(body);
}

export function getCurrentUser(accessToken: string): Promise<AuthUserResponseDto> {
  return apiFetch<AuthUserResponseDto>(
    { url: "/auth/me", method: "GET" },
    apiAuthOptions(accessToken),
  );
}

export function logout(accessToken: string): Promise<void> {
  return apiFetch<void>({ url: "/auth/logout", method: "POST" }, apiAuthOptions(accessToken));
}

/** Permanently deletes the current account and all its synced data on the server. */
export function deleteAccount(accessToken: string): Promise<void> {
  return apiFetch<void>({ url: "/auth/me", method: "DELETE" }, apiAuthOptions(accessToken));
}

export function syncPull(accessToken: string, since?: string): Promise<SyncPullResponseDto> {
  const query = since ? `?since=${encodeURIComponent(since)}` : "";
  return apiFetch<SyncPullResponseDto>(
    { url: `/sync/pull${query}`, method: "GET" },
    apiAuthOptions(accessToken),
  );
}

export function syncPush(
  accessToken: string,
  records: SyncRecordDto[],
): Promise<SyncPushResponseDto> {
  return apiFetch<SyncPushResponseDto>(
    // The server DTO field is `changes` (SyncPushDto.changes) — the payload key
    // must match or the ValidationPipe rejects every push.
    { url: "/sync/push", method: "POST", body: JSON.stringify({ changes: records }) },
    apiAuthOptions(accessToken),
  );
}
