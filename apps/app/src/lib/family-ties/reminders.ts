import i18n from "@/i18n";
import { locationCalcExtras, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { computePrayerTimes } from "@/lib/prayer-times";
import { parseHhMm, prayerDayAnchor, shiftPrayerDay, wallClockInTimeZoneToDate } from "@/lib/time";

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

function dayKeyOf(day: Date): string {
  return `${day.getFullYear()}-${`${day.getMonth() + 1}`.padStart(2, "0")}-${`${day.getDate()}`.padStart(2, "0")}`;
}

function atClock(day: Date, clock: string, timeZone?: string): Date {
  const { hour, minute } = parseHhMm(clock, { hour: 14, minute: 0 });
  return wallClockInTimeZoneToDate(
    day.getFullYear(),
    day.getMonth() + 1,
    day.getDate(),
    hour,
    minute,
    timeZone,
  );
}

export function digestFireAt(day: Date, digestTime: string, location: StoredLocation): Date {
  if (digestTime === "after-jumuah") {
    if (location.source === "default") return atClock(day, NO_LOCATION_DIGEST, location.timeZone);
    const times = computePrayerTimes(
      { latitude: location.latitude, longitude: location.longitude },
      day,
      location.method,
      location.madhab,
      locationCalcExtras(location),
    );
    return new Date(times.dhuhr.getTime() + AFTER_JUMUAH_MINUTES * 60_000);
  }
  return atClock(day, digestTime, location.timeZone);
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
  const past = (at: Date) => at.getTime() <= now.getTime() - 60_000;

  // Weekly digest — the next digest day (today included) whose time is still ahead.
  for (let offset = 0; offset <= 7; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    if (day.getDay() !== reminder.digestWeekday) continue;
    const fireAt = digestFireAt(day, reminder.digestTime, location);
    if (past(fireAt)) continue;
    const key = dayKeyOf(day);
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
      Array.from({ length: PARENT_NUDGE_DAYS }, (_, i) => dayKeyOf(shiftPrayerDay(anchor, i))),
    );
    const date = [...new Set(reminder.parentNudgeDates)].filter((d) => window.has(d)).sort()[0];
    if (date) {
      const [y, m, d] = date.split("-").map(Number);
      const fireAt = atClock(new Date(y, m - 1, d), PARENT_NUDGE_TIME, location.timeZone);
      if (!past(fireAt)) {
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
