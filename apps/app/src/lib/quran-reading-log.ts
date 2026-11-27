import { addDays } from "@munib-tracker/shared/utils";

/**
 * D40 daily Qur'an reading log: local date (YYYY-MM-DD) → how much was read
 * that day. Recorded by the readers (ayah mode, page/mushaf mode) and Qur'an
 * practice only once the user has actually been reading (see
 * `quran-reading-session.ts`), so the weekly coach can count real reading days
 * instead of approximating them from per-surah `updatedAt` stamps.
 *
 * Synced as blob entity `quran_reading_log` with {@link mergeQuranReadingLog}:
 * a per-date, per-field MAX. That is idempotent and order-independent (a
 * re-pull can never inflate a day); the cost is that the same day read on two
 * devices keeps the larger device's numbers rather than their sum — fine for a
 * "did I read today / how much" signal.
 */

export interface QuranReadingDay {
  /** Active foreground reading time, whole seconds. */
  seconds: number;
  /** Distinct ayahs that settled on screen (ayah mode) or were practised. */
  ayahs: number;
  /** Distinct mushaf pages opened and dwelt on (page mode). */
  pages: number;
}

export type QuranReadingLog = Record<string, QuranReadingDay>;

/** Days kept on device (and in the synced blob); older days are pruned on write. */
export const QURAN_READING_LOG_KEEP_DAYS = 400;

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
/** A day can't hold more than 24 h of reading; also bounds a corrupted/hostile blob. */
const MAX_SECONDS = 86_400;
/** Upper bound for ayahs/pages per day (the whole mushaf several times over). */
const MAX_UNITS = 100_000;

export const EMPTY_READING_DAY: QuranReadingDay = { seconds: 0, ayahs: 0, pages: 0 };

function count(value: unknown, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 0;
  return Math.min(max, Math.floor(value));
}

function sanitizeDay(raw: unknown): QuranReadingDay | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const day = {
    seconds: count(r.seconds, MAX_SECONDS),
    ayahs: count(r.ayahs, MAX_UNITS),
    pages: count(r.pages, MAX_UNITS),
  };
  return isReadingDay(day) ? day : null;
}

/** True when anything was read that day. */
export function isReadingDay(day: QuranReadingDay | undefined | null): boolean {
  return day != null && (day.seconds > 0 || day.ayahs > 0 || day.pages > 0);
}

/** Drops malformed keys/values and empty days (safe on any stored or pulled value). */
export function sanitizeQuranReadingLog(raw: unknown): QuranReadingLog {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: QuranReadingLog = {};
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!DATE_KEY.test(date)) continue;
    const day = sanitizeDay(value);
    if (day) out[date] = day;
  }
  return out;
}

/** Keeps only the last `keepDays` days up to and including `today`. */
export function pruneQuranReadingLog(
  log: QuranReadingLog,
  today: string,
  keepDays = QURAN_READING_LOG_KEEP_DAYS,
): QuranReadingLog {
  const cutoff = addDays(today, -(keepDays - 1));
  let changed = false;
  const out: QuranReadingLog = {};
  for (const [date, day] of Object.entries(log)) {
    if (date < cutoff) {
      changed = true;
      continue;
    }
    out[date] = day;
  }
  return changed ? out : log;
}

/** Adds `delta` to `date` (clamped), then prunes relative to `today`. Returns `log` when nothing changes. */
export function addQuranReading(
  log: QuranReadingLog,
  date: string,
  delta: Partial<QuranReadingDay>,
  today: string = date,
): QuranReadingLog {
  if (!DATE_KEY.test(date)) return log;
  const current = log[date] ?? EMPTY_READING_DAY;
  const next: QuranReadingDay = {
    seconds: Math.min(MAX_SECONDS, current.seconds + count(delta.seconds, MAX_SECONDS)),
    ayahs: Math.min(MAX_UNITS, current.ayahs + count(delta.ayahs, MAX_UNITS)),
    pages: Math.min(MAX_UNITS, current.pages + count(delta.pages, MAX_UNITS)),
  };
  if (
    next.seconds === current.seconds &&
    next.ayahs === current.ayahs &&
    next.pages === current.pages
  ) {
    return log;
  }
  return pruneQuranReadingLog({ ...log, [date]: next }, today);
}

/** Blob-sync merge: union of dates, per-field max on a shared date (idempotent, commutative). */
export function mergeQuranReadingLog(local: unknown, remote: unknown): QuranReadingLog {
  const a = sanitizeQuranReadingLog(local);
  const b = sanitizeQuranReadingLog(remote);
  const out: QuranReadingLog = { ...a };
  for (const [date, day] of Object.entries(b)) {
    const mine = out[date];
    out[date] = mine
      ? {
          seconds: Math.max(mine.seconds, day.seconds),
          ayahs: Math.max(mine.ayahs, day.ayahs),
          pages: Math.max(mine.pages, day.pages),
        }
      : day;
  }
  return out;
}

/** Earliest date with reading in the log, or `null` when it is empty. */
export function firstReadingLogDate(log: QuranReadingLog): string | null {
  let first: string | null = null;
  for (const [date, day] of Object.entries(log)) {
    if (isReadingDay(day) && (first == null || date < first)) first = date;
  }
  return first;
}

/** Dates in `[from, to]` (inclusive) with any reading. */
export function readingDaysBetween(log: QuranReadingLog, from: string, to: string): string[] {
  return Object.keys(log)
    .filter((date) => date >= from && date <= to && isReadingDay(log[date]))
    .sort();
}
