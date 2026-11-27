import type { UserPreferences } from "@munib-tracker/shared/types";
import { getLocalDateString, normalizeCoachWeekday } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { digestFireAt } from "@/lib/family-ties/reminders";
import type { StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { isPastFireTime } from "@/lib/notifications/reminder-clock";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/time";

import { COACH_ROUTE } from "./constants";

/**
 * Weekly coach reminder (NF-3.14, §11 tier 5 "coach"): one dated notification
 * on the coach day — after Jumu'ah (Dhuhr + 90 min) by default, 14:00 without
 * a location. Generic text only ("Your weekly reflection is ready"): nothing
 * about salah counts, journals or relatives ever reaches the lock screen.
 * Paused during an excused period; skipped when nothing was tracked recently.
 */
export const COACH_REMINDER_PRIORITY = priorityForKind("coach", 40);

export interface CoachReminderInput {
  /** Set when something was tracked in the last two weeks (no nagging empty weeks). */
  coach?: { hasRecentActivity: boolean };
}

export function pushCoachReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  options: CoachReminderInput,
): void {
  if (prefs.notificationPrefs.coach === false) return;
  if (prefs.activeExcusedReason != null) return;
  if (!options.coach?.hasRecentActivity) return;
  const weekday = normalizeCoachWeekday(prefs.coachWeekday);
  const anchor = prayerDayAnchor(now, location.timeZone);
  for (let offset = 0; offset <= 7; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    if (day.getDay() !== weekday) continue;
    const fireAt = digestFireAt(day, "after-jumuah", location);
    if (isPastFireTime(fireAt, now)) continue;
    reminders.push({
      id: `coach:${getLocalDateString(day)}`,
      fireAt,
      title: i18n.t("coach.notif.title"),
      body: i18n.t("coach.notif.body"),
      channelId: "zikr",
      repeat: "date",
      route: COACH_ROUTE,
      priority: COACH_REMINDER_PRIORITY,
    });
    return;
  }
}
