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
let riyadLoad: Promise<BundledHadithCollection> | undefined;

/**
 * Dynamic `import()` — Metro emits a separate async chunk. Do not use
 * `require()` here; it still embeds Riyad in the parent module graph on web.
 */
function loadRiyadAsync(): Promise<BundledHadithCollection> {
  if (riyadCache) return Promise.resolve(riyadCache);
  if (process.env.NODE_ENV === "test") {
    // Isolate sync require in a separate module so production Metro never sees it.
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
    const { loadRiyadSyncForTests } =
      require("./hadith-riyad-test-loader") as typeof import("./hadith-riyad-test-loader");
    riyadCache = loadRiyadSyncForTests();
    return Promise.resolve(riyadCache);
  }
  riyadLoad ??= import("@/assets/data/hadith/riyad-as-salihin.json").then((mod) => {
    riyadCache = (mod.default ?? mod) as BundledHadithCollection;
    return riyadCache;
  });
  return riyadLoad;
}

export function getBundledCollections(): HadithCollection[] {
  return [NAWAWI.collection, RIYAD_COLLECTION];
}

/**
 * Sync accessor. Nawawi is always available; Riyad only after
 * {@link ensureBundledCollection} (or a prior async load) has resolved.
 * In Jest, Riyad is loaded synchronously via the test-only loader.
 */
export function getBundledCollection(id: string): BundledHadithCollection | undefined {
  if (id === NAWAWI.collection.id) return NAWAWI;
  if (id === RIYAD_COLLECTION.id) {
    if (riyadCache) return riyadCache;
    if (process.env.NODE_ENV === "test") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
      const { loadRiyadSyncForTests } =
        require("./hadith-riyad-test-loader") as typeof import("./hadith-riyad-test-loader");
      riyadCache = loadRiyadSyncForTests();
      return riyadCache;
    }
    return undefined;
  }
  return undefined;
}

/** Load a bundled collection, fetching Riyad on demand via async import. */
export async function ensureBundledCollection(
  id: string,
): Promise<BundledHadithCollection | undefined> {
  if (id === NAWAWI.collection.id) return NAWAWI;
  if (id === RIYAD_COLLECTION.id) return loadRiyadAsync();
  return undefined;
}

export function isBundledCollection(id: string): boolean {
  return id === NAWAWI.collection.id || id === RIYAD_COLLECTION.id;
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
