import { useMemo } from "react";

import { getSurahAyahs } from "@/lib/quran";
import { splitAyahWords } from "@/lib/quran-companion/align-words";
import type { RootIndex } from "@/lib/quran-morphology/build-index";
import { buildSurahWordRoots } from "@/lib/quran-roots";
import { useEnsureRootIndex, useRootDataStatus, useRootIndex } from "@/stores/quran-roots-store";

export type SurahWordRoots = {
  /** `"ayah:studyIndex"` → roots (absent = the dataset gives that word no root). */
  roots: Map<string, string[]>;
  /** Bundled word count per ayah — the chip only shows when Quran.com's split matches. */
  bundledCounts: Map<number, number>;
};

let cache: { index: RootIndex; surah: number; value: SurahWordRoots } | null = null;

function surahWordRoots(index: RootIndex, surah: number): SurahWordRoots {
  if (cache && cache.index === index && cache.surah === surah) return cache.value;
  const bundledCounts = new Map<number, number>();
  for (const ayah of getSurahAyahs(surah)) {
    bundledCounts.set(ayah.ayah, splitAyahWords(ayah.arabic).length);
  }
  const value = { roots: buildSurahWordRoots(index, surah), bundledCounts };
  cache = { index, surah, value };
  return value;
}

/**
 * Word-by-word "Root" chips (NF-3.22). Loads the root index when it is already
 * on the device (never downloads); `null` until it is ready.
 */
export function useSurahWordRoots(surah: number | null, enabled: boolean): SurahWordRoots | null {
  useEnsureRootIndex(enabled && surah != null);
  const index = useRootIndex();
  return useMemo(
    () => (enabled && index && surah != null ? surahWordRoots(index, surah) : null),
    [enabled, index, surah],
  );
}

/** True when the root data still needs its one-time download (offer the link). */
export function useRootDataNeedsDownload(): boolean {
  const { status } = useRootDataStatus();
  return status === "needs-download" || status === "failed";
}
