import { Linking } from "react-native";

import { IPHONE_SAFARI_UA, installBrowser } from "@/test-support/browser";
import {
  mockNotificationsOs,
  mockNotificationsPlatform,
  resetSwitchableNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";
import { setPlatform } from "@/test-support/platform";

import {
  canEnableLocalReminders,
  openNotificationSettings,
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "./permissions";

const mockExpoNotifications = {
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
};
jest.mock("expo-notifications", () => mockExpoNotifications);

jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").switchableNotificationsPlatformMock,
);

let restores: (() => void)[] = [];

/** Web session with an optional Notification API in the given state. */
function onWeb(permission?: string, requestPermission?: jest.Mock, userAgent?: string) {
  mockNotificationsOs.current = "web";
  restores.push(setPlatform({ OS: "web" }));
  restores.push(
    installBrowser({
      userAgent,
      notification: permission ? { permission, requestPermission } : undefined,
    }),
  );
}

/** Native OS permission status before / after the system prompt. */
function onNative(current: string, requested: string = current) {
  mockExpoNotifications.getPermissionsAsync.mockResolvedValue({ status: current });
  mockExpoNotifications.requestPermissionsAsync.mockResolvedValue({ status: requested });
}

beforeEach(() => {
  resetSwitchableNotificationsPlatformMock();
  mockExpoNotifications.getPermissionsAsync.mockReset();
  mockExpoNotifications.requestPermissionsAsync.mockReset();
});
afterEach(() => {
  for (const restore of restores.reverse()) restore();
  restores = [];
});

describe("readNotificationPermissionUiState", () => {
  it.each([
    ["granted", "granted"],
    ["denied", "denied"],
    ["default", "undetermined"],
  ])("maps web permission %s to %s", async (permission, expected) => {
    onWeb(permission);
    expect(await readNotificationPermissionUiState()).toBe(expected);
  });

  it("is undetermined when the web environment blocks notifications", async () => {
    onWeb("granted", undefined, IPHONE_SAFARI_UA);
    expect(await readNotificationPermissionUiState()).toBe("undetermined");
  });

  it("is undetermined in Expo Go", async () => {
    mockNotificationsPlatform.expoGo = true;
    expect(await readNotificationPermissionUiState()).toBe("undetermined");
  });

  it.each([
    ["granted", "granted"],
    ["denied", "denied"],
    ["undetermined", "undetermined"],
  ])("maps native status %s to %s", async (status, expected) => {
    onNative(status);
    expect(await readNotificationPermissionUiState()).toBe(expected);
  });

  it("is undetermined when the native module fails", async () => {
    mockExpoNotifications.getPermissionsAsync.mockRejectedValue(new Error("no native module"));
    expect(await readNotificationPermissionUiState()).toBe("undetermined");
  });
});

describe("requestNotificationPermission on web", () => {
  it("short-circuits when already granted", async () => {
    onWeb("granted");
    expect(await requestNotificationPermission()).toEqual({ granted: true });
  });

  it("short-circuits when already denied", async () => {
    onWeb("denied");
    expect(await requestNotificationPermission()).toEqual({
      granted: false,
      reason: "permission_denied",
    });
  });

  it("reports the blocking reason", async () => {
    onWeb("default", undefined, IPHONE_SAFARI_UA);
    expect(await requestNotificationPermission()).toEqual({
      granted: false,
      reason: "ios_requires_pwa",
    });
  });

  it.each([
    ["granted", { granted: true }],
    ["denied", { granted: false, reason: "permission_denied" }],
    ["default", { granted: false, reason: "permission_dismissed" }],
  ])("resolves a prompt answered %s", async (answer, expected) => {
    onWeb(
      "default",
      jest.fn(async () => answer),
    );
    expect(await requestNotificationPermission()).toEqual(expected);
  });

  it("uses a prompt the caller already started", async () => {
    const requestPermission = jest.fn();
    onWeb("default", requestPermission);
    expect(await requestNotificationPermission({ webPermissionRequest: "granted" })).toEqual({
      granted: true,
    });
    expect(
      await requestNotificationPermission({ webPermissionRequest: Promise.resolve("denied") }),
    ).toEqual({ granted: false, reason: "permission_denied" });
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("accepts a synchronous legacy prompt result", async () => {
    onWeb(
      "default",
      jest.fn(() => "granted"),
    );
    expect(await requestNotificationPermission()).toEqual({ granted: true });
  });

  it.each([
    ["granted", { granted: true }],
    ["denied", { granted: false, reason: "permission_denied" }],
    ["default", { granted: false, reason: "permission_dismissed" }],
  ])(
    "when the prompt throws, falls back to the current permission (%s)",
    async (after, expected) => {
      const notification = { permission: "default", requestPermission: jest.fn() };
      notification.requestPermission.mockImplementation(async () => {
        notification.permission = after;
        throw new Error("blocked");
      });
      mockNotificationsOs.current = "web";
      restores.push(setPlatform({ OS: "web" }), installBrowser({ notification }));
      expect(await requestNotificationPermission()).toEqual(expected);
    },
  );

  it("is unsupported without the Notification API", async () => {
    onWeb();
    expect(await requestNotificationPermission()).toEqual({
      granted: false,
      reason: "unsupported",
    });
  });
});

describe("requestNotificationPermission on native", () => {
  it("is unsupported in Expo Go", async () => {
    mockNotificationsPlatform.expoGo = true;
    expect(await requestNotificationPermission()).toEqual({
      granted: false,
      reason: "unsupported",
    });
  });

  it("skips the prompt when already granted", async () => {
    onNative("granted");
    expect(await requestNotificationPermission()).toEqual({ granted: true });
    expect(mockExpoNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it.each([
    ["granted", { granted: true }],
    ["denied", { granted: false, reason: "permission_denied" }],
    ["undetermined", { granted: false, reason: "permission_dismissed" }],
  ])("prompts and maps the %s answer", async (answer, expected) => {
    onNative("undetermined", answer);
    expect(await requestNotificationPermission()).toEqual(expected);
  });

  it("is unsupported when the native module fails", async () => {
    mockExpoNotifications.getPermissionsAsync.mockRejectedValue(new Error("no native module"));
    expect(await requestNotificationPermission()).toEqual({
      granted: false,
      reason: "unsupported",
    });
  });
});

describe("openNotificationSettings / canEnableLocalReminders", () => {
  const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);
  beforeEach(() => openSettings.mockClear());

  it("opens system settings on native builds", () => {
    openNotificationSettings();
    expect(openSettings).toHaveBeenCalled();
    expect(canEnableLocalReminders()).toBe(true);
  });

  it("does nothing where reminders are unsupported", () => {
    mockNotificationsPlatform.expoGo = true;
    openNotificationSettings();
    expect(openSettings).not.toHaveBeenCalled();
    expect(canEnableLocalReminders()).toBe(false);
  });
});
