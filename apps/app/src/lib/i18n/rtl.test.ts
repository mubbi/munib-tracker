import { describe, expect, it } from "@jest/globals";

import { isRtlLocale, RTL_LOCALES } from "@/lib/i18n/rtl-locale";

describe("RTL_LOCALES", () => {
  it("includes all registry RTL locales", () => {
    for (const code of ["ar", "ur", "fa", "ps", "ku"] as const) {
      expect(RTL_LOCALES.has(code)).toBe(true);
    }
    expect(RTL_LOCALES.has("en")).toBe(false);
    expect(RTL_LOCALES.has("tr")).toBe(false);
  });
});

describe("isRtlLocale", () => {
  it("returns true for Arabic-script RTL locales", () => {
    for (const code of ["ar", "ur", "fa", "ps", "ku"] as const) {
      expect(isRtlLocale(code)).toBe(true);
    }
  });

  it("returns false for LTR locales", () => {
    expect(isRtlLocale("en")).toBe(false);
    expect(isRtlLocale("id")).toBe(false);
    expect(isRtlLocale("fr")).toBe(false);
  });
});
