/**
 * Mutable `expo-constants` (the real default export's `expoConfig` is not
 * configurable, so it cannot be replaced per test):
 *
 *   jest.mock("expo-constants", () => require("@/test-support/mocks/expo-constants").expoConstantsMock);
 *   import { mockExpoConstants, resetExpoConstantsMock } from "@/test-support/mocks/expo-constants";
 *   beforeEach(resetExpoConstantsMock);
 *   mockExpoConstants.expoConfig = { version: "2.0.0", extra: { iosAppVersion: "2.0.1" } };
 */

type MockConstants = {
  expoConfig: Record<string, unknown> | null;
  easConfig: Record<string, unknown> | null;
  executionEnvironment: string;
};

const defaults = (): MockConstants => ({
  expoConfig: { name: "Munib Tracker", slug: "munib-tracker", version: "1.0.0", extra: {} },
  easConfig: null,
  executionEnvironment: "standalone",
});

export const mockExpoConstants: MockConstants = defaults();

export function resetExpoConstantsMock(): void {
  Object.assign(mockExpoConstants, defaults());
}

export const expoConstantsMock = {
  __esModule: true,
  default: mockExpoConstants,
  ExecutionEnvironment: { Bare: "bare", Standalone: "standalone", StoreClient: "storeClient" },
};
