import { QURAN_TOTAL_AYAHS, QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";
import { getLocalDateString } from "@munib-tracker/shared/utils";

/** Total ayahs in the Qur'an — the finish line for any ayah-based khatm plan. */
export { QURAN_TOTAL_AYAHS, QURAN_TOTAL_PAGES };

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
  /** Track progress by ayah count or mushaf pages. */
  unit?: "ayah" | "page";
}

/** Ayahs to read per day to finish on schedule. */
export function dailyAyahTarget(days: number): number {
  return Math.ceil(QURAN_TOTAL_AYAHS / Math.max(1, days));
}

/** Mushaf pages to read per day to finish on schedule. */
export function dailyPageTarget(days: number): number {
  return Math.ceil(QURAN_TOTAL_PAGES / Math.max(1, days));
}

export function khatmTotalForUnit(unit: "ayah" | "page" = "ayah"): number {
  return unit === "page" ? QURAN_TOTAL_PAGES : QURAN_TOTAL_AYAHS;
}

export function dailyTargetForPlan(plan: KhatmPlan): number {
  return plan.unit === "page" ? dailyPageTarget(plan.days) : dailyAyahTarget(plan.days);
}

/** Parses pages to log in one session (1 … remaining). */
export function parseKhatmLogPages(raw: string, pagesRead: number): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const amount = Number.parseInt(trimmed, 10);
  const max = pagesRemaining(pagesRead);
  if (!Number.isFinite(amount) || amount < 1 || amount > max) return null;
  return amount;
}

/** Parses an absolute total-page count for manual correction. */
export function parseKhatmTotalPages(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const total = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(total) || total < 0 || total > QURAN_TOTAL_PAGES) return null;
  return total;
}

export function pagesRemaining(pagesRead: number): number {
  return Math.max(0, QURAN_TOTAL_PAGES - pagesRead);
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
  const total = khatmTotalForUnit(plan.unit ?? "ayah");
  const daily = dailyTargetForPlan(plan);
  return Math.min(total, daily * dayNumber);
}

export type KhatmPace = "ahead" | "onTrack" | "behind" | "done";

/** Compares actual reading against the expected pace for a status pill. */
export function khatmPace(
  plan: KhatmPlan,
  read: number,
  today: string = getLocalDateString(),
): KhatmPace {
  const total = khatmTotalForUnit(plan.unit ?? "ayah");
  if (read >= total) return "done";
  const expected = expectedAyahsByToday(plan, today);
  if (read >= expected) return read > expected ? "ahead" : "onTrack";
  return "behind";
}

/** Whole-percent completion toward finishing the Qur'an. */
export function khatmPercentComplete(read: number, unit: "ayah" | "page" = "ayah"): number {
  const total = khatmTotalForUnit(unit);
  return Math.min(100, Math.round((read / total) * 100));
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
