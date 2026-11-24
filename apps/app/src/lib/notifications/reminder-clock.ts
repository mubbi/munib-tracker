import type { StoredLocation } from "@/lib/location";
import { parseHhMm, prayerDayAnchor, shiftPrayerDay, wallClockInTimeZoneToDate } from "@/lib/time";

/**
 * Time helpers shared by every reminder builder (`build-reminders.ts` and the
 * per-feature `push*Reminders` modules), so "today at HH:mm in the location's
 * timezone" and "has this already fired?" mean the same thing everywhere.
 */

/** A DATE reminder that fired up to a minute ago is still delivered (scheduling latency). */
export const JUST_MISSED_WINDOW_MS = 60_000;

/** True once `fireAt` is more than {@link JUST_MISSED_WINDOW_MS} in the past. */
export function isPastFireTime(fireAt: Date, now: Date): boolean {
  return fireAt.getTime() <= now.getTime() - JUST_MISSED_WINDOW_MS;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * The instant of wall-clock `hhmm` on the calendar day of `day` (a prayer-day
 * anchor, whose local Y/M/D already carry the location's date) in `timeZone`.
 */
export function wallClockOnDay(day: Date, hhmm: string, timeZone: string | undefined): Date {
  const { hour, minute } = parseHhMm(hhmm);
  return wallClockInTimeZoneToDate(
    day.getFullYear(),
    day.getMonth() + 1,
    day.getDate(),
    hour,
    minute,
    timeZone,
  );
}

/**
 * First fire of a DAILY reminder at `hhmm`: today's occurrence, or tomorrow's
 * once today's is past — so the OS daily trigger's first fire and the
 * notification centre's "next at" row stay aligned.
 */
export function nextDailyFireAt(
  hhmm: string,
  now: Date,
  location: Pick<StoredLocation, "timeZone">,
): Date {
  const today = prayerDayAnchor(now, location.timeZone);
  const fireAt = wallClockOnDay(today, hhmm, location.timeZone);
  if (!isPastFireTime(fireAt, now)) return fireAt;
  return wallClockOnDay(shiftPrayerDay(today, 1), hhmm, location.timeZone);
}
