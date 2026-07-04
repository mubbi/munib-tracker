import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION } from "@/lib/location";
import { buildReminders } from "@/lib/notifications/build-reminders";

// jest.mock is hoisted above the imports, so expo-notifications and the
// permission/platform helpers are mocked before scheduler.ts imports them.
jest.mock("expo-notifications", () => ({
  __esModule: true,
  SchedulableTriggerInputTypes: {
    DAILY: "daily",
    DATE: "date",
    TIME_INTERVAL: "timeInterval",
  },
  AndroidImportance: { DEFAULT: 3 },
  setNotificationHandler: jest.fn(),
  setNotificationCategoryAsync: jest.fn().mockResolvedValue(undefined),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  scheduleNotificationAsync: jest.fn().mockResolvedValue("id"),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/lib/notifications/platform", () => ({
  isLocalNotificationSupported: jest.fn(() => true),
}));

jest.mock("@/lib/notifications/permissions", () => ({
  readNotificationPermissionUiState: jest.fn().mockResolvedValue("granted"),
  requestNotificationPermission: jest.fn(),
}));

import * as Notifications from "expo-notifications";

import { readNotificationPermissionUiState } from "@/lib/notifications/permissions";
import { isLocalNotificationSupported } from "@/lib/notifications/platform";

import { rescheduleAll, snoozeNotification } from "./scheduler";

const mockCancelAll = Notifications.cancelAllScheduledNotificationsAsync as jest.MockedFunction<
  typeof Notifications.cancelAllScheduledNotificationsAsync
>;
const mockSchedule = Notifications.scheduleNotificationAsync as jest.MockedFunction<
  typeof Notifications.scheduleNotificationAsync
>;
const mockPermission = readNotificationPermissionUiState as jest.MockedFunction<
  typeof readNotificationPermissionUiState
>;
const mockSupported = isLocalNotificationSupported as jest.MockedFunction<
  typeof isLocalNotificationSupported
>;

function makePrefs(over: Partial<UserPreferences["notificationPrefs"]> = {}): UserPreferences {
  return {
    locale: "en",
    translationLocale: "en",
    timeFormat: "24",
    bedtime: "22:30",
    notificationPrefs: {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      masterEnabled: true,
      prayer: true,
      sunnahPrayer: true,
      ...over,
    },
    prayerAlerts: {},
    fontPrefs: {
      global: {},
      arabic: {},
      translation: {},
      transliteration: {},
      titles: {},
    },
    favoriteZikrIds: [],
    favoriteZikrOrder: [],
    hasCompletedOnboarding: true,
  };
}

/** Order of trigger-type resolution matters — pin the enum values from the mock. */
const TRIGGER = Notifications.SchedulableTriggerInputTypes;

beforeEach(() => {
  mockCancelAll.mockClear();
  mockCancelAll.mockResolvedValue(undefined);
  mockSchedule.mockClear();
  mockSchedule.mockResolvedValue("id");
  mockSupported.mockReturnValue(true);
  mockPermission.mockResolvedValue("granted");
});

describe("rescheduleAll", () => {
  it("cancels existing notifications then schedules one per built reminder", async () => {
    const prefs = makePrefs();
    await rescheduleAll(prefs, DEFAULT_LOCATION);

    // buildReminders with the same prefs/location is the source of truth for the count.
    const expected = buildReminders(prefs, DEFAULT_LOCATION);

    expect(mockCancelAll).toHaveBeenCalledTimes(1);
    expect(mockSchedule).toHaveBeenCalledTimes(expected.length);
    expect(expected.length).toBeGreaterThan(0);

    // Cancel must run before any schedule call.
    const cancelOrder = mockCancelAll.mock.invocationCallOrder[0];
    const firstScheduleOrder = mockSchedule.mock.invocationCallOrder[0];
    expect(cancelOrder).toBeLessThan(firstScheduleOrder);
  });

  it("cancels but schedules nothing when masterEnabled is false", async () => {
    await rescheduleAll(makePrefs({ masterEnabled: false }), DEFAULT_LOCATION);

    expect(mockCancelAll).toHaveBeenCalledTimes(1);
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it("schedules nothing when permission is denied", async () => {
    mockPermission.mockResolvedValue("denied");
    await rescheduleAll(makePrefs(), DEFAULT_LOCATION);

    expect(mockCancelAll).toHaveBeenCalledTimes(1);
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it("schedules nothing when local notifications are unsupported", async () => {
    mockSupported.mockReturnValue(false);
    await rescheduleAll(makePrefs(), DEFAULT_LOCATION);

    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it("uses a DAILY trigger for repeating reminders and a DATE trigger for one-offs", async () => {
    const prefs = makePrefs();
    await rescheduleAll(prefs, DEFAULT_LOCATION);

    const triggers = mockSchedule.mock.calls.map(
      ([arg]) => (arg as { trigger: { type: string } }).trigger,
    );
    const daily = triggers.filter((t) => t.type === TRIGGER.DAILY);
    const date = triggers.filter((t) => t.type === TRIGGER.DATE);

    // The built set contains both repeat kinds; every reminder is one or the other.
    const built = buildReminders(prefs, DEFAULT_LOCATION);
    expect(daily.length).toBe(built.filter((r) => r.repeat === "daily").length);
    expect(date.length).toBe(built.filter((r) => r.repeat === "date").length);
    expect(daily.length).toBeGreaterThan(0);
    expect(date.length).toBeGreaterThan(0);
    expect(daily.length + date.length).toBe(triggers.length);
  });

  it("gives daily triggers an hour/minute and date triggers an absolute date", async () => {
    await rescheduleAll(makePrefs(), DEFAULT_LOCATION);

    const daily = mockSchedule.mock.calls
      .map(([arg]) => (arg as { trigger: Record<string, unknown> }).trigger)
      .find((t) => t.type === TRIGGER.DAILY);
    const date = mockSchedule.mock.calls
      .map(([arg]) => (arg as { trigger: Record<string, unknown> }).trigger)
      .find((t) => t.type === TRIGGER.DATE);

    expect(typeof daily?.hour).toBe("number");
    expect(typeof daily?.minute).toBe("number");
    expect(date?.date).toBeInstanceOf(Date);
  });

  it("uses stable reminder ids as notification identifiers", async () => {
    const prefs = makePrefs();
    await rescheduleAll(prefs, DEFAULT_LOCATION);

    const built = buildReminders(prefs, DEFAULT_LOCATION);
    const identifiers = mockSchedule.mock.calls.map(
      ([arg]) => (arg as { identifier: string }).identifier,
    );

    expect(identifiers).toEqual(built.map((reminder) => reminder.id));
  });

  it("serializes overlapping reschedule passes so cancel and schedule do not interleave", async () => {
    const prefs = makePrefs();
    const ops: string[] = [];

    mockCancelAll.mockImplementation(async () => {
      ops.push("cancel:start");
      await new Promise((resolve) => setTimeout(resolve, 5));
      ops.push("cancel:end");
    });
    mockSchedule.mockImplementation(async () => {
      ops.push("schedule");
      return "id";
    });

    await Promise.all([
      rescheduleAll(prefs, DEFAULT_LOCATION),
      rescheduleAll(prefs, DEFAULT_LOCATION),
    ]);

    expect(ops.indexOf("cancel:end")).toBeLessThan(ops.indexOf("schedule"));

    let openCancels = 0;
    for (const op of ops) {
      if (op === "cancel:start") openCancels += 1;
      if (op === "cancel:end") openCancels -= 1;
      expect(openCancels).toBeGreaterThanOrEqual(0);
      expect(openCancels).toBeLessThanOrEqual(1);
    }
    expect(openCancels).toBe(0);
    expect(ops.filter((op) => op === "cancel:start").length).toBe(2);
  });
});

describe("snoozeNotification", () => {
  function response(over: Record<string, unknown> = {}) {
    return {
      actionIdentifier: "snooze",
      notification: {
        request: {
          content: {
            title: "Fajr time",
            body: "It's time to pray.",
            data: { channelId: "prayer" },
            ...over,
          },
        },
      },
    } as unknown as Parameters<typeof snoozeNotification>[0];
  }

  it("re-fires with a ~600s TIME_INTERVAL trigger", async () => {
    await snoozeNotification(response());

    expect(mockSchedule).toHaveBeenCalledTimes(1);
    const arg = mockSchedule.mock.calls[0]?.[0] as {
      trigger: { type: string; seconds: number; repeats: boolean; channelId: string };
    };
    expect(arg.trigger.type).toBe(TRIGGER.TIME_INTERVAL);
    expect(arg.trigger.seconds).toBe(600);
    expect(arg.trigger.repeats).toBe(false);
    expect(arg.trigger.channelId).toBe("prayer");
  });

  it("falls back to the prayer channel when the notification carries no channel", async () => {
    await snoozeNotification(response({ data: {} }));

    const arg = mockSchedule.mock.calls[0]?.[0] as { trigger: { channelId: string } };
    expect(arg.trigger.channelId).toBe("prayer");
  });
});
