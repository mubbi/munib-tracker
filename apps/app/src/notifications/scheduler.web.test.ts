import { handleExternalCommand } from "@/lib/external-commands";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import * as buildRemindersModule from "@/lib/notifications/build-reminders";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { getWebNotificationBlockingReason } from "@/lib/notifications/web-environment";
import {
  armWebReminderTimer,
  cancelWebReminderTimers,
  scheduleWebReminderTimers,
} from "@/lib/notifications/web-reminder-scheduler";
import { captureAppException } from "@/lib/sentry";
import {
  buildNotificationPreferences,
  buildUserPreferences,
} from "@/test-support/fixtures/preferences";

import {
  cancelAll,
  configureNotifications,
  getPermissionStatus,
  listScheduled,
  markFromNotification,
  requestPermission,
  rescheduleAll,
  snoozeNotification,
} from "./scheduler.web";

jest.mock("@/lib/notifications/web-reminder-scheduler", () => ({
  armWebReminderTimer: jest.fn(),
  cancelWebReminderTimers: jest.fn(),
  scheduleWebReminderTimers: jest.fn(),
}));
jest.mock("@/lib/notifications/web-environment", () => ({
  getWebNotificationBlockingReason: jest.fn(() => null),
}));
jest.mock("@/lib/notifications/permissions", () => ({
  readNotificationPermissionUiState: jest.fn(async () => "granted"),
  requestNotificationPermission: jest.fn(),
}));
jest.mock("@/lib/external-commands", () => ({ handleExternalCommand: jest.fn(async () => {}) }));
jest.mock("@/lib/quran-companion/reminder-options", () => ({
  quranRevisionReminderOptions: jest.fn(async () => ({ revisionReminderEnabled: false })),
}));
jest.mock("@/lib/sentry", () => ({ captureAppException: jest.fn() }));
jest.mock("@/stores/tracker-store", () => ({
  trackerStore: { getState: () => ({ qazaCounters: [], roza: { remaining: 0, completed: 0 } }) },
}));

const LOCATION: StoredLocation = { ...DEFAULT_LOCATION, source: "device", updatedAt: "2026-07-01" };
const prefs = (masterEnabled = true) =>
  buildUserPreferences({ notificationPrefs: buildNotificationPreferences({ masterEnabled }) });

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("permissions", () => {
  it("configureNotifications is a no-op on web", async () => {
    await expect(configureNotifications()).resolves.toBeUndefined();
  });

  it("reports denied while the browser blocks notifications", async () => {
    (getWebNotificationBlockingReason as jest.Mock).mockReturnValueOnce("insecure-context");
    await expect(getPermissionStatus()).resolves.toBe("denied");
    expect(readNotificationPermissionUiState).not.toHaveBeenCalled();
  });

  it("otherwise reports the browser permission", async () => {
    await expect(getPermissionStatus()).resolves.toBe("granted");
  });

  it("requestPermission is the shared permission request", () => {
    expect(requestPermission).toBe(requestNotificationPermission);
  });
});

describe("rescheduleAll", () => {
  it("cancels timers but keeps snoozes when reminders are off", async () => {
    await rescheduleAll(prefs(false));
    expect(cancelWebReminderTimers).toHaveBeenCalledWith({ preserveSnoozes: true });
    expect(scheduleWebReminderTimers).not.toHaveBeenCalled();
  });

  it("arms a timer per built reminder", async () => {
    await rescheduleAll(prefs(), LOCATION);
    const [reminders] = (scheduleWebReminderTimers as jest.Mock).mock.calls[0];
    expect(reminders.length).toBeGreaterThan(0);
  });

  it("reports instead of throwing when building reminders fails", async () => {
    jest.spyOn(buildRemindersModule, "buildReminders").mockImplementation(() => {
      throw new Error("crescent math");
    });
    await expect(rescheduleAll(prefs())).resolves.toBeUndefined();
    expect(captureAppException).toHaveBeenCalledWith(expect.any(Error), {
      tags: { area: "notifications", phase: "reschedule" },
    });
  });

  it("cancelAll clears every web timer", async () => {
    await cancelAll();
    expect(cancelWebReminderTimers).toHaveBeenCalledWith();
  });
});

describe("snoozeNotification", () => {
  const armed = () => (armWebReminderTimer as jest.Mock).mock.calls[0]?.[0];

  it("re-arms a fard reminder ten minutes out with its prayer metadata", async () => {
    const before = Date.now();
    await snoozeNotification({
      notification: {
        request: {
          content: {
            title: "Asr",
            body: "Time for Asr",
            data: {
              prayerId: "asr",
              prayerDate: "2026-07-03",
              channelId: "prayerAdhan",
              reminderId: "prayer:asr",
              route: "/home",
            },
          },
        },
      },
    });
    expect(armed()).toMatchObject({
      title: "Asr",
      body: "Time for Asr",
      channelId: "prayerAdhan",
      route: "/home",
      prayerId: "asr",
      prayerDateKey: "2026-07-03",
    });
    expect(armed().id).toMatch(/^snooze:prayer:asr:/);
    expect(armed().fireAt.getTime()).toBeGreaterThanOrEqual(before + 10 * 60_000);
  });

  it("uses defaults and no prayer metadata for an empty response", async () => {
    await snoozeNotification({});
    expect(armed()).toMatchObject({
      title: "Reminder",
      body: "",
      channelId: "prayer",
      route: "/tracker",
    });
    expect(armed().id).toMatch(/^snooze:prayer:/);
    expect(armed()).not.toHaveProperty("prayerId");
  });

  it("keys a sunnah snooze by prayer id without fard metadata", async () => {
    await snoozeNotification({
      notification: { request: { content: { data: { prayerId: "witr" } } } },
    });
    expect(armed().id).toMatch(/^snooze:witr:/);
    expect(armed()).not.toHaveProperty("prayerId");
  });
});

describe("markFromNotification", () => {
  it("marks the named fard prayer for its date", async () => {
    await markFromNotification({
      notification: {
        request: { content: { data: { prayerId: "isha", prayerDate: "2026-07-03" } } },
      },
    });
    expect(handleExternalCommand).toHaveBeenCalledWith({
      type: "mark-prayer",
      prayerId: "isha",
      date: "2026-07-03",
      source: "notification",
    });
  });

  it.each([
    ["no data", {}],
    [
      "a sunnah prayer",
      { notification: { request: { content: { data: { prayerId: "witr", prayerDate: "d" } } } } },
    ],
  ])("marks the current obligatory prayer for %s", async (_label, response) => {
    await markFromNotification(response);
    expect(handleExternalCommand).toHaveBeenCalledWith({
      type: "mark-current-obligatory",
      source: "notification",
    });
  });
});

describe("listScheduled", () => {
  it("is empty when reminders are off", async () => {
    await expect(listScheduled(prefs(false))).resolves.toEqual([]);
  });

  it("summarises the built reminders", async () => {
    const rows = await listScheduled(prefs(), LOCATION);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toMatchObject({ id: expect.any(String), fireAt: expect.any(String) });
  });

  it("reports and returns nothing when building fails", async () => {
    jest.spyOn(buildRemindersModule, "buildReminders").mockImplementation(() => {
      throw new Error("boom");
    });
    await expect(listScheduled(prefs())).resolves.toEqual([]);
    expect(captureAppException).toHaveBeenCalledWith(expect.any(Error), {
      tags: { area: "notifications", phase: "list" },
    });
  });
});
