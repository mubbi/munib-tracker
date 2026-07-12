import type {
  HadithCollection,
  HadithCollectionData,
  HadithItem,
  HadithSection,
} from "@munib-tracker/shared/types";

export interface BundledHadithCollection {
  collection: HadithCollection;
  chapters: Array<{ id: string; nameArabic: string; nameEnglish: string }>;
  items: HadithItem[];
}

/** Collection meta for the hadith index without pulling Nawawi JSON (~200 KB+). */
const NAWAWI_COLLECTION: HadithCollection = {
  id: "nawawi40",
  nameArabic: "الأربعون النووية",
  nameEnglish: "The Forty Hadith of Imam Nawawi",
  bundled: true,
  bookCount: 1,
};

/** Collection meta for the hadith index without pulling the ~2.2 MB Riyad JSON. */
const RIYAD_COLLECTION: HadithCollection = {
  id: "riyad_assalihin",
  nameArabic: "رياض الصالحين",
  nameEnglish: "Riyad as-Salihin",
  bundled: true,
  bookCount: 20,
};

let nawawiCache: BundledHadithCollection | undefined;
let nawawiLoad: Promise<BundledHadithCollection> | undefined;
let riyadCache: BundledHadithCollection | undefined;
let riyadLoad: Promise<BundledHadithCollection> | undefined;

/**
 * Jest-only: inject bundled JSON without production modules `require()`-ing it.
 * Metro follows every `require()` in this file into the web graph — never add one.
 */
export function __setBundledHadithForTests(id: string, data: BundledHadithCollection): void {
  if (id === NAWAWI_COLLECTION.id) nawawiCache = data;
  if (id === RIYAD_COLLECTION.id) riyadCache = data;
}

/**
 * Dynamic `import()` — Metro emits a separate async chunk. Do not use
 * `require()` here; it still embeds the JSON in the parent module graph on web.
 */
function loadNawawiAsync(): Promise<BundledHadithCollection> {
  if (nawawiCache) return Promise.resolve(nawawiCache);
  nawawiLoad ??= import("@/assets/data/hadith/nawawi40.json").then((mod) => {
    nawawiCache = (mod.default ?? mod) as BundledHadithCollection;
    return nawawiCache;
  });
  return nawawiLoad;
}

function loadRiyadAsync(): Promise<BundledHadithCollection> {
  if (riyadCache) return Promise.resolve(riyadCache);
  riyadLoad ??= import("@/assets/data/hadith/riyad-as-salihin.json").then((mod) => {
    riyadCache = (mod.default ?? mod) as BundledHadithCollection;
    return riyadCache;
  });
  return riyadLoad;
}

export function getBundledCollections(): HadithCollection[] {
  return [NAWAWI_COLLECTION, RIYAD_COLLECTION];
}

/**
 * Sync accessor. Returns a collection only after {@link ensureBundledCollection}
 * (or {@link __setBundledHadithForTests}) has populated the cache.
 */
export function getBundledCollection(id: string): BundledHadithCollection | undefined {
  if (id === NAWAWI_COLLECTION.id) return nawawiCache;
  if (id === RIYAD_COLLECTION.id) return riyadCache;
  return undefined;
}

/** Load a bundled collection via async import (Nawawi + Riyad). */
export async function ensureBundledCollection(
  id: string,
): Promise<BundledHadithCollection | undefined> {
  if (id === NAWAWI_COLLECTION.id) return loadNawawiAsync();
  if (id === RIYAD_COLLECTION.id) return loadRiyadAsync();
  return undefined;
}

export function isBundledCollection(id: string): boolean {
  return id === NAWAWI_COLLECTION.id || id === RIYAD_COLLECTION.id;
}

function toCollectionData(bundled: BundledHadithCollection): HadithCollectionData {
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

/** Group a bundled collection into the same {sections, items} shape as remote. */
export function getBundledCollectionData(id: string): HadithCollectionData | undefined {
  const bundled = getBundledCollection(id);
  if (!bundled) return undefined;
  return toCollectionData(bundled);
}

export async function ensureBundledCollectionData(
  id: string,
): Promise<HadithCollectionData | undefined> {
  const bundled = await ensureBundledCollection(id);
  if (!bundled) return undefined;
  return toCollectionData(bundled);
}
