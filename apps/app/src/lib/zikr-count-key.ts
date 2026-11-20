import type { AfterSalahPrayer, ZikrItem } from "@munib-tracker/shared/types";

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

type TargetFields = Pick<ZikrItem, "targetCount" | "prayerTargets">;

/**
 * The daily repetition target of a zikr — per salah when it differs (the Quls
 * are ×3 after Fajr and Maghrib, once otherwise). Every zikr is recited at least
 * once, so a missing / zero target means a single recitation (never an arbitrary
 * tasbeeh default like 33).
 */
export function zikrTarget(item: Partial<TargetFields>, prayer?: AfterSalahPrayer): number {
  const perPrayer = prayer ? item.prayerTargets?.[prayer] : undefined;
  const target = perPrayer ?? item.targetCount;
  return target && target > 0 ? Math.floor(target) : 1;
}

/**
 * Supported only by weak narrations (for this salah): shown, but never required
 * for a set to count as done.
 */
export function isZikrOptional(
  item: Pick<ZikrItem, "optional" | "optionalPrayers">,
  prayer?: AfterSalahPrayer,
): boolean {
  if (item.optional) return true;
  return prayer ? (item.optionalPrayers?.includes(prayer) ?? false) : false;
}

/** A zikr counts as done once its daily target is met (a single recitation when untargeted). */
export function isZikrItemDone(count: number, targetCount?: number): boolean {
  return count >= zikrTarget({ targetCount });
}
