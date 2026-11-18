import type { AuthSessionResponseDto, AuthUserResponseDto } from "@munib-tracker/api-client";

import type { StoredSession } from "@/auth/session-store";

/** A persisted signed-in (Google) user session. */
export function buildStoredSession(overrides: Partial<StoredSession> = {}): StoredSession {
  return {
    accessToken: "access-user",
    refreshToken: "refresh-user",
    accountType: "user",
    userId: "u1",
    provider: "google",
    ...overrides,
  };
}

/** A persisted guest session (no provider). */
export function buildGuestSession(overrides: Partial<StoredSession> = {}): StoredSession {
  return {
    accessToken: "access-guest",
    refreshToken: "refresh-guest",
    accountType: "guest",
    userId: "g1",
    ...overrides,
  };
}

/** An API auth session response for a signed-in (Google) user. */
export function buildAuthSessionDto(
  overrides: Partial<AuthSessionResponseDto> = {},
): AuthSessionResponseDto {
  return {
    accessToken: "access-user",
    accessTokenExpiresIn: 900,
    refreshToken: "refresh-user",
    accountType: "user",
    userId: "u1",
    provider: "google",
    ...overrides,
  };
}

/** The `/auth/me` profile of a signed-in (Google) user. */
export function buildAuthUser(overrides: Partial<AuthUserResponseDto> = {}): AuthUserResponseDto {
  return {
    userId: "u1",
    accountType: "user",
    provider: "google",
    email: "user@example.com",
    ...overrides,
  };
}
