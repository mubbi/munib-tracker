import {
  MADHHAB_IDS,
  type MadhhabId,
  type MadhhabRules,
  rulesForSchool,
} from "@munib-tracker/shared/fiqh";
import type { ExcusedReason, ObligatoryPrayer, PrayerLog } from "@munib-tracker/shared/types";
import { addDays, diffInDays } from "@munib-tracker/shared/utils";

/**
 * Hayd / nifas day counter and gentle prompts (NF-3.0a retrofit, plan §4.1.4).
 * Pure: reads the prayer logs' per-day excused flags and the user's taharah
 * rules (custom `haydMaxDays` / `nifasMaxDays` already applied). Everything it
 * returns is a PROMPT — callers never edit data automatically, and none of it
 * is ever used in notification text (privacy).
 */

export type BloodReason = Extract<ExcusedReason, "hayd" | "nifas">;

export const BLOOD_REASONS: readonly BloodReason[] = ["hayd", "nifas"];

export function isBloodReason(reason: ExcusedReason | null | undefined): reason is BloodReason {
  return reason === "hayd" || reason === "nifas";
}

const FARD: readonly ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

/** How far back a finished short period still gets the "make up these salahs" prompt. */
export const SHORT_PERIOD_PROMPT_DAYS = 15;
/** Previous periods older than this can't affect the purity check (max minimum purity is 15). */
const PURITY_LOOKBACK_DAYS = 60;

export interface ExcusedPeriod {
  reason: BloodReason;
  /** First and last excused calendar day (inclusive), YYYY-MM-DD. */
  start: string;
  end: string;
  days: number;
}

/** Consecutive days carrying the same hayd/nifas reason, oldest first. */
export function bloodPeriods(logs: readonly PrayerLog[]): ExcusedPeriod[] {
  const byDate = new Map<string, BloodReason>();
  for (const log of logs) {
    if (log.isExcused && isBloodReason(log.excusedReason)) byDate.set(log.date, log.excusedReason);
  }
  const dates = [...byDate.keys()].sort();
  const periods: ExcusedPeriod[] = [];
  for (const date of dates) {
    const reason = byDate.get(date) as BloodReason;
    const last = periods[periods.length - 1];
    if (last && last.reason === reason && addDays(last.end, 1) === date) {
      last.end = date;
      last.days += 1;
    } else {
      periods.push({ reason, start: date, end: date, days: 1 });
    }
  }
  return periods;
}

/** The limits in force: the user's school, or the strictest figure across schools (all views). */
export interface BloodLimits {
  /** `null` = all views (limits are the most cautious across the four schools). */
  school: MadhhabId | null;
  haydMaxDays: number;
  nifasMaxDays: number;
  /** Minimum hayd in whole days (`minHours / 24`, rounded up); 0 = no minimum. */
  haydMinDays: number;
  minPurityDays: number;
}

export function bloodLimits(school: MadhhabId | null, rules: MadhhabRules | null): BloodLimits {
  if (school != null && rules != null) {
    return {
      school,
      haydMaxDays: rules.hayd.maxDays,
      nifasMaxDays: rules.hayd.nifasMaxDays,
      haydMinDays: Math.ceil(rules.hayd.minHours / 24),
      minPurityDays: rules.hayd.minPurityDays,
    };
  }
  // All views: prompt at the earliest point any school would (labelled neutrally in the UI).
  const all = MADHHAB_IDS.map((id) => rulesForSchool(id).hayd);
  return {
    school: null,
    haydMaxDays: Math.min(...all.map((h) => h.maxDays)),
    nifasMaxDays: Math.min(...all.map((h) => h.nifasMaxDays)),
    haydMinDays: Math.max(...all.map((h) => Math.ceil(h.minHours / 24))),
    minPurityDays: Math.max(...all.map((h) => h.minPurityDays)),
  };
}

export type HaydPrompt =
  /** (a) Bleeding past the maximum: istihada — resume salah with wudu for each salah time. */
  | { kind: "beyondMax"; reason: BloodReason; day: number; maxDays: number }
  /** (b) A finished hayd period shorter than the school's minimum: consider making the salahs up. */
  | {
      kind: "shortPeriod";
      period: ExcusedPeriod;
      minDays: number;
      perPrayer: Record<ObligatoryPrayer, number>;
      total: number;
    }
  /** (c) A new hayd period began before the minimum purity since the previous one (info only). */
  | { kind: "purityGap"; gapDays: number; minPurityDays: number };

export interface HaydStatus {
  limits: BloodLimits;
  /** "Day 6 of a maximum of 10" while a hayd/nifas period is active. */
  counter: { reason: BloodReason; day: number; maxDays: number; start: string } | null;
  prompts: HaydPrompt[];
}

export interface HaydStatusInput {
  logs: readonly PrayerLog[];
  today: string;
  activeReason: ExcusedReason | null;
  school: MadhhabId | null;
  rules: MadhhabRules | null;
}

/** Fard salahs in `period` not already logged as prayed — what "Add N to qaza" would add. */
function unprayedFard(
  logs: readonly PrayerLog[],
  period: ExcusedPeriod,
): Record<ObligatoryPrayer, number> {
  const prayed = new Set(
    logs
      .filter((l) => l.date >= period.start && l.date <= period.end)
      .filter((l) => l.status === "completed" || l.status === "delayed" || l.status === "qaza")
      .map((l) => `${l.prayerId}:${l.date}`),
  );
  const out = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 } as Record<
    ObligatoryPrayer,
    number
  >;
  for (let i = 0; i < period.days; i++) {
    const date = addDays(period.start, i);
    for (const prayer of FARD) if (!prayed.has(`${prayer}:${date}`)) out[prayer] += 1;
  }
  return out;
}

/** ES2022-safe `findLastIndex` (the app targets ES2022 lib). */
function lastIndexWhere<T>(items: readonly T[], test: (item: T) => boolean): number {
  for (let i = items.length - 1; i >= 0; i--) if (test(items[i] as T)) return i;
  return -1;
}

export function haydStatus(input: HaydStatusInput): HaydStatus {
  const { logs, today, activeReason } = input;
  const limits = bloodLimits(input.school, input.rules);
  const periods = bloodPeriods(logs);
  const prompts: HaydPrompt[] = [];

  // Active period: the one running up to today (or yesterday, before today is flagged).
  const activeIndex = isBloodReason(activeReason)
    ? lastIndexWhere(periods, (p) => p.reason === activeReason && p.end >= addDays(today, -1))
    : -1;
  const active = activeIndex >= 0 ? periods[activeIndex] : undefined;

  let counter: HaydStatus["counter"] = null;
  if (active && isBloodReason(activeReason)) {
    const maxDays = activeReason === "nifas" ? limits.nifasMaxDays : limits.haydMaxDays;
    const day = diffInDays(today, active.start) + 1;
    counter = { reason: activeReason, day, maxDays, start: active.start };
    if (day > maxDays) prompts.push({ kind: "beyondMax", reason: activeReason, day, maxDays });

    const previous = activeIndex > 0 ? periods[activeIndex - 1] : undefined;
    if (
      active.reason === "hayd" &&
      previous &&
      diffInDays(active.start, previous.end) <= PURITY_LOOKBACK_DAYS
    ) {
      const gapDays = diffInDays(active.start, previous.end) - 1;
      if (gapDays < limits.minPurityDays) {
        prompts.push({ kind: "purityGap", gapDays, minPurityDays: limits.minPurityDays });
      }
    }
  }

  if (!active && limits.haydMinDays > 0) {
    const last = periods[lastIndexWhere(periods, (p) => p.reason === "hayd")];
    if (
      last &&
      last.end < today &&
      diffInDays(today, last.end) <= SHORT_PERIOD_PROMPT_DAYS &&
      last.days < limits.haydMinDays
    ) {
      const perPrayer = unprayedFard(logs, last);
      const total = FARD.reduce((sum, p) => sum + perPrayer[p], 0);
      if (total > 0) {
        prompts.push({
          kind: "shortPeriod",
          period: last,
          minDays: limits.haydMinDays,
          perPrayer,
          total,
        });
      }
    }
  }

  return { limits, counter, prompts };
}

/** Stable id for remembering a dismissed / accepted short-period prompt (synced tours list). */
export function shortPeriodPromptId(period: Pick<ExcusedPeriod, "start" | "end">): string {
  return `hayd-short-period:${period.start}:${period.end}`;
}
