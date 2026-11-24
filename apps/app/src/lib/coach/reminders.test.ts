import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { digestFireAt } from "@/lib/family-ties/reminders";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { buildReminders } from "@/lib/notifications/build-reminders";
import { reminderBudgetTier } from "@/lib/notifications/reminder-budget";
import { buildStoredLocation } from "@/test-support/fixtures/location";

import { COACH_REMINDER_PRIORITY, pushCoachReminders } from "./reminders";

// Wall-clock local time keeps these deterministic in any TZ.
const LOCATION = buildStoredLocation({ timeZone: undefined });
const NO_FIX = buildStoredLocation({ timeZone: undefined, source: "default" });
// Monday 23 Nov 2026, 12:00 local.
const NOW = new Date(2026, 10, 23, 12, 0);
const ACTIVE = { coach: { hasRecentActivity: true } };

const prefs = (overrides: Partial<UserPreferences> = {}): UserPreferences => ({
  ...DEFAULT_USER_PREFERENCES,
  notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, masterEnabled: true },
  ...overrides,
});

function build(p: UserPreferences, options = ACTIVE, location = NO_FIX): BuiltReminder[] {
  const out: BuiltReminder[] = [];
  pushCoachReminders(out, p, location, NOW, options);
  return out;
}

describe("weekly coach reminder (NF-3.14)", () => {
  it("fires once on Friday after Jumu'ah with generic text only (§11 tier 5)", () => {
    const [reminder, ...rest] = build(prefs());
    expect(rest).toHaveLength(0);
    expect(reminder).toMatchObject({
      id: "coach:2026-11-27",
      title: "Weekly reflection",
      body: "Your weekly reflection is ready",
      route: "/coach",
      repeat: "date",
      priority: COACH_REMINDER_PRIORITY,
    });
    expect(reminderBudgetTier(COACH_REMINDER_PRIORITY)).toBe(5);
    // No location: the "after Jumu'ah" slot falls back to 14:00.
    expect(reminder?.fireAt.getHours()).toBe(14);
  });

  it("uses Dhuhr + 90 min with a location, and the chosen weekday", () => {
    const [friday] = build(prefs(), ACTIVE, LOCATION);
    expect(friday?.fireAt.getTime()).toBe(
      digestFireAt(new Date(2026, 10, 27), "after-jumuah", LOCATION).getTime(),
    );
    const [wednesday] = build(prefs({ coachWeekday: 3 }));
    expect(wednesday?.id).toBe("coach:2026-11-25");
  });

  it("is skipped when turned off, while excused, or with nothing tracked recently", () => {
    const off = prefs({
      notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, coach: false },
    });
    expect(build(off)).toEqual([]);
    expect(build(prefs({ activeExcusedReason: "hayd" }))).toEqual([]);
    expect(build(prefs(), { coach: { hasRecentActivity: false } })).toEqual([]);
    expect(build(prefs(), {})).toEqual([]);
  });

  it("is part of buildReminders", () => {
    const all = buildReminders(prefs(), NO_FIX, NOW, ACTIVE);
    expect(all.some((reminder) => reminder.id === "coach:2026-11-27")).toBe(true);
  });
});
