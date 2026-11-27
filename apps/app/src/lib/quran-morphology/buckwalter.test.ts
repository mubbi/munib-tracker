import { foldArabicWord, splitAyahWords } from "@/lib/quran-companion/align-words";
import { loadBundledSurahArabic, readQacFixture } from "@/test-support/quran-morphology";

import {
  arabicLetterToRoot,
  BUCKWALTER_TO_CODEPOINT,
  buckwalterToArabic,
  ROOT_ALPHABET,
  rootLetters,
  rootToArabic,
} from "./buckwalter";
import { parseMorphologyWords } from "./parse";

const cp = (...codes: number[]) => String.fromCodePoint(...codes);

describe("extended Buckwalter → Arabic", () => {
  it("maps every symbol to a distinct code point", () => {
    const values = Object.values(BUCKWALTER_TO_CODEPOINT);
    expect(new Set(values).size).toBe(values.length);
  });

  it("converts letters and marks by code point", () => {
    expect(buckwalterToArabic("{ll~ahi")).toBe(cp(0x671, 0x644, 0x644, 0x651, 0x64e, 0x647, 0x650));
    expect(buckwalterToArabic("r~aHoma`n")).toBe(
      cp(0x631, 0x651, 0x64e, 0x62d, 0x652, 0x645, 0x64e, 0x670, 0x646),
    );
  });

  it("drops homonym digits in lemmas", () => {
    expect(buckwalterToArabic("Ealay2")).toBe(buckwalterToArabic("Ealay"));
  });

  it("reproduces the bundled Tanzil text for every fixture word (after folding)", () => {
    const words = parseMorphologyWords(readQacFixture()).filter((w) => w.surah === 1);
    const bundled = loadBundledSurahArabic(1);
    for (const ayah of [1, 2, 3, 4, 5, 6, 7]) {
      const study = splitAyahWords(bundled[String(ayah)]).map(foldArabicWord);
      const corpus = words
        .filter((w) => w.ayah === ayah)
        .map((w) => foldArabicWord(buckwalterToArabic(w.form)));
      expect(corpus).toEqual(study);
    }
  });
});

describe("root letters", () => {
  it("spaces the radicals and writes the hamza radical as alif-hamza", () => {
    expect(rootLetters("rHm")).toEqual([cp(0x631), cp(0x62d), cp(0x645)]);
    expect(rootToArabic("Amn")).toBe([cp(0x623), cp(0x645), cp(0x646)].join(" "));
  });

  it("offers the 28-letter alphabet for the picker", () => {
    expect(ROOT_ALPHABET).toHaveLength(28);
  });

  it.each([0x621, 0x622, 0x623, 0x624, 0x625, 0x626, 0x671, 0x627])(
    "folds hamza / alif form U+%s to the dataset's A",
    (code) => {
      expect(arabicLetterToRoot(cp(code))).toBe("A");
    },
  );

  it("folds alif maqsura to y and rejects marks", () => {
    expect(arabicLetterToRoot(cp(0x649))).toBe("y");
    expect(arabicLetterToRoot(cp(0x64e))).toBeNull();
  });
});
