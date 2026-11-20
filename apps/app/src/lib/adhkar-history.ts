import type { ZikrProgress } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";

import {
  type AdhkarScope,
  AFTER_SALAH_SESSION_PRAYERS,
  sessionItems,
  sessionProgress,
} from "@/lib/adhkar-session";
import { zikrCountKey } from "@/lib/zikr-count-key";

/**
 * Every daily adhkar set, in the order of the day: morning, after each salah
 * (Fajr … Isha, Witr), evening, before sleep. Each is tracked per date — and
 * after-salah per salah — so history never mixes one salah's adhkar with another's.
 */
export const DAILY_ADHKAR_SETS: AdhkarScope[] = [
  { categoryId: "morning" },
  ...AFTER_SALAH_SESSION_PRAYERS.map(
    (prayer): AdhkarScope => ({ categoryId: "after_prayer", prayer }),
  ),
  { categoryId: "evening" },
  { categoryId: "before_sleep" },
];

/** Stable id for a set ("morning", "after_prayer:fajr", …). */
export function adhkarSetKey(scope: AdhkarScope): string {
  return scope.prayer ? `${scope.categoryId}:${scope.prayer}` : scope.categoryId;
}

/** Group stored progress into per-date count maps (keys match the live tracker). */
export function zikrCountsByDate(entries: ZikrProgress[]): Map<string, Record<string, number>> {
  const byDate = new Map<string, Record<string, number>>();
  for (const entry of entries) {
    let counts = byDate.get(entry.date);
    if (!counts) {
      counts = {};
      byDate.set(entry.date, counts);
    }
    counts[zikrCountKey(entry.zikrId, entry.prayerId)] = entry.count;
  }
  return byDate;
}

export type AdhkarSetDay = {
  scope: AdhkarScope;
  completed: number;
  total: number;
  /** Every required zikr of the set met its target that day. */
  done: boolean;
  /** At least one zikr of the set was recited that day. */
  started: boolean;
};

/** Each daily set's completion for one day's counts. */
export function adhkarSetsForDay(counts: Record<string, number>): AdhkarSetDay[] {
  return DAILY_ADHKAR_SETS.map((scope) => {
    const items = sessionItems(scope);
    const progress = sessionProgress(items, counts, scope);
    const started = items.some((item) => {
      const key = zikrCountKey(
        item.id,
        scope.categoryId === "after_prayer" ? scope.prayer : undefined,
      );
      return (counts[key] ?? 0) > 0;
    });
    return {
      scope,
      completed: progress.completed,
      total: progress.total,
      done: progress.total > 0 && progress.completed >= progress.total,
      started,
    };
  });
}

export type AdhkarSetHistory = {
  scope: AdhkarScope;
  /** Days in the range on which the whole set was completed. */
  doneDays: number;
  /** Days on which it was started but not finished. */
  partialDays: number;
  /** Days in the range. */
  days: number;
};

/** Per-set completion across an inclusive date range (statistics). */
export function adhkarSetHistory(
  entries: ZikrProgress[],
  from: string,
  to: string,
): AdhkarSetHistory[] {
  const byDate = zikrCountsByDate(entries);
  const history = DAILY_ADHKAR_SETS.map((scope) => ({
    scope,
    doneDays: 0,
    partialDays: 0,
    days: 0,
  }));
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const counts = byDate.get(date);
    const sets = counts ? adhkarSetsForDay(counts) : null;
    history.forEach((row, index) => {
      row.days += 1;
      const day = sets?.[index];
      if (day?.done) row.doneDays += 1;
      else if (day?.started) row.partialDays += 1;
    });
  }
  return history;
}
