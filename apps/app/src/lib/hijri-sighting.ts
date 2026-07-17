import {
  Body,
  Equator,
  GeoMoon,
  Horizon,
  KM_PER_AU,
  Observer,
  SearchMoonPhase,
  SearchRiseSet,
} from "astronomy-engine";

import {
  gregorianToJDN,
  type HijriDate,
  inUmalquraJDNRange,
  inUmalquraYearRange,
  jdnToGregorian,
  jdnToUmalqura,
  umalquraToJDN,
} from "@/lib/hijri-core";

/**
 * Location-aware Hijri months from actual crescent (hilāl) visibility,
 * computed with the `astronomy-engine` ephemeris and the Yallop criterion —
 * the standard published test used by HM Nautical Almanac Office and
 * moon-sighting authorities to predict whether the hilāl is naked-eye visible
 * from a given place on a given evening.
 *
 * A month begins on the day after the first evening (following the lunar
 * conjunction) on which the crescent is visible at the observer's location,
 * capped at 30 days per the classical rule. This reproduces regional
 * moon-sighting outcomes — e.g. Safar 1448 starting July 16, 2026 in Pakistan
 * (announced by the Central Ruet-e-Hilal Committee) while the Saudi Umm
 * al-Qura calendar has July 15 — without any network dependency.
 *
 * Month numbering (year + month index) is anchored to the Umm al-Qura table
 * by sampling mid-month, so both systems always agree on *which* month it is
 * and differ only by 0–2 days on when it starts.
 */

/** Coordinates the sighting calculation is anchored to. */
export interface SightingObserver {
  latitude: number;
  longitude: number;
}

/**
 * Yallop naked-eye visibility limit (top of his zone "C"): q above this means
 * the crescent is expected to be found by eye under good conditions.
 */
const YALLOP_VISIBLE_Q = -0.014;

/**
 * Above ~61.5° latitude sunsets/moonsets degenerate (midnight sun, polar
 * night) and crescent visibility is undefined for parts of the year.
 */
const MAX_SIGHTING_LATITUDE = 61.5;

/** Keep sighted months well inside the Umm al-Qura anchor table. */
const RANGE_MARGIN_DAYS = 400;

const DAY_MS = 86_400_000;
const SD_COEF = 0.27245 * 6378.14 * 3437.75; // topocentric semi-diameter (arcmin·km)

/** Whether sighting-based months can be computed at this latitude. */
export function sightingAvailable(latitude: number): boolean {
  return Math.abs(latitude) <= MAX_SIGHTING_LATITUDE;
}

/**
 * Civil day of an instant in mean solar time at the observer's longitude.
 * Sunset is always mid-evening in legal clocks, so the solar civil day of a
 * sunset/conjunction matches the legal calendar day for inhabited timezones.
 */
function solarCivilJDN(instant: Date, longitude: number): number {
  const solarMs = instant.getTime() + (longitude / 15) * 3_600_000;
  const d = new Date(solarMs);
  return gregorianToJDN(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** UTC instant near local (solar) noon of a civil day, to seed sunset searches. */
function solarNoonUtc(jdn: number, longitude: number): Date {
  const { year, month, day } = jdnToGregorian(jdn);
  return new Date(Date.UTC(year, month - 1, day, 12) - (longitude / 15) * 3_600_000);
}

function equatorToUnitVector(eq: { ra: number; dec: number }): [number, number, number] {
  const ra = (eq.ra * 15 * Math.PI) / 180;
  const dec = (eq.dec * Math.PI) / 180;
  return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
}

/**
 * Yallop q for the evening ending civil day `jdn`. Returns `null` when the
 * sun or moon does not set (polar edge), `-Infinity` when the moon sets
 * before the sun (no crescent window at all).
 */
function eveningYallopQ(observer: Observer, jdn: number, longitude: number): number | null {
  const noon = solarNoonUtc(jdn, longitude);
  const sunset = SearchRiseSet(Body.Sun, observer, -1, noon, 1.2);
  if (!sunset) return null;
  const moonset = SearchRiseSet(Body.Moon, observer, -1, sunset.date, 1.2);
  if (!moonset) return null;
  const lagMinutes = (moonset.date.getTime() - sunset.date.getTime()) / 60_000;
  if (lagMinutes <= 0) return Number.NEGATIVE_INFINITY;

  // Yallop's "best time": sunset + 4/9 of the sunset→moonset lag.
  const best = new Date(sunset.date.getTime() + ((lagMinutes * 4) / 9) * 60_000);
  const sunEq = Equator(Body.Sun, best, observer, true, true);
  const moonEq = Equator(Body.Moon, best, observer, true, true);
  const sunHor = Horizon(best, observer, sunEq.ra, sunEq.dec, "normal");
  const moonHor = Horizon(best, observer, moonEq.ra, moonEq.dec, "normal");

  const arcv = moonHor.altitude - sunHor.altitude;
  const [sx, sy, sz] = equatorToUnitVector(sunEq);
  const [mx, my, mz] = equatorToUnitVector(moonEq);
  const dot = Math.min(1, Math.max(-1, sx * mx + sy * my + sz * mz));
  const arcl = (Math.acos(dot) * 180) / Math.PI;
  const moonDistKm = GeoMoon(best).Length() * KM_PER_AU;
  const semiDiameter = SD_COEF / moonDistKm;
  const w = semiDiameter * (1 - Math.cos((arcl * Math.PI) / 180));
  return (arcv - (11.8371 - 6.3226 * w + 0.7319 * w * w - 0.1018 * w * w * w)) / 10;
}

/**
 * Civil JDN on which the month of the given conjunction begins: the day after
 * the first visible evening, capped at conjunction day + 3 (30-day rule).
 * Returns `null` when visibility cannot be evaluated (polar edge).
 */
function monthStartForConjunction(
  observer: Observer,
  conjunction: Date,
  longitude: number,
): number | null {
  const conjJdn = solarCivilJDN(conjunction, longitude);
  for (let i = 0; i <= 2; i += 1) {
    const q = eveningYallopQ(observer, conjJdn + i, longitude);
    if (q === null) return null;
    if (q > YALLOP_VISIBLE_Q) return conjJdn + i + 1;
  }
  return conjJdn + 3;
}

interface SightingTable {
  key: string;
  observer: Observer;
  longitude: number;
  /** Sorted civil JDNs on which each computed month begins. */
  starts: number[];
  /** Umm al-Qura anchored { year, month } label per entry in `starts`. */
  labels: { year: number; month: number }[];
  /** Conjunction instants bracketing the computed range, for extension. */
  firstConjunction: Date;
  lastConjunction: Date;
}

let cache: SightingTable | null = null;

function observerKey(obs: SightingObserver): string {
  return `${obs.latitude.toFixed(1)},${obs.longitude.toFixed(1)}`;
}

function labelForStart(startJdn: number): { year: number; month: number } {
  const mid = jdnToUmalqura(startJdn + 14);
  return { year: mid.year, month: mid.month };
}

/** Clamp a following start so every month is 29 or 30 days long. */
function clampAfter(prevStart: number, nextStart: number): number {
  return Math.min(prevStart + 30, Math.max(prevStart + 29, nextStart));
}

/** Clamp a preceding start so every month is 29 or 30 days long. */
function clampBefore(nextStart: number, prevStart: number): number {
  return Math.min(nextStart - 29, Math.max(nextStart - 30, prevStart));
}

function buildTable(obs: SightingObserver, aroundJdn: number): SightingTable | null {
  const observer = new Observer(obs.latitude, obs.longitude, 0);
  const seed = solarNoonUtc(aroundJdn - 45, obs.longitude);
  const conj = SearchMoonPhase(0, seed, 40);
  if (!conj) return null;
  const start = monthStartForConjunction(observer, conj.date, obs.longitude);
  if (start === null) return null;
  return {
    key: observerKey(obs),
    observer,
    longitude: obs.longitude,
    starts: [start],
    labels: [labelForStart(start)],
    firstConjunction: conj.date,
    lastConjunction: conj.date,
  };
}

/** Extends the table forward/backward until it covers `jdn` with margin. Returns false on failure. */
function ensureCovers(table: SightingTable, jdn: number): boolean {
  if (
    !inUmalquraJDNRange(jdn - RANGE_MARGIN_DAYS) ||
    !inUmalquraJDNRange(jdn + RANGE_MARGIN_DAYS)
  ) {
    return false;
  }
  // Forward: the last start must exceed jdn so the containing month is bounded.
  while (table.starts[table.starts.length - 1] <= jdn + 35) {
    const next = SearchMoonPhase(0, new Date(table.lastConjunction.getTime() + 20 * DAY_MS), 40);
    if (!next) return false;
    const raw = monthStartForConjunction(table.observer, next.date, table.longitude);
    if (raw === null) return false;
    const prev = table.starts[table.starts.length - 1];
    const start = clampAfter(prev, raw);
    table.starts.push(start);
    table.labels.push(labelForStart(start));
    table.lastConjunction = next.date;
  }
  // Backward: the first start must be at or before jdn.
  while (table.starts[0] > jdn) {
    const prev = SearchMoonPhase(0, new Date(table.firstConjunction.getTime() - 45 * DAY_MS), 40);
    if (!prev) return false;
    const raw = monthStartForConjunction(table.observer, prev.date, table.longitude);
    if (raw === null) return false;
    const start = clampBefore(table.starts[0], raw);
    table.starts.unshift(start);
    table.labels.unshift(labelForStart(start));
    table.firstConjunction = prev.date;
  }
  return true;
}

function tableFor(obs: SightingObserver, aroundJdn: number): SightingTable | null {
  if (!sightingAvailable(obs.latitude)) return null;
  if (!cache || cache.key !== observerKey(obs)) {
    cache = buildTable(obs, aroundJdn);
  }
  if (!cache) return null;
  if (!ensureCovers(cache, aroundJdn)) return null;
  return cache;
}

/** Index of the month containing `jdn` (last start <= jdn), or -1. */
function monthIndexOf(table: SightingTable, jdn: number): number {
  let lo = 0;
  let hi = table.starts.length - 1;
  if (table.starts[0] > jdn) return -1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (table.starts[mid] <= jdn) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Sighting-based Hijri date for a civil day, or `null` when unsupported. */
export function sightingHijriFromJDN(obs: SightingObserver, jdn: number): HijriDate | null {
  const table = tableFor(obs, jdn);
  if (!table) return null;
  const index = monthIndexOf(table, jdn);
  if (index < 0 || index >= table.starts.length - 1) return null;
  const { year, month } = table.labels[index];
  return { year, month, day: jdn - table.starts[index] + 1 };
}

/** Civil JDN of a sighting-based Hijri date, or `null` when unsupported. */
export function sightingJDNFromHijri(
  obs: SightingObserver,
  year: number,
  month: number,
  day: number,
): number | null {
  if (!inUmalquraYearRange(year)) return null;
  const approx = umalquraToJDN(year, month, 1);
  const table = tableFor(obs, approx);
  if (!table) return null;
  // The sighted start is within ±3 days of the Umm al-Qura start; scan the
  // covered window for the matching label.
  for (let i = 0; i < table.labels.length; i += 1) {
    if (table.labels[i].year === year && table.labels[i].month === month) {
      return table.starts[i] + day - 1;
    }
  }
  return null;
}

/** Length (29 or 30) of a sighting-based Hijri month, or `null` when unsupported. */
export function sightingMonthLength(
  obs: SightingObserver,
  year: number,
  month: number,
): number | null {
  const startJdn = sightingJDNFromHijri(obs, year, month, 1);
  if (startJdn === null || cache === null) return null;
  const index = monthIndexOf(cache, startJdn);
  if (index < 0) return null;
  if (index + 1 >= cache.starts.length && !ensureCovers(cache, startJdn + 35)) return null;
  return cache.starts[index + 1] - cache.starts[index];
}

/** Test-only: drops the cached per-observer table. */
export function resetSightingCacheForTests(): void {
  cache = null;
}
