import { KIDS_SURAHS } from "@/lib/circles/kids-content";
import { identityAlignment } from "@/lib/quran-companion/align-words";
import { createAyahState, createSessionState } from "@/lib/quran-companion/reduce-session";
import type { WordState } from "@/lib/quran-companion/types";

import {
  KIDS_RECITE_SURAHS,
  kidsAyahHeard,
  kidsDisplayStates,
  kidsNewlyCreditedAyahs,
  kidsReciteFinished,
  kidsWordsToTryAgain,
  parseKidsReciteSurah,
} from "./kids";

const aligned = (states: WordState[], takes = 1) => ({ alignment: {}, states, takes });

describe("kids recite-along", () => {
  it("offers exactly the curated kids surahs (D27)", () => {
    expect(KIDS_RECITE_SURAHS).toEqual(KIDS_SURAHS);
  });

  it("only opens a surah from the curated set", () => {
    expect(parseKidsReciteSurah("112")).toBe(112);
    expect(parseKidsReciteSurah(1)).toBe(1);
    expect(parseKidsReciteSurah("2")).toBeNull();
    expect(parseKidsReciteSurah("abc")).toBeNull();
    expect(parseKidsReciteSurah(undefined)).toBeNull();
  });

  it("asks again only for flagged or skipped words, never for a maybe", () => {
    expect(
      kidsWordsToTryAgain(
        aligned(["matched", "confirmedMismatch", "uncertain", "upcoming", "corrected"]),
      ),
    ).toEqual([1, 3]);
    // No take yet, or no listener alignment: nothing to ask.
    expect(kidsWordsToTryAgain(aligned(["upcoming"], 0))).toEqual([]);
    expect(kidsWordsToTryAgain({ alignment: null, states: ["idle"], takes: 1 })).toEqual([]);
  });

  it("knows when every word was heard", () => {
    expect(kidsAyahHeard(aligned(["matched", "corrected"]))).toBe(true);
    expect(kidsAyahHeard(aligned(["matched", "upcoming"]))).toBe(false);
    expect(kidsAyahHeard(aligned([], 1))).toBe(false);
  });

  it("never shows a red mistake: flagged words become a gentle nudge after the take", () => {
    const states: WordState[] = ["matched", "confirmedMismatch", "upcoming"];
    expect(kidsDisplayStates(states, true)).toEqual(["matched", "upcoming", "upcoming"]);
    expect(kidsDisplayStates(states, false)).toEqual(["matched", "uncertain", "upcoming"]);
  });

  it("finishes once the last ayah has a settled take", () => {
    expect(kidsReciteFinished({ index: 3, total: 4, lastSettled: true })).toBe(true);
    expect(kidsReciteFinished({ index: 2, total: 4, lastSettled: true })).toBe(false);
    expect(kidsReciteFinished({ index: 3, total: 4, lastSettled: false })).toBe(false);
    expect(kidsReciteFinished({ index: 0, total: 0, lastSettled: true })).toBe(false);
  });
});

describe("kidsNewlyCreditedAyahs (D73)", () => {
  const row = (ayah: number, states: WordState[]) => ({
    ...createAyahState(
      ayah,
      states.map((_, i) => `w${i}`),
      identityAlignment(states.length),
    ),
    states,
    takes: 1,
    reached: true,
  });
  const session = createSessionState([
    row(1, ["matched", "matched", "uncertain"]), // 2/3 → counts
    row(2, ["matched", "upcoming", "upcoming"]), // 1/3 → no
    row(3, ["matched", "corrected", "matched"]),
  ]);

  it("uses the two-thirds rule on settled ayahs, skipping ones already logged", () => {
    const settled = [1, 2, 3];
    expect(
      kidsNewlyCreditedAyahs({ session, settled, engineRan: true, already: new Set() }),
    ).toEqual([1, 3]);
    expect(
      kidsNewlyCreditedAyahs({ session, settled, engineRan: true, already: new Set([1]) }),
    ).toEqual([3]);
    expect(
      kidsNewlyCreditedAyahs({ session, settled: [2, 3], engineRan: true, already: new Set() }),
    ).toEqual([3]);
  });

  it("never credits without the listener", () => {
    expect(
      kidsNewlyCreditedAyahs({ session, settled: [1, 3], engineRan: false, already: new Set() }),
    ).toEqual([]);
  });
});
