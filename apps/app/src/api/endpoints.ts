import {
  type AuthSessionResponseDto,
  type AuthUserResponseDto,
  apiFetch,
  type SyncPullResponseDto,
  type SyncPushResponseDto,
  type SyncRecordDto,
} from "@munib-tracker/api-client";

/**
 * Thin typed wrappers over the API. We call `apiFetch` directly (rather than the
 * generated hooks) because the generated request functions can't attach a JSON
 * body, and because we need per-request bearer tokens. Paths omit the `/api/v1`
 * prefix — `getApiBaseUrl()` already includes it.
 */

type OAuthPayload = {
  code?: string;
  idToken?: string;
  accessToken?: string;
  email?: string;
  displayName?: string;
  redirectUri?: string;
};

export type OAuthProvider = "google" | "apple" | "facebook";

export function requestGuestSession(deviceId: string): Promise<AuthSessionResponseDto> {
  return apiFetch<AuthSessionResponseDto>({
    url: "/auth/guest",
    method: "POST",
    body: JSON.stringify({ deviceId }),
  });
}

export function completeOAuth(
  provider: OAuthProvider,
  payload: OAuthPayload,
): Promise<AuthSessionResponseDto> {
  return apiFetch<AuthSessionResponseDto>({
    url: `/auth/oauth/${provider}`,
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function linkAccount(
  accessToken: string,
  provider: OAuthProvider,
  payload: OAuthPayload,
): Promise<AuthSessionResponseDto> {
  return apiFetch<AuthSessionResponseDto>(
    { url: "/auth/link", method: "POST", body: JSON.stringify({ provider, ...payload }) },
    { accessToken },
  );
}

export function refreshSession(refreshToken: string): Promise<AuthSessionResponseDto> {
  return apiFetch<AuthSessionResponseDto>({
    url: "/auth/refresh",
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function getCurrentUser(accessToken: string): Promise<AuthUserResponseDto> {
  return apiFetch<AuthUserResponseDto>({ url: "/auth/me", method: "GET" }, { accessToken });
}

export function logout(accessToken: string): Promise<void> {
  return apiFetch<void>({ url: "/auth/logout", method: "POST" }, { accessToken });
}

export function syncPull(accessToken: string, since?: string): Promise<SyncPullResponseDto> {
  const query = since ? `?since=${encodeURIComponent(since)}` : "";
  return apiFetch<SyncPullResponseDto>(
    { url: `/sync/pull${query}`, method: "GET" },
    { accessToken },
  );
}

export function syncPush(
  accessToken: string,
  records: SyncRecordDto[],
): Promise<SyncPushResponseDto> {
  return apiFetch<SyncPushResponseDto>(
    { url: "/sync/push", method: "POST", body: JSON.stringify({ records }) },
    { accessToken },
  );
}
