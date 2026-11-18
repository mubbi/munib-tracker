import type { QuranEdition } from "@munib-tracker/shared/types";
import { REMOTE_EDITIONS } from "@/api/quran-remote";
import { getBundledEditions } from "@/lib/quran";
import {
  ALL_QURAN_TRANSLATIONS,
  getAllQuranTranslations,
  groupTranslationsByLanguage,
  languageForEditionId,
} from "@/lib/quran-translation-options";

const ed = (id: string, language: string, name: string) =>
  ({ id, language, name, kind: "translation" }) as QuranEdition;

describe("quran translation options", () => {
  it("lists bundled translations plus remote editions", () => {
    const all = getAllQuranTranslations();
    const bundled = getBundledEditions().filter((e) => e.kind === "translation");
    expect(all).toHaveLength(bundled.length + REMOTE_EDITIONS.length);
    expect(all.every((e) => e.kind !== "arabic" || REMOTE_EDITIONS.includes(e))).toBe(true);
    expect(ALL_QURAN_TRANSLATIONS).toEqual(all);
  });

  it("groups by language, sorts editions by name and preferred languages first", () => {
    const groups = groupTranslationsByLanguage(
      [
        ed("ur-2", "ur", "Zeta"),
        ed("en-1", "en", "Sahih"),
        ed("ur-1", "ur", "Alpha"),
        ed("xx-1", "xx", "Unknown"),
      ],
      ["ur"],
    );
    expect(groups[0].language).toBe("ur");
    expect(groups[0].locale).toBe("ur");
    expect(groups[0].editions.map((e) => e.id)).toEqual(["ur-1", "ur-2"]);
    const unknown = groups.find((g) => g.language === "xx");
    expect(unknown).toEqual(expect.objectContaining({ locale: null, name: "XX", english: "XX" }));
    // Non-preferred groups are alphabetical by display name.
    const rest = groups.slice(1).map((g) => g.name);
    expect(rest).toEqual(
      [...rest].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
    );
  });

  it("defaults to no preferred languages", () => {
    const groups = groupTranslationsByLanguage([ed("a", "en", "A"), ed("b", "ar", "B")]);
    expect(groups).toHaveLength(2);
  });

  it("resolves an edition's language", () => {
    const eds = [ed("en-1", "en", "Sahih")];
    expect(languageForEditionId("en-1", eds)).toBe("en");
    expect(languageForEditionId("zz", eds)).toBeUndefined();
  });
});
