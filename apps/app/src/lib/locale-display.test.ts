import { APP_LOCALES, localeSecondaryLabel, matchesLocaleSearch } from "@/lib/locale-display";

describe("APP_LOCALES", () => {
  it("lists every app locale with native and English names", () => {
    const urdu = APP_LOCALES.find((entry) => entry.code === "ur");
    expect(APP_LOCALES).toHaveLength(24);
    expect(urdu).toMatchObject({ name: "اردو", english: "Urdu" });
  });

  it("flags which locales have scripture translations", () => {
    expect(APP_LOCALES.some((entry) => entry.scriptureSupported)).toBe(true);
    expect(APP_LOCALES.every((entry) => typeof entry.scriptureSupported === "boolean")).toBe(true);
  });
});

describe("localeSecondaryLabel", () => {
  it("shows the English name when it differs from the native name", () => {
    expect(localeSecondaryLabel("ur", "Urdu", "اردو")).toBe("Urdu");
  });

  it("shows the locale code when the names match", () => {
    expect(localeSecondaryLabel("en", "English", "English")).toBe("EN");
  });
});

describe("matchesLocaleSearch", () => {
  const urdu = { code: "ur" as const, name: "اردو", english: "Urdu" };

  it.each([
    ["  ", true],
    ["UR", true],
    ["urd", true],
    ["اردو", true],
    ["french", false],
  ])("query %p → %p", (query, expected) => {
    expect(matchesLocaleSearch(query, urdu)).toBe(expected);
  });
});
