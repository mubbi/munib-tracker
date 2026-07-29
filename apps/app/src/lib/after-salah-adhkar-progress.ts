import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrItem } from "@munib-tracker/shared/types";
import { zikrByCategory } from "@/lib/zikr";
import { getZikrCountFromMap, isZikrItemDone } from "@/lib/zikr-count-key";

export { getZikrCountFromMap, isZikrItemDone, zikrCountKey } from "@/lib/zikr-count-key";

/**
 * After-salah adhkar applicable to one prayer. Universal items (no `prayers`
 * tag) appear under every fard salah; the Witr tab shows only Witr-specific
 * adhkar, since the untagged adhkar are recited after the fard prayers.
 */
export function afterSalahItemsForPrayer(prayerId: AfterSalahPrayer): ZikrItem[] {
  return zikrByCategory("after_prayer").filter((item) =>
    afterSalahApplicablePrayers(item).includes(prayerId),
  );
}

/** Which prayers an after-salah item applies to (untagged ⇒ every fard prayer). */
export function afterSalahApplicablePrayers(item: ZikrItem): AfterSalahPrayer[] {
  if (item.prayers?.length) return item.prayers;
  return [...OBLIGATORY_PRAYERS];
}

export function afterSalahProgressForPrayer(
  prayerId: AfterSalahPrayer,
  counts: Record<string, number>,
): { completed: number; total: number } {
  const items = afterSalahItemsForPrayer(prayerId);
  const completed = items.filter((item) =>
    isZikrItemDone(getZikrCountFromMap(counts, item.id, prayerId), item.targetCount),
  ).length;
  return { completed, total: items.length };
}

/** Per-item completion across every salah it applies to (for the "All" filter). */
export function afterSalahItemProgress(
  item: ZikrItem,
  counts: Record<string, number>,
): { completed: number; total: number } {
  const prayers = afterSalahApplicablePrayers(item);
  const completed = prayers.filter((prayerId) =>
    isZikrItemDone(getZikrCountFromMap(counts, item.id, prayerId), item.targetCount),
  ).length;
  return { completed, total: prayers.length };
}

/** Sum after-salah adhkar slots across all five fard prayers for today. */
export function totalAfterSalahProgress(counts: Record<string, number>): {
  completed: number;
  total: number;
} {
  return OBLIGATORY_PRAYERS.reduce(
    (acc, prayerId) => {
      const slot = afterSalahProgressForPrayer(prayerId, counts);
      return { completed: acc.completed + slot.completed, total: acc.total + slot.total };
    },
    { completed: 0, total: 0 },
  );
}
