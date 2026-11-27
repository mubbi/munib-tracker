import {
  ayahIndexForKey,
  ayahNumberFromKey,
  focusWordTarget,
  hifzConfirmCopyKeys,
  readingProgressForIndex,
  resolvePrimaryEditionId,
  resolveSecondaryEditionId,
  shouldPersistResumeAyah,
  surahAudioKey,
  surahSeoCopy,
  viewableIndexRange,
} from "@/lib/quran-surah-reader";
import { ALL_QURAN_TRANSLATIONS } from "@/lib/quran-translation-options";

describe("ayahIndexForKey", () => {
  const contiguous = [{ ayah: 1 }, { ayah: 2 }, { ayah: 3 }];

  it("maps ayah n to row n-1 in a contiguous surah", () => {
    expect(ayahIndexForKey(contiguous, 2, "2:3")).toBe(2);
    expect(ayahIndexForKey(contiguous, 2, "2:1")).toBe(0);
  });

  it("rejects other surahs, non-numeric and missing ayahs", () => {
    expect(ayahIndexForKey(contiguous, 2, "3:1")).toBe(-1);
    expect(ayahIndexForKey(contiguous, 2, "2:x")).toBe(-1);
    expect(ayahIndexForKey(contiguous, 2, "2:9")).toBe(-1);
  });

  it("falls back to a search when the list has gaps", () => {
    expect(ayahIndexForKey([{ ayah: 1 }, { ayah: 3 }], 5, "5:3")).toBe(1);
  });
});

describe("surahAudioKey / ayahNumberFromKey", () => {
  it("keeps only this surah's track", () => {
    expect(surahAudioKey("2:255", 2)).toBe("2:255");
    expect(surahAudioKey("22:1", 2)).toBeUndefined();
    expect(surahAudioKey(undefined, 2)).toBeUndefined();
  });

  it("reads the ayah number", () => {
    expect(ayahNumberFromKey("2:255")).toBe(255);
    expect(ayahNumberFromKey(undefined)).toBeNull();
  });
});

describe("viewableIndexRange / readingProgressForIndex", () => {
  it("ignores tokens without an index", () => {
    expect(viewableIndexRange([{ index: 4 }, { index: null }, { index: 2 }, {}])).toEqual({
      min: 2,
      max: 4,
    });
    expect(viewableIndexRange([{ index: null }])).toBeNull();
    expect(viewableIndexRange([])).toBeNull();
  });

  it("clamps progress to 0…1 over the last row index", () => {
    expect(readingProgressForIndex(0, 5)).toBe(0);
    expect(readingProgressForIndex(2, 5)).toBe(0.5);
    expect(readingProgressForIndex(4, 5)).toBe(1);
    expect(readingProgressForIndex(9, 5)).toBe(1);
  });
});

describe("shouldPersistResumeAyah", () => {
  const base = { ayah: 10, lastRecorded: 5, audioActive: false, userMoved: false };

  it("moves forward past the entry ayah", () => {
    expect(shouldPersistResumeAyah(base)).toBe(true);
  });

  it("skips unchanged, unknown, and audio-owned positions", () => {
    expect(shouldPersistResumeAyah({ ...base, ayah: 5 })).toBe(false);
    expect(shouldPersistResumeAyah({ ...base, ayah: null })).toBe(false);
    expect(shouldPersistResumeAyah({ ...base, audioActive: true })).toBe(false);
  });

  it("walks backward only after the user moved the list", () => {
    expect(shouldPersistResumeAyah({ ...base, ayah: 4 })).toBe(false);
    expect(shouldPersistResumeAyah({ ...base, ayah: 4, userMoved: true })).toBe(true);
  });
});

describe("focusWordTarget", () => {
  it("marks the 0-based word while the deep-linked ayah is ringed", () => {
    expect(focusWordTarget(7, 7, 3)).toEqual({ ayah: 7, index: 2 });
  });

  it("clears with the ring, on another ayah, or without a valid word", () => {
    expect(focusWordTarget(undefined, 7, 3)).toBeNull();
    expect(focusWordTarget(8, 7, 3)).toBeNull();
    expect(focusWordTarget(7, 7, undefined)).toBeNull();
    expect(focusWordTarget(7, 7, 0)).toBeNull();
  });
});

describe("edition resolution", () => {
  const [first, second] = ALL_QURAN_TRANSLATIONS;

  it("uses the preferred translation when it exists, else the default", () => {
    expect(resolvePrimaryEditionId(second.id, first.id)).toBe(second.id);
    expect(resolvePrimaryEditionId(undefined, first.id)).toBe(first.id);
    expect(resolvePrimaryEditionId("no-such-edition", first.id)).toBe(first.id);
  });

  it("drops a second translation that duplicates the primary or is unknown", () => {
    expect(resolveSecondaryEditionId(second.id, first.id)).toBe(second.id);
    expect(resolveSecondaryEditionId(first.id, first.id)).toBeUndefined();
    expect(resolveSecondaryEditionId("no-such-edition", first.id)).toBeUndefined();
    expect(resolveSecondaryEditionId(undefined, first.id)).toBeUndefined();
  });
});

describe("hifzConfirmCopyKeys", () => {
  it("names the status the tap moves to", () => {
    expect(hifzConfirmCopyKeys("memorized")).toEqual({
      bodyKey: "hifz.confirmMemorizedBody",
      confirmKey: "hifz.markMemorized",
      destructive: false,
    });
    expect(hifzConfirmCopyKeys("review")).toEqual({
      bodyKey: "hifz.confirmReviewBody",
      confirmKey: "hifz.markReview",
      destructive: false,
    });
    expect(hifzConfirmCopyKeys(null)).toEqual({
      bodyKey: "hifz.confirmClearBody",
      confirmKey: "hifz.clear",
      destructive: true,
    });
  });
});

describe("surahSeoCopy", () => {
  it("builds the crawlable title, description, keywords and breadcrumbs", () => {
    const seo = surahSeoCopy(
      {
        number: 1,
        nameTransliteration: "Al-Fatihah",
        nameEnglish: "The Opener",
        ayahCount: 7,
        revelationPlace: "makkah",
      },
      { home: "Home", quran: "Qur'an" },
    );
    expect(seo.path).toBe("/quran/1");
    expect(seo.title).toBe("Surah Al-Fatihah — The Opener");
    expect(seo.description).toContain("chapter 1 of the Qur'an — 7 ayahs, revealed in Makkah.");
    expect(seo.keywords).toEqual([
      "Surah Al-Fatihah",
      "The Opener",
      "surah 1",
      "read Quran online",
    ]);
    expect(seo.breadcrumbs).toEqual([
      { name: "Home", path: "/" },
      { name: "Qur'an", path: "/quran" },
      { name: "Al-Fatihah", path: "/quran/1" },
    ]);
  });

  it("labels Madinan surahs", () => {
    const seo = surahSeoCopy(
      {
        number: 2,
        nameTransliteration: "Al-Baqarah",
        nameEnglish: "The Cow",
        ayahCount: 286,
        revelationPlace: "madinah",
      },
      { home: "Home", quran: "Qur'an" },
    );
    expect(seo.description).toContain("revealed in Madinah.");
  });
});
