/**
 * NF-3.13 / D37: the weekend days "Weekdays only" skips, defaulting from the
 * user's region. `regionWeekendDays` is pure (the caller passes the stored
 * location's country and timezone plus the device timezone); only
 * `deviceTimeZone` / `weekendRegionFor` read `Intl`.
 *
 * Days are JS weekdays: 0 = Sunday … 6 = Saturday.
 *
 * Sources / assumptions (checked 2026-11-24):
 * - Wikipedia, "Workweek and weekend" (country tables + introduction lists),
 *   read 2026-11-24. Where the page contradicts itself (Libya, Palestine) the
 *   Friday + Saturday listing is used.
 * - United Arab Emirates moved to Saturday + Sunday on 1 January 2022 (Friday is
 *   a half day for government), so it keeps the Saturday + Sunday default.
 * - Afghanistan is listed with Friday + Saturday (since 2015). Iran, Somalia and
 *   Djibouti work Saturday–Thursday, so Friday only (Iran's Thursday is a half
 *   day for most offices; not skipped).
 * - Brunei keeps Friday + Sunday (works Saturday).
 * - Sub-national rules can't be told apart from a country or timezone, so they
 *   fall back to the country default: Kedah / Kelantan / Terengganu (Friday +
 *   Saturday) and Sarawak (Friday + Sunday) in Malaysia, Aceh in Indonesia.
 *   The user can edit the days in focus-lock settings.
 * - Anything unknown ⇒ Saturday + Sunday.
 */

export const SAT_SUN: readonly number[] = [0, 6];
const FRI_SAT: readonly number[] = [5, 6];
const FRI: readonly number[] = [5];
const FRI_SUN: readonly number[] = [0, 5];

/** ISO 3166-1 alpha-2 → weekend days, only where it isn't Saturday + Sunday. */
export const WEEKEND_BY_COUNTRY: Readonly<Record<string, readonly number[]>> = {
  AF: FRI_SAT,
  BD: FRI_SAT,
  BH: FRI_SAT,
  DZ: FRI_SAT,
  EG: FRI_SAT,
  IL: FRI_SAT,
  IQ: FRI_SAT,
  JO: FRI_SAT,
  KW: FRI_SAT,
  LY: FRI_SAT,
  MV: FRI_SAT,
  OM: FRI_SAT,
  PS: FRI_SAT,
  QA: FRI_SAT,
  SA: FRI_SAT,
  SD: FRI_SAT,
  SY: FRI_SAT,
  YE: FRI_SAT,
  DJ: FRI,
  IR: FRI,
  SO: FRI,
  BN: FRI_SUN,
};

/** IANA timezone → country, for the zones of the countries above. */
const COUNTRY_BY_TIMEZONE: Readonly<Record<string, string>> = {
  "Asia/Kabul": "AF",
  "Asia/Dhaka": "BD",
  "Asia/Dacca": "BD",
  "Asia/Bahrain": "BH",
  "Africa/Algiers": "DZ",
  "Africa/Cairo": "EG",
  Egypt: "EG",
  "Asia/Jerusalem": "IL",
  "Asia/Tel_Aviv": "IL",
  Israel: "IL",
  "Asia/Baghdad": "IQ",
  "Asia/Amman": "JO",
  "Asia/Kuwait": "KW",
  "Africa/Tripoli": "LY",
  Libya: "LY",
  "Indian/Maldives": "MV",
  "Asia/Muscat": "OM",
  "Asia/Gaza": "PS",
  "Asia/Hebron": "PS",
  "Asia/Qatar": "QA",
  "Asia/Riyadh": "SA",
  "Africa/Khartoum": "SD",
  "Asia/Damascus": "SY",
  "Asia/Aden": "YE",
  "Africa/Djibouti": "DJ",
  "Asia/Tehran": "IR",
  Iran: "IR",
  "Africa/Mogadishu": "SO",
  "Asia/Brunei": "BN",
};

/** English country names (as reverse geocoders return them) → ISO code. */
const COUNTRY_BY_NAME: Readonly<Record<string, string>> = {
  afghanistan: "AF",
  bangladesh: "BD",
  bahrain: "BH",
  algeria: "DZ",
  egypt: "EG",
  israel: "IL",
  iraq: "IQ",
  jordan: "JO",
  kuwait: "KW",
  libya: "LY",
  maldives: "MV",
  oman: "OM",
  palestine: "PS",
  "palestinian territories": "PS",
  "palestinian territory": "PS",
  "state of palestine": "PS",
  qatar: "QA",
  "saudi arabia": "SA",
  "kingdom of saudi arabia": "SA",
  sudan: "SD",
  syria: "SY",
  "syrian arab republic": "SY",
  yemen: "YE",
  djibouti: "DJ",
  iran: "IR",
  "iran (islamic republic of)": "IR",
  "islamic republic of iran": "IR",
  somalia: "SO",
  brunei: "BN",
  "brunei darussalam": "BN",
};

export interface WeekendRegion {
  /** Stored location country: an English name or an ISO 3166-1 alpha-2 code. */
  country?: string | null;
  /** IANA timezone of a manually picked city. */
  timeZone?: string | null;
  /** The device's IANA timezone (last resort). */
  deviceTimeZone?: string | null;
}

function countryCode(country: string | null | undefined): string | null {
  const raw = country?.trim();
  if (!raw) return null;
  if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();
  return COUNTRY_BY_NAME[raw.toLowerCase()] ?? null;
}

/**
 * The region's weekend days: the stored country when recognised (an ISO code or
 * a name from the table), else the location's timezone, else the device
 * timezone; Saturday + Sunday otherwise. Reverse-geocoded names can be in the
 * device language, which is why the timezone is the fallback.
 */
export function regionWeekendDays(region: WeekendRegion): number[] {
  const code = countryCode(region.country);
  if (code) return [...(WEEKEND_BY_COUNTRY[code] ?? SAT_SUN)];
  // The location's own timezone (manual city) decides when set; the device's only otherwise.
  const tz = region.timeZone || region.deviceTimeZone;
  const fromTz = tz ? COUNTRY_BY_TIMEZONE[tz] : undefined;
  return [...((fromTz && WEEKEND_BY_COUNTRY[fromTz]) || SAT_SUN)];
}

/** Unique, sorted 0–6 days; undefined when not an array or every day is chosen. */
export function sanitizeWeekendDays(raw: unknown): number[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const days = [
    ...new Set(raw.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6)),
  ].sort((a, b) => a - b);
  return days.length === 7 ? undefined : days;
}

/** The days skipped while `weekdaysOnly` is on: the user's choice, else the region default. */
export function effectiveWeekendDays(
  schedule: { weekendDays?: readonly number[] },
  region: WeekendRegion,
): number[] {
  return schedule.weekendDays ? [...schedule.weekendDays] : regionWeekendDays(region);
}

/** Device timezone, or undefined where `Intl` can't tell. */
export function deviceTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Where the default weekend comes from (D37): the stored location, then the
 * device timezone. The placeholder location (Makkah, `source: "default"`,
 * before any fix) says nothing about the user, so only the device timezone
 * counts then.
 */
export function weekendRegionFor(location: {
  country?: string | null;
  timeZone?: string | null;
  source?: string;
}): WeekendRegion {
  const device = deviceTimeZone();
  if (location.source === "default") return { deviceTimeZone: device };
  return { country: location.country, timeZone: location.timeZone, deviceTimeZone: device };
}
