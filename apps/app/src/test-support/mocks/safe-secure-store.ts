/**
 * In-memory `@/lib/storage/safe-secure-store` mock with stable spies:
 *
 *   jest.mock("@/lib/storage/safe-secure-store", () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock);
 *   import { mockSecureStore, resetSafeSecureStoreMock } from "@/test-support/mocks/safe-secure-store";
 *   beforeEach(resetSafeSecureStoreMock);
 *   mockSecureStore.set("key", "value");
 *
 * Writes resolve `true` (keychain accessible); override per test with
 * `mockSetSecureItem.mockResolvedValueOnce(false)` / `.mockRejectedValueOnce(err)`.
 */

/** Backing store for the mock — seed or inspect it directly. */
export const mockSecureStore = new Map<string, string>();

const defaultGet = async (key: string): Promise<string | null> => mockSecureStore.get(key) ?? null;
const defaultSet = async (key: string, value: string): Promise<boolean> => {
  mockSecureStore.set(key, value);
  return true;
};
const defaultDelete = async (key: string): Promise<void> => {
  mockSecureStore.delete(key);
};

export const mockGetSecureItem = jest.fn(defaultGet);
export const mockSetSecureItem = jest.fn(defaultSet);
export const mockDeleteSecureItem = jest.fn(defaultDelete);

/** Empties the store and restores the default spy implementations. */
export function resetSafeSecureStoreMock(): void {
  mockSecureStore.clear();
  mockGetSecureItem.mockReset().mockImplementation(defaultGet);
  mockSetSecureItem.mockReset().mockImplementation(defaultSet);
  mockDeleteSecureItem.mockReset().mockImplementation(defaultDelete);
}

export const safeSecureStoreMock = {
  __esModule: true,
  getSecureItem: (key: string) => mockGetSecureItem(key),
  setSecureItem: (key: string, value: string) => mockSetSecureItem(key, value),
  deleteSecureItem: (key: string) => mockDeleteSecureItem(key),
  isSecureStoreAccessDeniedError: () => false,
};
