import type { WasiyyahSettings } from "@munib-tracker/shared/types";
import { addDays, diffInDays, getLocalDateString } from "@munib-tracker/shared/utils";

/**
 * "Review your wasiyyah" (NF-3.9): every N months (default 12, configurable) and
 * whenever open debts change by more than 20 %. Overdue reviews repeat weekly
 * on the same weekday — a gentle nudge, never daily.
 */
export const DEFAULT_REVIEW_INTERVAL_MONTHS = 12;
export const REVIEW_INTERVAL_OPTIONS = [3, 6, 12, 24] as const;
export const DEBTS_CHANGE_THRESHOLD = 0.2;
export const REVIEW_REPEAT_DAYS = 7;

export function defaultWasiyyahSettings(): WasiyyahSettings {
  return { reviewIntervalMonths: DEFAULT_REVIEW_INTERVAL_MONTHS };
}

export function clampReviewInterval(months: number | undefined): number {
  if (months == null || !Number.isFinite(months)) return DEFAULT_REVIEW_INTERVAL_MONTHS;
  return Math.min(60, Math.max(1, Math.round(months)));
}

/** YYYY-MM-DD + whole months, clamped to the target month's last day (Jan 31 + 1 → Feb 28/29). */
export function addMonthsToDate(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, lastDay));
  return getLocalDateString(target);
}

/** True when open debts moved by more than 20 % since the last review (or appeared from zero). */
export function debtsChangedSignificantly(snapshot: number | undefined, current: number): boolean {
  if (snapshot == null) return false;
  if (snapshot <= 0) return current > 0;
  return Math.abs(current - snapshot) / snapshot > DEBTS_CHANGE_THRESHOLD;
}

/**
 * The date the review is due: the interval from the last review (or the latest
 * saved version), or the day a >20 % debts change was noticed — whichever is
 * earlier. `null` when there is no saved wasiyyah.
 */
export function wasiyyahReviewDueOn(
  settings: WasiyyahSettings | undefined,
  latestVersionCreatedAt: string | undefined,
): string | null {
  const base = settings?.lastReviewedAt ?? latestVersionCreatedAt;
  if (!base) return null;
  const baseDay = getLocalDateString(new Date(base));
  const interval = addMonthsToDate(baseDay, clampReviewInterval(settings?.reviewIntervalMonths));
  const noticed = settings?.debtsChangeNoticedOn;
  return noticed && noticed < interval ? noticed : interval;
}

/** Days from `today` (inclusive) to `today + horizonDays` on which the review nudge fires. */
export function wasiyyahReviewReminderDates(
  dueOn: string | null,
  today: string,
  horizonDays: number,
): string[] {
  if (!dueOn) return [];
  const dates: string[] = [];
  for (let offset = 0; offset <= horizonDays; offset += 1) {
    const day = addDays(today, offset);
    if (day < dueOn) continue;
    if (diffInDays(day, dueOn) % REVIEW_REPEAT_DAYS === 0) dates.push(day);
  }
  return dates;
}

export function isReviewDue(dueOn: string | null, today: string): boolean {
  return !!dueOn && dueOn <= today;
}
