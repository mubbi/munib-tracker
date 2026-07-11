import type {
  HadithCollection,
  HadithCollectionData,
  HadithItem,
  HadithSection,
} from "@munib-tracker/shared/types";

import nawawi from "@/assets/data/hadith/nawawi40.json";

export interface BundledHadithCollection {
  collection: HadithCollection;
  chapters: Array<{ id: string; nameArabic: string; nameEnglish: string }>;
  items: HadithItem[];
}

const NAWAWI = nawawi as BundledHadithCollection;

/** Collection meta for the hadith index without pulling the ~2.2 MB Riyad JSON. */
const RIYAD_COLLECTION: HadithCollection = {
  id: "riyad_assalihin",
  nameArabic: "رياض الصالحين",
  nameEnglish: "Riyad as-Salihin",
  bundled: true,
  bookCount: 20,
};

let riyadCache: BundledHadithCollection | undefined;

/** Lazy require — Metro evaluates Riyad JSON on first open / search, not at entry. */
function loadRiyad(): BundledHadithCollection {
  if (!riyadCache) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- deferred asset load
    riyadCache = require("@/assets/data/hadith/riyad-as-salihin.json") as BundledHadithCollection;
  }
  return riyadCache;
}

export function getBundledCollections(): HadithCollection[] {
  return [NAWAWI.collection, RIYAD_COLLECTION];
}

export function getBundledCollection(id: string): BundledHadithCollection | undefined {
  if (id === NAWAWI.collection.id) return NAWAWI;
  if (id === RIYAD_COLLECTION.id) return loadRiyad();
  return undefined;
}

export function isBundledCollection(id: string): boolean {
  return id === NAWAWI.collection.id || id === RIYAD_COLLECTION.id;
}

/** Group a bundled collection into the same {sections, items} shape as remote. */
export function getBundledCollectionData(id: string): HadithCollectionData | undefined {
  const bundled = getBundledCollection(id);
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
