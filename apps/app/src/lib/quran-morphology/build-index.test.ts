import { foldArabicWord } from "@/lib/quran-companion/align-words";
import {
  buildFixtureIndex,
  FIXTURE_SOURCE_HASH,
  loadBundledSurahArabic,
  readQacFixture,
} from "@/test-support/quran-morphology";
import { buckwalterToArabic } from "./buckwalter";
import {
  buildRootIndex,
  decodeAlignment,
  encodeAlignment,
  isRootIndexCurrent,
  ROOT_INDEX_VERSION,
} from "./build-index";
import { decodeLocations, packLocation } from "./codec";

describe("buildRootIndex (fixture: Al-Fatiha + Al-Baqarah 1–5)", () => {
  it("groups occurrences by root → lemma, packed", async () => {
    const index = await buildFixtureIndex();
    expect(Object.keys(index.roots.rHm).sort()).toEqual(["r~aHiym", "r~aHoma`n"]);
    expect(decodeLocations(index.roots.rHm["r~aHoma`n"])).toEqual([
      packLocation(1, 1, 3),
      packLocation(1, 3, 1),
    ]);
    expect(index.counts.rHm).toBe(4);
  });

  it("indexes whole-word forms (folded) and marks rootless words", async () => {
    const index = await buildFixtureIndex();
    expect(index.forms[foldArabicWord(buckwalterToArabic("{lr~aHoma`ni"))]).toBe("rHm");
    expect(index.forms[foldArabicWord(buckwalterToArabic("humu"))]).toBe("");
  });

  it("aligns every fixture word one-to-one (no recorded exceptions)", async () => {
    const index = await buildFixtureIndex();
    expect(index.align).toEqual({});
    expect(index.stats).toMatchObject({ ayahs: 12, unalignedWords: 0, adjustedAyahs: 0 });
  });

  it("records the known joins and splits (2:72, 15:7, 37:164) without losing a word", async () => {
    const index = await buildFixtureIndex("qac-join-split-excerpt.txt");
    expect(Object.keys(index.align).sort()).toEqual(["15:7", "2:72", "37:164"]);
    // 15:7: corpus words 1 and 2 (law + maA) are one bundled word.
    expect(decodeAlignment(index.align["15:7"]).slice(0, 3)).toEqual([[0], [0], [1]]);
    // 2:72: corpus word 4 covers bundled words 4 and 5.
    expect(decodeAlignment(index.align["2:72"])[3]).toEqual([3, 4]);
    expect(index.stats.unalignedWords).toBe(0);
  });

  it("yields between chunks and reports progress", async () => {
    const yieldToUi = jest.fn(async () => {});
    const onProgress = jest.fn();
    await buildRootIndex(readQacFixture(), {
      sourceHash: FIXTURE_SOURCE_HASH,
      loadSurahArabic: loadBundledSurahArabic,
      chunkLines: 20,
      yieldToUi,
      onProgress,
    });
    expect(yieldToUi.mock.calls.length).toBeGreaterThan(5);
    expect(onProgress).toHaveBeenLastCalledWith(
      expect.objectContaining({ phase: "parse", done: expect.any(Number) }),
    );
  });

  it("is current only for the same source hash and index version", async () => {
    const index = await buildFixtureIndex();
    expect(index.v).toBe(ROOT_INDEX_VERSION);
    expect(isRootIndexCurrent(index, FIXTURE_SOURCE_HASH)).toBe(true);
    expect(isRootIndexCurrent(index, "other")).toBe(false);
    expect(isRootIndexCurrent({ ...index, v: ROOT_INDEX_VERSION + 1 }, FIXTURE_SOURCE_HASH)).toBe(
      false,
    );
    expect(isRootIndexCurrent(null, FIXTURE_SOURCE_HASH)).toBe(false);
  });

  it("round-trips the alignment encoding", () => {
    const mapping = [[0], [0], [1, 2], []];
    expect(decodeAlignment(encodeAlignment(mapping))).toEqual(mapping);
  });
});
