import { buildHadithItem } from "@/test-support/fixtures/hadith";

import {
  isBundledQuranEdition,
  isHadithTranslationAvailable,
  resolveHadithTranslation,
  resolveQuranEditionId,
  resolveTranslationField,
} from "./translation-locale";

describe("resolveQuranEditionId", () => {
  it("prefers the translation locale's edition", () => {
    expect(resolveQuranEditionId({ translationLocale: "ur", locale: "fr" })).toBe("ur-jalandhry");
  });

  /** Load a copy whose locale registry has editions only for `withEdition` locales. */
  function setupRegistry(withEdition: string[]) {
    let resolve!: typeof resolveQuranEditionId;
    jest.isolateModules(() => {
      jest.doMock("@munib-tracker/shared/i18n", () => ({
        ...jest.requireActual("@munib-tracker/shared/i18n"),
        getLocaleDefinition: (code: string) => ({
          quranEditionId: withEdition.includes(code) ? `${code}-edition` : undefined,
        }),
      }));
      resolve = require("./translation-locale").resolveQuranEditionId;
    });
    return resolve;
  }

  it("falls back to the UI locale's edition", () => {
    const resolve = setupRegistry(["fr"]);
    expect(resolve({ translationLocale: "ur", locale: "fr" })).toBe("fr-edition");
  });

  it("falls back to the bundled English edition", () => {
    const resolve = setupRegistry([]);
    expect(resolve({ translationLocale: "ur", locale: "fr" })).toBe("en-pickthall");
  });
});

describe("isBundledQuranEdition", () => {
  it.each([
    ["en-pickthall", true],
    ["fr-hamidullah", false],
  ])("%s → %p", (id, expected) => {
    expect(isBundledQuranEdition(id)).toBe(expected);
  });
});

describe("resolveTranslationField", () => {
  const item = {
    translation: "In the name of Allah",
    translations: { ur: "اللہ کے نام سے", fr: "  " },
  };

  it.each([
    ["ur", "اللہ کے نام سے"],
    ["fr", "In the name of Allah"],
    ["tr", "In the name of Allah"],
  ] as const)("%s → %s", (translationLocale, expected) => {
    expect(resolveTranslationField(item, { translationLocale })).toBe(expected);
  });

  it("uses English when the item has no translations", () => {
    expect(resolveTranslationField({ translation: "Hi" }, { translationLocale: "ur" })).toBe("Hi");
  });
});

describe("resolveHadithTranslation", () => {
  const hadith = buildHadithItem({
    english: "English text",
    arabic: "نص عربي",
    translations: { ur: " اردو متن " },
  });

  it.each([
    ["ar", hadith, "نص عربي"],
    ["ar", { ...hadith, arabic: " " }, "English text"],
    ["ur", hadith, "اردو متن"],
    ["tr", hadith, "English text"],
    ["ur", { ...hadith, translations: undefined }, "English text"],
  ] as const)("%s → %s", (translationLocale, item, expected) => {
    expect(resolveHadithTranslation(item, { translationLocale })).toBe(expected);
  });
});

describe("isHadithTranslationAvailable", () => {
  it.each([
    ["ur", true],
    ["sq", false],
  ])("%s → %p", (locale, expected) => {
    expect(isHadithTranslationAvailable(locale)).toBe(expected);
  });
});
