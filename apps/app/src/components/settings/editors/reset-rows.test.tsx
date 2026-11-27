import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { ResetAppDataRow, ResetSettingsRow } from "@/components/settings/editors/reset-rows";
import { deferred } from "@/test-support/async";
import { mockAuth, resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const calls: string[] = [];
const mockWipe = jest.fn(async () => {
  calls.push("wipeLocalDeviceData");
});
const mockFactoryReset = jest.fn(async () => {
  calls.push("factoryResetPinLock");
});
const mockClearAll = jest.fn(async () => {
  calls.push("clearAll");
});
const mockResetAllSettings = jest.fn(async () => undefined);

jest.mock("@/lib/wipe-local-data", () => ({
  wipeLocalDeviceData: () => mockWipe(),
}));
jest.mock("@/features/pin-lock", () => ({
  usePinLock: () => ({ factoryResetPinLock: mockFactoryReset }),
}));
jest.mock("@/providers/in-app-notifications-provider", () => ({
  useInAppNotifications: () => ({ clearAll: mockClearAll }),
}));
jest.mock("@/lib/settings/reset", () => ({
  ...jest.requireActual("@/lib/settings/reset"),
  resetAllSettings: () => mockResetAllSettings(),
}));

beforeEach(() => {
  calls.length = 0;
  jest.clearAllMocks();
  resetAuthMock();
  resetToastMock();
  resetExpoRouterMock();
  mockAuth.resetAppData.mockImplementation(async () => {
    calls.push("resetAppData");
    return "ok";
  });
});

async function openResetAppData() {
  await renderWithTheme(<ResetAppDataRow />);
  await fireEvent.press(screen.getByRole("button", { name: "Reset app data" }));
}

const confirmButton = () => screen.getByRole("button", { name: "Reset data" });

describe("ResetAppDataRow (D-02)", () => {
  it("lists what is erased on the device and, when signed in, in the cloud", async () => {
    setMockAuth({ isAuthenticated: true, isGuest: false, session: { accessToken: "tok" } });
    await openResetAppData();
    expect(screen.getByText(/On this device:/)).toBeTruthy();
    expect(screen.getByText(/In the cloud:/)).toBeTruthy();
  });

  it("tells guests nothing in the cloud is touched", async () => {
    await openResetAppData();
    expect(screen.getByText(/Nothing is stored in the cloud/)).toBeTruthy();
  });

  it("keeps confirm disabled until the acknowledgement is ticked", async () => {
    await openResetAppData();
    expect(confirmButton().props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
    await fireEvent.press(confirmButton());
    expect(mockWipe).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole("checkbox"));
    expect(confirmButton().props.accessibilityState?.disabled).toBeFalsy();
  });

  it("stays open and busy until the wipe resolves, then goes Home in the same call order", async () => {
    setMockAuth({ isAuthenticated: true, isGuest: false, session: { accessToken: "tok" } });
    const gate = deferred<void>();
    mockClearAll.mockImplementationOnce(async () => {
      calls.push("clearAll");
      await gate.promise;
    });
    await openResetAppData();
    await fireEvent.press(screen.getByRole("checkbox"));
    await fireEvent.press(confirmButton());

    await waitFor(() => expect(mockClearAll).toHaveBeenCalled());
    // Still open and busy: nothing navigated yet.
    expect(screen.getByTestId("sheet")).toBeTruthy();
    expect(confirmButton().props.accessibilityState).toEqual(
      expect.objectContaining({ busy: true }),
    );
    expect(mockRouter.replace).not.toHaveBeenCalled();

    await act(async () => {
      gate.resolve();
    });
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
    expect(calls).toEqual([
      "resetAppData",
      "wipeLocalDeviceData",
      "factoryResetPinLock",
      "clearAll",
    ]);
    expect(mockToast.success).toHaveBeenCalledWith("Your app data was reset");
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("shows the cloud error inline, touches nothing local, and can retry", async () => {
    setMockAuth({ isAuthenticated: true, isGuest: false, session: { accessToken: "tok" } });
    mockAuth.resetAppData.mockImplementationOnce(async () => {
      calls.push("resetAppData");
      return "error";
    });
    await openResetAppData();
    await fireEvent.press(screen.getByRole("checkbox"));
    await fireEvent.press(confirmButton());

    await waitFor(() =>
      expect(
        screen.getByText("Couldn't reset your app data. Check your connection and try again."),
      ).toBeTruthy(),
    );
    expect(mockWipe).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(screen.getByTestId("sheet")).toBeTruthy();

    // Retry runs the full sequence again.
    await fireEvent.press(confirmButton());
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
    expect(calls).toEqual([
      "resetAppData",
      "resetAppData",
      "wipeLocalDeviceData",
      "factoryResetPinLock",
      "clearAll",
    ]);
  });

  it("reports a device wipe failure inline without navigating", async () => {
    mockWipe.mockRejectedValueOnce(new Error("disk"));
    await openResetAppData();
    await fireEvent.press(screen.getByRole("checkbox"));
    await fireEvent.press(confirmButton());
    await waitFor(() =>
      expect(screen.getByText("Couldn't finish erasing this device. Try again.")).toBeTruthy(),
    );
    expect(mockAuth.resetAppData).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});

describe("ResetSettingsRow", () => {
  it("toasts after the reset resolves", async () => {
    await renderWithTheme(<ResetSettingsRow />);
    await fireEvent.press(screen.getByRole("button", { name: "Reset settings to defaults" }));
    await fireEvent.press(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => expect(mockToast.success).toHaveBeenCalled());
    expect(mockResetAllSettings).toHaveBeenCalledTimes(1);
  });

  it("keeps the dialog open with an inline error when the reset fails", async () => {
    mockResetAllSettings.mockRejectedValueOnce(new Error("nope"));
    await renderWithTheme(<ResetSettingsRow />);
    await fireEvent.press(screen.getByRole("button", { name: "Reset settings to defaults" }));
    await fireEvent.press(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(screen.getByText("Couldn't reset your settings. Try again.")).toBeTruthy(),
    );
    expect(mockToast.success).not.toHaveBeenCalled();
  });
});
