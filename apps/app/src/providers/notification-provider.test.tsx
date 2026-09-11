import { render, screen, waitFor } from "@testing-library/react-native";
import { Platform, Text } from "react-native";

const mockRescheduleAll = jest.fn().mockResolvedValue(undefined);
const mockConfigureNotifications = jest.fn().mockResolvedValue(undefined);
const mockSubscribeLiveActivityPushTokens = jest.fn(() => jest.fn());
const mockSubscribeLiveActivityLifecycle = jest.fn(() => jest.fn());

const mockPrefs = {
  isReady: true,
  hasCompletedOnboarding: false,
  notificationPrefs: { masterEnabled: true },
  prayerAlerts: {},
  prayerReminderOffsets: {},
  bedtime: "22:30",
  listeners: new Set<() => void>(),
};

jest.mock("@/notifications/scheduler", () => ({
  configureNotifications: (...args: unknown[]) => mockConfigureNotifications(...args),
  rescheduleAll: (...args: unknown[]) => mockRescheduleAll(...args),
  markFromNotification: jest.fn(),
  snoozeNotification: jest.fn(),
  MARK_ACTION_IDENTIFIER: "markcurrent",
  SNOOZE_ACTION_IDENTIFIER: "snooze",
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

jest.mock("@/lib/notifications/platform", () => ({
  isLocalNotificationSupported: () => true,
  isWeb: false,
}));

jest.mock("@/lib/live-activity", () => ({
  handleLiveActivityPushToken: jest.fn(),
  notifyLiveActivityLifecycle: jest.fn(),
  subscribeLiveActivityPushTokens: (...args: unknown[]) =>
    mockSubscribeLiveActivityPushTokens(...args),
  subscribeLiveActivityLifecycle: (...args: unknown[]) =>
    mockSubscribeLiveActivityLifecycle(...args),
}));

jest.mock("@/lib/notifications/register-push-token", () => ({
  registerExpoPushTokenWithApi: jest.fn(),
  registerWebPushSubscriptionWithApi: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getLastNotificationResponseAsync: jest.fn(async () => null),
  clearLastNotificationResponseAsync: jest.fn(async () => undefined),
}));

jest.mock("@/providers/in-app-notifications-provider", () => ({
  useInAppNotifications: () => ({ deliver: jest.fn() }),
}));

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({
      isReady: mockPrefs.isReady,
      prefs: {
        hasCompletedOnboarding: mockPrefs.hasCompletedOnboarding,
        notificationPrefs: mockPrefs.notificationPrefs,
        prayerAlerts: mockPrefs.prayerAlerts,
        prayerReminderOffsets: mockPrefs.prayerReminderOffsets,
        bedtime: mockPrefs.bedtime,
      },
    }),
    subscribe: (listener: () => void) => {
      mockPrefs.listeners.add(listener);
      return () => mockPrefs.listeners.delete(listener);
    },
  },
  usePreferencesReady: () => mockPrefs.isReady,
}));

jest.mock("@/stores/location-store", () => ({
  locationStore: {
    getState: () => ({
      location: { latitude: 24.86, longitude: 67.0, timeZone: "Asia/Karachi" },
      isReady: true,
    }),
    subscribe: () => () => undefined,
  },
}));

jest.mock("@/stores/tracker-store", () => ({
  trackerStore: {
    getState: () => ({
      isReady: true,
      qazaCounters: [],
      roza: { remaining: 0, completed: 0 },
    }),
    subscribe: () => () => undefined,
  },
}));

Platform.OS = "web";
const { NotificationProvider } =
  require("./notification-provider") as typeof import("./notification-provider");

describe("NotificationProvider", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = "ios";
    mockPrefs.isReady = true;
    mockPrefs.hasCompletedOnboarding = false;
    mockPrefs.listeners.clear();
    mockRescheduleAll.mockClear();
    mockConfigureNotifications.mockClear();
    mockSubscribeLiveActivityPushTokens.mockClear();
    mockSubscribeLiveActivityLifecycle.mockClear();
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("does not arm reminders or Live Activity until onboarding finishes", async () => {
    render(
      <NotificationProvider>
        <Text>child</Text>
      </NotificationProvider>,
    );

    expect(screen.getByText("child")).toBeTruthy();
    await waitFor(() => {
      expect(mockConfigureNotifications).toHaveBeenCalled();
    });
    expect(mockRescheduleAll).not.toHaveBeenCalled();
    expect(mockSubscribeLiveActivityPushTokens).not.toHaveBeenCalled();
    expect(mockSubscribeLiveActivityLifecycle).not.toHaveBeenCalled();
  });

  it("arms reminders and Live Activity after onboarding", async () => {
    mockPrefs.hasCompletedOnboarding = true;

    render(
      <NotificationProvider>
        <Text>child</Text>
      </NotificationProvider>,
    );

    await waitFor(() => {
      expect(mockRescheduleAll).toHaveBeenCalled();
    });
    expect(mockSubscribeLiveActivityPushTokens).toHaveBeenCalled();
    expect(mockSubscribeLiveActivityLifecycle).toHaveBeenCalled();
  });
});
