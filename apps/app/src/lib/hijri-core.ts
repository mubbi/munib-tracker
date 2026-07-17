import {
  UMALQURA_END_YEAR,
  UMALQURA_EPOCH_JDN,
  UMALQURA_MONTH_MASKS,
  UMALQURA_START_YEAR,
  UMALQURA_TOTAL_DAYS,
} from "@/lib/hijri-umalqura-data";

/**
 * Calendar arithmetic shared by the Hijri modules: Julian Day Number math, the
 * Umm al-Qura month table, and the arithmetic "Kuwaiti algorithm" fallback.
 * UI-facing formatting lives in `hijri.ts`; the location-aware crescent
 * sighting engine lives in `hijri-sighting.ts`.
 */

export interface HijriDate {
  /** Islamic year (AH). */
  year: number;
  /** Islamic month, 1–12. */
  month: number;
  /** Day of the Islamic month, 1–30. */
  day: number;
}

/** Gregorian (proleptic) calendar day → integer Julian Day Number. */
export function gregorianToJDN(gy: number, gm: number, gd: number): number {
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  return (
    gd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Julian Day Number → Gregorian { year, month (1-12), day }. */
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

/** Whether the Umm al-Qura table covers this Julian Day Number. */
export function inUmalquraJDNRange(jdn: number): boolean {
  return jdn >= UMALQURA_EPOCH_JDN && jdn < UMALQURA_EPOCH_JDN + UMALQURA_TOTAL_DAYS;
}

/** Whether the Umm al-Qura table covers this Hijri year. */
export function inUmalquraYearRange(year: number): boolean {
  return year >= UMALQURA_START_YEAR && year <= UMALQURA_END_YEAR;
}

/** Cumulative day offsets from the Umm al-Qura epoch to the start of each year. */
const UMALQURA_YEAR_STARTS: number[] = (() => {
  const starts = new Array<number>(UMALQURA_MONTH_MASKS.length + 1);
  let days = 0;
  for (let i = 0; i < UMALQURA_MONTH_MASKS.length; i += 1) {
    starts[i] = days;
    const mask = UMALQURA_MONTH_MASKS[i];
    for (let m = 0; m < 12; m += 1) {
      days += mask & (1 << m) ? 30 : 29;
    }
  }
  starts[UMALQURA_MONTH_MASKS.length] = days;
  return starts;
})();

/** Days (29 or 30) in a month of the Umm al-Qura table. Caller checks range. */
export function umalquraMonthLength(year: number, month: number): number {
  const mask = UMALQURA_MONTH_MASKS[year - UMALQURA_START_YEAR];
  return mask & (1 << (month - 1)) ? 30 : 29;
}

/** Umm al-Qura Islamic date → integer Julian Day Number. Caller checks range. */
export function umalquraToJDN(hy: number, hm: number, hd: number): number {
  let days = UMALQURA_YEAR_STARTS[hy - UMALQURA_START_YEAR];
  const mask = UMALQURA_MONTH_MASKS[hy - UMALQURA_START_YEAR];
  for (let m = 0; m < hm - 1; m += 1) {
    days += mask & (1 << m) ? 30 : 29;
  }
  return UMALQURA_EPOCH_JDN + days + hd - 1;
}

/** Julian Day Number → Umm al-Qura Islamic date. Caller checks range. */
export function jdnToUmalqura(jdn: number): HijriDate {
  const offset = jdn - UMALQURA_EPOCH_JDN;
  // Binary search the year whose start offset is <= offset.
  let lo = 0;
  let hi = UMALQURA_MONTH_MASKS.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (UMALQURA_YEAR_STARTS[mid] <= offset) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  const year = UMALQURA_START_YEAR + lo;
  let rest = offset - UMALQURA_YEAR_STARTS[lo];
  const mask = UMALQURA_MONTH_MASKS[lo];
  let month = 1;
  for (; month < 12; month += 1) {
    const length = mask & (1 << (month - 1)) ? 30 : 29;
    if (rest < length) break;
    rest -= length;
  }
  return { year, month, day: rest + 1 };
}

/** Julian Day Number → Islamic date (tabular "Kuwaiti algorithm"). */
export function jdnToIslamicTabular(jdn: number): HijriDate {
  let l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

/** Islamic date → integer Julian Day Number (exact inverse of `jdnToIslamicTabular`). */
export function islamicTabularToJDN(hy: number, hm: number, hd: number): number {
  return (
    hd + Math.ceil(29.5 * (hm - 1)) + (hy - 1) * 354 + Math.floor((3 + 11 * hy) / 30) + 1948440 - 1
  );
}
