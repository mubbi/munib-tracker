import { describe, expect, it } from "vitest";
import { DUA_ITEMS, duasByCategory, getDuaById } from "./duas";
import { DUROOD_ITEMS, getDurudById } from "./duroods";
import { overlayExportSuffix, parseOverlayExportName } from "./i18n/overlay-locale";
import { QURAN_GUIDE_LETTER_AUDIO_URI, resolveGlyphAudioUri } from "./quran-guide-audio";

const FIRST_DUA = DUA_ITEMS[0];

describe("dua lookups", () => {
  it("finds a dua by id", () => {
    expect(getDuaById(FIRST_DUA?.id ?? "")).toBe(FIRST_DUA);
  });

  it("returns undefined for an unknown dua id", () => {
    expect(getDuaById("missing-dua")).toBeUndefined();
  });

  it("lists only duas in the requested category", () => {
    const categoryId = FIRST_DUA?.categoryId ?? "quranic";

    const items = duasByCategory(categoryId);

    expect(items).toContain(FIRST_DUA);
    expect(items.every((item) => item.categoryId === categoryId)).toBe(true);
  });
});

describe("getDurudById", () => {
  it.each([
    ["durood-ibrahim", DUROOD_ITEMS[0]],
    ["missing", undefined],
  ])("%s", (id, expected) => {
    expect(getDurudById(id)).toBe(expected);
  });
});

describe("resolveGlyphAudioUri", () => {
  it.each([
    ["ب", QURAN_GUIDE_LETTER_AUDIO_URI.ba],
    ["x", undefined],
  ])("%s", (glyph, expected) => {
    expect(resolveGlyphAudioUri(glyph)).toBe(expected);
  });
});

describe("overlay export names", () => {
  it("builds the upper-case locale suffix", () => {
    expect(overlayExportSuffix("ur")).toBe("UR");
  });

  it.each([
    ["AQEDAH_TOPICS_UR", { baseKey: "AQEDAH_TOPICS", locale: "ur" }],
    ["AQEDAH_TOPICS_EN", null],
    ["AQEDAH_TOPICS", null],
  ])("parses %s", (name, expected) => {
    expect(parseOverlayExportName(name)).toEqual(expected);
  });
});
