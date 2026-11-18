import { AuthProvider, type AuthSessionResponseDto } from "../../auth/dto/auth.dto";

/** The token pair `AuthService` issues after a successful sign-in. */
export function buildSession(
  overrides: Partial<AuthSessionResponseDto> = {},
): AuthSessionResponseDto {
  return {
    accessToken: "access-jwt",
    accessTokenExpiresIn: 900,
    refreshToken: "refresh-token",
    accountType: "user",
    userId: "user-1",
    provider: AuthProvider.Google,
    ...overrides,
  };
}
