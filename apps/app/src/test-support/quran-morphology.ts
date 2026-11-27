import { readFileSync } from "node:fs";
import { join } from "node:path";

import { buildRootIndex, type RootIndex } from "@/lib/quran-morphology/build-index";

/**
 * NF-3.22 test helpers. The fixtures are verbatim excerpts of the Quranic Arabic
 * Corpus morphology v0.4 file, each with its full copyright block (the licence
 * requires the notice in every copy). The full dataset is never committed.
 *
 * - `qac-excerpt.txt` — Al-Fatiha + Al-Baqarah 1–5
 * - `qac-join-split-excerpt.txt` — 2:72, 15:7, 37:164 (known word joins/splits)
 */
export type QacFixture = "qac-excerpt.txt" | "qac-join-split-excerpt.txt";

export function readQacFixture(name: QacFixture = "qac-excerpt.txt"): string {
  return readFileSync(join(__dirname, "../lib/quran-morphology/__fixtures__", name), "utf8");
}

/** Bundled Arabic for a surah (ayah → text) straight from the shipped JSON. */
export function loadBundledSurahArabic(surah: number): Record<string, string> {
  const pad = String(surah).padStart(3, "0");
  return JSON.parse(
    readFileSync(join(__dirname, `../../assets/data/quran/arabic/${pad}.json`), "utf8"),
  ) as Record<string, string>;
}

export const FIXTURE_SOURCE_HASH = "fixture-hash";

/** Root index built from a fixture with the real builder. */
export function buildFixtureIndex(
  name: QacFixture = "qac-excerpt.txt",
  sourceHash = FIXTURE_SOURCE_HASH,
): Promise<RootIndex> {
  return buildRootIndex(readQacFixture(name), {
    sourceHash,
    loadSurahArabic: loadBundledSurahArabic,
  });
}

/** Put a built index into the root store as if it had loaded (screen tests). */
export function seedRootIndex(index: RootIndex | null): void {
  // Lazy: only screen tests need the store graph.
  const { quranRootsStore } =
    require("@/stores/quran-roots-store") as typeof import("@/stores/quran-roots-store");
  quranRootsStore.setState(
    index
      ? { status: "ready", index, progress: 1, error: null }
      : { status: "needs-download", index: null, progress: 0, error: null },
  );
}
