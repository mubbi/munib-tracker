import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import { buildReminders } from "@/lib/notifications/build-reminders";
import {
  dedupeCollidingReminders,
  prayerAnchorKey,
  REMINDER_COLLISION_WINDOW_MS,
} from "@/lib/notifications/reminder-dedupe";
import { buildReminder } from "@/test-support/fixtures/notifications";
import { buildUserPreferences } from "@/test-support/fixtures/preferences";

const SET_LOCATION: StoredLocation = {
  ...DEFAULT_LOCATION,
  source: "device",
  updatedAt: "2026-07-01T00:00:00.000Z",
};

const AT = new Date("2026-07-03T18:00:00.000Z");
const plus = (ms: number) => new Date(AT.getTime() + ms);

describe("prayerAnchorKey", () => {
  it("reads every Salah-anchored id shape", () => {
    expect(prayerAnchorKey("prayer:isha:2026-07-03")).toBe("isha|2026-07-03");
    expect(prayerAnchorKey("afterAzan:isha:2026-07-03")).toBe("isha|2026-07-03");
    expect(prayerAnchorKey("iqamah:asr:2026-07-03")).toBe("asr|2026-07-03");
    expect(prayerAnchorKey("takbirTashriq:2026-07-03:dhuhr")).toBe("dhuhr|2026-07-03");
    // A Dua-window nudge, not a second Asr alert.
    expect(prayerAnchorKey("fridayAcceptance:asr:2026-07-03")).toBeNull();
    expect(prayerAnchorKey("morningZikr")).toBeNull();
  });
});

describe("dedupeCollidingReminders", () => {
  it("keeps the Salah alert when a zikr nudge lands on the same minute", () => {
    const salah = buildReminder({ id: "prayer:isha:2026-07-03", fireAt: AT, priority: 110 });
    const afterAdhan = buildReminder({
      id: "afterAzan:isha:2026-07-03",
      fireAt: plus(30_000),
      title: "After Isha Adhan",
      priority: 373,
    });
    expect(dedupeCollidingReminders([afterAdhan, salah]).map((r) => r.id)).toEqual([
      "prayer:isha:2026-07-03",
    ]);
  });

  it("keeps both when they are a minute or more apart", () => {
    const salah = buildReminder({ id: "prayer:isha:2026-07-03", fireAt: AT, priority: 110 });
    const afterAdhan = buildReminder({
      id: "afterAzan:isha:2026-07-03",
      fireAt: plus(REMINDER_COLLISION_WINDOW_MS),
      title: "After Isha Adhan",
      priority: 373,
    });
    expect(dedupeCollidingReminders([salah, afterAdhan])).toHaveLength(2);
  });

  it("keeps different Salah at the same minute (not a duplicate)", () => {
    const isha = buildReminder({ id: "prayer:isha:2026-07-03", fireAt: AT, title: "Isha" });
    const witr = buildReminder({ id: "prayer:witr:2026-07-03", fireAt: AT, title: "Witr" });
    expect(dedupeCollidingReminders([isha, witr])).toHaveLength(2);
  });

  it("drops identical text firing in the same minute", () => {
    const a = buildReminder({ id: "a", fireAt: AT });
    const b = buildReminder({ id: "b", fireAt: plus(5_000) });
    expect(dedupeCollidingReminders([a, b]).map((r) => r.id)).toEqual(["a"]);
  });
});

describe("buildReminders with every toggle on", () => {
  // 2026-07-03 is a Friday (hour of acceptance at Asr).
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-03T00:30:00.000Z"));
  });
  afterEach(() => jest.useRealTimers());

  it("never alerts twice for the same Salah within a minute", () => {
    const prefs: UserPreferences = buildUserPreferences({
      notificationPrefs: {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        masterEnabled: true,
        prayer: true,
        sunnahPrayer: true,
        beforePrayer: true,
        afterPrayer: true,
        afterAzan: true,
        morningZikr: true,
        eveningZikr: true,
        beforeSleep: true,
        qaza: true,
        dailyContent: true,
        friday: true,
        whiteDays: true,
        playAdhanOnPrayer: true,
        preferredTime: true,
        iqamah: true,
      },
      // Offsets that land the main alert exactly on a zikr nudge.
      prayerReminderOffsets: { fajr: -10, isha: 2, maghrib: 10 },
    });
    const reminders = buildReminders(prefs, SET_LOCATION, new Date(), { hasQazaDebt: true });
    expect(reminders.some((r) => r.id.startsWith("prayer:isha:"))).toBe(true);

    for (let i = 0; i < reminders.length; i += 1) {
      for (let j = i + 1; j < reminders.length; j += 1) {
        const a = reminders[i];
        const b = reminders[j];
        if (!a || !b) continue;
        const close =
          Math.abs(a.fireAt.getTime() - b.fireAt.getTime()) < REMINDER_COLLISION_WINDOW_MS;
        if (!close) continue;
        const key = prayerAnchorKey(a.id);
        expect({
          pair: [a.id, b.id],
          samePrayer: key != null && key === prayerAnchorKey(b.id),
        }).toEqual({ pair: [a.id, b.id], samePrayer: false });
        expect(a.title === b.title && a.body === b.body).toBe(false);
      }
    }
    // The colliding nudges gave way to the Salah alert.
    const ishaDay = reminders.find((r) => r.id.startsWith("prayer:isha:"))?.id.split(":")[2];
    expect(reminders.some((r) => r.id === `afterAzan:isha:${ishaDay}`)).toBe(false);
    expect(reminders.some((r) => r.id === `prayer:isha:${ishaDay}`)).toBe(true);
  });
});
