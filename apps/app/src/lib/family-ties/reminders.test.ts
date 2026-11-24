import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { locationCalcExtras } from "@/lib/location";
import { buildMuhasabahReminders, muhasabahFireAt } from "@/lib/muhasabah/reminders";
import { buildReminders } from "@/lib/notifications/build-reminders";
import { reminderBudgetTier } from "@/lib/notifications/reminder-budget";
import { computePrayerTimes } from "@/lib/prayer-times";
import { buildStoredLocation } from "@/test-support/fixtures/location";

import { buildFamilyTiesReminders, digestFireAt } from "./reminders";

// Wall-clock local time (no location time zone) keeps these deterministic in any TZ.
const LOCATION = buildStoredLocation({ timeZone: undefined });
const NO_FIX = buildStoredLocation({ timeZone: undefined, source: "default" });
// Monday 23 Nov 2026, 12:00 local.
const NOW = new Date(2026, 10, 23, 12, 0);

const prefs = (notif: Partial<UserPreferences["notificationPrefs"]> = {}): UserPreferences => ({
  ...DEFAULT_USER_PREFERENCES,
  bedtime: "22:30",
  notificationPrefs: {
    ...DEFAULT_USER_PREFERENCES.notificationPrefs,
    masterEnabled: true,
    ...notif,
  },
});

const familyInput = {
  dueDates: ["2026-11-20", "2026-11-26", "2026-12-30"],
  parentNudgeDates: ["2026-11-24"],
  digestWeekday: 5,
  digestTime: "after-jumuah",
};

describe("family-ties reminders", () => {
  it("schedules one Friday digest after Jumu'ah with a count and no names", () => {
    const out = buildFamilyTiesReminders({
      location: NO_FIX,
      now: NOW,
      reminder: familyInput,
      excused: false,
      priority: 510,
    });
    const digest = out.find((r) => r.id.startsWith("familyTies:"));
    expect(digest?.id).toBe("familyTies:2026-11-27");
    expect(digest?.fireAt.getDay()).toBe(5);
    expect(digest?.body).toBe("2 relatives would love to hear from you");
    expect(digest?.route).toBe("/family-ties");
    // No location: the "after Jumu'ah" digest falls back to 14:00 local.
    expect(digest?.fireAt.getHours()).toBe(14);
  });

  it("uses Dhuhr + 90 min with a location and honours a custom time", () => {
    const friday = new Date(2026, 10, 27);
    const dhuhr = computePrayerTimes(
      { latitude: LOCATION.latitude, longitude: LOCATION.longitude },
      friday,
      LOCATION.method,
      LOCATION.madhab,
      locationCalcExtras(LOCATION),
    ).dhuhr;
    expect(digestFireAt(friday, "after-jumuah", LOCATION).getTime()).toBe(
      dhuhr.getTime() + 90 * 60_000,
    );
    const custom = digestFireAt(friday, "19:45", LOCATION);
    expect([custom.getHours(), custom.getMinutes()]).toEqual([19, 45]);
  });

  it("adds one parent nudge on the first overdue day — paused while excused", () => {
    const base = { location: LOCATION, now: NOW, reminder: familyInput, priority: 510 };
    const nudge = buildFamilyTiesReminders({ ...base, excused: false }).find((r) =>
      r.id.startsWith("familyTiesParent:"),
    );
    expect(nudge?.id).toBe("familyTiesParent:2026-11-24");
    expect(nudge?.body).toBe("A parent would love to hear from you today");
    expect(
      buildFamilyTiesReminders({ ...base, excused: true }).some((r) =>
        r.id.startsWith("familyTiesParent:"),
      ),
    ).toBe(false);
  });

  it("schedules nothing without due relatives", () => {
    expect(
      buildFamilyTiesReminders({
        location: LOCATION,
        now: NOW,
        reminder: { ...familyInput, dueDates: [], parentNudgeDates: [] },
        excused: false,
        priority: 510,
      }),
    ).toEqual([]);
  });
});

describe("muhasabah reminders", () => {
  it("fires at bedtime, skips reviewed nights, generic text only", () => {
    const out = buildMuhasabahReminders({
      location: LOCATION,
      now: NOW,
      bedtime: "22:30",
      reminder: { time: "bedtime", reviewedDates: ["2026-11-23"] },
      priority: 520,
    });
    expect(out.map((r) => r.id)).toEqual(["muhasabah:2026-11-24"]);
    expect([out[0]?.fireAt.getHours(), out[0]?.fireAt.getMinutes()]).toEqual([22, 30]);
    expect(out[0]?.body).toBe("A minute with yourself before sleep");
  });

  it("puts a past-midnight time on the next calendar day and supports Isha + 90", () => {
    const night = new Date(2026, 10, 23);
    expect(muhasabahFireAt(night, "00:30", "22:30", LOCATION).getDate()).toBe(24);
    const isha = muhasabahFireAt(night, "isha+90", "22:30", LOCATION);
    const times = computePrayerTimes(
      { latitude: LOCATION.latitude, longitude: LOCATION.longitude },
      night,
      LOCATION.method,
      LOCATION.madhab,
      locationCalcExtras(LOCATION),
    );
    expect(isha.getTime()).toBe(times.isha.getTime() + 90 * 60_000);
    // Without a location Isha can't be computed — falls back to bedtime.
    expect(muhasabahFireAt(night, "isha+90", "21:00", NO_FIX).getHours()).toBe(21);
  });
});

describe("buildReminders integration (§11 tier 5)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });
  afterEach(() => jest.useRealTimers());

  const options = {
    muhasabah: { time: "bedtime", reviewedDates: [] },
    familyTies: familyInput,
  };

  it("muhasabah is off until enabled; family ties is on unless turned off", () => {
    const ids = buildReminders(prefs(), LOCATION, NOW, options).map((r) => r.id);
    expect(ids.some((id) => id.startsWith("muhasabah:"))).toBe(false);
    expect(ids).toContain("familyTies:2026-11-27");

    const on = buildReminders(
      prefs({ muhasabah: true, familyTies: false }),
      LOCATION,
      NOW,
      options,
    );
    expect(on.some((r) => r.id.startsWith("muhasabah:"))).toBe(true);
    expect(on.some((r) => r.id.startsWith("familyTies"))).toBe(false);
  });

  it("uses tier-5 priorities", () => {
    const out = buildReminders(prefs({ muhasabah: true }), LOCATION, NOW, options).filter(
      (r) => r.id.startsWith("muhasabah:") || r.id.startsWith("familyTies"),
    );
    expect(out.length).toBeGreaterThan(0);
    for (const r of out) expect(reminderBudgetTier(r.priority)).toBe(5);
  });

  it("pauses the parent nudge during an excused period", () => {
    const out = buildReminders({ ...prefs(), activeExcusedReason: "sick" }, LOCATION, NOW, options);
    expect(out.some((r) => r.id.startsWith("familyTiesParent:"))).toBe(false);
    expect(out.some((r) => r.id.startsWith("familyTies:"))).toBe(true);
  });
});
