/**
 * Shared `@/providers/auth-provider` mock with a mutable session. jest.setup
 * already stubs a signed-out guest; use this when a test needs a signed-in user
 * or to assert auth actions:
 *
 *   jest.mock("@/providers/auth-provider", () => require("@/test-support/mocks/auth-provider").authProviderMock);
 *   import { setMockAuth, resetAuthMock, mockAuth } from "@/test-support/mocks/auth-provider";
 *   setMockAuth({ session: { accessToken: "tok" }, isGuest: false });
 */
import type { ReactNode } from "react";

type MockAuthState = {
  session: { accessToken: string; [key: string]: unknown } | null;
  user: Record<string, unknown> | null;
  isReady: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isSyncing: boolean;
};

const defaults: MockAuthState = {
  session: null,
  user: null,
  isReady: true,
  isGuest: true,
  isAuthenticated: false,
  isSyncing: false,
};

let state: MockAuthState = { ...defaults };

export const mockAuth = {
  signInAsGuest: jest.fn(),
  signInWithProvider: jest.fn(),
  linkProvider: jest.fn(),
  signOut: jest.fn(),
  syncNow: jest.fn(async () => "skipped"),
  deleteAccount: jest.fn(async () => "ok"),
  resetAppData: jest.fn(async () => "ok"),
};

export function setMockAuth(overrides: Partial<MockAuthState>): void {
  state = { ...state, ...overrides };
}

export function resetAuthMock(): void {
  state = { ...defaults };
  for (const fn of Object.values(mockAuth)) fn.mockClear();
}

export const authProviderMock = {
  __esModule: true,
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({ ...state, ...mockAuth }),
};
