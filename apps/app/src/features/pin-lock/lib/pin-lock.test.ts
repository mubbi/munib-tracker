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
  it("prefers Face ID label", () => {
    expect(resolveBiometricUnlockLabelKey([2])).toBe("pinLock.unlockWithFaceId");
  });
});

describe("pinLockDeferActions", () => {
  it("defers when not ready or locked", () => {
    expect(shouldDeferActionsUntilPinUnlock(false, false)).toBe(true);
    expect(shouldDeferActionsUntilPinUnlock(true, true)).toBe(true);
    expect(shouldDeferActionsUntilPinUnlock(true, false)).toBe(false);
  });
});
