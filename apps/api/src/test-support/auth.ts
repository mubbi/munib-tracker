import { type Mock, vi } from "vitest";
import type { AuthService } from "../auth/auth.service";
import { buildAuthUser } from "./fixtures/user";

export type MockAuthService = { getCurrentUser: Mock };

/** AuthService double for feature services that only resolve the caller. */
export function buildMockAuthService(
  user = buildAuthUser(),
): MockAuthService & { asService: () => AuthService } {
  const auth = { getCurrentUser: vi.fn().mockResolvedValue(user) };
  return { ...auth, asService: () => auth as unknown as AuthService };
}
