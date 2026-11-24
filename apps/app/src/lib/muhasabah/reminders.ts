import type { MuhasabahReminderTime } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { addMinutes, isPastFireTime } from "@/lib/notifications/reminder-clock";
import {
  getZonedParts,
  parseHhMm,
  prayerDayAnchor,
  shiftPrayerDay,
  wallClockInTimeZoneToDate,
} from "@/lib/time";

import { MUHASABAH_DAY_ROLLOVER_HOUR } from "./model";

/**
 * Nightly muhasabah reminder (NF-3.6, §11 priority 5). One per night at the
 * chosen time, generic text only ("A minute with yourself before sleep") — it
 * never mentions prompts, answers or anything from the vault. A night that is
 * already reviewed is skipped. Excused periods don't silence it: the review
 * still runs then (plan §6); only its Salah screen changes copy.
 */
export const MUHASABAH_ROUTE = "/muhasabah";
export const ISHA_PLUS_MINUTES = 90;
const DAYS = 2;

export interface MuhasabahReminderInput {
  time: MuhasabahReminderTime;
  /** Review days (YYYY-MM-DD) already completed — those nights are skipped. */
  reviewedDates: string[];
}

/** Fire instant for the review night `day` (an evening; times before 04:00 fall after midnight). */
export function muhasabahFireAt(
  day: Date,
  time: MuhasabahReminderTime,
  bedtime: string | undefined,
  location: StoredLocation,
): Date {
  if (time === "isha+90" && location.source !== "default") {
    return addMinutes(computeLocationPrayerTimes(location, day).isha, ISHA_PLUS_MINUTES);
  }
  const clock = time === "bedtime" || time === "isha+90" ? (bedtime ?? "22:30") : time;
  const { hour, minute } = parseHhMm(clock, { hour: 22, minute: 30 });
  const target = hour < MUHASABAH_DAY_ROLLOVER_HOUR ? shiftPrayerDay(day, 1) : day;
  return wallClockInTimeZoneToDate(
    target.getFullYear(),
    target.getMonth() + 1,
    target.getDate(),
    hour,
    minute,
    location.timeZone,
  );
}

export function buildMuhasabahReminders(input: {
  location: StoredLocation;
  now: Date;
  bedtime: string | undefined;
  reminder: MuhasabahReminderInput;
  priority: number;
}): BuiltReminder[] {
  const { location, now, reminder } = input;
  const reviewed = new Set(reminder.reviewedDates);
  // Before the rollover hour "tonight" is still yesterday's review night.
  let anchor = prayerDayAnchor(now, location.timeZone);
  if (getZonedParts(now, location.timeZone).hour < MUHASABAH_DAY_ROLLOVER_HOUR) {
    anchor = shiftPrayerDay(anchor, -1);
  }

  const out: BuiltReminder[] = [];
  for (let offset = 0; offset < DAYS; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    const key = getLocalDateString(day);
    if (reviewed.has(key)) continue;
    const fireAt = muhasabahFireAt(day, reminder.time, input.bedtime, location);
    if (isPastFireTime(fireAt, now)) continue;
    out.push({
      id: `muhasabah:${key}`,
      fireAt,
      title: i18n.t("muhasabah.notif.title"),
      body: i18n.t("muhasabah.notif.body"),
      channelId: "zikr",
      repeat: "date",
      route: MUHASABAH_ROUTE,
      priority: input.priority,
    });
  }
  return out;
}
