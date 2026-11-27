import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { addMinutes, isPastFireTime, wallClockOnDay } from "@/lib/notifications/reminder-clock";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/time";

import { dueCountOn, type FamilyTiesReminderInput } from "./model";

/**
 * Family-ties reminders (NF-3.7, §11 priority 5):
 * - one weekly digest on the chosen day (default Friday after Jumu'ah):
 *   "3 relatives would love to hear from you" — a count, never a name;
 * - one extra nudge on the first overdue day of a mother or father, with
 *   generic text. It is the only judgement-like nudge here, so an active
 *   excused period (illness / travel / hayd) pauses it.
 */
export const FAMILY_TIES_ROUTE = "/family-ties";
/** Minutes after Dhuhr on Friday for the "after Jumu'ah" digest. */
export const AFTER_JUMUAH_MINUTES = 90;
const NO_LOCATION_DIGEST = "14:00";
const PARENT_NUDGE_TIME = "18:00";
/** Parent nudges are dated triggers inside the normal 2-day scheduling window. */
const PARENT_NUDGE_DAYS = 2;

export function digestFireAt(day: Date, digestTime: string, location: StoredLocation): Date {
  if (digestTime === "after-jumuah") {
    if (location.source === "default") {
      return wallClockOnDay(day, NO_LOCATION_DIGEST, location.timeZone);
    }
    return addMinutes(computeLocationPrayerTimes(location, day).dhuhr, AFTER_JUMUAH_MINUTES);
  }
  // `digestTime` is validated as "HH:mm" by the settings model.
  return wallClockOnDay(day, digestTime, location.timeZone);
}

export function buildFamilyTiesReminders(input: {
  location: StoredLocation;
  now: Date;
  reminder: FamilyTiesReminderInput;
  /** Active excused period pauses the parent nudge (gentle-tone rule, plan §2). */
  excused: boolean;
  priority: number;
}): BuiltReminder[] {
  const { location, now, reminder } = input;
  const out: BuiltReminder[] = [];
  if (reminder.dueDates.length === 0) return out;
  const anchor = prayerDayAnchor(now, location.timeZone);

  // Weekly digest — the next digest day (today included) whose time is still ahead.
  for (let offset = 0; offset <= 7; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    if (day.getDay() !== reminder.digestWeekday) continue;
    const fireAt = digestFireAt(day, reminder.digestTime, location);
    if (isPastFireTime(fireAt, now)) continue;
    const key = getLocalDateString(day);
    const count = dueCountOn(reminder.dueDates, key);
    if (count > 0) {
      out.push({
        id: `familyTies:${key}`,
        fireAt,
        title: i18n.t("familyTies.notif.digestTitle"),
        body: i18n.t("familyTies.notif.digestBody", { count }),
        channelId: "zikr",
        repeat: "date",
        route: FAMILY_TIES_ROUTE,
        priority: input.priority,
      });
    }
    break;
  }

  // One gentle parent nudge per overdue episode (its first overdue day).
  if (!input.excused) {
    const window = new Set(
      Array.from({ length: PARENT_NUDGE_DAYS }, (_, i) =>
        getLocalDateString(shiftPrayerDay(anchor, i)),
      ),
    );
    const date = [...new Set(reminder.parentNudgeDates)].filter((d) => window.has(d)).sort()[0];
    if (date) {
      const [y, m, d] = date.split("-").map(Number);
      const fireAt = wallClockOnDay(new Date(y, m - 1, d), PARENT_NUDGE_TIME, location.timeZone);
      if (!isPastFireTime(fireAt, now)) {
        out.push({
          id: `familyTiesParent:${date}`,
          fireAt,
          title: i18n.t("familyTies.notif.parentTitle"),
          body: i18n.t("familyTies.notif.parentBody"),
          channelId: "zikr",
          repeat: "date",
          route: FAMILY_TIES_ROUTE,
          priority: input.priority,
        });
      }
    }
  }
  return out;
}
