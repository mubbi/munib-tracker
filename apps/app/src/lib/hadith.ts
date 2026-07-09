import type { HadithItem } from "@munib-tracker/shared/types";

import { resolveHadithTranslation } from "@/lib/translation-locale";
import { preferencesStore } from "@/stores/preferences-store";

export type { BundledHadithCollection } from "./hadith-bundled";
export {
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
  isBundledCollection,
} from "./hadith-bundled";

/** Case-insensitive search over english text + reference within a hadith set. */
export function searchHadiths(items: HadithItem[], query: string): HadithItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const prefs = preferencesStore.getState().prefs;
  return items.filter((h) => {
    const translation = resolveHadithTranslation(h, prefs).toLowerCase();
    return (
      h.english.toLowerCase().includes(q) ||
      translation.includes(q) ||
      h.reference.toLowerCase().includes(q) ||
      (h.narrator?.toLowerCase().includes(q) ?? false)
    );
  });
}
