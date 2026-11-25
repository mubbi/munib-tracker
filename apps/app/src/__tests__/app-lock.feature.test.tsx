import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AppLockScreen from "@/app/settings/app-lock";
import { pressPinDigits } from "@/test-support/pin-lock";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => ({
  ...require("@/test-support/mocks/expo-router").expoRouterMock,
  Redirect: require("@/test-support/mocks/expo-router").MockRedirect,
}));
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);
jest.mock("@/lib/notifications/platform", () => ({
  ...jest.requireActual("@/lib/notifications/platform"),
  isExpoGo: () => false,
}));

const mockToast = { success: jest.fn(), error: jest.fn(), info: jest.fn() };
jest.mock("@/providers/toast-provider", () => ({
  ...jest.requireActual("@/providers/toast-provider"),
  useToast: () => mockToast,
}));

const mockPinLock = {
  isPinEnabled: true,
  hasStoredPin: true,
  enablePin: jest.fn(async () => true),
  disablePin: jest.fn(async () => true),
  setPin: jest.fn(async () => true),
  unlock: jest.fn(async () => true),
  lockTimeoutMs: 60_000,
  setLockTimeoutMs: jest.fn(),
  biometricsAvailable: false,
  biometricsSupported: false,
  biometricUnlockEnabled: false,
  setBiometricUnlockEnabled: jest.fn(),
  biometricUnlockLabelKey: "pinLock.unlockWithBiometrics",
};
jest.mock("@/features/pin-lock/providers/pin-lock-provider", () => ({
  ...jest.requireActual("@/features/pin-lock/providers/pin-lock-provider"),
  usePinLock: () => mockPinLock,
}));
jest.mock("@/features/pin-lock", () => ({
  ...jest.requireActual("@/features/pin-lock"),
  usePinLock: () => mockPinLock,
}));

describe("App lock settings (P5-49)", () => {
  usePlatform({ OS: "ios" });

  beforeEach(() => {
    mockPinLock.isPinEnabled = true;
    jest.clearAllMocks();
  });

  it("offers 'Lock after' as a radio group with the selection announced", async () => {
    await renderWithProviders(<AppLockScreen />);
    const group = screen.getByLabelText("Lock when app goes to background");
    expect(group.props.accessibilityRole).toBe("radiogroup");
    const oneMinute = screen.getByRole("radio", { name: "After 1 minute" });
    expect(oneMinute.props.accessibilityState).toEqual(expect.objectContaining({ checked: true }));
    await fireEvent.press(screen.getByRole("radio", { name: "After 5 minutes" }));
    expect(mockPinLock.setLockTimeoutMs).toHaveBeenCalledWith(300_000);
  });

  it("turns app lock off after the PIN and toasts the result, not the action", async () => {
    await renderWithProviders(<AppLockScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Turn off app lock" }));
    await pressPinDigits("123456");
    expect(mockPinLock.disablePin).toHaveBeenCalledWith("123456");
    await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith("App lock turned off"));
  });

  it("enables app lock from a real button", async () => {
    mockPinLock.isPinEnabled = false;
    await renderWithProviders(<AppLockScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Enable app lock" }));
    expect(screen.getByText("Choose a 6-digit PIN to lock the app")).toBeTruthy();
  });
});
