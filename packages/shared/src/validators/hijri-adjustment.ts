/*
 * Structural copies of `HijriAdjustment` & co. from `../types/preferences` —
 * kept local so the API (nodenext resolution) can import this file without
 * pulling the shared type graph. They must stay identical to the originals.
 */
type HijriOffsetDays = -2 | -1 | 0 | 1 | 2;
type HijriMonthKey = `${number}-${string}`;
interface HijriAdjustment {
  offsetDays: HijriOffsetDays;
  monthStarts?: Record<HijriMonthKey, string>;
  basis?: string;
  basisPlace?: string;
  updatedAt: string;
}

/**
 * Validation for the synced `UserPreferences.hijriAdjustment` blob (D14). Used
 * by the app when reading preferences and by the API when accepting a pushed
 * preferences record, so both sides agree on what a valid adjustment is.
 * Dependency-free so the API can import it without pulling the shared barrel.
 */

/** Allowed whole-calendar offsets, −2…+2 days. */
export const HIJRI_OFFSET_DAYS: readonly HijriOffsetDays[] = [-2, -1, 0, 1, 2];

/** Upper bound on stored per-month corrections (≈ 20 years of monthly announcements). */
export const MAX_HIJRI_MONTH_CORRECTIONS = 240;

/** `"YYYY-MM"` Hijri month key, years 1–9999, months 01–12. */
const MONTH_KEY_RE = /^(\d{1,4})-(0[1-9]|1[0-2])$/;
/** `"YYYY-MM-DD"` Gregorian ISO calendar date. */
const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_BASIS_LENGTH = 64;
const MAX_PLACE_LENGTH = 120;

export function isHijriOffsetDays(value: unknown): value is HijriOffsetDays {
  return typeof value === "number" && (HIJRI_OFFSET_DAYS as readonly number[]).includes(value);
}

export function isHijriMonthKey(value: unknown): value is HijriMonthKey {
  return typeof value === "string" && MONTH_KEY_RE.test(value);
}

/** True for a real Gregorian calendar date in `YYYY-MM-DD` form. */
export function isIsoCalendarDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = ISO_DATE_RE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return (
    date.getUTCFullYear() === Number(y) &&
    date.getUTCMonth() === Number(m) - 1 &&
    date.getUTCDate() === Number(d)
  );
}

/**
 * Returns a clean copy of a stored/pushed adjustment, or `undefined` when the
 * value is not a usable adjustment. Invalid individual month corrections are
 * dropped (never the whole blob), so one bad entry can't wipe the others.
 */
export function sanitizeHijriAdjustment(value: unknown): HijriAdjustment | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  if (!isHijriOffsetDays(raw.offsetDays)) return undefined;
  if (typeof raw.updatedAt !== "string" || Number.isNaN(Date.parse(raw.updatedAt))) {
    return undefined;
  }
  const result: HijriAdjustment = { offsetDays: raw.offsetDays, updatedAt: raw.updatedAt };

  if (raw.monthStarts && typeof raw.monthStarts === "object" && !Array.isArray(raw.monthStarts)) {
    const entries = Object.entries(raw.monthStarts as Record<string, unknown>)
      .filter(
        (entry): entry is [HijriMonthKey, string] =>
          isHijriMonthKey(entry[0]) && isIsoCalendarDate(entry[1]),
      )
      .sort(([a], [b]) => compareMonthKeys(a, b))
      .slice(-MAX_HIJRI_MONTH_CORRECTIONS);
    if (entries.length > 0) {
      result.monthStarts = Object.fromEntries(entries) as Record<HijriMonthKey, string>;
    }
  }
  if (typeof raw.basis === "string" && raw.basis.length > 0) {
    result.basis = raw.basis.slice(0, MAX_BASIS_LENGTH);
  }
  if (typeof raw.basisPlace === "string" && raw.basisPlace.length > 0) {
    result.basisPlace = raw.basisPlace.slice(0, MAX_PLACE_LENGTH);
  }
  return result;
}

/** True when a value passes {@link sanitizeHijriAdjustment} unchanged in meaning. */
export function isHijriAdjustment(value: unknown): value is HijriAdjustment {
  return sanitizeHijriAdjustment(value) !== undefined;
}

function compareMonthKeys(a: string, b: string): number {
  const index = (key: string) => {
    const [year = 0, month = 0] = key.split("-").map(Number);
    return year * 12 + month;
  };
  return index(a) - index(b);
}
