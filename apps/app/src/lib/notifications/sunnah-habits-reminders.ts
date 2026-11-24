import type { UserPreferences } from "@munib-tracker/shared/types";

import i18n from "@/i18n";
import type { StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import {
  getZonedParts,
  parseHhMm,
  prayerDayAnchor,
  shiftPrayerDay,
  wallClockInTimeZoneToDate,
} from "@/lib/time";

/**
 * Daily Sunnah habits reminders (NF-3.5, §11 tier 5 "habits"):
 *
 * - one optional evening nudge (`notificationPrefs.habits`, default off), a
 *   DAILY repeat so it costs one OS slot; skipped when no habit is selected;
 * - bedtime habits never get their own slot — they fold into the existing
 *   before-sleep reminder text ({@link beforeSleepBodyWithHabits}).
 *
 * Habits are not worship-gated, so excused periods don't pause them (plan
 * NF-3.5 "Excused"). Copy is generic — it never lists what is left undone.
 */

export const HABITS_NUDGE_TIME = "20:30";
export const HABITS_ROUTE = "/habits";
const PRIORITY_HABITS = priorityForKind("habits", 30);

export interface SunnahHabitsReminderInput {
  sunnahHabits?: {
    selectedCount: number;
    /** Selected habits flagged `bedtime` in the catalog. */
    bedtimeHabitCount: number;
  };
}

export function pushSunnahHabitsReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  options: SunnahHabitsReminderInput,
): void {
  if (prefs.notificationPrefs.habits !== true) return;
  if (!options.sunnahHabits || options.sunnahHabits.selectedCount <= 0) return;
  const { hour, minute } = parseHhMm(HABITS_NUDGE_TIME);
  const parts = getZonedParts(now, location.timeZone);
  let fireAt = wallClockInTimeZoneToDate(
    parts.year,
    parts.month,
    parts.day,
    hour,
    minute,
    location.timeZone,
  );
  if (fireAt.getTime() <= now.getTime() - 60_000) {
    const tomorrow = shiftPrayerDay(prayerDayAnchor(now, location.timeZone), 1);
    fireAt = wallClockInTimeZoneToDate(
      tomorrow.getFullYear(),
      tomorrow.getMonth() + 1,
      tomorrow.getDate(),
      hour,
      minute,
      location.timeZone,
    );
  }
  reminders.push({
    id: "sunnahHabits",
    fireAt,
    title: i18n.t("sunnahHabits.reminder.title"),
    body: i18n.t("sunnahHabits.reminder.body"),
    channelId: "zikr",
    repeat: "daily",
    route: HABITS_ROUTE,
    priority: PRIORITY_HABITS,
  });
}

/** Before-sleep reminder body — mentions bedtime sunnahs when the user follows any (no extra slot). */
export function beforeSleepBodyWithHabits(options: SunnahHabitsReminderInput): string {
  return (options.sunnahHabits?.bedtimeHabitCount ?? 0) > 0
    ? i18n.t("sunnahHabits.reminder.beforeSleepBody")
    : i18n.t("notif.reminders.beforeSleepBody");
}
