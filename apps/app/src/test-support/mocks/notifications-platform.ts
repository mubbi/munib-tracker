/**
 * `@/lib/notifications/platform` mock with a switchable Expo Go flag:
 *
 *   jest.mock("@/lib/notifications/platform", () => require("@/test-support/mocks/notifications-platform").notificationsPlatformMock);
 *   import { mockNotificationsPlatform, resetNotificationsPlatformMock } from "@/test-support/mocks/notifications-platform";
 *   beforeEach(resetNotificationsPlatformMock);
 *   mockNotificationsPlatform.expoGo = true;
 *
 * The OS constants mirror an iOS phone build (the jest-expo default).
 */

export const mockNotificationsPlatform = { expoGo: false };

export function resetNotificationsPlatformMock(): void {
  mockNotificationsPlatform.expoGo = false;
}

export const notificationsPlatformMock = {
  __esModule: true,
  isExpoGo: () => mockNotificationsPlatform.expoGo,
  isWeb: false,
  isIOS: true,
  isAndroid: false,
  isNative: true,
  isLocalNotificationSupported: () => !mockNotificationsPlatform.expoGo,
};

/**
 * Variant whose OS flags follow `mockNotificationsOs.current` (read live through
 * getters, so one test file can cover web and native branches):
 *
 *   jest.mock("@/lib/notifications/platform", () => require("@/test-support/mocks/notifications-platform").switchableNotificationsPlatformMock);
 *   mockNotificationsOs.current = "web";
 *
 * `isLocalNotificationSupported()` is true on native unless `expoGo` / `tv` is set.
 */
export const mockNotificationsOs: { current: "ios" | "android" | "web"; tv: boolean } = {
  current: "ios",
  tv: false,
};

export function resetSwitchableNotificationsPlatformMock(): void {
  resetNotificationsPlatformMock();
  mockNotificationsOs.current = "ios";
  mockNotificationsOs.tv = false;
}

export const switchableNotificationsPlatformMock = {
  __esModule: true,
  isExpoGo: () => mockNotificationsPlatform.expoGo,
  get isWeb() {
    return mockNotificationsOs.current === "web";
  },
  get isIOS() {
    return mockNotificationsOs.current === "ios";
  },
  get isAndroid() {
    return mockNotificationsOs.current === "android";
  },
  get isNative() {
    return mockNotificationsOs.current !== "web";
  },
  isLocalNotificationSupported: () =>
    mockNotificationsOs.current !== "web" &&
    !mockNotificationsPlatform.expoGo &&
    !mockNotificationsOs.tv,
};
