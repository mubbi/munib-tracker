import {
  clearPinLockStorage,
  LOCK_TIMEOUT_STORAGE_KEY,
  PIN_ENABLED_KEY,
  PIN_FAILED_ATTEMPTS_KEY,
  PIN_LOCKOUT_UNTIL_KEY,
  PIN_STORE_KEY,
} from "@/features/pin-lock/lib/pin-lock-storage";
import {
  mockNotificationsPlatform,
  resetNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";
import {
  mockDeleteSecureItem,
  mockSecureStore,
  mockSetSecureItem,
  resetSafeSecureStoreMock,
} from "@/test-support/mocks/safe-secure-store";
import { usePlatform } from "@/test-support/platform";

jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").notificationsPlatformMock,
);

const PIN_KEYS = [PIN_STORE_KEY, PIN_ENABLED_KEY, PIN_LOCKOUT_UNTIL_KEY, PIN_FAILED_ATTEMPTS_KEY];

function setup() {
  for (const key of PIN_KEYS) mockSecureStore.set(key, "seeded");
  mockSecureStore.set(LOCK_TIMEOUT_STORAGE_KEY, "60000");
}

describe("clearPinLockStorage", () => {
  beforeEach(() => {
    resetSafeSecureStoreMock();
    resetNotificationsPlatformMock();
  });

  it("deletes every PIN key", async () => {
    setup();
    await clearPinLockStorage();
    expect(PIN_KEYS.filter((key) => mockSecureStore.has(key))).toEqual([]);
  });

  it("resets the lock timeout to immediate", async () => {
    setup();
    await clearPinLockStorage();
    expect(mockSecureStore.get(LOCK_TIMEOUT_STORAGE_KEY)).toBe("0");
  });

  it("leaves storage untouched in Expo Go", async () => {
    mockNotificationsPlatform.expoGo = true;
    await clearPinLockStorage();
    expect(mockDeleteSecureItem).not.toHaveBeenCalled();
  });

  it("swallows delete and write failures", async () => {
    mockDeleteSecureItem.mockRejectedValueOnce(new Error("keychain"));
    mockSetSecureItem.mockRejectedValueOnce(new Error("keychain"));
    await expect(clearPinLockStorage()).resolves.toBeUndefined();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("leaves storage untouched", async () => {
      await clearPinLockStorage();
      expect(mockDeleteSecureItem).not.toHaveBeenCalled();
      expect(mockSetSecureItem).not.toHaveBeenCalled();
    });
  });
});
