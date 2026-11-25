import { screen } from "@testing-library/react-native";

import { PinLockGate } from "@/features/pin-lock/components/pin-lock-gate";
import type { PinLockContextValue } from "@/features/pin-lock/providers/pin-lock-provider";
import { pressPinDigits } from "@/test-support/pin-lock";
import { renderWithTheme } from "@/test-support/render";

let mockPinLock: Partial<PinLockContextValue> = {};

jest.mock("@/features/pin-lock/providers/pin-lock-provider", () => ({
  usePinLock: () => mockPinLock,
}));

/** Renders the gate over a locked, ready PIN state with `overrides` applied. */
async function renderGate(overrides: Partial<PinLockContextValue> = {}) {
  mockPinLock = {
    isReady: true,
    isLocked: true,
    hasStoredPin: true,
    pinSetupRequired: false,
    unlock: jest.fn(async () => true),
    unlockWithBiometrics: jest.fn(async () => true),
    biometricsAvailable: false,
    biometricUnlockLabelKey: "pinLock.unlockWithBiometrics",
    unlockError: null,
    unlockErrorParams: null,
    clearUnlockError: jest.fn(),
    isLockedOut: false,
    lockoutRemainingMs: 0,
    enablePin: jest.fn(async () => true),
    ...overrides,
  };
  await renderWithTheme(<PinLockGate />);
  return mockPinLock;
}

describe("PinLockGate", () => {
  it.each([
    ["not ready", { isReady: false, pinSetupRequired: true }],
    ["unlocked", { isLocked: false }],
    ["without a stored PIN", { hasStoredPin: false }],
  ])("renders no overlay when %s", async (_case, overrides) => {
    await renderGate(overrides);
    expect(screen.queryByText("Enter PIN")).toBeNull();
    expect(screen.queryByText("Set PIN")).toBeNull();
  });

  it("unlocks with the entered PIN", async () => {
    const { unlock } = await renderGate();
    await pressPinDigits("123456");
    expect(unlock).toHaveBeenCalledWith("123456");
  });

  it.each([
    ["a plain error", { unlockError: "pinLock.wrongPin" }, "Wrong PIN. Try again."],
    [
      "an interpolated error",
      { unlockError: "pinLock.wrongPinAttemptsRemaining", unlockErrorParams: { count: 3 } },
      "Wrong PIN. 3 attempts left before lockout.",
    ],
  ])("translates %s", async (_case, overrides, text) => {
    await renderGate(overrides);
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("shows the mandatory PIN setup when required", async () => {
    await renderGate({ isLocked: false, pinSetupRequired: true });
    expect(screen.getByText("Set PIN")).toBeTruthy();
    expect(screen.queryByLabelText("Close")).toBeNull();
  });

  it("saves the PIN chosen in the setup overlay", async () => {
    const { enablePin } = await renderGate({ isLocked: false, pinSetupRequired: true });
    await pressPinDigits("121212");
    await pressPinDigits("121212");
    expect(enablePin).toHaveBeenCalledWith("121212");
    expect(await screen.findByText("PIN saved")).toBeTruthy();
  });
});
