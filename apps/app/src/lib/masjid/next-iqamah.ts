import { IQAMAH_PRAYERS, type IqamahTimetable } from "@munib-tracker/shared/masjid";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

import { dateKeyOf, iqamahOn } from "@/lib/masjid/iqamah-on";
import { getZonedParts, parseHhMm, wallClockInTimeZoneToDate } from "@/lib/time";

export interface NextIqamah {
  prayer: ObligatoryPrayer;
  at: Date;
  /** Whole minutes from `now` (rounded up, ≥ 0). */
  minutes: number;
}

/** Default look-ahead: the hero shows the iqamah countdown only when it is this close. */
export const IQAMAH_COUNTDOWN_HORIZON_MIN = 180;

/**
 * The next iqamah at the home masjid within `horizonMin` (NF-3.11 home-hero
 * countdown). Reads today's and tomorrow's rows in the location's timezone;
 * Fridays use the Jumu'ah iqamah for Dhuhr (via `iqamahOn`). Null when there are
 * no times (the hero then shows nothing extra) or none is close enough.
 */
export function nextIqamah(
  timetable: IqamahTimetable | null | undefined,
  now: Date,
  timeZone?: string,
  horizonMin = IQAMAH_COUNTDOWN_HORIZON_MIN,
): NextIqamah | null {
  if (!timetable) return null;
  let best: NextIqamah | null = null;
  for (const offset of [0, 1]) {
    const day = getZonedParts(new Date(now.getTime() + offset * 86_400_000), timeZone);
    const key = dateKeyOf(day.year, day.month, day.day);
    for (const prayer of IQAMAH_PRAYERS) {
      const value = iqamahOn(key, prayer, timetable);
      if (!value) continue;
      const clock = parseHhMm(value);
      const at = wallClockInTimeZoneToDate(
        day.year,
        day.month,
        day.day,
        clock.hour,
        clock.minute,
        timeZone,
      );
      const diff = at.getTime() - now.getTime();
      if (diff < 0 || diff > horizonMin * 60_000) continue;
      if (!best || at.getTime() < best.at.getTime()) {
        best = { prayer, at, minutes: Math.ceil(diff / 60_000) };
      }
    }
  }
  return best;
}
