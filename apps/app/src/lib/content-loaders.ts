/**
 * Async content loaders — Metro emits separate chunks. Prefer these over static
 * `import { … } from "@munib-tracker/shared/content/*"` whenever ≥2 routes need
 * the same corpus (static shared deps land in web `__common` and hit every page).
 */
import type { DuaItem, DurudItem, NameOfAllah, ZikrItem } from "@munib-tracker/shared/types";

let namesCache: NameOfAllah[] | undefined;
let duaCache: DuaItem[] | undefined;
let zikrCache: ZikrItem[] | undefined;
let duroodCache: DurudItem[] | undefined;

/** Jest-only: avoid dynamic `import()` (needs --experimental-vm-modules). */
export function __setContentLoaderCachesForTests(corpora: {
  names?: NameOfAllah[];
  duas?: DuaItem[];
  zikr?: ZikrItem[];
  duroods?: DurudItem[];
}): void {
  if (corpora.names) namesCache = corpora.names;
  if (corpora.duas) duaCache = corpora.duas;
  if (corpora.zikr) zikrCache = corpora.zikr;
  if (corpora.duroods) duroodCache = corpora.duroods;
}

export async function loadNamesOfAllah(): Promise<NameOfAllah[]> {
  if (namesCache) return namesCache;
  const mod = await import("@munib-tracker/shared/content/names");
  namesCache = mod.NAMES_OF_ALLAH;
  return namesCache;
}

export async function loadDuaItems(): Promise<DuaItem[]> {
  if (duaCache) return duaCache;
  const mod = await import("@munib-tracker/shared/content/duas");
  duaCache = mod.DUA_ITEMS;
  return duaCache;
}

export async function loadZikrItems(): Promise<ZikrItem[]> {
  if (zikrCache) return zikrCache;
  const mod = await import("@munib-tracker/shared/content/zikr");
  zikrCache = mod.ZIKR_ITEMS;
  return zikrCache;
}

export async function loadDuroodItems(): Promise<DurudItem[]> {
  if (duroodCache) return duroodCache;
  const mod = await import("@munib-tracker/shared/content/duroods");
  duroodCache = mod.DUROOD_ITEMS;
  return duroodCache;
}

export function getDuaByIdFrom(items: DuaItem[], id: string): DuaItem | undefined {
  return items.find((item) => item.id === id);
}

export function getZikrByIdFrom(items: ZikrItem[], id: string): ZikrItem | undefined {
  return items.find((item) => item.id === id);
}
