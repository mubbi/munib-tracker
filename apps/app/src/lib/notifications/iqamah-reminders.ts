import {
  clampWalkMinutes,
  IQAMAH_PRAYERS,
  type IqamahTimetable,
} from "@munib-tracker/shared/masjid";
import type { UserPreferences } from "@munib-tracker/shared/types";

import i18n from "@/i18n";
import type { StoredLocation } from "@/lib/location";
import { dateKeyOf, iqamahOn } from "@/lib/masjid/iqamah-on";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { parseHhMm, prayerDayAnchor, shiftPrayerDay, wallClockInTimeZoneToDate } from "@/lib/time";

/**
 * NF-3.11 iqamah "leave now" reminders (§11 tier 2 "iqamah"). Fire at
 * `iqamah − masjidWalkMinutes` for the home masjid, only when iqamah times exist
 * (the user's private times, or a licence-cleared public source). Off by
 * default (`notificationPrefs.iqamah`), paused by any excused period. Text is
 * generic — no masjid name, so the lock screen never reveals where the user prays.
 */

export const PRIORITY_IQAMAH = priorityForKind("iqamah", 10);
export const IQAMAH_REMINDER_ROUTE = "/masjids";

export interface IqamahReminderInput {
  /** Resolved home-masjid timetable (private > public); null/undefined ⇒ nothing scheduled. */
  iqamahTimetable?: IqamahTimetable | null;
}

export function iqamahRemindersActive(prefs: UserPreferences): boolean {
  if (prefs.notificationPrefs.iqamah !== true) return false;
  if (prefs.activeExcusedReason != null) return false;
  return !!prefs.homeMasjid;
}

export function pushIqamahReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  daysAhead: number,
  options: IqamahReminderInput,
): void {
  const timetable = options.iqamahTimetable;
  if (!timetable || !iqamahRemindersActive(prefs)) return;
  const walk = clampWalkMinutes(prefs.masjidWalkMinutes);
  const tz = location.timeZone;
  // Calendar-day steps from the location's today — adding 24 h steps would skip
  // or repeat a day around a DST change (L2).
  const anchor = prayerDayAnchor(now, tz);

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const shifted = shiftPrayerDay(anchor, offset);
    const day = {
      year: shifted.getFullYear(),
      month: shifted.getMonth() + 1,
      day: shifted.getDate(),
    };
    const dateKey = dateKeyOf(day.year, day.month, day.day);
    for (const prayer of IQAMAH_PRAYERS) {
      const at = iqamahOn(dateKey, prayer, timetable);
      if (!at) continue;
      const clock = parseHhMm(at);
      const iqamahAt = wallClockInTimeZoneToDate(
        day.year,
        day.month,
        day.day,
        clock.hour,
        clock.minute,
        tz,
      );
      const fireAt = new Date(iqamahAt.getTime() - walk * 60_000);
      if (fireAt.getTime() <= now.getTime()) continue;
      const prayerLabel = i18n.t(`prayers.${prayer}`);
      reminders.push({
        id: `iqamah:${prayer}:${dateKey}`,
        fireAt,
        title: i18n.t("masjids.reminder.title"),
        body:
          walk > 0
            ? i18n.t("masjids.reminder.body", { prayer: prayerLabel, minutes: walk })
            : i18n.t("masjids.reminder.bodyNow", { prayer: prayerLabel }),
        channelId: "prayer",
        repeat: "date",
        route: IQAMAH_REMINDER_ROUTE,
        priority: PRIORITY_IQAMAH,
      });
    }
  }
}
