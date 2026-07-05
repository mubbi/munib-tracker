import { QAZA_PRAYERS } from "../constants/index";
import type { QazaDailyProgress, QazaPrayer, QazaSchedule } from "../types/index";
import { addDays, getLocalDateString } from "./date";

/** Sums all per-prayer targets in a qaza schedule. */
export function sumQazaScheduleTargets(schedule?: QazaSchedule): number {
  if (!schedule) return 0;
  return QAZA_PRAYERS.reduce(
    (sum, prayerId) => sum + Math.max(0, schedule.targets[prayerId] ?? 0),
    0,
  );
}

/** Sums all per-prayer completions for a day. */
export function sumQazaDailyProgress(progress?: QazaDailyProgress): number {
  if (!progress) return 0;
  return QAZA_PRAYERS.reduce(
    (sum, prayerId) => sum + Math.max(0, progress.completed[prayerId] ?? 0),
    0,
  );
}

export interface QazaCalculatorInput {
  /** Current age in years. */
  currentAge: number;
  /** Age at which prayers became obligatory (puberty). */
  pubertyAge: number;
  /** Whole years during which prayers were performed consistently. */
  yearsPrayedConsistently: number;
  /** Use the lunar year (354 days) rather than the solar year (365). Default true. */
  useLunarYear?: boolean;
  /** Days per year with no prayers owed (e.g. menstruation) — subtracted from the total. */
  annualExemptDays?: number;
}

export interface QazaCalculatorResult {
  missedYears: number;
  missedDays: number;
  /** Missed count for a single prayer slot (equal across prayers). */
  perPrayer: number;
  byPrayer: Record<QazaPrayer, number>;
}

/**
 * Estimates lifetime missed obligatory prayers (Qaza-e-Umri).
 *
 * Formula: missedYears = max(0, currentAge − pubertyAge − yearsPrayedConsistently).
 * missedDays = round(missedYears × daysPerYear) − (annualExemptDays × missedYears).
 * Each missed day owes one of every fard prayer (and optionally Witr for qaza tracking).
 * This is an estimate only — consult a scholar.
 */
export function computeLifetimeMissedPrayers(input: QazaCalculatorInput): QazaCalculatorResult {
  const daysPerYear = input.useLunarYear === false ? 365 : 354;
  const missedYears = Math.max(
    0,
    input.currentAge - input.pubertyAge - input.yearsPrayedConsistently,
  );
  const exempt = Math.max(0, input.annualExemptDays ?? 0) * missedYears;
  const missedDays = Math.max(0, Math.round(missedYears * daysPerYear - exempt));

  const byPrayer = {} as Record<QazaPrayer, number>;
  for (const prayerId of QAZA_PRAYERS) byPrayer[prayerId] = missedDays;

  return { missedYears, missedDays, perPrayer: missedDays, byPrayer };
}

/**
 * Estimates when a qaza backlog will be cleared given a fixed daily rate.
 * Returns null when the daily target is not positive.
 */
export function computeQazaEta(
  remainingTotal: number,
  dailyTarget: number,
  today: string = getLocalDateString(),
): { days: number; date: string } | null {
  if (dailyTarget <= 0 || remainingTotal <= 0) return null;
  const days = Math.ceil(remainingTotal / dailyTarget);
  return { days, date: addDays(today, days) };
}

/**
 * Suggests per-prayer daily qaza targets that clear the whole backlog in about
 * `days` days (NF-1.16). Each prayer is spread independently so the plan finishes
 * every prayer's debt within the horizon; prayers with no debt are omitted.
 */
export function suggestDailyQazaTargets(
  counters: { prayerId: QazaPrayer; remaining: number }[],
  days: number,
): Partial<Record<QazaPrayer, number>> {
  const horizon = Math.max(1, Math.floor(days));
  const targets: Partial<Record<QazaPrayer, number>> = {};
  for (const counter of counters) {
    if (counter.remaining > 0) targets[counter.prayerId] = Math.ceil(counter.remaining / horizon);
  }
  return targets;
}

export interface DayDurationParts {
  years: number;
  months: number;
  days: number;
}

/** Splits a day count into years, months, and days for human-readable ETA display. */
export function breakDownDayDuration(
  totalDays: number,
  daysPerYear = 365,
  daysPerMonth = 30,
): DayDurationParts {
  const safe = Math.max(0, Math.floor(totalDays));
  const years = Math.floor(safe / daysPerYear);
  const afterYears = safe % daysPerYear;
  const months = Math.floor(afterYears / daysPerMonth);
  const days = afterYears % daysPerMonth;
  return { years, months, days };
}

/** Estimates missed fasts from whole years, defaulting to ~30 days of Ramadan per year. */
export function computeMissedFasts(years: number, daysPerYear = 30): number {
  return Math.max(0, Math.round(years * daysPerYear));
}

/** Sustainability tiers for daily qaza volume — favors long-term consistency over intensity. */
export type QazaSustainabilityLevel = "easy" | "moderate" | "challenging" | "intensive";

export type QazaPlanPresetId = "gentle" | "balanced" | "committed" | "intensive" | "custom";

export interface QazaPlanPreset {
  id: Exclude<QazaPlanPresetId, "custom">;
  /** Same count applied to each prayer slot that still has debt. */
  perPrayer: number;
  recommended?: boolean;
}

/** Preset daily per-prayer targets — balanced (3 each) is the default recommendation. */
export const QAZA_PLAN_PRESETS: readonly QazaPlanPreset[] = [
  { id: "gentle", perPrayer: 1 },
  { id: "balanced", perPrayer: 3, recommended: true },
  { id: "committed", perPrayer: 5 },
  { id: "intensive", perPrayer: 10 },
] as const;

/** Rough average minutes per make-up prayer (recitation + ruku/sujud). */
export const QAZA_MINUTES_PER_PRAYER = 2.5;

/** Sets the same daily target on every prayer slot that still has remaining debt. */
export function buildUniformQazaTargets(
  counters: { prayerId: QazaPrayer; remaining: number }[],
  perPrayer: number,
): Partial<Record<QazaPrayer, number>> {
  const safePerPrayer = Math.max(0, Math.floor(perPrayer));
  const targets: Partial<Record<QazaPrayer, number>> = {};
  for (const counter of counters) {
    if (counter.remaining > 0 && safePerPrayer > 0) {
      targets[counter.prayerId] = safePerPrayer;
    }
  }
  return targets;
}

/** Maps a daily qaza total to a sustainability label for planner guidance. */
export function classifyQazaSustainability(dailyTotal: number): QazaSustainabilityLevel | null {
  if (dailyTotal <= 0) return null;
  if (dailyTotal <= 12) return "easy";
  if (dailyTotal <= 30) return "moderate";
  if (dailyTotal <= 60) return "challenging";
  return "intensive";
}

/** Estimates how many minutes qaza may take at the current daily pace. */
export function estimateQazaDailyMinutes(
  dailyTotal: number,
  minutesPerPrayer = QAZA_MINUTES_PER_PRAYER,
): number {
  if (dailyTotal <= 0) return 0;
  return Math.round(dailyTotal * minutesPerPrayer);
}

/** Detects whether the schedule is a uniform preset across prayers with debt. */
export function matchQazaPlanPreset(
  targets: Partial<Record<QazaPrayer, number>>,
  counters: { prayerId: QazaPrayer; remaining: number }[],
): QazaPlanPresetId {
  const active = counters.filter((counter) => counter.remaining > 0);
  if (active.length === 0) return "custom";

  const values = active.map((counter) => targets[counter.prayerId] ?? 0);
  const perPrayer = values[0] ?? 0;
  if (perPrayer <= 0 || values.some((value) => value !== perPrayer)) return "custom";

  for (const preset of QAZA_PLAN_PRESETS) {
    if (preset.perPrayer === perPrayer) return preset.id;
  }
  return "custom";
}
