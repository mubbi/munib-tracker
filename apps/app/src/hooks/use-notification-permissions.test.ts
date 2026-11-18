import { act, renderHook } from "@testing-library/react-native";

import {
  openNotificationSettings,
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { getWebNotificationGuidance } from "@/lib/notifications/web-environment";
import { captureAppStateListener } from "@/test-support/app-state";
import {
  mockNotificationsOs,
  mockNotificationsPlatform,
  resetSwitchableNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";

import { useNotificationPermissions } from "./use-notification-permissions";

jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").switchableNotificationsPlatformMock,
);
jest.mock("@/lib/notifications/permissions", () => ({
  canEnableLocalReminders: () => true,
  openNotificationSettings: jest.fn(),
  readNotificationPermissionUiState: jest.fn(async () => "undetermined"),
  requestNotificationPermission: jest.fn(async () => ({ status: "granted" })),
}));
jest.mock("@/lib/notifications/web-environment", () => ({
  getWebNotificationGuidance: jest.fn(() => ({
    tier: "pwa",
    isIos: true,
    isInstalledPwa: false,
    needsSafariForInstall: true,
    blockingReason: "install-pwa",
  })),
}));

const readState = readNotificationPermissionUiState as jest.Mock;
let appState: ReturnType<typeof captureAppStateListener>;

async function setup() {
  const hook = await renderHook(() => useNotificationPermissions());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  resetSwitchableNotificationsPlatformMock();
  appState = captureAppStateListener();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useNotificationPermissions", () => {
  it.each([
    ["granted", { granted: true, denied: false, undetermined: false }],
    ["denied", { granted: false, denied: true, undetermined: false }],
    ["undetermined", { granted: false, denied: false, undetermined: true }],
  ] as const)("reads the %s permission state on mount", async (state, flags) => {
    readState.mockResolvedValueOnce(state);
    const { result } = await setup();
    expect(result.current.permission).toBe(state);
    expect(result.current).toEqual(expect.objectContaining(flags));
  });

  it("re-reads the permission when the app returns to the foreground", async () => {
    const { result } = await setup();
    readState.mockResolvedValueOnce("granted");
    await act(async () => appState.emit("background"));
    expect(readState).toHaveBeenCalledTimes(1);
    await act(async () => appState.emit("active"));
    expect(result.current.granted).toBe(true);
  });

  it("requests permission and refreshes the state", async () => {
    const { result } = await setup();
    readState.mockResolvedValueOnce("granted");
    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.requestPermission({ webPermissionRequest: null });
    });
    expect(requestNotificationPermission).toHaveBeenCalledWith({ webPermissionRequest: null });
    expect(outcome).toEqual({ status: "granted" });
    expect(result.current.granted).toBe(true);
  });

  it("exposes native capabilities without web guidance", async () => {
    mockNotificationsPlatform.expoGo = true;
    const { result } = await setup();
    expect(result.current.openSettings).toBe(openNotificationSettings);
    expect(result.current.canEnableLocalReminders).toBe(true);
    expect(result.current.isExpoGo).toBe(true);
    expect(result.current.isLocalSupported).toBe(false);
    expect(result.current.webTier).toBeNull();
    expect(result.current.webBlockingReason).toBeNull();
    expect(getWebNotificationGuidance).not.toHaveBeenCalled();
  });

  it("surfaces web install guidance on web", async () => {
    mockNotificationsOs.current = "web";
    const { result } = await setup();
    expect(result.current.webTier).toBe("pwa");
    expect(result.current.webBlockingReason).toBe("install-pwa");
  });

  it("stops listening on unmount", async () => {
    const { unmount } = await setup();
    const subscription = appState.spy.mock.results[0].value as { remove: jest.Mock };
    await unmount();
    expect(subscription.remove).toHaveBeenCalled();
  });
});
