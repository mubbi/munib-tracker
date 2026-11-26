import { describe, expect, it } from "vitest";
import { fastingRefLabel, VOLUNTARY_FAST_RESTRICTION_EVIDENCE } from "./voluntary-fasting-evidence";

describe.concurrent("fastingRefLabel", () => {
  it("labels Qur'an refs by surah and ayah (with a range when given)", () => {
    expect(fastingRefLabel({ kind: "quran", surah: 2, ayahFrom: 183 })).toBe("Qur'an 2:183");
    expect(fastingRefLabel({ kind: "quran", surah: 2, ayahFrom: 183, ayahTo: 185 })).toBe(
      "Qur'an 2:183–185",
    );
  });

  it("labels hadith by collection, preferring the printed (Abd al-Baqi) number", () => {
    expect(
      fastingRefLabel({
        kind: "hadith",
        collection: "muslim",
        number: 2746,
        arabicNumber: "1162.01",
        grade: "sahih",
      }),
    ).toBe("Sahih Muslim 1162");
    expect(
      fastingRefLabel({ kind: "hadith", collection: "tirmidhi", number: 747, grade: "hasan" }),
    ).toBe("Jami' at-Tirmidhi 747");
  });

  it("labels a book ref by its work", () => {
    expect(fastingRefLabel({ kind: "book", work: "mughni" })).toBe("mughni");
  });

  it("produces a label for every bundled restriction ref", () => {
    for (const refs of Object.values(VOLUNTARY_FAST_RESTRICTION_EVIDENCE)) {
      for (const ref of refs) expect(fastingRefLabel(ref)).toMatch(/\S/);
    }
  });
});
