import { renderHook } from "@testing-library/react-native";
import { useReviewPromptBlocked } from "@/features/reviews/hooks/useReviewPromptBlocked";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";

jest.unmock("@/features/reviews/hooks/useReviewPromptBlocked");

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);

const mockEnv = {
  isLocked: false,
  ready: true,
  hasCompletedOnboarding: true,
  isHardUpdateBlocking: false,
};
const defaults = { ...mockEnv };

jest.mock("@/features/pin-lock", () => ({
  usePinLock: () => ({ isLocked: mockEnv.isLocked }),
}));

jest.mock("@/stores/preferences-store", () => ({
  usePreferencesReady: () => mockEnv.ready,
  usePreferences: () => ({ hasCompletedOnboarding: mockEnv.hasCompletedOnboarding }),
}));

jest.mock("@/providers/app-version-provider", () => ({
  useAppVersion: () => ({ isHardUpdateBlocking: mockEnv.isHardUpdateBlocking }),
}));

async function setup(env: Partial<typeof mockEnv> = {}) {
  Object.assign(mockEnv, defaults, env);
  const { result } = await renderHook(() => useReviewPromptBlocked());
  return result.current;
}

describe("useReviewPromptBlocked", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    resetAuthMock();
    setMockPathname("/", ["(tabs)"]);
  });

  it("is unblocked when nothing is in the way", async () => {
    await expect(setup()).resolves.toBe(false);
  });

  it.each([
    ["the PIN lock", { isLocked: true }],
    ["preferences still loading", { ready: false }],
    ["incomplete onboarding", { hasCompletedOnboarding: false }],
    ["a hard update", { isHardUpdateBlocking: true }],
  ])("is blocked by %s", async (_label, env) => {
    await expect(setup(env)).resolves.toBe(true);
  });

  it("is blocked on an onboarding route", async () => {
    setMockPathname("/welcome", ["(onboarding)"]);
    await expect(setup()).resolves.toBe(true);
  });

  it("is blocked while syncing", async () => {
    setMockAuth({ isSyncing: true });
    await expect(setup()).resolves.toBe(true);
  });
});
