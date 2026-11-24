import type { CalculationMethodKey } from "@/lib/prayer-times";

/**
 * Suggested Salah-time calculation method per country (ISO 3166-1 alpha-2).
 * Only methods the bundled `adhan` library implements; countries without a
 * clearly established regional method get no suggestion (null), so nobody is
 * nagged away from a deliberate choice. A suggestion is only ever offered —
 * the user's masjid timetable remains the best guide.
 *
 * Sources:
 * - PrayTimes.org, "Calculation Methods" (regions table): ISNA — North America;
 *   Egyptian General Authority of Survey — Africa, Syria, Lebanon; Umm al-Qura —
 *   Arabian Peninsula; University of Islamic Sciences, Karachi — Pakistan,
 *   Afghanistan, Bangladesh, India; Institute of Geophysics, Tehran — Iran.
 * - adhan-js `CalculationMethod` docs (github.com/batoulapps/adhan-js, METHODS.md):
 *   Dubai — UAE; Kuwait; Qatar; Singapore — Singapore, Malaysia, Indonesia
 *   (MUIS / JAKIM / Kemenag use the same 20° / 18° angles); Turkey — Diyanet
 *   İşleri Başkanlığı; Moonsighting Committee — recommended for the UK.
 *   (adhan-js prefers Moonsighting Committee over ISNA for North America too;
 *   we suggest ISNA there because it is the regional body most local
 *   timetables follow — both stay one tap apart in Settings.)
 */
export const SUGGESTED_METHOD_BY_COUNTRY: Readonly<Record<string, CalculationMethodKey>> = {
  // Arabian Peninsula (Umm al-Qura) and the Gulf's own authorities.
  SA: "UmmAlQura",
  YE: "UmmAlQura",
  AE: "Dubai",
  KW: "Kuwait",
  QA: "Qatar",
  // Egyptian General Authority of Survey.
  EG: "Egyptian",
  SD: "Egyptian",
  LY: "Egyptian",
  SY: "Egyptian",
  LB: "Egyptian",
  // University of Islamic Sciences, Karachi.
  PK: "Karachi",
  IN: "Karachi",
  BD: "Karachi",
  AF: "Karachi",
  // Southeast Asia (MUIS / JAKIM / Kemenag angles).
  SG: "Singapore",
  MY: "Singapore",
  ID: "Singapore",
  // Others with a national method in adhan.
  TR: "Turkey",
  IR: "Tehran",
  US: "NorthAmerica",
  CA: "NorthAmerica",
  GB: "MoonsightingCommittee",
};

/** The usual method in a country, or `null` when there is no clear regional one. */
export function suggestedMethodForCountry(
  countryCode: string | null | undefined,
): CalculationMethodKey | null {
  if (!countryCode) return null;
  return SUGGESTED_METHOD_BY_COUNTRY[countryCode.toUpperCase()] ?? null;
}

/** Remembers "Keep current" for this exact country + suggestion pair. */
export function methodSuggestionKey(countryCode: string, method: CalculationMethodKey): string {
  return `${countryCode.toUpperCase()}:${method}`;
}

/**
 * The method to offer for a stored location, or `null` when there is nothing
 * to say: no real place yet (Makkah default), unknown country, already using
 * it, or the user chose to keep their method for this suggestion.
 */
export function methodSuggestionFor(
  location: { source: string; countryCode?: string; method: CalculationMethodKey },
  dismissedKey?: string,
): CalculationMethodKey | null {
  if (location.source === "default" || !location.countryCode) return null;
  const suggested = suggestedMethodForCountry(location.countryCode);
  if (!suggested || suggested === location.method) return null;
  if (dismissedKey === methodSuggestionKey(location.countryCode, suggested)) return null;
  return suggested;
}
