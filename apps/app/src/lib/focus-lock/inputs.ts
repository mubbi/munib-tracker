import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { FocusLockPrayer, ObligatoryPrayer } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import { parseHhMm, wallClockInTimeZoneToDate } from "@/lib/time";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/timezone-anchor";

import type { FocusDayInput } from "./plan";

/**
 * Adapter from the app's prayer-time + masjid layers to the pure planner.
 * Adhan times use the user's method, madhab and prayer tuning
 * (`locationCalcExtras` → per-prayer adjustments, high-latitude rule), exactly
 * like the reminders, so the lock and the adhan agree.
 */

/**
 * Iqamah "HH:mm" for a local date (NF-3.11). Bound to the masjid layer's
 * `iqamahFor` by the caller; returning null falls back to the adhan anchor.
 */
export type IqamahLookup = (date: string, prayer: ObligatoryPrayer) => string | null;

const WALL_CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;

/** "HH:mm" on a local date (in the location's timezone) → instant; invalid ⇒ undefined. */
export function wallClockOn(
  anchor: Date,
  hhmm: string | null,
  timeZone?: string,
): Date | undefined {
  if (!hhmm || !WALL_CLOCK.test(hhmm)) return undefined;
  const { hour, minute } = parseHhMm(hhmm);
  return wallClockInTimeZoneToDate(
    anchor.getFullYear(),
    anchor.getMonth() + 1,
    anchor.getDate(),
    hour,
    minute,
    timeZone,
  );
}

/** Today and tomorrow (days `0..count-1`) for the planner. */
export function buildFocusDays(
  location: StoredLocation,
  now: Date,
  iqamah?: IqamahLookup | null,
  count = 2,
): FocusDayInput[] {
  const today = prayerDayAnchor(now, location.timeZone);
  const days: FocusDayInput[] = [];
  for (let offset = 0; offset < count; offset++) {
    const anchor = shiftPrayerDay(today, offset);
    const date = getLocalDateString(anchor);
    const times = computeLocationPrayerTimes(location, anchor);
    const adhan: Partial<Record<ObligatoryPrayer, Date>> = {
      fajr: times.fajr,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
    };
    let iqamahTimes: Partial<Record<FocusLockPrayer, Date>> | undefined;
    if (iqamah) {
      iqamahTimes = {};
      for (const prayer of OBLIGATORY_PRAYERS) {
        const at = wallClockOn(anchor, iqamah(date, prayer), location.timeZone);
        if (at) iqamahTimes[prayer] = at;
      }
      // The masjid layer resolves Friday Dhuhr to the Jumu'ah iqamah.
      if (anchor.getDay() === 5 && iqamahTimes.dhuhr) iqamahTimes.jumuah = iqamahTimes.dhuhr;
    }
    days.push({
      date,
      weekday: anchor.getDay(),
      adhan,
      sunrise: times.sunrise,
      ...(iqamahTimes ? { iqamah: iqamahTimes } : {}),
    });
  }
  return days;
}

/** True when the home masjid has any iqamah time in the planned days (the iqamah anchor is offered). */
export function hasIqamahTimes(days: readonly FocusDayInput[]): boolean {
  return days.some((d) => d.iqamah && Object.keys(d.iqamah).length > 0);
}
