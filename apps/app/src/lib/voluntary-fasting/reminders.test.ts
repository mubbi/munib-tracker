import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type {
  UserPreferences,
  VoluntaryFastEntry,
  VoluntaryFastingMap,
} from "@munib-tracker/shared/types";
import { addDays, getLocalDateString, weekdayOfDateKey } from "@munib-tracker/shared/utils";

import {
  hijriToGregorian,
  resetHijriAdjustmentCacheForTests,
  setHijriAdjustment,
  setHijriObserver,
} from "@/lib/hijri";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { reminderBudgetTier } from "@/lib/notifications/reminder-budget";
import { resolveVoluntaryFastingPrefs } from "@/lib/voluntary-fasting/prefs";
import { pushVoluntaryFastingReminders } from "@/lib/voluntary-fasting/reminders";

const LOCATION: StoredLocation = {
  ...DEFAULT_LOCATION,
  source: "device",
  updatedAt: "2026-07-01T00:00:00.000Z",
};

const makeFastEntry = (status: VoluntaryFastEntry["status"]): VoluntaryFastEntry => ({
  status,
  updatedAt: "2026-07-01T00:00:00.000Z",
});

const key = (y: number, m: number, d: number) => getLocalDateString(hijriToGregorian(y, m, d));
/** Morning of a local day (well before the 21:00 intent reminder). */
const morningOf = (dateKey: string) => new Date(`${dateKey}T08:00:00`);

function prefsWith(overrides: Partial<UserPreferences> = {}): UserPreferences {
  return { ...DEFAULT_USER_PREFERENCES, madhhab: "hanafi", ...overrides };
}

function build(
  prefs: UserPreferences,
  now: Date,
  entries: VoluntaryFastingMap = {},
): BuiltReminder[] {
  const reminders: BuiltReminder[] = [];
  pushVoluntaryFastingReminders(reminders, prefs, LOCATION, now, 2, {
    voluntaryFastingEntries: entries,
  });
  return reminders;
}

beforeEach(() => {
  setHijriObserver(null);
  setHijriAdjustment(null);
  resetHijriAdjustmentCacheForTests();
});

describe("pushVoluntaryFastingReminders", () => {
  const arafah = key(1448, 12, 9);

  it("schedules the intent reminder the night before Arafah (tier 3)", () => {
    const reminders = build(prefsWith(), morningOf(addDays(arafah, -1)));
    const intent = reminders.find((r) => r.id === `fastIntent:${arafah}`);
    expect(intent).toBeDefined();
    expect(intent?.route).toBe(`/fasting?date=${arafah}`);
    expect(intent?.fireAt.getHours()).toBe(21);
    expect(reminderBudgetTier(intent?.priority ?? 0)).toBe(3);
  });

  it("adds the Arafah nudge two days ahead", () => {
    const reminders = build(prefsWith(), morningOf(addDays(arafah, -2)));
    expect(reminders.some((r) => r.id === `fastSeasonal:${arafah}`)).toBe(true);
  });

  it("skips days that already have an entry", () => {
    const reminders = build(prefsWith(), morningOf(addDays(arafah, -1)), {
      [arafah]: makeFastEntry("intended"),
    });
    expect(reminders.some((r) => r.id === `fastIntent:${arafah}`)).toBe(false);
  });

  it("pauses every fasting nudge during an excused period", () => {
    for (const reason of ["hayd", "sick", "travel"] as const) {
      expect(
        build(prefsWith({ activeExcusedReason: reason }), morningOf(addDays(arafah, -1))),
      ).toEqual([]);
    }
  });

  it("respects the seasonal toggle", () => {
    const prefs = prefsWith({
      notificationPrefs: {
        ...DEFAULT_USER_PREFERENCES.notificationPrefs,
        voluntaryFasting: { weekly: false, seasonal: false },
      },
    });
    expect(build(prefs, morningOf(addDays(arafah, -1)))).toEqual([]);
  });

  it("Mondays/Thursdays follow the weekly toggle (off by default)", () => {
    // A plain Monday in Rabi al-Awwal (no seasonal kind, not a White Day).
    let monday = key(1448, 3, 1);
    while (weekdayOfDateKey(monday) !== 1) monday = addDays(monday, 1);
    const evening = morningOf(addDays(monday, -1));
    expect(build(prefsWith(), evening).some((r) => r.id === `fastIntent:${monday}`)).toBe(false);
    const weeklyOn = prefsWith({
      notificationPrefs: {
        ...DEFAULT_USER_PREFERENCES.notificationPrefs,
        voluntaryFasting: { weekly: true, seasonal: true },
      },
    });
    expect(build(weeklyOn, evening).some((r) => r.id === `fastIntent:${monday}`)).toBe(true);
  });

  it("supports an Isha-relative intent time", () => {
    const prefs = prefsWith({
      voluntaryFasting: { ...resolveVoluntaryFastingPrefs(null), intentReminderTime: "isha+30" },
    });
    const intent = build(prefs, morningOf(addDays(arafah, -1))).find(
      (r) => r.id === `fastIntent:${arafah}`,
    );
    expect(intent).toBeDefined();
    expect(intent?.fireAt.getHours()).toBeGreaterThanOrEqual(19);
  });

  it("suhoor alarm (tier 2) only on intended days, when opted in", () => {
    const day = "2026-07-08";
    const entries = { [day]: makeFastEntry("intended") };
    const off = build(prefsWith(), morningOf("2026-07-07"), entries);
    expect(off.some((r) => r.id.startsWith("suhoor:"))).toBe(false);
    const prefs = prefsWith({
      voluntaryFasting: { ...resolveVoluntaryFastingPrefs(null), suhoorAlarm: true },
    });
    const suhoor = build(prefs, morningOf("2026-07-07"), entries).find(
      (r) => r.id === `suhoor:${day}`,
    );
    expect(suhoor).toBeDefined();
    expect(reminderBudgetTier(suhoor?.priority ?? 0)).toBe(2);
    expect(suhoor?.body).not.toMatch(/hayd|qaza/i);
  });
});
