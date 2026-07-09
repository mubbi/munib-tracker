import { describe, expect, it } from "vitest";
import { LOCALE_REGISTRY } from "./locale-registry";

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
});
