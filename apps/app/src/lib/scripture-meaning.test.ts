import {
  baseLanguage,
  joinAyahRangeText,
  MAX_DATASET_MEANING_AYAHS,
  resolveScriptureMeaning,
  shouldResolveQuranFromDataset,
} from "@/lib/scripture-meaning";

describe("scripture meaning (D45)", () => {
  it("normalises language tags", () => {
    expect(baseLanguage("fr-FR")).toBe("fr");
    expect(baseLanguage(undefined)).toBe("en");
    expect(baseLanguage("")).toBe("en");
  });

  describe("shouldResolveQuranFromDataset", () => {
    const ref = { surah: 9, ayahFrom: 60 };

    it("never resolves for an English UI or an English edition", () => {
      expect(shouldResolveQuranFromDataset("en", "fr-hamidullah", ref)).toBe(false);
      expect(shouldResolveQuranFromDataset("fr", "en-pickthall", ref)).toBe(false);
    });

    it("resolves short, valid spans for a non-English UI + edition", () => {
      expect(shouldResolveQuranFromDataset("fr", "fr-hamidullah", ref)).toBe(true);
      expect(
        shouldResolveQuranFromDataset("ur", "ur-jalandhry", {
          surah: 2,
          ayahFrom: 1,
          ayahTo: MAX_DATASET_MEANING_AYAHS,
        }),
      ).toBe(true);
    });

    it("keeps long spans, invalid refs and missing refs on the labelled English", () => {
      expect(
        shouldResolveQuranFromDataset("fr", "fr-hamidullah", {
          surah: 2,
          ayahFrom: 30,
          ayahTo: 30 + MAX_DATASET_MEANING_AYAHS,
        }),
      ).toBe(false);
      expect(
        shouldResolveQuranFromDataset("fr", "fr-hamidullah", { surah: 115, ayahFrom: 1 }),
      ).toBe(false);
      expect(shouldResolveQuranFromDataset("fr", "fr-hamidullah", { surah: 2, ayahFrom: 0 })).toBe(
        false,
      );
      expect(shouldResolveQuranFromDataset("fr", "fr-hamidullah", null)).toBe(false);
    });
  });

  describe("joinAyahRangeText", () => {
    const ayahs = { "1": " One. ", "2": "Two.", "3": "" };

    it("joins a range in order", () => {
      expect(joinAyahRangeText(ayahs, { surah: 1, ayahFrom: 1, ayahTo: 2 })).toBe("One. Two.");
    });

    it("returns null when any ayah is missing or the edition is not loaded", () => {
      expect(joinAyahRangeText(ayahs, { surah: 1, ayahFrom: 2, ayahTo: 3 })).toBeNull();
      expect(joinAyahRangeText(null, { surah: 1, ayahFrom: 1 })).toBeNull();
    });
  });

  describe("resolveScriptureMeaning", () => {
    it("shows the English source without a label in an English UI", () => {
      expect(resolveScriptureMeaning("Meaning", "en", "Sens")).toEqual({
        text: "Meaning",
        englishFallback: false,
      });
    });

    it("prefers the dataset text in a non-English UI", () => {
      expect(resolveScriptureMeaning("Meaning", "fr", "Sens")).toEqual({
        text: "Sens",
        englishFallback: false,
      });
    });

    it("labels the English when no dataset text exists", () => {
      expect(resolveScriptureMeaning("Meaning", "fr", null)).toEqual({
        text: "Meaning",
        englishFallback: true,
      });
      expect(resolveScriptureMeaning("", "fr", null).englishFallback).toBe(false);
    });
  });
});
