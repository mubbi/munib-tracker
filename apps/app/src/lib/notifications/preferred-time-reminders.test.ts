import { MADHHAB_RULES } from "@munib-tracker/shared/fiqh/core";
import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";
import { type BuiltReminder, buildReminders } from "@/lib/notifications/build-reminders";
import {
  PREFERRED_TIME_DEDUP_MINUTES,
  PREFERRED_TIME_PRIORITY,
  PREFERRED_TIME_ROUTE,
  preferredTimeFireAt,
  preferredTimeRemindersActive,
  pushPreferredTimeReminders,
} from "@/lib/notifications/preferred-time-reminders";
import { budgetPriority, reminderBudgetTier } from "@/lib/notifications/reminder-budget";
import { computePrayerTimes } from "@/lib/prayer-times";
import { preferredWindowFor } from "@/lib/salah-phase/preferred-window";
import { getSetting, isSettingVisible } from "@/lib/settings/registry";
import { getSettingsSnapshot } from "@/lib/settings/snapshot";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import {
  buildNotificationPreferences,
  buildUserPreferences,
} from "@/test-support/fixtures/preferences";

// No `timeZone` ⇒ the prayer day is the device-local day of NOW (00:05, before Fajr).
const LOCATION = buildStoredLocation();
const NOW = new Date(2026, 10, 24, 0, 5);
const DAY_KEY = "2026-11-24";

function prefs(
  notif: Partial<NotificationPreferences> = { preferredTime: true },
  extra: Partial<UserPreferences> = {},
): UserPreferences {
  return buildUserPreferences({
    madhhab: "hanafi",
    notificationPrefs: buildNotificationPreferences(notif),
    ...extra,
  });
}

function run(p: UserPreferences, existing: BuiltReminder[] = [], days = 1): BuiltReminder[] {
  const out = [...existing];
  pushPreferredTimeReminders(out, p, LOCATION, NOW, days);
  return out.filter((r) => r.id.startsWith("preferredTime:"));
}

function todayTimes() {
  const coords = { latitude: LOCATION.latitude, longitude: LOCATION.longitude };
  const today = computePrayerTimes(coords, NOW, LOCATION.method, LOCATION.madhab);
  const tomorrow = computePrayerTimes(
    coords,
    new Date(2026, 10, 25, 0, 5),
    LOCATION.method,
    LOCATION.madhab,
  );
  return {
    fajr: today.fajr,
    sunrise: today.sunrise,
    asr: today.asr,
    maghrib: today.maghrib,
    isha: today.isha,
    nextFajr: tomorrow.fajr,
  };
}

describe("preferred-time reminders (D40)", () => {
  it("is off by default", () => {
    const p = buildUserPreferences({ madhhab: "hanafi" });
    expect(p.notificationPrefs.preferredTime).toBe(false);
    expect(preferredTimeRemindersActive(p)).toBe(false);
    expect(run(p)).toEqual([]);
  });

  it("Hanafi: one generic reminder at the start of each preferred band (Fajr isfar, Asr, Isha)", () => {
    const reminders = run(prefs());
    expect(reminders.map((r) => r.id)).toEqual([
      `preferredTime:fajr:${DAY_KEY}`,
      `preferredTime:asr:${DAY_KEY}`,
      `preferredTime:isha:${DAY_KEY}`,
    ]);
    const times = todayTimes();
    for (const reminder of reminders) {
      const prayer = reminder.id.split(":")[1] as "fajr" | "asr" | "isha";
      const window = preferredWindowFor(prayer, times, MADHHAB_RULES.hanafi);
      expect(window?.kind).toBe("band");
      expect(reminder.fireAt).toEqual(window && window.kind === "band" ? window.start : null);
      expect(reminder.fireAt.getTime()).toBeGreaterThan(times[prayer].getTime());
      expect(reminder).toMatchObject({
        repeat: "date",
        channelId: "prayer",
        route: PREFERRED_TIME_ROUTE,
        priority: PREFERRED_TIME_PRIORITY,
      });
      // Generic: names the Salah, never the school.
      expect(`${reminder.title} ${reminder.body}`).not.toMatch(/hanafi/i);
    }
  });

  it("schedules nothing where the preferred time is the start (Shafi'i, Maliki); Hanbali only Isha", () => {
    expect(run(prefs(undefined, { madhhab: "shafii" }))).toEqual([]);
    expect(run(prefs(undefined, { madhhab: "maliki" }))).toEqual([]);
    expect(run(prefs(undefined, { madhhab: "hanbali" })).map((r) => r.id)).toEqual([
      `preferredTime:isha:${DAY_KEY}`,
    ]);
    const times = todayTimes();
    expect(preferredTimeFireAt("fajr", times, MADHHAB_RULES.shafii)).toBeNull();
    expect(preferredTimeFireAt("asr", times, null)).toBeNull();
  });

  it("is never scheduled in all-views mode or before a school is chosen", () => {
    for (const madhhab of [null, undefined]) {
      const p = prefs(undefined, { madhhab });
      expect(preferredTimeRemindersActive(p)).toBe(false);
      expect(run(p)).toEqual([]);
    }
  });

  it("follows the salah domain override (school for salah differs from the global one)", () => {
    const p = prefs(undefined, { madhhab: "shafii", madhhabOverrides: { salah: "hanafi" } });
    expect(run(p)).toHaveLength(3);
  });

  it("pauses during an excused period and respects master / per-prayer alerts", () => {
    expect(run(prefs(undefined, { activeExcusedReason: "hayd" }))).toEqual([]);
    expect(run(prefs({ preferredTime: true, masterEnabled: false }))).toEqual([]);
    const noFajr = run(prefs(undefined, { prayerAlerts: { fajr: false } }));
    expect(noFajr.map((r) => r.id)).toEqual([
      `preferredTime:asr:${DAY_KEY}`,
      `preferredTime:isha:${DAY_KEY}`,
    ]);
  });

  it("never duplicates a reminder the user already gets for that prayer within the window", () => {
    const [asr] = run(prefs()).filter((r) => r.id.includes(":asr:"));
    expect(asr).toBeDefined();
    const near = (id: string, minutes: number): BuiltReminder => ({
      id,
      fireAt: new Date((asr?.fireAt.getTime() ?? 0) + minutes * 60_000),
      title: "t",
      body: "b",
      channelId: "prayer",
      repeat: "date",
      route: "/tracker",
      priority: 110,
    });
    const within = PREFERRED_TIME_DEDUP_MINUTES - 1;
    // The user's shifted Asr reminder (offset) lands close to the band start ⇒ skipped.
    expect(run(prefs(), [near(`prayer:asr:${DAY_KEY}`, within)]).map((r) => r.id)).not.toContain(
      `preferredTime:asr:${DAY_KEY}`,
    );
    // Iqamah counts too; other prayers or far-away reminders don't.
    expect(run(prefs(), [near(`iqamah:asr:${DAY_KEY}`, -within)])).toHaveLength(2);
    expect(run(prefs(), [near(`prayer:dhuhr:${DAY_KEY}`, 0)])).toHaveLength(3);
    expect(
      run(prefs(), [near(`prayer:asr:${DAY_KEY}`, PREFERRED_TIME_DEDUP_MINUTES + 1)]),
    ).toHaveLength(3);
  });

  it("sits in §11 tier 2, after iqamah and before any tier-3 nudge", () => {
    expect(reminderBudgetTier(PREFERRED_TIME_PRIORITY)).toBe(2);
    expect(PREFERRED_TIME_PRIORITY).toBeLessThan(budgetPriority(3, 0));
  });

  it("is wired into buildReminders (and skipped without a real location)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    try {
      const built = buildReminders(prefs(), LOCATION, NOW);
      expect(built.some((r) => r.id === `preferredTime:fajr:${DAY_KEY}`)).toBe(true);
      const fallback = buildReminders(prefs(), { ...LOCATION, source: "default" }, NOW);
      expect(fallback.some((r) => r.id.startsWith("preferredTime:"))).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it("registers an off-by-default toggle that is hidden in all-views mode", () => {
    const def = getSetting("notifications.salah.preferredTime");
    expect(def).toMatchObject({ group: "notifications", defaultValue: false });
    expect(def?.fields).toEqual(["prefs.notificationPrefs.preferredTime"]);
    expect(def?.sideEffects).toContain("reschedule-reminders");
    const base = getSettingsSnapshot();
    const visible = (p: UserPreferences) =>
      def != null && isSettingVisible(def, { ...base, prefs: p });
    expect(visible(prefs())).toBe(true);
    expect(visible(prefs(undefined, { madhhab: null }))).toBe(false);
    expect(visible(prefs(undefined, { madhhab: undefined }))).toBe(false);
  });
});
