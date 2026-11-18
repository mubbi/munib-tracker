import type { AuthUserResponseDto } from "../../auth/dto/auth.dto";
import type { UserEntity } from "../../database/entities";

const FIXED_DATE = new Date("2026-01-01T00:00:00.000Z");

/** A persisted signed-in user row. */
export function buildUser(overrides: Partial<UserEntity> = {}): UserEntity {
  return {
    id: "user-1",
    accountType: "user",
    provider: "google",
    providerAccountId: "google-sub-1",
    email: "user@example.com",
    displayName: "Test User",
    deviceId: null,
    reviewReactivationLastWindowKey: null,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
    ...overrides,
  } as UserEntity;
}

/** The `AuthService.getCurrentUser()` payload for a signed-in user. */
export function buildAuthUser(overrides: Partial<AuthUserResponseDto> = {}): AuthUserResponseDto {
  return { userId: "user-1", accountType: "user", ...overrides };
}
