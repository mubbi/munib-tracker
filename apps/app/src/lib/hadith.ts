import type { HadithCollection, HadithItem } from "@munib-tracker/shared/types";

import nawawi from "@/assets/data/hadith/nawawi40.json";
import riyad from "@/assets/data/hadith/riyad-as-salihin.json";

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

/** Case-insensitive search over english text + reference within a hadith set. */
export function searchHadiths(items: HadithItem[], query: string): HadithItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (h) =>
      h.english.toLowerCase().includes(q) ||
      h.reference.toLowerCase().includes(q) ||
      (h.narrator?.toLowerCase().includes(q) ?? false),
  );
}
