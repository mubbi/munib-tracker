import { getLocalDateString } from "@munib-tracker/shared/utils";

/** Total ayahs in the Qur'an — the finish line for any khatm plan. */
export const QURAN_TOTAL_AYAHS = 6236;

/** Inclusive bounds for a user-entered khatm plan length. */
export const KHATM_MIN_PLAN_DAYS = 1;
export const KHATM_MAX_PLAN_DAYS = 365;

/** Parses a custom plan length from user input; returns null when out of range. */
export function parseKhatmPlanDays(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const days = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(days) || days < KHATM_MIN_PLAN_DAYS || days > KHATM_MAX_PLAN_DAYS) {
    return null;
  }
  return days;
}

/** Parses ayahs to log in one session (1 … remaining). */
export function parseKhatmLogAmount(raw: string, ayahsRead: number): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const amount = Number.parseInt(trimmed, 10);
  const max = ayahsRemaining(ayahsRead);
  if (!Number.isFinite(amount) || amount < 1 || amount > max) return null;
  return amount;
}

/** Parses an absolute total-ayah count for manual correction. */
export function parseKhatmTotalAyahs(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const total = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(total) || total < 0 || total > QURAN_TOTAL_AYAHS) return null;
  return total;
}

/** A khatm (complete-the-Qur'an) reading plan over a fixed number of days. */
export interface KhatmPlan {
  /** Plan length in days (e.g. 30 / 60 / 90). */
  days: number;
  /** ISO date the plan started (YYYY-MM-DD). */
  startDate: string;
}

/** Ayahs to read per day to finish on schedule. */
export function dailyAyahTarget(days: number): number {
  return Math.ceil(QURAN_TOTAL_AYAHS / Math.max(1, days));
}

/** Whole days elapsed since the plan started (0 on the start day). */
export function daysElapsed(plan: KhatmPlan, today: string = getLocalDateString()): number {
  const start = Date.parse(`${plan.startDate}T00:00:00`);
  const now = Date.parse(`${today}T00:00:00`);
  if (Number.isNaN(start) || Number.isNaN(now)) return 0;
  return Math.max(0, Math.floor((now - start) / 86_400_000));
}

/** How many ayahs the reader should have reached by today to stay on schedule. */
export function expectedAyahsByToday(
  plan: KhatmPlan,
  today: string = getLocalDateString(),
): number {
  const dayNumber = Math.min(plan.days, daysElapsed(plan, today) + 1);
  return Math.min(QURAN_TOTAL_AYAHS, dailyAyahTarget(plan.days) * dayNumber);
}

export type KhatmPace = "ahead" | "onTrack" | "behind" | "done";

/** Compares actual reading against the expected pace for a status pill. */
export function khatmPace(
  plan: KhatmPlan,
  ayahsRead: number,
  today: string = getLocalDateString(),
): KhatmPace {
  if (ayahsRead >= QURAN_TOTAL_AYAHS) return "done";
  const expected = expectedAyahsByToday(plan, today);
  if (ayahsRead >= expected) return ayahsRead > expected ? "ahead" : "onTrack";
  return "behind";
}

/** Whole-percent completion toward finishing the Qur'an. */
export function khatmPercentComplete(ayahsRead: number): number {
  return Math.min(100, Math.round((ayahsRead / QURAN_TOTAL_AYAHS) * 100));
}

/** Ayahs still to read before the plan is complete. */
export function ayahsRemaining(ayahsRead: number): number {
  return Math.max(0, QURAN_TOTAL_AYAHS - ayahsRead);
}

/** Positive = ahead of schedule, negative = behind, zero = on track. */
export function scheduleGap(
  plan: KhatmPlan,
  ayahsRead: number,
  today: string = getLocalDateString(),
): number {
  return ayahsRead - expectedAyahsByToday(plan, today);
}
