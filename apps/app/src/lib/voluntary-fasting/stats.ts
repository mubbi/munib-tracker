import type { VoluntaryFastingMap, VoluntaryFastKind } from "@munib-tracker/shared/types";
import {
  addDays,
  dhulHijjahNineCount,
  type FastingCalendarContext,
  fastKindsForDay,
  isLiveFastEntry,
  shawwalSixCount,
} from "@munib-tracker/shared/utils";

/** Target for the Shawwal counter (Muslim 1164). */
export const SHAWWAL_SIX_TARGET = 6;
/** Target for the Dhul-Hijjah counter (days 1–9). */
export const DHUL_HIJJAH_TARGET = 9;

export interface VoluntaryFastingStats {
  /** Kept voluntary fasts, all time. */
  totalFasted: number;
  /** Kept fasts that also counted as qaza (make-up). */
  qazaFasted: number;
  /** Kept fasts in the current Hijri year. */
  thisHijriYear: number;
  /** Kept fasts in the last 30 days (including today). */
  last30Days: number;
  /** Planned (intended) days from today on. */
  upcomingIntended: number;
  /** Kept fasts per recommended kind (a day can count for several kinds). */
  byKind: Partial<Record<VoluntaryFastKind, number>>;
  /** Shawwal six progress for the current Hijri year. */
  shawwalSix: number;
  /** Dhul-Hijjah 1–9 progress for the current Hijri year. */
  dhulHijjahNine: number;
}

/** Private stats for the hub (never shared, no leaderboard). Pure given the injected Hijri engine. */
export function computeVoluntaryFastingStats(
  entries: VoluntaryFastingMap,
  ctx: Pick<FastingCalendarContext, "toHijri" | "prefs">,
  today: string,
): VoluntaryFastingStats {
  const hijriYear = ctx.toHijri(today).year;
  const since = addDays(today, -29);
  const stats: VoluntaryFastingStats = {
    totalFasted: 0,
    qazaFasted: 0,
    thisHijriYear: 0,
    last30Days: 0,
    upcomingIntended: 0,
    byKind: {},
    shawwalSix: shawwalSixCount(entries, ctx.toHijri, hijriYear),
    dhulHijjahNine: dhulHijjahNineCount(entries, ctx.toHijri, hijriYear),
  };
  for (const [date, entry] of Object.entries(entries)) {
    if (!isLiveFastEntry(entry)) continue;
    if (entry.status === "intended" && date >= today) stats.upcomingIntended += 1;
    if (entry.status !== "fasted") continue;
    stats.totalFasted += 1;
    if (entry.asQaza) stats.qazaFasted += 1;
    if (date >= since && date <= today) stats.last30Days += 1;
    const hijri = ctx.toHijri(date);
    if (hijri.year === hijriYear) stats.thisHijriYear += 1;
    for (const kind of fastKindsForDay(date, hijri, ctx.prefs)) {
      stats.byKind[kind] = (stats.byKind[kind] ?? 0) + 1;
    }
  }
  return stats;
}

/** Live entries, newest first (history list). */
export function fastingHistory(
  entries: VoluntaryFastingMap,
  limit = 60,
): { date: string; entry: VoluntaryFastingMap[string] }[] {
  return Object.entries(entries)
    .filter(([, entry]) => isLiveFastEntry(entry))
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .slice(0, limit)
    .map(([date, entry]) => ({ date, entry }));
}
