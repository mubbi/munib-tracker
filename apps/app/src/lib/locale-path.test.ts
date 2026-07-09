import {
  LOCALE_PATH_DEFAULT,
  localizedUrl,
  prependLocalePath,
  stripLocalePrefix,
} from "./locale-path";

describe("locale-path", () => {
  it("leaves default locale paths unprefixed", () => {
    expect(prependLocalePath("/hadith", LOCALE_PATH_DEFAULT)).toBe("/hadith");
    expect(localizedUrl("/hadith", "en", "https://example.com")).toBe("https://example.com/hadith");
  });

  it("prefixes non-default locales", () => {
    expect(prependLocalePath("/hadith", "ar")).toBe("/ar/hadith");
    expect(localizedUrl("/", "ur", "https://example.com")).toBe("https://example.com/ur");
  });

  it("strips locale prefix for router paths", () => {
    expect(stripLocalePrefix("/ar/hadith")).toEqual({ locale: "ar", path: "/hadith" });
    expect(stripLocalePrefix("/hadith")).toEqual({ locale: null, path: "/hadith" });
    expect(stripLocalePrefix("/en/hadith")).toEqual({ locale: null, path: "/en/hadith" });
  });
});
