import { RECITATION_MODELS } from "@/constants/recitation-models";
import modelsJson from "@/constants/recitation-models.json";
import { TOY_CORPUS, TOY_PIECES, TOY_VOCAB } from "@/test-support/quran-pronunciation";

import {
  buildLattice,
  buildPieceIndex,
  engineWordTexts,
  expectedAyah,
  letterCount,
  matchFold,
  withoutOptional,
} from "./ayah-tokens";
import { PINNED_CALIBRATION } from "./calibration";

type PinnedFile = { fileName: string; sha256: string };
const fcFiles = (modelsJson as unknown as { engines: Record<string, { files: PinnedFile[] }> })
  .engines["tilawa-fastconformer"].files;
const sha = (name: string) => fcFiles.find((f) => f.fileName === name)?.sha256;

describe("pinned calibration lock (NF-3.24)", () => {
  it("is locked to the pinned FastConformer version and files", () => {
    // Fails on any model change: re-run `pnpm --filter app quran-pronunciation:eval`.
    expect(PINNED_CALIBRATION.modelVersion).toBe(RECITATION_MODELS["tilawa-fastconformer"].version);
    expect(PINNED_CALIBRATION.vocabSha256).toBe(sha("vocab.json"));
    expect(PINNED_CALIBRATION.corpusSha256).toBe(sha("quran.json"));
  });

  it("records the D20/D24 outcome consistently and never claims more than measured", () => {
    expect(PINNED_CALIBRATION.measuredOn).toMatch(/reference \+ synthetic audio/);
    expect(PINNED_CALIBRATION.mode).toBe(PINNED_CALIBRATION.gate.passed ? "full" : "skipped-only");
    const t = PINNED_CALIBRATION.thresholds;
    expect(t.listen).toBeLessThan(t.clear);
    expect(t.skip).toBeLessThan(t.clear);
  });
});

describe("expected ayah + lattice", () => {
  it("folds harakat, alif forms and alifs out of the match text", () => {
    expect(matchFold("ٱلْحَمْدُ")).toBe("لحمد");
    expect(letterCount("قُلْ")).toBe(2);
  });

  it("indexes pieces: letters vs pure-harakat fillers, blank and <unk> skipped", () => {
    const index = buildPieceIndex(TOY_VOCAB, 9);
    expect(index.fillers).toEqual([5]);
    expect(index.pieces.map(([id]) => id)).not.toContain(0);
    expect(index.sameText.get(" ربك")).toEqual([3]);
  });

  it("reads the words from the corpus and marks a prepended basmala optional", () => {
    const first = expectedAyah(5, 1, TOY_CORPUS);
    expect(first?.words.map((w) => !!w.optional)).toEqual([true, false, false, false]);
    expect(engineWordTexts(first ?? { surah: 0, ayah: 0, words: [] })).toEqual([
      "بسم",
      "بسم",
      "ربك",
      "قل",
    ]);
    const trimmed = withoutOptional(first ?? { surah: 0, ayah: 0, words: [] });
    expect(trimmed.original).toEqual([1, 2, 3]);
    expect(expectedAyah(5, 2, TOY_CORPUS)?.words.some((w) => w.optional)).toBe(false);
    expect(expectedAyah(9, 9, TOY_CORPUS)).toBeNull();
  });

  it("returns null when the text can't be spelled with the vocab", () => {
    expect(buildLattice([{ text: "زز" }], TOY_PIECES)).toBeNull();
  });
});
