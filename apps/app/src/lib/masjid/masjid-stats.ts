import { OBLIGATORY_PRAYER_SET } from "@munib-tracker/shared/constants";
import type { PrayerLog } from "@munib-tracker/shared/types";
import { parseLocalDateString } from "@munib-tracker/shared/utils";

/**
 * NF-3.11 masjid statistics: obligatory Salah logged "at the masjid" in a date
 * range, and the average per week. Only prayed logs count (completed /
 * delayed / qaza); excused days are left out, like every other rate. Never a
 * judgement — the screen shows it only when there is something to show.
 */
export interface MasjidPrayerStats {
  count: number;
  perWeek: number;
  /** Distinct days with at least one masjid Salah. */
  days: number;
}

const PRAYED = new Set<PrayerLog["status"]>(["completed", "delayed", "qaza"]);

export function masjidPrayerStats(
  logs: readonly PrayerLog[],
  from: string,
  to: string,
): MasjidPrayerStats {
  let count = 0;
  const days = new Set<string>();
  for (const log of logs) {
    if (!log.atMasjid || log.isExcused || log.date < from || log.date > to) continue;
    if (!OBLIGATORY_PRAYER_SET.has(log.prayerId) || !PRAYED.has(log.status)) continue;
    count += 1;
    days.add(log.date);
  }
  const spanDays =
    Math.round(
      (parseLocalDateString(to).getTime() - parseLocalDateString(from).getTime()) / 86_400_000,
    ) + 1;
  const weeks = Math.max(1, spanDays / 7);
  return { count, perWeek: Math.round((count / weeks) * 10) / 10, days: days.size };
}
