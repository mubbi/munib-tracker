/**
 * Jest-only sync loaders for search corpora. Kept separate so production Metro
 * never sees `require("@munib-tracker/shared/content/…")` inside `search.ts`.
 */
import type { DuaItem, DurudItem, NameOfAllah, ZikrItem } from "@munib-tracker/shared/types";

export function loadDuaItemsSyncForTests(): DuaItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@munib-tracker/shared/content/duas").DUA_ITEMS as DuaItem[];
}

export function loadZikrItemsSyncForTests(): ZikrItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@munib-tracker/shared/content/zikr").ZIKR_ITEMS as ZikrItem[];
}

export function loadDuroodItemsSyncForTests(): DurudItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@munib-tracker/shared/content/duroods").DUROOD_ITEMS as DurudItem[];
}

export function loadNamesSyncForTests(): NameOfAllah[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@munib-tracker/shared/content/names").NAMES_OF_ALLAH as NameOfAllah[];
}
