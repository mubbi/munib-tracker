import { WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import {
  afterSalahItemProgress,
  afterSalahProgressForPrayer,
  getZikrCountFromMap,
  totalAfterSalahProgress,
} from "@/lib/after-salah-adhkar-progress";
import { zikrByCategory } from "@/lib/zikr";
import { isZikrOptional, zikrTarget } from "@/lib/zikr-count-key";

export type ZikrListRowProgress = {
  completed: boolean;
  /** Recitation (or salah-slot) progress while the item is still open. */
  progressLabel?: string;
};

function countProgressLabel(count: number, target: number): string | undefined {
  // Single recitations read as "Mark as done" — a "0/1" pill adds nothing.
  if (target <= 1) return undefined;
  return `${Math.min(count, target)}/${target}`;
}

/**
 * Today's list-row progress for a zikr. Completed items omit `progressLabel` so
 * the row can show a Done badge; in-progress items show `count/target`.
 */
export function zikrListRowProgress(
  item: ZikrItem,
  counts: Record<string, number>,
  prayerFilter: AfterSalahPrayer | "all" = "all",
): ZikrListRowProgress {
  if (item.categoryId === "after_prayer") {
    if (prayerFilter === "all") {
      const slot = afterSalahItemProgress(item, counts);
      return {
        completed: slot.total > 0 && slot.completed >= slot.total,
        progressLabel: `${slot.completed}/${slot.total}`,
      };
    }
    const count = getZikrCountFromMap(counts, item.id, prayerFilter);
    const target = zikrTarget(item, prayerFilter);
    const completed = count >= target;
    return {
      completed,
      progressLabel: completed ? undefined : countProgressLabel(count, target),
    };
  }

  const count = getZikrCountFromMap(counts, item.id);
  const target = zikrTarget(item);
  const completed = count >= target;
  return {
    completed,
    progressLabel: completed ? undefined : countProgressLabel(count, target),
  };
}

/** How many required items in a list are done today (optional weak-chain adhkar excluded). */
export function zikrListProgress(
  items: ZikrItem[],
  counts: Record<string, number>,
  prayerFilter: AfterSalahPrayer | "all" = "all",
): { completed: number; total: number } {
  const prayer = prayerFilter === "all" ? undefined : prayerFilter;
  let completed = 0;
  let total = 0;
  for (const item of items) {
    if (isZikrOptional(item, prayer)) continue;
    total += 1;
    if (zikrListRowProgress(item, counts, prayerFilter).completed) completed += 1;
  }
  return { completed, total };
}

/** Today's remaining/done totals for a whole zikr category (home + tracker rows). */
export function zikrCategoryTodayProgress(
  categoryId: ZikrCategoryId,
  counts: Record<string, number>,
): { completed: number; total: number } {
  if (categoryId === "after_prayer") {
    const fard = totalAfterSalahProgress(counts);
    const witr = afterSalahProgressForPrayer(WITR_PRAYER, counts);
    return { completed: fard.completed + witr.completed, total: fard.total + witr.total };
  }
  return zikrListProgress(zikrByCategory(categoryId), counts);
}

/** Trailing badge for category nav rows: remaining `done/total`, or Done. */
export function zikrCategoryBadge(
  categoryId: ZikrCategoryId,
  counts: Record<string, number>,
  doneLabel: string,
): { label: string; completed: boolean } | undefined {
  const progress = zikrCategoryTodayProgress(categoryId, counts);
  if (progress.total <= 0) return undefined;
  const completed = progress.completed >= progress.total;
  return {
    label: completed ? doneLabel : `${progress.completed}/${progress.total}`,
    completed,
  };
}
