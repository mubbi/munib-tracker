import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import type { VoluntaryFastingMap } from "@munib-tracker/shared/types";
import { addDays, asVoluntaryFastingMap, getLocalDateString } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { hijriToGregorian } from "@/lib/hijri";
import { isWhiteDayHijri } from "@/lib/white-days";

/**
 * One record of a fast (NF-3.2): the White Days checklist used to keep its own
 * month-scoped ticks (`white_days_checklist`, rows `{ id: "day13", monthKey:
 * "1448-2", completedAt }`). The tracker's White Days section now reads and
 * writes the voluntary-fasting log, so `/fasting` history, stats and the coach
 * see the same fasts. This folds the old ticks into that log.
 *
 * - **One-shot per row.** A row is migrated exactly once: afterwards it carries
 *   `migratedDate` (the date it was folded into), written back to the legacy key
 *   (device-local: the `white_days_checklist` sync entity is retired, so each
 *   device folds its own rows; the fasts sync as `voluntary_fasting`). A later run never
 *   re-derives a date for a consumed row, so changing the Hijri adjustment, a
 *   month correction or the sighting observer can't mint phantom fasts.
 * - A row's stored Gregorian `date` (if any) wins over the Hijri → date mapping.
 * - Installs that ran the earlier every-load migration: a row whose fast already
 *   sits within ±5 days stamped with the row's own `completedAt` is treated as
 *   already migrated (only the migration writes that exact stamp).
 * - A date that already has a voluntary entry (live or tombstone) is never
 *   touched, so a newer choice (or a fast synced from another device) is never overridden.
 * - `updatedAt` is the original tick time, so two devices migrating the same row
 *   write identical entries (per-date LWW stays stable).
 * - Ticks on a day no voluntary fast can be logged (13 Dhul-Hijjah, Ramadan) are
 *   skipped.
 * - The old key is left in place (local only, readable).
 */

export interface LegacyWhiteDayFast {
  /** The legacy row's key in the checklist map (`itemId::monthKey`). */
  key: string;
  date: string;
  completedAt: string;
}

const MONTH_KEY = /^(\d{4})-(\d{1,2})$/;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
/**
 * How far an earlier (pre-marker) run may have mapped a row under another
 * adjustment (offset ±2 plus a month-start correction, with slack).
 */
const PRIOR_RUN_WINDOW_DAYS = 5;

/** Default resolver: Hijri → local date via `lib/hijri.ts` (sighting authority + adjustment). */
function defaultToDate(year: number, month: number, day: number): string {
  return getLocalDateString(hijriToGregorian(year, month, day));
}

/**
 * Pure: the not-yet-migrated legacy checklist rows as `{ key, date, completedAt }`
 * fasts (malformed / blocked / already-consumed rows dropped).
 */
export function legacyWhiteDayFasts(
  rows: unknown,
  toDate: (year: number, month: number, day: number) => string = defaultToDate,
  now: string = new Date().toISOString(),
): LegacyWhiteDayFast[] {
  if (rows == null || typeof rows !== "object") return [];
  const out: LegacyWhiteDayFast[] = [];
  for (const [key, raw] of Object.entries(rows as Record<string, unknown>)) {
    if (raw == null || typeof raw !== "object") continue;
    const row = raw as {
      id?: unknown;
      monthKey?: unknown;
      completedAt?: unknown;
      date?: unknown;
      migratedDate?: unknown;
    };
    if (typeof row.migratedDate === "string") continue;
    const item = WHITE_DAYS_CHECKLIST.find((entry) => entry.id === row.id);
    const match = typeof row.monthKey === "string" ? MONTH_KEY.exec(row.monthKey) : null;
    if (!item || !match) continue;
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month < 1 || month > 12) continue;
    if (!isWhiteDayHijri({ year, month, day: item.hijriDay })) continue;
    const completedAt =
      typeof row.completedAt === "string" && Number.isFinite(Date.parse(row.completedAt))
        ? row.completedAt
        : now;
    const date =
      typeof row.date === "string" && DATE_KEY.test(row.date)
        ? row.date
        : toDate(year, month, item.hijriDay);
    out.push({ key, date, completedAt });
  }
  return out;
}

/** Day offsets to search for a prior run's entry, nearest first (0, -1, +1, -2, +2, …). */
const PRIOR_RUN_OFFSETS = [0].concat(
  ...Array.from({ length: PRIOR_RUN_WINDOW_DAYS }, (_, i) => [-(i + 1), i + 1]),
);

/**
 * The date an earlier (pre-marker) run already folded this fast into: an entry in
 * the log as it was BEFORE this run, near the mapped date, stamped with the row's
 * own tick time and not already claimed by another row of this batch.
 */
function priorRunDate(
  before: VoluntaryFastingMap,
  fast: LegacyWhiteDayFast,
  claimed: Set<string>,
): string | null {
  for (const offset of PRIOR_RUN_OFFSETS) {
    const date = offset === 0 ? fast.date : addDays(fast.date, offset);
    if (claimed.has(date)) continue;
    if (before[date]?.updatedAt === fast.completedAt) return date;
  }
  return null;
}

/**
 * Pure: adds each legacy fast as a `fasted` entry unless an earlier run already
 * folded it in or the date already has an entry (live or tombstone). `consumed`
 * maps every handled row key → the date it now belongs to.
 */
export function importLegacyWhiteDays(
  map: VoluntaryFastingMap,
  fasts: readonly LegacyWhiteDayFast[],
): { map: VoluntaryFastingMap; added: number; consumed: Record<string, string> } {
  let added = 0;
  const next = { ...map };
  const consumed: Record<string, string> = {};
  const claimed = new Set<string>();
  for (const fast of fasts) {
    const prior = priorRunDate(map, fast, claimed);
    if (prior) {
      claimed.add(prior);
      consumed[fast.key] = prior;
      continue;
    }
    consumed[fast.key] = fast.date;
    if (next[fast.date]) continue;
    next[fast.date] = { status: "fasted", updatedAt: fast.completedAt };
    added += 1;
  }
  return { map: next, added, consumed };
}

/**
 * Folds legacy White Days ticks into the voluntary-fasting log, once per row.
 * Returns how many entries were added (0 when there is nothing new). Safe to
 * call on every load.
 */
export async function migrateLegacyWhiteDaysChecklist(): Promise<number> {
  const rows = await readJSON<unknown>(DB_KEYS.whiteDaysChecklist, {});
  const fasts = legacyWhiteDayFasts(rows);
  if (fasts.length === 0) return 0;

  let added = 0;
  let consumed: Record<string, string> = {};
  const current = asVoluntaryFastingMap(await readJSON<unknown>(DB_KEYS.voluntaryFasting, {}));
  const preview = importLegacyWhiteDays(current, fasts);
  if (preview.added === 0) {
    consumed = preview.consumed;
  } else {
    await updateJSON<VoluntaryFastingMap>(DB_KEYS.voluntaryFasting, {}, (stored) => {
      const result = importLegacyWhiteDays(asVoluntaryFastingMap(stored), fasts);
      added = result.added;
      consumed = result.consumed;
      return result.map;
    });
  }

  // Mark the rows consumed so no later run (after an adjustment change) re-maps them.
  const original = rows as Record<string, unknown>;
  await updateJSON<Record<string, unknown>>(DB_KEYS.whiteDaysChecklist, {}, (stored) => {
    const next = { ...(stored ?? {}) };
    for (const [key, date] of Object.entries(consumed)) {
      const row = next[key];
      if (row == null || typeof row !== "object") continue;
      // A row rewritten meanwhile (e.g. re-ticked on an old-release device) is a
      // new tick — leave it for the next run.
      if (JSON.stringify(row) !== JSON.stringify(original[key])) continue;
      next[key] = { ...(row as Record<string, unknown>), migratedDate: date };
    }
    return next;
  });
  return added;
}
