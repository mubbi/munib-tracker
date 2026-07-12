import { ZIKR_CATEGORY_IDS, ZIKR_CATEGORY_LABELS } from "@munib-tracker/shared/constants";
import type { ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";
import { loadZikrItems } from "@/lib/content-loaders";
import { ZIKR_CATEGORY_ICONS } from "@/lib/zikr-ui";

export { ZIKR_CATEGORY_ICONS } from "@/lib/zikr-ui";

type SymbolName = SymbolViewProps["name"];

let zikrItemsCache: ZikrItem[] | undefined;

/** Jest-only: inject corpus without production modules `require()`-ing content. */
export function __setZikrItemsForTests(items: ZikrItem[]): void {
  zikrItemsCache = items;
}

async function ensureZikrItems(): Promise<ZikrItem[]> {
  if (zikrItemsCache) return zikrItemsCache;
  zikrItemsCache = await loadZikrItems();
  return zikrItemsCache;
}

function getZikrItemsSync(): ZikrItem[] {
  return zikrItemsCache ?? [];
}

/** Warm the zikr corpus (tracker / zikr screens). */
export async function ensureZikrCorpus(): Promise<ZikrItem[]> {
  return ensureZikrItems();
}

export function zikrByCategory(categoryId: ZikrCategoryId): ZikrItem[] {
  // Kick off async load when empty (web/native after navigation); Jest warms via setup.
  if (!zikrItemsCache) void ensureZikrItems();
  return getZikrItemsSync().filter((item) => item.categoryId === categoryId);
}

/** Returns a loaded zikr item, or undefined while the corpus is warming. */
export function getZikrById(id: string | undefined): ZikrItem | undefined {
  if (!id) return undefined;
  if (!zikrItemsCache) void ensureZikrItems();
  return getZikrItemsSync().find((item) => item.id === id);
}

export function zikrCategories(): Array<{
  id: ZikrCategoryId;
  label: string;
  icon: SymbolName;
  count: number;
}> {
  if (!zikrItemsCache) void ensureZikrItems();
  return ZIKR_CATEGORY_IDS.map((id) => ({
    id,
    label: ZIKR_CATEGORY_LABELS[id],
    icon: ZIKR_CATEGORY_ICONS[id],
    count: zikrByCategory(id).length,
  }));
}
