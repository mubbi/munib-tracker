import type {
  HadithCollection,
  HadithCollectionData,
  HadithItem,
  HadithSection,
} from "@munib-tracker/shared/types";

import nawawi from "@/assets/data/hadith/nawawi40.json";
import riyad from "@/assets/data/hadith/riyad-as-salihin.json";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { preferencesStore } from "@/stores/preferences-store";

export interface BundledHadithCollection {
  collection: HadithCollection;
  chapters: Array<{ id: string; nameArabic: string; nameEnglish: string }>;
  items: HadithItem[];
}

const BUNDLED: Record<string, BundledHadithCollection> = {
  nawawi40: nawawi as BundledHadithCollection,
  riyad_assalihin: riyad as BundledHadithCollection,
};

export function getBundledCollections(): HadithCollection[] {
  return Object.values(BUNDLED).map((c) => c.collection);
}

export function getBundledCollection(id: string): BundledHadithCollection | undefined {
  return BUNDLED[id];
}

export function isBundledCollection(id: string): boolean {
  return id in BUNDLED;
}

/** Group a bundled collection into the same {sections, items} shape as remote. */
export function getBundledCollectionData(id: string): HadithCollectionData | undefined {
  const bundled = BUNDLED[id];
  if (!bundled) return undefined;
  const counts = new Map<string, number>();
  for (const item of bundled.items) {
    const key = item.chapterId ?? "";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sections: HadithSection[] = bundled.chapters
    .map((ch) => ({
      id: ch.id,
      name: ch.nameEnglish || ch.nameArabic || `Chapter ${ch.id}`,
      count: counts.get(ch.id) ?? 0,
    }))
    .filter((s) => s.count > 0);
  return { sections, items: bundled.items };
}

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
