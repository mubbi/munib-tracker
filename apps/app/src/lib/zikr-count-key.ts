import type { AfterSalahPrayer } from "@munib-tracker/shared/types";

/** In-memory key for today's zikr count map (optionally per prayer, fard or Witr). */
export function zikrCountKey(zikrId: string, prayerId?: AfterSalahPrayer): string {
  return prayerId ? `${zikrId}::${prayerId}` : zikrId;
}

export function getZikrCountFromMap(
  counts: Record<string, number>,
  zikrId: string,
  prayerId?: AfterSalahPrayer,
): number {
  return counts[zikrCountKey(zikrId, prayerId)] ?? 0;
}

/** A zikr counts as done once its daily target is met (or it was recited when it has no target). */
export function isZikrItemDone(count: number, targetCount?: number): boolean {
  return targetCount ? count >= targetCount : count > 0;
}
