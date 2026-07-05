import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { FontPreferences } from "@munib-tracker/shared/types";

import {
  ARABIC_SIZE_BOUNDS,
  nextReadingDelta,
  resolveArabicFontFamily,
  resolveArabicLineHeight,
  resolveReadingFontSizes,
  TEXT_SIZE_BOUNDS,
} from "@/lib/reading-typography";

function fontPrefs(patch: Partial<FontPreferences> = {}): FontPreferences {
  return { ...DEFAULT_USER_PREFERENCES.fontPrefs, ...patch };
}

describe("resolveReadingFontSizes", () => {
  it("returns the global base sizes when there is no override", () => {
    const prefs = fontPrefs({ arabic: { size: 28 }, translation: { size: 16 } });
    const sizes = resolveReadingFontSizes("quran", prefs);
    expect(sizes.arabic).toBe(28);
    expect(sizes.translation).toBe(16);
    expect(sizes.transliteration).toBe(15);
  });

  it("applies a surface delta over the base sizes", () => {
    const prefs = fontPrefs({
      arabic: { size: 28 },
      translation: { size: 16 },
      readingOverrides: { quran: { arabicDelta: 6, textDelta: 4 } },
    });
    const sizes = resolveReadingFontSizes("quran", prefs);
    expect(sizes.arabic).toBe(34);
    expect(sizes.translation).toBe(20);
  });

  it("clamps to the layout-safe bounds", () => {
    const prefs = fontPrefs({
      arabic: { size: 28 },
      translation: { size: 16 },
      readingOverrides: { quran: { arabicDelta: 999, textDelta: 999 } },
    });
    const sizes = resolveReadingFontSizes("quran", prefs);
    expect(sizes.arabic).toBe(ARABIC_SIZE_BOUNDS.max);
    expect(sizes.translation).toBe(TEXT_SIZE_BOUNDS.max);
  });

  it("keeps surfaces independent", () => {
    const prefs = fontPrefs({
      arabic: { size: 28 },
      readingOverrides: { quran: { arabicDelta: 4 } },
    });
    expect(resolveReadingFontSizes("quran", prefs).arabic).toBe(32);
    expect(resolveReadingFontSizes("hadith", prefs).arabic).toBe(28);
  });
});

describe("nextReadingDelta", () => {
  it("steps up and down without escaping bounds", () => {
    const prefs = fontPrefs({ arabic: { size: 28 }, translation: { size: 16 } });
    const up = nextReadingDelta(prefs, "quran", 1);
    expect(up.arabicDelta).toBe(2);
    expect(up.textDelta).toBe(2);

    const maxed = fontPrefs({
      arabic: { size: ARABIC_SIZE_BOUNDS.max },
      translation: { size: TEXT_SIZE_BOUNDS.max },
    });
    // Already at the ceiling — stepping up cannot exceed the bound.
    expect(nextReadingDelta(maxed, "quran", 1).arabicDelta).toBe(0);
  });
});

describe("resolveArabicFontFamily", () => {
  it("falls back to the system default for an unknown family", () => {
    expect(resolveArabicFontFamily("does-not-exist")).toBe(resolveArabicFontFamily("system"));
    expect(resolveArabicFontFamily(undefined)).toBe(resolveArabicFontFamily("system"));
  });

  it("resolves a named family to its fontFamily", () => {
    expect(resolveArabicFontFamily("amiri")).toBe("Amiri");
  });
});

describe("resolveArabicLineHeight", () => {
  it("scales with font size", () => {
    expect(resolveArabicLineHeight(28, "system")).toBe(56);
    expect(resolveArabicLineHeight(28, "scheherazade")).toBeGreaterThan(
      resolveArabicLineHeight(28, "system"),
    );
  });

  it("adds extra leading for compact sizes", () => {
    const compact = resolveArabicLineHeight(13, "system");
    const ratio = compact / 13;
    expect(ratio).toBeGreaterThan(2);
  });
});
