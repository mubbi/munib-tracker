import type { HijriAdjustment, HijriMonthKey, HijriOffsetDays } from "@munib-tracker/shared/types";
import { sanitizeHijriAdjustment } from "@munib-tracker/shared/validators/hijri-adjustment";

import { gregorianToJDN, type HijriDate, jdnToGregorian } from "@/lib/hijri-core";

/**
 * Hijri date adjustment (D14, plan §4.5.11) — pure calendar math.
 *
 * A user's committee or masjid can announce a month a day earlier or later than
 * any prediction. This module turns the *base* month starts (Umm al-Qura,
 * crescent visibility or tabular — whatever `hijri.ts` uses today) into
 * *effective* starts:
 *
 * 1. `B(m)`  — base JDN of day 1 of month `m`.
 * 2. `S₀(m) = B(m) + offsetDays` — a uniform shift keeps every base length.
 * 3. Per-month corrections, applied in time order from the earliest corrected
 *    month: a corrected month uses its announced start `A` only when
 *    `|A − S₀| ≤ 2`, and every month in the chain is clamped against the
 *    previous effective start `P`: `S = clamp(A ?? S₀, P + 29, P + 30)`. Every
 *    month therefore stays 29 or 30 days. Later months drift back to `S₀` (one
 *    day per "opposite"-length base month) and the chain stops once converged.
 *
 * `hijri.ts` wraps its conversions with {@link createAdjustedCalendar}; no
 * consumer changes. Months are addressed by a linear index `year·12 + month−1`.
 */

/** Largest accepted distance, in days, between an announced start and `S₀`. */
export const MAX_CORRECTION_DELTA = 2;

/** Safety bound on one correction chain (it converges in a few months in practice). */
const MAX_CHAIN_MONTHS = 48;

/** Pluggable base calendar — the method `hijri.ts` uses without any adjustment. */
export interface HijriBaseCalendar {
  /** JDN of day 1 of the month with linear index `index`. */
  monthStart(index: number): number;
  /** Linear index of the base month that contains civil day `jdn`. */
  monthIndexOf(jdn: number): number;
}

/** A month whose start or length differs from the prediction (`S₀`). */
export interface AffectedHijriMonth {
  year: number;
  month: number;
  /** Effective JDN of day 1. */
  start: number;
  /** Predicted JDN of day 1 (base + offset). */
  predictedStart: number;
  /** Effective length (29 or 30). */
  length: number;
  /** Predicted length. */
  predictedLength: number;
  /** True when the user corrected this month directly. */
  corrected: boolean;
}

/** One stored per-month correction and whether the calendar could apply it. */
export interface HijriMonthCorrection {
  key: HijriMonthKey;
  year: number;
  month: number;
  /** Announced Gregorian ISO date of day 1. */
  date: string;
  /** False when the correction was refused (too far from `S₀`, or it would break a 29/30 month). */
  applied: boolean;
}

export interface AdjustedHijriCalendar {
  /** Predicted start `S₀` (base + offset) of a month. */
  predictedStart(index: number): number;
  /** Effective start `S` of a month. */
  monthStart(index: number): number;
  /** Effective month length `S(next) − S`. */
  monthLength(index: number): number;
  /** Effective Hijri date of a civil day. */
  toHijri(jdn: number): HijriDate;
  /** Effective JDN of a Hijri date; `day` is limited to the effective month length. */
  toJDN(year: number, month: number, day: number): number;
  /** Months whose start or length moved because of per-month corrections, oldest first. */
  affectedMonths(): AffectedHijriMonth[];
  /** Stored corrections, oldest first, with whether each one applied. */
  corrections(): HijriMonthCorrection[];
}

// ---------------------------------------------------------------------------
// Month indices, keys and ISO dates
// ---------------------------------------------------------------------------

export function hijriMonthIndex(year: number, month: number): number {
  return year * 12 + month - 1;
}

export function hijriMonthFromIndex(index: number): { year: number; month: number } {
  const year = Math.floor(index / 12);
  return { year, month: index - year * 12 + 1 };
}

export function hijriMonthKey(year: number, month: number): HijriMonthKey {
  return `${year}-${String(month).padStart(2, "0")}` as HijriMonthKey;
}

export function parseHijriMonthKey(key: string): { year: number; month: number } | null {
  const match = /^(\d{1,4})-(\d{2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

/** `YYYY-MM-DD` → JDN (null when malformed). */
export function isoDateToJDN(iso: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return gregorianToJDN(Number(match[1]), Number(match[2]), Number(match[3]));
}

/** JDN → `YYYY-MM-DD`. */
export function jdnToIsoDate(jdn: number): string {
  const { year, month, day } = jdnToGregorian(jdn);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** JDN → local-midnight `Date`. */
export function jdnToLocalDate(jdn: number): Date {
  const { year, month, day } = jdnToGregorian(jdn);
  return new Date(year, month - 1, day);
}

// ---------------------------------------------------------------------------
// Adjustment values
// ---------------------------------------------------------------------------

/** Clean copy of a stored adjustment, or `null` when it changes nothing (zero offset, no corrections). */
export function normalizeHijriAdjustment(
  adjustment: HijriAdjustment | null | undefined,
): HijriAdjustment | null {
  const clean = sanitizeHijriAdjustment(adjustment);
  if (!clean) return null;
  const hasCorrections = clean.monthStarts && Object.keys(clean.monthStarts).length > 0;
  if (clean.offsetDays === 0 && !hasCorrections) return null;
  return clean;
}

/** True when the adjustment leaves every date exactly as computed. */
export function isNeutralHijriAdjustment(adjustment: HijriAdjustment | null | undefined): boolean {
  return normalizeHijriAdjustment(adjustment) === null;
}

/** Stable identity of the parts that affect dates (offset + corrections). */
export function hijriAdjustmentSignature(adjustment: HijriAdjustment | null | undefined): string {
  const clean = normalizeHijriAdjustment(adjustment);
  if (!clean) return "0";
  const starts = Object.entries(clean.monthStarts ?? {})
    .map(([key, iso]) => `${key}=${iso}`)
    .join(",");
  return `${clean.offsetDays}|${starts}`;
}

function parseCorrections(
  monthStarts: HijriAdjustment["monthStarts"],
): { index: number; jdn: number; key: HijriMonthKey; date: string }[] {
  const list: { index: number; jdn: number; key: HijriMonthKey; date: string }[] = [];
  for (const [key, date] of Object.entries(monthStarts ?? {})) {
    const month = parseHijriMonthKey(key);
    const jdn = isoDateToJDN(date);
    if (!month || jdn === null) continue;
    list.push({
      index: hijriMonthIndex(month.year, month.month),
      jdn,
      key: key as HijriMonthKey,
      date,
    });
  }
  return list.sort((a, b) => a.index - b.index);
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

// ---------------------------------------------------------------------------
// The adjusted calendar
// ---------------------------------------------------------------------------

/**
 * Effective calendar for `base` under `adjustment`. Base starts are fetched
 * lazily and memoised; correction chains are resolved only up to the month a
 * caller asks about, so months before the earliest correction cost nothing
 * beyond the base lookup.
 */
export function createAdjustedCalendar(
  base: HijriBaseCalendar,
  adjustment: HijriAdjustment | null | undefined,
): AdjustedHijriCalendar {
  const clean = sanitizeHijriAdjustment(adjustment);
  const offset: number = clean?.offsetDays ?? 0;
  const corrections = parseCorrections(clean?.monthStarts);
  const baseStarts = new Map<number, number>();
  const perturbed = new Map<number, number>();
  let nextCorrection = 0;

  const predictedStart = (index: number): number => {
    let start = baseStarts.get(index);
    if (start === undefined) {
      start = base.monthStart(index) + offset;
      baseStarts.set(index, start);
    }
    return start;
  };
  const resolvedStart = (index: number): number => perturbed.get(index) ?? predictedStart(index);

  /** Applies the chain that begins at the next unprocessed correction, until it converges. */
  const runChain = () => {
    let index = corrections[nextCorrection].index;
    let steps = 0;
    for (;;) {
      const correction =
        nextCorrection < corrections.length && corrections[nextCorrection].index === index
          ? corrections[nextCorrection]
          : null;
      if (correction) nextCorrection += 1;
      const predicted = predictedStart(index);
      const previous = resolvedStart(index - 1);
      const wanted =
        correction && Math.abs(correction.jdn - predicted) <= MAX_CORRECTION_DELTA
          ? correction.jdn
          : predicted;
      const start = clamp(wanted, previous + 29, previous + 30);
      if (start !== predicted) perturbed.set(index, start);
      const nextIsCorrected =
        nextCorrection < corrections.length && corrections[nextCorrection].index === index + 1;
      steps += 1;
      if (!nextIsCorrected && (start === predicted || steps >= MAX_CHAIN_MONTHS)) return;
      index += 1;
    }
  };

  /** Resolves every correction chain that can affect months up to `index`. */
  const ensureThrough = (index: number) => {
    while (nextCorrection < corrections.length && corrections[nextCorrection].index <= index) {
      runChain();
    }
  };

  const monthStart = (index: number): number => {
    ensureThrough(index);
    return resolvedStart(index);
  };

  const monthLength = (index: number): number => {
    ensureThrough(index + 1);
    return resolvedStart(index + 1) - resolvedStart(index);
  };

  const toHijri = (jdn: number): HijriDate => {
    const guess = base.monthIndexOf(jdn);
    ensureThrough(guess + 3);
    // |S − B| ≤ |offset| + 2 ≤ 4 days, so the effective month is a neighbour of the base one.
    let best = guess;
    for (let index = guess - 2; index <= guess + 2; index += 1) {
      const start = resolvedStart(index);
      if (start <= jdn && jdn < resolvedStart(index + 1)) {
        const { year, month } = hijriMonthFromIndex(index);
        return { year, month, day: jdn - start + 1 };
      }
      if (start <= jdn) best = index;
    }
    const { year, month } = hijriMonthFromIndex(best);
    return { year, month, day: jdn - resolvedStart(best) + 1 };
  };

  const toJDN = (year: number, month: number, day: number): number => {
    const index = hijriMonthIndex(year, month);
    const start = monthStart(index);
    return start + Math.min(day, monthLength(index)) - 1;
  };

  const resolveAll = () => {
    const last = corrections[corrections.length - 1];
    if (last) ensureThrough(last.index + 1);
  };

  const affectedMonths = (): AffectedHijriMonth[] => {
    resolveAll();
    const correctedIndices = new Set(corrections.map((c) => c.index));
    const candidates = new Set<number>();
    for (const index of perturbed.keys()) {
      candidates.add(index - 1);
      candidates.add(index);
    }
    for (const index of correctedIndices) candidates.add(index);
    const result: AffectedHijriMonth[] = [];
    for (const index of [...candidates].sort((a, b) => a - b)) {
      const start = resolvedStart(index);
      const length = resolvedStart(index + 1) - start;
      const predicted = predictedStart(index);
      const predictedLength = predictedStart(index + 1) - predicted;
      const corrected = correctedIndices.has(index);
      if (start === predicted && length === predictedLength && !corrected) continue;
      const { year, month } = hijriMonthFromIndex(index);
      result.push({
        year,
        month,
        start,
        predictedStart: predicted,
        length,
        predictedLength,
        corrected,
      });
    }
    return result;
  };

  const correctionList = (): HijriMonthCorrection[] => {
    resolveAll();
    return corrections.map(({ index, jdn, key, date }) => {
      const { year, month } = hijriMonthFromIndex(index);
      return { key, year, month, date, applied: resolvedStart(index) === jdn };
    });
  };

  return {
    predictedStart,
    monthStart,
    monthLength,
    toHijri,
    toJDN,
    affectedMonths,
    corrections: correctionList,
  };
}

// ---------------------------------------------------------------------------
// "This month started on…" choices
// ---------------------------------------------------------------------------

export interface MonthStartChoice {
  /** JDN of the proposed day 1. */
  jdn: number;
  /** Gregorian ISO date of the proposed day 1. */
  date: string;
  /** Days relative to the prediction (−2…+2). */
  delta: number;
  isPredicted: boolean;
  isCurrent: boolean;
}

export interface MonthStartChoices {
  year: number;
  month: number;
  /** Predicted day 1 (with every other correction applied, but not this month's own). */
  predicted: number;
  /** Effective day 1 right now. */
  current: number;
  /** True when this month has a stored correction. */
  corrected: boolean;
  /** Only choices that keep the previous month at 29 or 30 days, earliest first. */
  choices: MonthStartChoice[];
  /** A later start would make the previous month 31 days — correct the previous month first. */
  laterNeedsPreviousMonth: boolean;
  /** An earlier start would make the previous month 28 days — correct the previous month first. */
  earlierNeedsPreviousMonth: boolean;
}

/**
 * Valid "this month started on…" options for a Hijri month: the predicted day
 * 1 and up to two days either side, filtered to the starts that keep the
 * previous month 29 or 30 days and stay within ±2 days of `S₀`.
 */
export function monthStartChoices(
  base: HijriBaseCalendar,
  adjustment: HijriAdjustment | null | undefined,
  year: number,
  month: number,
): MonthStartChoices {
  const index = hijriMonthIndex(year, month);
  const key = hijriMonthKey(year, month);
  const withoutThis = createAdjustedCalendar(
    base,
    withMonthStartValue(adjustment, key, null) ?? null,
  );
  const current = createAdjustedCalendar(base, adjustment).monthStart(index);
  const predicted = withoutThis.monthStart(index);
  const previous = withoutThis.monthStart(index - 1);
  const s0 = withoutThis.predictedStart(index);
  const isValid = (jdn: number) =>
    jdn >= previous + 29 && jdn <= previous + 30 && Math.abs(jdn - s0) <= MAX_CORRECTION_DELTA;

  const choices: MonthStartChoice[] = [];
  for (let delta = -MAX_CORRECTION_DELTA; delta <= MAX_CORRECTION_DELTA; delta += 1) {
    const jdn = predicted + delta;
    if (!isValid(jdn)) continue;
    choices.push({
      jdn,
      date: jdnToIsoDate(jdn),
      delta,
      isPredicted: delta === 0,
      isCurrent: jdn === current,
    });
  }
  const corrected = Boolean(sanitizeHijriAdjustment(adjustment)?.monthStarts?.[key]);
  return {
    year,
    month,
    predicted,
    current,
    corrected,
    choices,
    laterNeedsPreviousMonth: predicted + 1 > previous + 30,
    earlierNeedsPreviousMonth: predicted - 1 < previous + 29,
  };
}

// ---------------------------------------------------------------------------
// Editing helpers (pure; return the next stored value, `undefined` when neutral)
// ---------------------------------------------------------------------------

export interface HijriAdjustmentMeta {
  /** Fingerprint of the current method/location ({@link hijriBasisFingerprint}). */
  basis: string;
  /** Display name of the current place. */
  basisPlace?: string;
  /** ISO timestamp of the edit. */
  updatedAt: string;
}

function finalize(
  next: Omit<HijriAdjustment, "updatedAt">,
  meta: HijriAdjustmentMeta,
): HijriAdjustment | undefined {
  const value: HijriAdjustment = { ...next, updatedAt: meta.updatedAt };
  if (!value.monthStarts || Object.keys(value.monthStarts).length === 0) {
    delete value.monthStarts;
  }
  if (value.offsetDays === 0 && !value.monthStarts) return undefined;
  if (meta.basis) value.basis = meta.basis;
  else delete value.basis;
  if (meta.basisPlace) value.basisPlace = meta.basisPlace;
  else delete value.basisPlace;
  return value;
}

function withMonthStartValue(
  adjustment: HijriAdjustment | null | undefined,
  key: HijriMonthKey,
  date: string | null,
): HijriAdjustment | undefined {
  const clean = sanitizeHijriAdjustment(adjustment);
  const monthStarts = { ...(clean?.monthStarts ?? {}) };
  if (date) monthStarts[key] = date;
  else delete monthStarts[key];
  const offsetDays = clean?.offsetDays ?? 0;
  if (offsetDays === 0 && Object.keys(monthStarts).length === 0) return undefined;
  return {
    ...(clean ?? { updatedAt: new Date(0).toISOString() }),
    offsetDays,
    monthStarts,
  };
}

/** Sets the whole-calendar offset (−2…+2), keeping per-month corrections. */
export function withHijriOffset(
  adjustment: HijriAdjustment | null | undefined,
  offsetDays: HijriOffsetDays,
  meta: HijriAdjustmentMeta,
): HijriAdjustment | undefined {
  const clean = sanitizeHijriAdjustment(adjustment);
  return finalize({ ...clean, offsetDays }, meta);
}

/**
 * Records "this month started on `date`" (or clears the month with `null`).
 * Choosing the predicted start clears the correction — nothing to store.
 */
export function withHijriMonthStart(
  base: HijriBaseCalendar,
  adjustment: HijriAdjustment | null | undefined,
  year: number,
  month: number,
  date: string | null,
  meta: HijriAdjustmentMeta,
): HijriAdjustment | undefined {
  const key = hijriMonthKey(year, month);
  let stored = date;
  if (date) {
    const choices = monthStartChoices(base, adjustment, year, month);
    const jdn = isoDateToJDN(date);
    if (jdn === null || !choices.choices.some((choice) => choice.jdn === jdn)) {
      return sanitizeHijriAdjustment(adjustment) ?? undefined;
    }
    if (jdn === choices.predicted) stored = null;
  }
  const next = withMonthStartValue(adjustment, key, stored);
  return next ? finalize(next, meta) : undefined;
}

/** Removes every per-month correction, keeping the offset. */
export function withoutHijriMonthStarts(
  adjustment: HijriAdjustment | null | undefined,
  meta: HijriAdjustmentMeta,
): HijriAdjustment | undefined {
  const clean = sanitizeHijriAdjustment(adjustment);
  if (!clean) return undefined;
  return finalize({ offsetDays: clean.offsetDays }, meta);
}

/** "Keep" after a move: re-stamps the corrections with the current basis. */
export function withHijriBasis(
  adjustment: HijriAdjustment | null | undefined,
  meta: HijriAdjustmentMeta,
): HijriAdjustment | undefined {
  const clean = sanitizeHijriAdjustment(adjustment);
  if (!clean) return undefined;
  return finalize(clean, meta);
}

// ---------------------------------------------------------------------------
// Basis fingerprint (warn after a move)
// ---------------------------------------------------------------------------

/**
 * Fingerprint of the prediction method: `"umalqura"` without a sighting
 * observer, otherwise `"sighting:<lat>,<lon>"` rounded to whole degrees (≈ 100
 * km — crescent visibility barely changes within that distance, so a move
 * across town never triggers the "made for <old place>" card).
 */
export function hijriBasisFingerprint(
  observer: { latitude: number; longitude: number } | null,
): string {
  if (!observer) return "umalqura";
  const lat = Math.round(observer.latitude) || 0;
  const lon = Math.round(observer.longitude) || 0;
  return `sighting:${lat},${lon}`;
}

/** True when per-month corrections exist and were made under a different basis. */
export function hijriBasisMismatch(
  adjustment: HijriAdjustment | null | undefined,
  currentBasis: string,
): boolean {
  const clean = sanitizeHijriAdjustment(adjustment);
  if (!clean?.monthStarts || Object.keys(clean.monthStarts).length === 0) return false;
  return Boolean(clean.basis) && clean.basis !== currentBasis;
}

/** Which prediction source a basis describes, for the sheet's note. */
export function hijriBasisSource(basis: string): "umalqura" | "sighting" {
  return basis.startsWith("sighting:") ? "sighting" : "umalqura";
}
