import type { IqamahTimetable } from "@munib-tracker/shared/masjid";

import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import {
  IQAMAH_REMINDER_ROUTE,
  iqamahRemindersActive,
  pushIqamahReminders,
} from "@/lib/notifications/iqamah-reminders";
import { reminderBudgetTier } from "@/lib/notifications/reminder-budget";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import {
  buildNotificationPreferences,
  buildUserPreferences,
} from "@/test-support/fixtures/preferences";

const HOME = { osmType: "node" as const, osmId: "1", name: "East Masjid", lat: 51.5, lon: -0.12 };
const TIMETABLE: IqamahTimetable = {
  daily: { fajr: "06:00", dhuhr: "13:30", isha: "20:00" },
  jumuah: [{ iqamahAt: "13:15" }],
  source: { id: "private" },
};
// Wednesday 2026-11-25, 00:30 UTC — UTC location so wall clock = UTC.
const NOW = new Date("2026-11-25T00:30:00Z");
const LOCATION = buildStoredLocation({ timeZone: "UTC", source: "manual" });

function prefs(overrides: Record<string, unknown> = {}, notif: Record<string, unknown> = {}) {
  return buildUserPreferences({
    homeMasjid: HOME,
    notificationPrefs: buildNotificationPreferences({ iqamah: true, ...notif }),
    ...overrides,
  });
}

function run(p = prefs(), timetable: IqamahTimetable | null = TIMETABLE, now = NOW, days = 2) {
  const out: BuiltReminder[] = [];
  pushIqamahReminders(out, p, LOCATION, now, days, { iqamahTimetable: timetable });
  return out;
}

describe("iqamah reminders (NF-3.11, §11 tier 2)", () => {
  it("is off by default and needs a home masjid", () => {
    expect(iqamahRemindersActive(buildUserPreferences({ homeMasjid: HOME }))).toBe(false);
    expect(iqamahRemindersActive(prefs({ homeMasjid: null }))).toBe(false);
    expect(iqamahRemindersActive(prefs())).toBe(true);
  });

  it("schedules nothing without iqamah times (falls back to adhan reminders)", () => {
    expect(run(prefs(), null)).toEqual([]);
  });

  it("fires at iqamah − walk minutes with generic text", () => {
    const out = run(prefs({ masjidWalkMinutes: 15 }), TIMETABLE, NOW, 1);
    const fajr = out.find((r) => r.id === "iqamah:fajr:2026-11-25");
    expect(fajr?.fireAt.toISOString()).toBe("2026-11-25T05:45:00.000Z");
    expect(fajr?.route).toBe(IQAMAH_REMINDER_ROUTE);
    expect(fajr?.title).not.toContain("East Masjid");
    expect(fajr?.body).not.toContain("East Masjid");
    expect(reminderBudgetTier(fajr?.priority ?? 0)).toBe(2);
    // Asr/Maghrib have no times → nothing scheduled for them.
    expect(out.map((r) => r.id.split(":")[1])).toEqual(["fajr", "dhuhr", "isha"]);
  });

  it("steps calendar days across a DST change — no skipped day, no duplicate ids (L2)", () => {
    // 1 Nov 2026, 00:30 EDT: the clocks go back that night, so +24 h lands on
    // 23:30 the same day.
    const out: BuiltReminder[] = [];
    pushIqamahReminders(
      out,
      prefs(),
      buildStoredLocation({ timeZone: "America/New_York", source: "manual" }),
      new Date("2026-11-01T04:30:00Z"),
      2,
      { iqamahTimetable: TIMETABLE },
    );
    const ids = out.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("iqamah:isha:2026-11-01");
    expect(ids).toContain("iqamah:isha:2026-11-02");
    // 20:00 EST on 2 Nov − 10 min.
    expect(out.find((r) => r.id === "iqamah:isha:2026-11-02")?.fireAt.toISOString()).toBe(
      "2026-11-03T00:50:00.000Z",
    );
  });

  it("defaults to a 10-minute lead", () => {
    const isha = run().find((r) => r.id === "iqamah:isha:2026-11-25");
    expect(isha?.fireAt.toISOString()).toBe("2026-11-25T19:50:00.000Z");
  });

  it("uses the Jumu'ah iqamah for Dhuhr on Fridays, never the weekday time", () => {
    const friday = new Date("2026-11-27T00:30:00Z");
    const out = run(prefs(), TIMETABLE, friday, 1);
    expect(out.find((r) => r.id.startsWith("iqamah:dhuhr"))?.fireAt.toISOString()).toBe(
      "2026-11-27T13:05:00.000Z",
    );
    const noJumuah = run(prefs(), { ...TIMETABLE, jumuah: undefined }, friday, 1);
    expect(noJumuah.find((r) => r.id.startsWith("iqamah:dhuhr"))).toBeUndefined();
  });

  it("is paused during excused periods", () => {
    expect(run(prefs({ activeExcusedReason: "hayd" }))).toEqual([]);
    expect(run(prefs({ activeExcusedReason: "travel" }))).toEqual([]);
  });

  it("covers the scheduling window and skips past times", () => {
    const afternoon = new Date("2026-11-25T14:00:00Z");
    const ids = run(prefs(), TIMETABLE, afternoon, 2).map((r) => r.id);
    expect(ids).not.toContain("iqamah:fajr:2026-11-25");
    expect(ids).toContain("iqamah:isha:2026-11-25");
    expect(ids).toContain("iqamah:fajr:2026-11-26");
  });
});
