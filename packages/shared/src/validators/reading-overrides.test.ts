import { describe, expect, expectTypeOf, it } from "vitest";

import { READING_SURFACE_IDS, type ReadingSurface } from "../types/preferences";
import {
  isReadingSurface,
  SYNC_READING_SURFACES,
  sanitizeReadingOverrides,
  sanitizeReadingOverridesField,
} from "./reading-overrides";

describe("reading surfaces", () => {
  it("lists every ReadingSurface exactly once (type-level + runtime)", () => {
    expectTypeOf<(typeof READING_SURFACE_IDS)[number]>().toEqualTypeOf<ReadingSurface>();
    expect(new Set(READING_SURFACE_IDS).size).toBe(READING_SURFACE_IDS.length);
    expect(READING_SURFACE_IDS).toContain("finance");
  });

  it("keeps the API-safe copy identical to the shared list", () => {
    expect(SYNC_READING_SURFACES).toEqual(READING_SURFACE_IDS);
    expectTypeOf<(typeof SYNC_READING_SURFACES)[number]>().toEqualTypeOf<ReadingSurface>();
  });

  it("recognises finance and rejects unknown surfaces", () => {
    expect(isReadingSurface("finance")).toBe(true);
    expect(isReadingSurface("jannah")).toBe(true);
    expect(isReadingSurface("zakat")).toBe(false);
    expect(isReadingSurface(3)).toBe(false);
  });
});

describe("sanitizeReadingOverrides", () => {
  it("accepts a finance override", () => {
    expect(sanitizeReadingOverrides({ finance: { arabicDelta: 4, textDelta: -2 } })).toEqual({
      finance: { arabicDelta: 4, textDelta: -2 },
    });
  });

  it("drops junk surfaces, malformed entries and out-of-range deltas", () => {
    expect(
      sanitizeReadingOverrides({
        finance: { arabicDelta: "4", textDelta: 2, extra: true },
        quran: { arabicDelta: Number.NaN },
        hadith: "big",
        jannah: { arabicDelta: 9999, textDelta: -6 },
        bogus: { arabicDelta: 2 },
      }),
    ).toEqual({ finance: { textDelta: 2 }, jannah: { textDelta: -6 } });
    expect(sanitizeReadingOverrides(null)).toBeUndefined();
    expect(sanitizeReadingOverrides([{ finance: {} }])).toBeUndefined();
  });
});

describe("sanitizeReadingOverridesField", () => {
  it("passes records without reading overrides through untouched", () => {
    const noFonts = { locale: "en" };
    expect(sanitizeReadingOverridesField(noFonts)).toBe(noFonts);
    const oldBlob = { fontPrefs: { arabic: { size: 30 }, translation: {} } };
    expect(sanitizeReadingOverridesField(oldBlob)).toBe(oldBlob);
  });

  it("keeps an older blob without a finance entry as-is", () => {
    const data = { fontPrefs: { arabic: {}, readingOverrides: { quran: { arabicDelta: 2 } } } };
    expect(sanitizeReadingOverridesField(data)).toEqual(data);
  });

  it("cleans readingOverrides and drops a non-object one", () => {
    expect(
      sanitizeReadingOverridesField({
        locale: "ur",
        fontPrefs: { arabic: { size: 30 }, readingOverrides: { finance: { textDelta: 2 }, x: 1 } },
      }),
    ).toEqual({
      locale: "ur",
      fontPrefs: { arabic: { size: 30 }, readingOverrides: { finance: { textDelta: 2 } } },
    });
    expect(
      sanitizeReadingOverridesField({ fontPrefs: { arabic: {}, readingOverrides: "junk" } }),
    ).toEqual({ fontPrefs: { arabic: {} } });
  });
});
