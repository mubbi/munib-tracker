import { WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import {
  afterSalahItemProgress,
  afterSalahProgressForPrayer,
  getZikrCountFromMap,
  isZikrItemDone,
  totalAfterSalahProgress,
} from "@/lib/after-salah-adhkar-progress";
import { zikrByCategory } from "@/lib/zikr";

export type ZikrListRowProgress = {
  completed: boolean;
  /** Recitation (or salah-slot) progress while the item is still open. */
  progressLabel?: string;
};

function countProgressLabel(count: number, targetCount?: number): string | undefined {
  if (!targetCount) return undefined;
  return `${Math.min(count, targetCount)}/${targetCount}`;
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
    const completed = isZikrItemDone(count, item.targetCount);
    return {
      completed,
      progressLabel: completed ? undefined : countProgressLabel(count, item.targetCount),
    };
  }

  const count = getZikrCountFromMap(counts, item.id);
  const completed = isZikrItemDone(count, item.targetCount);
  return {
    completed,
    progressLabel: completed ? undefined : countProgressLabel(count, item.targetCount),
  };
}

/** How many items in a list are done today (for category headers). */
export function zikrListProgress(
  items: ZikrItem[],
  counts: Record<string, number>,
  prayerFilter: AfterSalahPrayer | "all" = "all",
): { completed: number; total: number } {
  let completed = 0;
  for (const item of items) {
    if (zikrListRowProgress(item, counts, prayerFilter).completed) completed += 1;
  }
  return { completed, total: items.length };
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
