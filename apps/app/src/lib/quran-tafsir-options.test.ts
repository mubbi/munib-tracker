import { describe, expect, it } from "@jest/globals";

import { QURAN_TAFSIR_EDITIONS, type QuranTafsirEditionDef } from "@munib-tracker/shared/i18n";

import {
  getAllTafsirEditions,
  groupTafsirsByLanguage,
  languageForTafsirId,
  resolvePreferredTafsirId,
} from "./quran-tafsir-options";

describe("resolvePreferredTafsirId", () => {
  it("treats empty string as explicit none", () => {
    expect(resolvePreferredTafsirId("", "en", "en")).toBeUndefined();
  });

  it("uses a stored edition when valid", () => {
    expect(resolvePreferredTafsirId("en-al-jalalayn", "ur", "ar")).toBe("en-al-jalalayn");
  });

  it("falls back to locale defaults when unset", () => {
    expect(resolvePreferredTafsirId(undefined, "en", "ar")).toBe("en-tafisr-ibn-kathir");
    expect(resolvePreferredTafsirId(undefined, "xx", "ar")).toBe("ar-tafsir-muyassar");
  });
});

describe("tafsir grouping", () => {
  const def = (id: string, language: string, name: string) =>
    ({ id, language, name }) as unknown as QuranTafsirEditionDef;

  it("exposes every tafsir edition", () => {
    expect(getAllTafsirEditions()).toBe(QURAN_TAFSIR_EDITIONS);
    expect(getAllTafsirEditions().length).toBeGreaterThan(0);
  });

  it("groups by language, putting preferred (BCP-47 normalised) first", () => {
    const groups = groupTafsirsByLanguage(
      [
        def("ar-2", "ar", "Zeta"),
        def("en-1", "en", "Ibn Kathir"),
        def("ar-1", "ar", "Alpha"),
        def("q", "qq", "Q"),
      ],
      ["AR-SA"],
    );
    expect(groups[0].language).toBe("ar");
    expect(groups[0].editions.map((e) => e.id)).toEqual(["ar-1", "ar-2"]);
    expect(groups.find((g) => g.language === "qq")).toEqual(
      expect.objectContaining({ locale: null, name: "QQ", english: "QQ" }),
    );
    const rest = groups.slice(1).map((g) => g.name);
    expect(rest).toEqual(
      [...rest].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
    );
  });

  it("works without preferred languages", () => {
    expect(groupTafsirsByLanguage([def("a", "en", "A")])).toHaveLength(1);
  });

  it("resolves an edition id's language with the default catalog", () => {
    const [first] = QURAN_TAFSIR_EDITIONS;
    expect(languageForTafsirId(first.id)).toBe(first.language);
    expect(languageForTafsirId("nope")).toBeUndefined();
    expect(languageForTafsirId("x", [def("x", "ur", "X")])).toBe("ur");
  });

  it("ignores stored ids that are no longer in the catalog", () => {
    expect(resolvePreferredTafsirId("gone-edition", "en", "ar")).toBe(
      resolvePreferredTafsirId(undefined, "en", "ar"),
    );
    expect(resolvePreferredTafsirId(undefined, "xx", "yy")).toBeUndefined();
  });
});
