import { localeToBcp47, toAppLocale } from "@/lib/locale-bcp47";

describe("localeToBcp47", () => {
  it("resolves an app locale to its Intl tag", () => {
    expect(localeToBcp47("en")).toMatch(/^en/);
  });

  it("falls back to en-US for unknown locales", () => {
    expect(localeToBcp47("xx")).toBe("en-US");
  });
});

describe("toAppLocale", () => {
  it.each([
    ["ur", "ur"],
    ["ar-SA", "ar"],
    ["xx-YY", "en"],
  ])("%s → %s", (raw, expected) => {
    expect(toAppLocale(raw)).toBe(expected);
  });
});
