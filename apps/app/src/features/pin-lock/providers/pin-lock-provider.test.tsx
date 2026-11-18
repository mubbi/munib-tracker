import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import {
  LOCK_TIMEOUT_STORAGE_KEY,
  PIN_ENABLED_KEY,
  PIN_FAILED_ATTEMPTS_KEY,
  PIN_LOCKOUT_UNTIL_KEY,
  PIN_STORE_KEY,
} from "@/features/pin-lock/lib/pin-lock-storage";
import {
  LOCK_TIMEOUT_OPTIONS,
  type PinLockContextValue,
  PinLockProvider,
  usePinLock,
} from "@/features/pin-lock/providers/pin-lock-provider";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";
import {
  mockNotificationsPlatform,
  resetNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";
import {
  mockDeleteSecureItem,
  mockGetSecureItem,
  mockSecureStore,
  mockSetSecureItem,
  resetSafeSecureStoreMock,
} from "@/test-support/mocks/safe-secure-store";
import { setPlatform, usePlatform } from "@/test-support/platform";

jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").notificationsPlatformMock,
);

const mockLocalAuth = {
  hasHardwareAsync: jest.fn(async () => true),
  isEnrolledAsync: jest.fn(async () => true),
  supportedAuthenticationTypesAsync: jest.fn(async (): Promise<number[]> => [2]),
  authenticateAsync: jest.fn(async (_options: unknown) => ({ success: true })),
};

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: () => mockLocalAuth.hasHardwareAsync(),
  isEnrolledAsync: () => mockLocalAuth.isEnrolledAsync(),
  supportedAuthenticationTypesAsync: () => mockLocalAuth.supportedAuthenticationTypesAsync(),
  authenticateAsync: (options: unknown) => mockLocalAuth.authenticateAsync(options),
}));

// Fast deterministic stand-in for PBKDF2 (covered by pin-crypto.test.ts).
const mockHashPin = jest.fn(async (pin: string) => `HASH:${pin}`);

jest.mock("@/features/pin-lock/lib/pin-crypto", () => ({
  ...jest.requireActual("@/features/pin-lock/lib/pin-crypto"),
  hashPin: (pin: string) => mockHashPin(pin),
  verifyPinHash: async (pin: string, stored: string) => stored === `HASH:${pin}`,
}));

const PIN = "123456";
const WRONG_PIN = "000000";

type StoreSeed = Partial<Record<string, string>>;

/** Store contents for an enabled PIN of `PIN`. */
const ENABLED_PIN: StoreSeed = { [PIN_ENABLED_KEY]: "1", [PIN_STORE_KEY]: `HASH:${PIN}` };

const wrapper = ({ children }: { children: ReactNode }) => (
  <PinLockProvider>{children}</PinLockProvider>
);

/** Seeds secure storage, mounts the provider and waits for its initial load. */
async function setup(seed: StoreSeed = {}) {
  for (const [key, value] of Object.entries(seed)) {
    if (value !== undefined) mockSecureStore.set(key, value);
  }
  const appState = captureAppStateListener();
  const hook = await renderHook(() => usePinLock(), { wrapper });
  await waitFor(() => expect(hook.result.current.isReady).toBe(true));
  const ctx = () => hook.result.current;
  /** Runs a context action inside act() and returns its result. */
  const run = async <T,>(action: (value: PinLockContextValue) => T): Promise<Awaited<T>> => {
    let out!: Awaited<T>;
    await act(async () => {
      out = await action(hook.result.current);
    });
    return out;
  };
  const emit = async (state: string) => {
    await act(async () => {
      appState.emit(state);
    });
  };
  return { ctx, run, emit, appState, unmount: hook.unmount };
}

/** An unlocked session with an enabled PIN (lock timeout from `seed`). */
async function setupUnlocked(seed: StoreSeed = {}) {
  const harness = await setup({ ...ENABLED_PIN, ...seed });
  await harness.run((c) => c.unlock(PIN));
  return harness;
}

describe("PinLockProvider", () => {
  beforeEach(() => {
    resetSafeSecureStoreMock();
    resetNotificationsPlatformMock();
    mockLocalAuth.hasHardwareAsync.mockReset().mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockReset().mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockReset().mockResolvedValue([2]);
    mockLocalAuth.authenticateAsync.mockReset().mockResolvedValue({ success: true });
    mockHashPin.mockReset().mockImplementation(async (pin: string) => `HASH:${pin}`);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("exports the timeout options", () => {
    expect(LOCK_TIMEOUT_OPTIONS.map((o) => o.value)).toEqual([0, 60_000, 300_000]);
  });

  it("throws outside the provider", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => usePinLock())).rejects.toThrow(
      "usePinLock must be used within PinLockProvider",
    );
    consoleError.mockRestore();
  });

  describe("initial load", () => {
    it("starts unlocked without a stored PIN", async () => {
      const { ctx } = await setup();
      expect(ctx()).toMatchObject({
        isPinEnabled: false,
        hasStoredPin: false,
        isLocked: false,
        deferActionsUntilPinUnlock: false,
        pinSetupRequired: false,
        lockTimeoutMs: 0,
      });
    });

    it("locks on launch when a PIN is enabled and stored", async () => {
      const { ctx } = await setup(ENABLED_PIN);
      expect(ctx()).toMatchObject({ isLocked: true, deferActionsUntilPinUnlock: true });
    });

    it("restores the saved lock timeout", async () => {
      const { ctx } = await setup({ [LOCK_TIMEOUT_STORAGE_KEY]: "60000" });
      expect(ctx().lockTimeoutMs).toBe(60_000);
    });

    it("ignores an unparsable lock timeout", async () => {
      const { ctx } = await setup({ [LOCK_TIMEOUT_STORAGE_KEY]: "garbage" });
      expect(ctx().lockTimeoutMs).toBe(0);
    });

    it("requires PIN setup when enabled without a stored hash", async () => {
      const { ctx } = await setup({ [PIN_ENABLED_KEY]: "1" });
      expect(ctx()).toMatchObject({ pinSetupRequired: true, isLocked: false });
    });

    it.each([
      ["Face ID", [2], "pinLock.unlockWithFaceId"],
      ["Touch ID", [1], "pinLock.unlockWithTouchId"],
    ])("offers %s when enrolled", async (_case, types, labelKey) => {
      mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue(types);
      const { ctx } = await setup();
      expect(ctx()).toMatchObject({ biometricsAvailable: true, biometricUnlockLabelKey: labelKey });
    });

    it("reports biometrics unavailable without hardware", async () => {
      mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);
      const { ctx } = await setup();
      expect(ctx()).toMatchObject({
        biometricsAvailable: false,
        biometricUnlockLabelKey: "pinLock.unlockWithBiometrics",
      });
    });

    it("restores an active lockout", async () => {
      const { ctx } = await setup({ [PIN_LOCKOUT_UNTIL_KEY]: String(Date.now() + 60_000) });
      expect(ctx().isLockedOut).toBe(true);
      expect(ctx().lockoutRemainingMs).toBeGreaterThan(0);
    });

    it("clears an expired lockout from storage", async () => {
      const { ctx } = await setup({ [PIN_LOCKOUT_UNTIL_KEY]: String(Date.now() - 1_000) });
      expect(ctx().isLockedOut).toBe(false);
      await waitFor(() => expect(mockSecureStore.has(PIN_LOCKOUT_UNTIL_KEY)).toBe(false));
    });

    it("ignores an unparsable lockout", async () => {
      const { ctx } = await setup({ [PIN_LOCKOUT_UNTIL_KEY]: "not-a-number" });
      expect(ctx().isLockedOut).toBe(false);
    });

    it("stays usable when loading fails", async () => {
      mockLocalAuth.isEnrolledAsync.mockRejectedValue(new Error("LA unavailable"));
      const { ctx } = await setup(ENABLED_PIN);
      expect(ctx()).toMatchObject({ isReady: true, isLocked: false });
    });

    it("skips secure storage in Expo Go", async () => {
      mockNotificationsPlatform.expoGo = true;
      const { ctx } = await setup(ENABLED_PIN);
      expect(ctx().isLocked).toBe(false);
      expect(mockGetSecureItem).not.toHaveBeenCalled();
    });

    describe("on TV", () => {
      usePlatform({ isTV: true });

      it("skips secure storage", async () => {
        const { ctx } = await setup(ENABLED_PIN);
        expect(ctx().isLocked).toBe(false);
        expect(mockGetSecureItem).not.toHaveBeenCalled();
      });
    });
  });

  describe("lockout countdown", () => {
    it("clears the lockout once it expires", async () => {
      jest.useFakeTimers({ now: 1_000_000 });
      mockSecureStore.set(PIN_LOCKOUT_UNTIL_KEY, String(1_000_000 + 2_500));
      const { result } = await renderHook(() => usePinLock(), { wrapper });
      await act(async () => {
        await jest.runOnlyPendingTimersAsync();
      });
      expect(result.current.isLockedOut).toBe(true);

      await act(async () => {
        await jest.advanceTimersByTimeAsync(3_000);
      });
      expect(result.current).toMatchObject({ isLockedOut: false, lockoutRemainingMs: 0 });
      expect(mockSecureStore.has(PIN_LOCKOUT_UNTIL_KEY)).toBe(false);
    });
  });

  describe("unlock", () => {
    it("unlocks with the correct PIN", async () => {
      const { ctx, run } = await setup(ENABLED_PIN);
      await expect(run((c) => c.unlock(PIN))).resolves.toBe(true);
      expect(ctx()).toMatchObject({ isLocked: false, unlockError: null });
    });

    it("resets the failed-attempt counter on success", async () => {
      const { run } = await setup({ ...ENABLED_PIN, [PIN_FAILED_ATTEMPTS_KEY]: "2" });
      await run((c) => c.unlock(PIN));
      expect(mockSecureStore.has(PIN_FAILED_ATTEMPTS_KEY)).toBe(false);
    });

    it.each([
      [1, 4],
      [4, 1],
    ])("reports remaining attempts after %i wrong PIN(s)", async (wrong, remaining) => {
      const { ctx, run } = await setup({ ...ENABLED_PIN, [PIN_FAILED_ATTEMPTS_KEY]: "-3" });
      for (let i = 0; i < wrong; i++) await run((c) => c.unlock(WRONG_PIN));
      expect(ctx()).toMatchObject({
        unlockError: "pinLock.wrongPinAttemptsRemaining",
        unlockErrorParams: { count: remaining },
      });
    });

    it("locks out on the fifth wrong PIN", async () => {
      const { ctx, run } = await setup({ ...ENABLED_PIN, [PIN_FAILED_ATTEMPTS_KEY]: "4" });
      await expect(run((c) => c.unlock(WRONG_PIN))).resolves.toBe(false);
      expect(ctx()).toMatchObject({
        unlockError: "pinLock.lockedOut",
        unlockErrorParams: null,
        isLockedOut: true,
      });
      expect(mockSecureStore.has(PIN_LOCKOUT_UNTIL_KEY)).toBe(true);
    });

    it("refuses even the correct PIN while locked out", async () => {
      const { ctx, run } = await setup({ ...ENABLED_PIN, [PIN_FAILED_ATTEMPTS_KEY]: "junk" });
      for (let i = 0; i < 5; i++) await run((c) => c.unlock(WRONG_PIN));
      await expect(run((c) => c.unlock(PIN))).resolves.toBe(false);
      expect(ctx().isLocked).toBe(true);
    });

    it("honours a lockout persisted after launch", async () => {
      const { ctx, run } = await setup(ENABLED_PIN);
      mockSecureStore.set(PIN_LOCKOUT_UNTIL_KEY, String(Date.now() + 60_000));
      await expect(run((c) => c.unlock(PIN))).resolves.toBe(false);
      expect(ctx().unlockError).toBe("pinLock.lockedOut");
    });

    it("clears the error on request", async () => {
      const { ctx, run } = await setup(ENABLED_PIN);
      await run((c) => c.unlock(WRONG_PIN));
      await run((c) => c.clearUnlockError());
      expect(ctx()).toMatchObject({ unlockError: null, unlockErrorParams: null });
    });

    it("refuses when enabled but the hash is missing", async () => {
      const { run } = await setup({ [PIN_ENABLED_KEY]: "1" });
      await expect(run((c) => c.unlock(PIN))).resolves.toBe(false);
    });

    it("unlocks a manual lock when no PIN is configured", async () => {
      const { ctx, run } = await setup();
      await run((c) => c.lock());
      expect(ctx().isLocked).toBe(true);
      await expect(run((c) => c.unlock("anything"))).resolves.toBe(true);
      expect(ctx().isLocked).toBe(false);
    });
  });

  describe("biometric unlock", () => {
    it("unlocks on success", async () => {
      const { ctx, run } = await setup(ENABLED_PIN);
      await expect(run((c) => c.unlockWithBiometrics())).resolves.toBe(true);
      expect(ctx().isLocked).toBe(false);
    });

    it.each([
      ["ios", ""],
      ["android", "Use PIN"],
    ] as const)("uses the %s fallback label", async (os, fallbackLabel) => {
      const { run } = await setup(ENABLED_PIN);
      const restore = setPlatform({ OS: os });
      await run((c) => c.unlockWithBiometrics());
      restore();
      expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ fallbackLabel, disableDeviceFallback: true }),
      );
    });

    it.each([
      ["not enrolled", () => mockLocalAuth.isEnrolledAsync.mockResolvedValueOnce(false)],
      ["failing", () => mockLocalAuth.authenticateAsync.mockResolvedValueOnce({ success: false })],
      ["throwing", () => mockLocalAuth.authenticateAsync.mockRejectedValueOnce(new Error("x"))],
    ])("asks for the PIN when biometrics are %s", async (_case, arrange) => {
      const { ctx, run } = await setup(ENABLED_PIN);
      arrange();
      await expect(run((c) => c.unlockWithBiometrics())).resolves.toBe(false);
      expect(ctx()).toMatchObject({ unlockError: "pinLock.usePinToUnlock", isLocked: true });
    });
  });

  describe("enablePin", () => {
    it("stores and enables a normalized PIN", async () => {
      const { ctx, run } = await setup();
      await expect(run((c) => c.enablePin("12 34 56"))).resolves.toBe(true);
      expect(ctx()).toMatchObject({ isPinEnabled: true, hasStoredPin: true });
      expect(mockSecureStore.get(PIN_STORE_KEY)).toBe("HASH:123456");
      expect(mockSecureStore.get(PIN_ENABLED_KEY)).toBe("1");
    });

    it.each([
      ["the PIN is too short", "123", () => {}],
      ["hashing fails", PIN, () => mockHashPin.mockRejectedValueOnce(new Error("crypto"))],
      ["the hash write is dropped", PIN, () => mockSetSecureItem.mockResolvedValueOnce(false)],
    ])("fails when %s", async (_case, pin, arrange) => {
      const { ctx, run } = await setup();
      arrange();
      await expect(run((c) => c.enablePin(pin))).resolves.toBe(false);
      expect(ctx().isPinEnabled).toBe(false);
    });

    it("rolls back the hash when the enabled flag write is dropped", async () => {
      const { ctx, run } = await setup();
      mockSetSecureItem
        .mockImplementationOnce(async (key: string, value: string) => {
          mockSecureStore.set(key, value);
          return true;
        })
        .mockResolvedValueOnce(false);
      await expect(run((c) => c.enablePin(PIN))).resolves.toBe(false);
      expect(mockSecureStore.has(PIN_STORE_KEY)).toBe(false);
      expect(ctx().isPinEnabled).toBe(false);
    });
  });

  describe("disablePin", () => {
    it("keeps the PIN when the current PIN is wrong", async () => {
      const { ctx, run } = await setup(ENABLED_PIN);
      await expect(run((c) => c.disablePin(WRONG_PIN))).resolves.toBe(false);
      expect(ctx().isPinEnabled).toBe(true);
    });

    it("removes the PIN with the correct current PIN", async () => {
      const { ctx, run } = await setup(ENABLED_PIN);
      await expect(run((c) => c.disablePin(PIN))).resolves.toBe(true);
      expect(ctx()).toMatchObject({ isPinEnabled: false, hasStoredPin: false });
      expect(mockSecureStore.get(PIN_ENABLED_KEY)).toBe("0");
      expect(mockSecureStore.has(PIN_STORE_KEY)).toBe(false);
    });
  });

  describe("setPin", () => {
    it.each([
      ["the new PIN is invalid", PIN, "12"],
      ["the current PIN is invalid", "12", "654321"],
      ["the current PIN is wrong", WRONG_PIN, "654321"],
    ])("refuses when %s", async (_case, current, next) => {
      const { run } = await setup(ENABLED_PIN);
      await expect(run((c) => c.setPin(current, next))).resolves.toBe(false);
      expect(mockSecureStore.get(PIN_STORE_KEY)).toBe(`HASH:${PIN}`);
    });

    it("changes the PIN after verifying the current one", async () => {
      const { run } = await setup(ENABLED_PIN);
      await expect(run((c) => c.setPin(PIN, "654321"))).resolves.toBe(true);
      expect(mockSecureStore.get(PIN_STORE_KEY)).toBe("HASH:654321");
    });

    it("sets a first PIN without a current one", async () => {
      const { ctx, run } = await setup();
      await expect(run((c) => c.setPin("", "111111"))).resolves.toBe(true);
      expect(ctx().hasStoredPin).toBe(true);
    });

    it.each([
      ["the write is dropped", () => mockSetSecureItem.mockResolvedValueOnce(false)],
      ["hashing fails", () => mockHashPin.mockRejectedValueOnce(new Error("crypto"))],
    ])("fails when %s", async (_case, arrange) => {
      const { ctx, run } = await setup();
      arrange();
      await expect(run((c) => c.setPin("", "222222"))).resolves.toBe(false);
      expect(ctx().hasStoredPin).toBe(false);
    });
  });

  describe("settings", () => {
    it("persists the lock timeout", async () => {
      const { ctx, run } = await setup();
      await run((c) => c.setLockTimeoutMs(300_000));
      expect(ctx().lockTimeoutMs).toBe(300_000);
      expect(mockSecureStore.get(LOCK_TIMEOUT_STORAGE_KEY)).toBe("300000");
    });

    it("keeps the new timeout when persisting fails", async () => {
      const { ctx, run } = await setup();
      mockSetSecureItem.mockRejectedValueOnce(new Error("keychain"));
      await run((c) => c.setLockTimeoutMs(60_000));
      expect(ctx().lockTimeoutMs).toBe(60_000);
    });

    it("factory resets state and storage", async () => {
      const { ctx, run } = await setup({ ...ENABLED_PIN, [LOCK_TIMEOUT_STORAGE_KEY]: "60000" });
      await run((c) => c.factoryResetPinLock());
      expect(ctx()).toMatchObject({
        isLocked: false,
        isPinEnabled: false,
        hasStoredPin: false,
        lockTimeoutMs: 0,
      });
      expect(mockSecureStore.has(PIN_STORE_KEY)).toBe(false);
      expect(mockSecureStore.get(LOCK_TIMEOUT_STORAGE_KEY)).toBe("0");
    });
  });

  describe("app state", () => {
    it("does not listen without an enabled, stored PIN", async () => {
      const { appState } = await setup();
      expect(appState.isArmed()).toBe(false);
    });

    it("locks on return from background with an immediate timeout", async () => {
      const { ctx, emit } = await setupUnlocked();
      await emit("background");
      await emit("active");
      expect(ctx().isLocked).toBe(true);
    });

    it("ignores inactive → active (system sheets)", async () => {
      const { ctx, emit } = await setupUnlocked();
      await emit("inactive");
      await emit("active");
      expect(ctx().isLocked).toBe(false);
    });

    it("does not lock before the timeout elapses", async () => {
      const { ctx, emit } = await setupUnlocked({ [LOCK_TIMEOUT_STORAGE_KEY]: "60000" });
      await emit("background");
      await emit("active");
      expect(ctx().isLocked).toBe(false);
    });

    it("ignores the background trip caused by the biometric prompt", async () => {
      const { ctx, run, emit } = await setupUnlocked();
      const prompt = deferred<{ success: boolean }>();
      mockLocalAuth.authenticateAsync.mockImplementationOnce(() => prompt.promise);
      let pending!: Promise<boolean>;
      await run((c) => {
        pending = c.unlockWithBiometrics();
      });
      await emit("background");
      await emit("active");
      await act(async () => {
        prompt.resolve({ success: false });
        await pending;
      });
      expect(ctx().isLocked).toBe(false);
    });

    it("removes its listener on unmount", async () => {
      const { appState, unmount } = await setup(ENABLED_PIN);
      const subscription = appState.spy.mock.results.at(-1)?.value as { remove: jest.Mock };
      await unmount();
      expect(subscription.remove).toHaveBeenCalled();
    });
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("never touches secure storage", async () => {
      const { run } = await setup();
      await run((c) => c.setLockTimeoutMs(60_000));
      await run((c) => c.disablePin(PIN));
      expect(mockGetSecureItem).not.toHaveBeenCalled();
      expect(mockSetSecureItem).not.toHaveBeenCalled();
      expect(mockDeleteSecureItem).not.toHaveBeenCalled();
    });

    it.each([
      ["enablePin", (c: PinLockContextValue) => c.enablePin(PIN), false],
      ["unlockWithBiometrics", (c: PinLockContextValue) => c.unlockWithBiometrics(), false],
      ["setPin", (c: PinLockContextValue) => c.setPin("", PIN), false],
      ["unlock", (c: PinLockContextValue) => c.unlock(PIN), true],
      ["disablePin", (c: PinLockContextValue) => c.disablePin(PIN), true],
    ])("%s uses the web fallback", async (_name, action, expected) => {
      const { ctx, run } = await setup();
      await expect(run(action)).resolves.toBe(expected);
      expect(ctx().pinSetupRequired).toBe(false);
    });
  });
});
