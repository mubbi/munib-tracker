import { describe, expect, it } from "vitest";
import type { AppLocale } from "./app-locale";
import {
  getLocaleDefinition,
  getLocaleDefinitionOrNull,
  isRtlLocale,
  LOCALE_REGISTRY,
  matchDeviceLocale,
  normalizeAppLocale,
  RTL_LOCALE_CODES,
  resolveIntlLocale,
  SCRIPT_UNICODE_RANGES,
  SORTED_LOCALE_REGISTRY,
} from "./locale-registry";

describe("locale registry", () => {
  it("has a unique code per entry", () => {
    const codes = LOCALE_REGISTRY.map((entry) => entry.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("has a unique, contiguous sortOrder starting at 1", () => {
    const orders = LOCALE_REGISTRY.map((entry) => entry.sortOrder).sort((a, b) => a - b);
    expect(orders).toEqual(LOCALE_REGISTRY.map((_, i) => i + 1));
  });

  it("has a non-empty native and English name for every locale", () => {
    for (const entry of LOCALE_REGISTRY) {
      expect(entry.nativeName.trim().length, `${entry.code} nativeName`).toBeGreaterThan(0);
      expect(entry.englishName.trim().length, `${entry.code} englishName`).toBeGreaterThan(0);
    }
  });

  it("has a valid-looking BCP-47 tag for every locale", () => {
    for (const entry of LOCALE_REGISTRY) {
      expect(entry.bcp47, entry.code).toMatch(/^[a-z]{2,3}(-[A-Z]{2})?$/);
    }
  });

  it("has a valid-looking og:locale (lang_REGION) for every locale", () => {
    for (const entry of LOCALE_REGISTRY) {
      expect(entry.ogLocale, entry.code).toMatch(/^[a-z]{2,3}_[A-Z]{2}$/);
    }
  });

  it("has a lowercase regionCode usable as a flag asset key", () => {
    for (const entry of LOCALE_REGISTRY) {
      expect(entry.regionCode, entry.code).toMatch(/^[a-z]{2,3}$/);
    }
  });

  it("only marks Arabic-script locales as RTL in the current set", () => {
    for (const entry of LOCALE_REGISTRY) {
      if (entry.direction === "rtl") {
        expect(entry.script, entry.code).toBe("arabic");
      }
    }
  });

  it("registers Hindi as a Devanagari LTR locale", () => {
    const hi = LOCALE_REGISTRY.find((entry) => entry.code === "hi");
    expect(hi).toMatchObject({
      script: "devanagari",
      direction: "ltr",
      phase: 5,
      regionCode: "in",
    });
    expect(SCRIPT_UNICODE_RANGES.devanagari.test("हिन्दी")).toBe(true);
  });
});

describe("locale registry lookups", () => {
  it("getLocaleDefinition returns the entry for a known code", () => {
    expect(getLocaleDefinition("ur").direction).toBe("rtl");
  });

  it("getLocaleDefinition throws for unknown codes", () => {
    expect(() => getLocaleDefinition("xx" as AppLocale)).toThrow("Unknown app locale: xx");
  });

  it.each([
    ["fr", "fr-FR"],
    ["xx", undefined],
  ])("getLocaleDefinitionOrNull(%s) bcp47 -> %s", (code, bcp47) => {
    expect(getLocaleDefinitionOrNull(code)?.bcp47).toBe(bcp47);
  });

  it("sorts by sortOrder starting with English", () => {
    const orders = SORTED_LOCALE_REGISTRY.map((entry) => entry.sortOrder);

    expect(SORTED_LOCALE_REGISTRY[0]?.code).toBe("en");
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it.each([
    ["ar", true],
    ["fa", true],
    ["ur", true],
    ["en", false],
  ] as const)("isRtlLocale(%s) -> %s", (code, rtl) => {
    expect(isRtlLocale(code)).toBe(rtl);
    expect(RTL_LOCALE_CODES.has(code)).toBe(rtl);
  });

  it.each([
    ["en", "en-US"],
    ["ar", "ar"],
  ] as const)("resolveIntlLocale(%s) -> %s", (code, tag) => {
    expect(resolveIntlLocale(code)).toBe(tag);
  });

  it.each([
    [undefined, "en"],
    [null, "en"],
    ["", "en"],
    ["-US", "en"],
    ["TR", "tr"],
    ["ur-PK", "ur"],
    ["de-DE", "en"],
  ])("normalizeAppLocale(%j) -> %s", (raw, expected) => {
    expect(normalizeAppLocale(raw)).toBe(expected);
  });

  it.each([
    [["de-DE", "", "-x", "FR-ca", "ar"], "fr"],
    [[42 as unknown as string, "bn-BD"], "bn"],
    [["de", "ja-JP"], null],
    [[], null],
  ])("matchDeviceLocale(%j) -> %s", (tags, expected) => {
    expect(matchDeviceLocale(tags)).toBe(expected);
  });
});
