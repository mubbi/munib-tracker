import { act, fireEvent, screen } from "@testing-library/react-native";

import { PinLockScreen } from "@/features/pin-lock/components/pin-lock-screen";
import { deferred } from "@/test-support/async";
import { pressPinBackspace, pressPinDigits } from "@/test-support/pin-lock";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof PinLockScreen>[0];

async function renderLockScreen(props: Partial<Props> = {}) {
  const { onUnlock = jest.fn(async (_pin: string) => true), ...rest } = props;
  const onClearError = jest.fn();
  await renderWithTheme(
    <PinLockScreen onUnlock={onUnlock} onClearError={onClearError} {...rest} />,
  );
  return { onUnlock, onClearError };
}

/** Renders with an unlock handler whose result the test resolves. */
async function renderPendingUnlock(props: Partial<Props> = {}) {
  const pending = deferred<boolean>();
  const handles = await renderLockScreen({ onUnlock: jest.fn(() => pending.promise), ...props });
  const settle = async (ok: boolean) => {
    await act(async () => {
      pending.resolve(ok);
      await pending.promise;
    });
  };
  return { ...handles, settle };
}

/** Renders with biometrics available and a biometric handler the test resolves. */
async function renderPendingBiometric(props: Partial<Props> = {}) {
  const pending = deferred<boolean>();
  const onBiometricUnlock = jest.fn(() => pending.promise);
  const handles = await renderLockScreen({
    biometricsAvailable: true,
    biometricUnlockLabelKey: "pinLock.unlockWithTouchId",
    onBiometricUnlock,
    ...props,
  });
  await fireEvent.press(screen.getByLabelText("Use Touch ID"));
  const settle = async () => {
    await act(async () => {
      pending.resolve(false);
      await pending.promise;
    });
  };
  return { ...handles, onBiometricUnlock, settle };
}

describe("PinLockScreen", () => {
  it("uses the default title and subtitle", async () => {
    await renderLockScreen();
    expect(screen.getByText("Enter PIN")).toBeTruthy();
    expect(screen.getByText("Enter your 6-digit PIN to unlock")).toBeTruthy();
  });

  it("uses a custom title and subtitle", async () => {
    await renderLockScreen({ title: "Locked", subtitle: "Custom subtitle" });
    expect(screen.getByText("Locked")).toBeTruthy();
    expect(screen.getByText("Custom subtitle")).toBeTruthy();
  });

  it("submits once six digits are entered", async () => {
    const { onUnlock } = await renderLockScreen();
    await pressPinDigits("12345");
    expect(onUnlock).not.toHaveBeenCalled();
    await pressPinDigits("6");
    expect(onUnlock).toHaveBeenCalledWith("123456");
  });

  it("clears the error on every key press", async () => {
    const { onClearError } = await renderLockScreen();
    await pressPinDigits("12");
    await pressPinBackspace();
    expect(onClearError).toHaveBeenCalledTimes(3);
  });

  it("drops the last digit on backspace", async () => {
    const { onUnlock } = await renderLockScreen();
    await pressPinDigits("12345");
    await pressPinBackspace();
    await pressPinDigits("90");
    expect(onUnlock).toHaveBeenCalledWith("123490");
  });

  it("works without an onClearError callback", async () => {
    const { onUnlock } = await renderLockScreen({ onClearError: undefined });
    await pressPinDigits("1");
    await pressPinBackspace();
    await pressPinDigits("222222");
    expect(onUnlock).toHaveBeenCalledWith("222222");
  });

  it("shows progress and hides the keys while unlocking", async () => {
    await renderPendingUnlock();
    await pressPinDigits("123456");
    expect(screen.getByText("Unlocking…")).toBeTruthy();
    expect(screen.queryByLabelText("1")).toBeNull();
  });

  it("clears the PIN after a failed unlock", async () => {
    const { onUnlock, settle } = await renderPendingUnlock();
    await pressPinDigits("123456");
    await settle(false);
    await pressPinDigits("654321");
    expect(onUnlock).toHaveBeenLastCalledWith("654321");
  });

  it("shows the error message", async () => {
    await renderLockScreen({ errorMessage: "Wrong PIN — please try again." });
    expect(screen.getByText("Wrong PIN — please try again.")).toBeTruthy();
  });

  describe("lockout", () => {
    it.each([
      [90_500, "Try again in 1 min 31 sec"],
      [4_200, "Try again in 5 sec"],
    ])("formats %i ms remaining as %p", async (lockoutRemainingMs, text) => {
      await renderLockScreen({ isLockedOut: true, lockoutRemainingMs, errorMessage: "Too many" });
      expect(screen.getByText(text)).toBeTruthy();
      expect(screen.queryByText("Too many")).toBeNull();
    });

    it("falls back to the error message when no time is left", async () => {
      await renderLockScreen({ isLockedOut: true, lockoutRemainingMs: 0, errorMessage: "Locked" });
      expect(screen.getByText("Locked")).toBeTruthy();
    });

    it("ignores key presses", async () => {
      const { onUnlock, onClearError } = await renderLockScreen({
        isLockedOut: true,
        lockoutRemainingMs: 5_000,
      });
      await pressPinDigits("123456");
      await pressPinBackspace();
      expect(onUnlock).not.toHaveBeenCalled();
      expect(onClearError).not.toHaveBeenCalled();
    });

    it("hides the biometric option", async () => {
      await renderLockScreen({
        isLockedOut: true,
        lockoutRemainingMs: 5_000,
        biometricsAvailable: true,
        onBiometricUnlock: jest.fn(async () => true),
      });
      expect(screen.queryByLabelText("Use biometrics")).toBeNull();
    });
  });

  describe("biometrics", () => {
    it("starts biometric unlock and clears the error", async () => {
      const { onBiometricUnlock, onClearError } = await renderPendingBiometric();
      expect(onBiometricUnlock).toHaveBeenCalledTimes(1);
      expect(onClearError).toHaveBeenCalledTimes(1);
    });

    it("shows progress while verifying", async () => {
      await renderPendingBiometric();
      expect(screen.getByLabelText("Verifying…")).toBeTruthy();
    });

    it("ignores input while verifying", async () => {
      const { onUnlock, onBiometricUnlock } = await renderPendingBiometric();
      await pressPinDigits("1");
      await fireEvent.press(screen.getByLabelText("Verifying…"));
      expect(onBiometricUnlock).toHaveBeenCalledTimes(1);
      expect(onUnlock).not.toHaveBeenCalled();
    });

    it("re-enables the keypad once verification settles", async () => {
      const { onUnlock, settle } = await renderPendingBiometric();
      await settle();
      expect(screen.getByLabelText("Use Touch ID")).toBeTruthy();
      await pressPinDigits("123456");
      expect(onUnlock).toHaveBeenCalledWith("123456");
    });

    it("uses the default label without onClearError", async () => {
      const onBiometricUnlock = jest.fn(async () => true);
      await renderLockScreen({
        biometricsAvailable: true,
        onBiometricUnlock,
        onClearError: undefined,
      });
      await fireEvent.press(screen.getByLabelText("Use biometrics"));
      expect(onBiometricUnlock).toHaveBeenCalled();
      expect(await screen.findByLabelText("Use biometrics")).toBeTruthy();
    });

    it("hides the option without a handler", async () => {
      await renderLockScreen({ biometricsAvailable: true });
      expect(screen.queryByLabelText("Use biometrics")).toBeNull();
    });
  });
});
