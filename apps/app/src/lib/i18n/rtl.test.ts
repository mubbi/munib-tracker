import { describe, expect, it } from "@jest/globals";

import { isRtlLocale, RTL_LOCALES } from "@/lib/i18n/rtl-locale";

describe("RTL_LOCALES", () => {
  it("includes Arabic and Urdu", () => {
    expect(RTL_LOCALES.has("ar")).toBe(true);
    expect(RTL_LOCALES.has("ur")).toBe(true);
    expect(RTL_LOCALES.has("en")).toBe(false);
  });
});

describe("isRtlLocale", () => {
  it("returns true for Arabic and Urdu", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("ur")).toBe(true);
  });

  it("returns false for English", () => {
    expect(isRtlLocale("en")).toBe(false);
  });
});
