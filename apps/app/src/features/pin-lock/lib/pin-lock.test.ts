import { resolveBiometricUnlockLabelKey } from "@/features/pin-lock/lib/biometric-unlock-label";
import { normalizePin } from "@/features/pin-lock/lib/pin-crypto";
import {
  shouldLockOnForeground,
  shouldRecordBackgroundTransition,
} from "@/features/pin-lock/lib/pin-lock-app-state";
import { shouldDeferActionsUntilPinUnlock } from "@/features/pin-lock/lib/pin-lock-defer-actions";
import {
  attemptsRemainingBeforeLockout,
  computeLockoutAfterFailure,
  LOCKOUT_ATTEMPTS_THRESHOLD,
} from "@/features/pin-lock/lib/pin-lockout";
import { setPlatform } from "@/test-support/platform";

describe("pinLockout", () => {
  it("returns null before threshold", () => {
    expect(computeLockoutAfterFailure(LOCKOUT_ATTEMPTS_THRESHOLD - 1)).toBeNull();
  });

  it("returns exponential lockout after threshold", () => {
    const result = computeLockoutAfterFailure(LOCKOUT_ATTEMPTS_THRESHOLD, 1000);
    expect(result).not.toBeNull();
    expect(result?.durationMs).toBe(30_000);
    expect(result?.until).toBe(31_000);
  });

  it("counts attempts remaining", () => {
    expect(attemptsRemainingBeforeLockout(3)).toBe(2);
    expect(attemptsRemainingBeforeLockout(5)).toBe(0);
  });
});

describe("pinLockAppState", () => {
  it("only records background transitions", () => {
    expect(shouldRecordBackgroundTransition("background")).toBe(true);
    expect(shouldRecordBackgroundTransition("inactive")).toBe(false);
    expect(shouldRecordBackgroundTransition("active")).toBe(false);
  });

  it.each([
    ["not backgrounded", { wasBackgrounded: false, backgroundedAt: 1000 }, false],
    ["missing a background timestamp", { wasBackgrounded: true, backgroundedAt: null }, false],
    ["backgrounded long enough ago", { wasBackgrounded: true, backgroundedAt: 0 }, true],
  ])("decides the foreground lock when %s", (_case, state, expected) => {
    expect(shouldLockOnForeground({ ...state, lockTimeoutMs: 60_000, now: 60_000 })).toBe(expected);
  });

  it("locks immediately when timeout is zero", () => {
    expect(
      shouldLockOnForeground({
        wasBackgrounded: true,
        backgroundedAt: 1000,
        lockTimeoutMs: 0,
        now: 1001,
      }),
    ).toBe(true);
  });

  it("respects lock timeout", () => {
    expect(
      shouldLockOnForeground({
        wasBackgrounded: true,
        backgroundedAt: 1000,
        lockTimeoutMs: 60_000,
        now: 30_000,
      }),
    ).toBe(false);
    expect(
      shouldLockOnForeground({
        wasBackgrounded: true,
        backgroundedAt: 1000,
        lockTimeoutMs: 60_000,
        now: 70_000,
      }),
    ).toBe(true);
  });
});

describe("pinCrypto normalizePin", () => {
  it("accepts exactly 6 digits", () => {
    expect(normalizePin("123456")).toBe("123456");
    expect(normalizePin("12a3456")).toBe("123456");
    expect(normalizePin("12345")).toBeNull();
    expect(normalizePin("1234567")).toBeNull();
  });
});

describe("biometricUnlockLabel", () => {
  let restorePlatform: () => void = () => {};
  afterEach(() => restorePlatform());

  it.each([
    ["Face ID when facial recognition is enrolled", "ios", [2], "pinLock.unlockWithFaceId"],
    ["Face ID over fingerprint", "ios", [1, 2], "pinLock.unlockWithFaceId"],
    ["Touch ID for fingerprint on iOS", "ios", [1], "pinLock.unlockWithTouchId"],
    ["Fingerprint on Android", "android", [1], "pinLock.unlockWithFingerprint"],
    ["the generic label with nothing enrolled", "ios", [], "pinLock.unlockWithBiometrics"],
    ["the generic label for iris only", "ios", [3], "pinLock.unlockWithBiometrics"],
  ] as const)("resolves %s", (_case, os, types, expected) => {
    restorePlatform = setPlatform({ OS: os });
    expect(resolveBiometricUnlockLabelKey(types)).toBe(expected);
  });
});

describe("pinLockDeferActions", () => {
  it("defers when not ready or locked", () => {
    expect(shouldDeferActionsUntilPinUnlock(false, false)).toBe(true);
    expect(shouldDeferActionsUntilPinUnlock(true, true)).toBe(true);
    expect(shouldDeferActionsUntilPinUnlock(true, false)).toBe(false);
  });
});
