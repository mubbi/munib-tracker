import type { AccentColorId } from "@munib-tracker/theme/types";

import { gregorianToHijri } from "@/lib/hijri";

export type SeasonalThemeId = "ramadan" | "hajj";

export interface SeasonalThemeDef {
  id: SeasonalThemeId;
  /** Curated accent applied when this season's theme is chosen. */
  accentId: AccentColorId;
  /** Islamic month (1–12) the season falls in. */
  hijriMonth: number;
  /** Optional inclusive day window within the month (1-based). */
  fromDay?: number;
  toDay?: number;
}

/**
 * Seasonal accent presets (NF-2.23). Each maps an Islamic season to a curated
 * accent so the app can dress up for Ramadan and the days of Hajj. Kept as data
 * only — the actual colours stay owned by `@munib-tracker/theme`, so a season is
 * just a shortcut to an existing preset the user could also pick by hand.
 */
export const SEASONAL_THEMES: readonly SeasonalThemeDef[] = [
  // Ramadan — a festive twilight purple for the month of the Qur'an.
  { id: "ramadan", accentId: "purple", hijriMonth: 9 },
  // Dhul-Hijjah 1–13: the ten best days, Eid al-Adha, and the days of Tashreeq — golden amber.
  { id: "hajj", accentId: "amber", hijriMonth: 12, fromDay: 1, toDay: 13 },
];

/** The seasonal theme active on a given Hijri month/day, or null out of season. */
export function seasonalThemeForHijri(month: number, day: number): SeasonalThemeDef | null {
  for (const season of SEASONAL_THEMES) {
    if (season.hijriMonth !== month) continue;
    if (season.fromDay != null && day < season.fromDay) continue;
    if (season.toDay != null && day > season.toDay) continue;
    return season;
  }
  return null;
}

/** The seasonal theme active right now (or on `date`), or null when out of season. */
export function currentSeasonalTheme(
  date: Date = new Date(),
  timeZone?: string,
): SeasonalThemeDef | null {
  const hijri = gregorianToHijri(date, timeZone);
  return seasonalThemeForHijri(hijri.month, hijri.day);
}
