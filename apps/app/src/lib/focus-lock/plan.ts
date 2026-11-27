import type {
  FocusLockAnchor,
  FocusLockPrayer,
  FocusLockPrefs,
  ObligatoryPrayer,
} from "@munib-tracker/shared/types";

import { FOCUS_LOCK_BOUNDS } from "./prefs";
import { SAT_SUN } from "./weekend";

/**
 * NF-3.13 focus-lock planner (pure). Turns the user's prefs plus the day's
 * computed adhan (and optional iqamah) times into concrete lock windows that
 * the native schedulers (DeviceActivity / AlarmManager) arm.
 *
 * Plan §NF-3.13 "Conditions":
 * 1. Windows for today and tomorrow from `prayer-times.ts` (tuned times come in
 *    already adjusted; see `inputs.ts`), anchored at the adhan or the iqamah.
 * 2. Skip a window when the salah is already completed, an excused period is
 *    active (and `pauseWhileExcused`), the date is quiet, or (Jumu'ah) it isn't
 *    Friday. On Friday the Jumu'ah window replaces the Dhuhr window.
 *    "Weekdays only" skips the user's weekend days (D37: their choice, else the
 *    region default — resolved by the caller, see `weekend.ts`). It applies to
 *    the daily windows only: a Jumu'ah window the user turned on always locks,
 *    even where Friday is a weekend day (Gulf Fri+Sat) — Qur'an 62:9 is about
 *    leaving trade for the Friday prayer, so a weekend never exempts it.
 * 5. Fajr's window ends at sunrise, and is dropped when it would start at or
 *    after sunrise (late reminder offset or iqamah anchor) — its time is over.
 * 6. A window ended early by an unlock stays ended: when a merged window
 *    (`maghrib+isha`) was unlocked and one of its prayers is then marked, the
 *    re-plan's remaining part (`isha`) is not re-armed.
 * 3. The Jumu'ah window (D38) has its own length (`jumuahDurationMin`, default
 *    60) and starts from the masjid's Jumu'ah time when known, else the Dhuhr
 *    adhan (plus the start offset).
 * 4. Overlapping windows merge (e.g. Maghrib → Isha at high latitudes).
 */

/**
 * Most windows handed to the native schedulers (two days ≤ 12; iOS caps the
 * number of monitored DeviceActivity schedules, so stay well under it).
 */
export const MAX_WINDOWS = 12;

const MINUTE = 60_000;
const FRIDAY = 5;

export interface FocusDayInput {
  /** Local date `YYYY-MM-DD`. */
  date: string;
  /** 0 = Sunday … 6 = Saturday (local). */
  weekday: number;
  /** Computed (tuned) adhan instants for the day. Missing / invalid ⇒ that window is skipped. */
  adhan: Partial<Record<ObligatoryPrayer, Date>>;
  /** Fajr's window never runs past sunrise (its time has ended). */
  sunrise?: Date;
  /** Iqamah instants from the home masjid (private or public, NF-3.11), when known. */
  iqamah?: Partial<Record<FocusLockPrayer, Date>>;
}

export interface FocusWindow {
  /** Stable id (`YYYY-MM-DD:dhuhr`, merged: `YYYY-MM-DD:maghrib+isha`). */
  id: string;
  date: string;
  prayers: FocusLockPrayer[];
  start: Date;
  end: Date;
  /** What the first prayer was anchored to (iqamah falls back to adhan when missing). */
  anchor: FocusLockAnchor;
}

export interface PlanFocusInput {
  prefs: FocusLockPrefs;
  days: readonly FocusDayInput[];
  now: Date;
  /** Completed fard per local date (only today matters in practice). */
  completed?: Readonly<Record<string, Partial<Record<ObligatoryPrayer, boolean>>>>;
  /** True while `activeExcusedReason` is set. */
  excused?: boolean;
  /**
   * `prayerReminderOffsets` (minutes, ± from the adhan). For an adhan-anchored
   * window the lock never starts before the user's own reminder for that salah,
   * so a late reminder ("remind me 10 min after the adhan") is respected.
   */
  reminderOffsets?: Partial<Record<ObligatoryPrayer, number>>;
  /** Windows already ended early (marked prayed, emergency unlock) — not re-armed. */
  endedIds?: readonly string[];
  /**
   * Days "Weekdays only" skips (0 = Sunday … 6 = Saturday), already resolved
   * from the user's choice or region (`effectiveWeekendDays`). Falls back to
   * `prefs.schedule.weekendDays`, then Saturday + Sunday.
   */
  weekendDays?: readonly number[];
}

export type FocusSkipReason =
  | "disabled"
  | "excused"
  | "quiet"
  | "weekend"
  | "notFriday"
  | "completed";

/** The fard a window's completion is read from (Jumu'ah is logged as Dhuhr). */
export function fardFor(prayer: FocusLockPrayer): ObligatoryPrayer {
  return prayer === "jumuah" ? "dhuhr" : prayer;
}

function isValid(date: Date | undefined): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/** Why a prayer's window on a day is skipped, or `null` when it is planned. */
export function focusSkipReason(
  prayer: FocusLockPrayer,
  day: Pick<FocusDayInput, "date" | "weekday">,
  input: Pick<PlanFocusInput, "prefs" | "completed" | "excused" | "weekendDays">,
): FocusSkipReason | null {
  const { prefs } = input;
  if (!prefs.enabled || !prefs.prayers.includes(prayer)) return "disabled";
  if (input.excused && prefs.pauseWhileExcused) return "excused";
  if (prefs.schedule.quietDates?.includes(day.date)) return "quiet";
  // Weekdays-only never skips the Jumu'ah window (see 2. above).
  if (prefs.schedule.weekdaysOnly && prayer !== "jumuah") {
    const weekend = input.weekendDays ?? prefs.schedule.weekendDays ?? SAT_SUN;
    if (weekend.includes(day.weekday)) return "weekend";
  }
  const friday = day.weekday === FRIDAY;
  if (prayer === "jumuah" && !friday) return "notFriday";
  // On Friday the Jumu'ah window replaces Dhuhr (when the user chose Jumu'ah).
  if (prayer === "dhuhr" && friday && prefs.prayers.includes("jumuah")) return "disabled";
  if (input.completed?.[day.date]?.[fardFor(prayer)]) return "completed";
  return null;
}

function windowFor(
  prayer: FocusLockPrayer,
  day: FocusDayInput,
  input: PlanFocusInput,
): FocusWindow | null {
  const { prefs } = input;
  const adhan = day.adhan[fardFor(prayer)];
  if (!isValid(adhan)) return null;
  const iqamah = day.iqamah?.[prayer];
  const jumuah = prayer === "jumuah";
  // Jumu'ah runs from the masjid's Jumu'ah time whenever it is known (D38): the
  // computed Dhuhr adhan can be well before the khutbah.
  const useIqamah = (jumuah || prefs.start.anchor === "iqamah") && isValid(iqamah);
  const anchorAt = useIqamah ? iqamah : adhan;

  const { min: minOffset, max: maxOffset } = FOCUS_LOCK_BOUNDS.offsetMin;
  const offsetMin = Number.isFinite(prefs.start.offsetMin)
    ? Math.min(maxOffset, Math.max(minOffset, prefs.start.offsetMin))
    : 0;
  let start = anchorAt.getTime() + offsetMin * MINUTE;
  if (!useIqamah) {
    const reminder = input.reminderOffsets?.[fardFor(prayer)];
    if (typeof reminder === "number" && Number.isFinite(reminder)) {
      start = Math.max(start, adhan.getTime() + reminder * MINUTE);
    }
  }
  let end = start + (jumuah ? prefs.jumuahDurationMin : prefs.durationMin) * MINUTE;
  if (prayer === "fajr" && isValid(day.sunrise)) {
    // Fajr's time ends at sunrise, whatever pushed the start (offset, late
    // reminder, iqamah anchor): never lock after it.
    if (start >= day.sunrise.getTime()) return null;
    end = Math.min(end, day.sunrise.getTime());
  }
  if (end <= start) return null;
  return {
    id: `${day.date}:${prayer}`,
    date: day.date,
    prayers: [prayer],
    start: new Date(start),
    end: new Date(end),
    anchor: useIqamah ? "iqamah" : "adhan",
  };
}

/** A merged window plus the ids of the single-prayer windows it was built from. */
interface MergedWindow {
  window: FocusWindow;
  parts: string[];
}

function mergeWithParts(windows: readonly FocusWindow[]): MergedWindow[] {
  const sorted = [...windows].sort((a, b) => a.start.getTime() - b.start.getTime());
  const out: MergedWindow[] = [];
  for (const w of sorted) {
    const last = out[out.length - 1];
    if (last && w.start.getTime() <= last.window.end.getTime()) {
      const prayers = [...last.window.prayers, ...w.prayers];
      last.window = {
        ...last.window,
        id: `${last.window.date}:${prayers.join("+")}`,
        prayers,
        end: new Date(Math.max(last.window.end.getTime(), w.end.getTime())),
      };
      last.parts.push(w.id);
    } else {
      out.push({ window: { ...w }, parts: [w.id] });
    }
  }
  return out;
}

/** Merges overlapping or touching windows (input sorted by start). */
export function mergeWindows(windows: readonly FocusWindow[]): FocusWindow[] {
  return mergeWithParts(windows).map((m) => m.window);
}

function rawWindows(input: PlanFocusInput): FocusWindow[] {
  const raw: FocusWindow[] = [];
  for (const day of input.days) {
    for (const prayer of input.prefs.prayers) {
      if (focusSkipReason(prayer, day, input)) continue;
      const w = windowFor(prayer, day, input);
      if (w) raw.push(w);
    }
  }
  return raw;
}

/**
 * Single-prayer window ids covered by an ended merged window. The merged id is
 * rebuilt both with today's completions and without them (the unlock may have
 * come before a prayer in it was marked), so marking one prayer of an unlocked
 * `maghrib+isha` window can't bring the lock back as a fresh `isha` window (L3).
 */
function endedParts(input: PlanFocusInput, ended: ReadonlySet<string>): Set<string> {
  const out = new Set<string>();
  if (![...ended].some((id) => id.includes("+"))) return out;
  const variants = [rawWindows(input), rawWindows({ ...input, completed: undefined })];
  for (const raw of variants) {
    for (const merged of mergeWithParts(raw)) {
      if (ended.has(merged.window.id)) for (const part of merged.parts) out.add(part);
    }
  }
  return out;
}

/** Today's and tomorrow's lock windows, merged, future-or-active only, capped at {@link MAX_WINDOWS}. */
export function planFocusWindows(input: PlanFocusInput): FocusWindow[] {
  if (!input.prefs.enabled) return [];
  const ended = new Set(input.endedIds ?? []);
  const endedPart = endedParts(input, ended);
  const nowMs = input.now.getTime();
  return mergeWithParts(rawWindows(input))
    .filter(
      ({ window: w, parts }) =>
        w.end.getTime() > nowMs && !ended.has(w.id) && !parts.every((part) => endedPart.has(part)),
    )
    .map((m) => m.window)
    .slice(0, MAX_WINDOWS);
}

/** The window running at `now`, if any. */
export function activeWindowAt(windows: readonly FocusWindow[], now: Date): FocusWindow | null {
  const t = now.getTime();
  return windows.find((w) => w.start.getTime() <= t && t < w.end.getTime()) ?? null;
}

/** The next window that hasn't started yet. */
export function nextWindowAfter(windows: readonly FocusWindow[], now: Date): FocusWindow | null {
  const t = now.getTime();
  return windows.find((w) => w.start.getTime() > t) ?? null;
}

/** A one-off window for the setup "Test with a 1-minute window" step. */
export function testWindow(now: Date, minutes = 1): FocusWindow {
  const start = new Date(now.getTime());
  return {
    id: `test:${start.getTime()}`,
    date: "test",
    prayers: [],
    start,
    end: new Date(start.getTime() + minutes * MINUTE),
    anchor: "adhan",
  };
}
