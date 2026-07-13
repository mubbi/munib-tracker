import tafsirDefs from "./quran-tafsir-defs.json";

/**
 * On-demand Qur'an tafsir editions (spa5k/tafsir_api + fawaz Siraj).
 * Never invent commentary — only dataset-backed editions belong here.
 *
 * @see https://github.com/spa5k/tafsir_api
 * @see https://github.com/fawazahmed0/quran-api
 */
export type QuranTafsirProvider = "spa5k" | "fawaz";

export interface QuranTafsirEditionDef {
  id: string;
  provider: QuranTafsirProvider;
  /** CDN path slug (spa5k folder name or fawaz edition slug). */
  slug: string;
  name: string;
  author: string;
  /** BCP-47-ish language code (`en`, `ar`, `ur`, …). */
  language: string;
  direction: "ltr" | "rtl";
}

export const QURAN_TAFSIR_EDITIONS: readonly QuranTafsirEditionDef[] =
  tafsirDefs as QuranTafsirEditionDef[];

const BY_ID: ReadonlyMap<string, QuranTafsirEditionDef> = new Map(
  QURAN_TAFSIR_EDITIONS.map((ed) => [ed.id, ed]),
);

export function getTafsirEdition(editionId: string): QuranTafsirEditionDef | undefined {
  return BY_ID.get(editionId);
}

/** Prefer these edition ids when resolving a default for a language. */
const DEFAULT_TAFSIR_BY_LANGUAGE: Readonly<Record<string, string>> = {
  en: "en-tafisr-ibn-kathir",
  ar: "ar-tafsir-muyassar",
  ur: "ur-tafseer-ibn-e-kaseer",
  bn: "bn-tafseer-ibn-e-kaseer",
  id: "in-tafsir-jalalayn",
  tr: "tr-tafsir-ibne-kathir",
  ru: "ru-tafsir-ibne-kahtir",
  fa: "persian-mokhtasar",
  fr: "french-mokhtasar",
  bs: "bosnian-mokhtasar",
  sq: "sq-saadi",
  az: "azeri-mokhtasar",
  ps: "pashto-mokhtasar",
  uz: "uzbek-mokhtasar",
  ky: "kyrgyz-mokhtasar",
  ku: "kurd-tafsir-rebar",
};

/**
 * Picks a sensible default tafsir for a language when one exists in the catalog.
 * Falls back to the first edition for that language, then `undefined`.
 */
export function resolveDefaultTafsirId(language: string | null | undefined): string | undefined {
  if (!language) return undefined;
  const lang = language.split("-")[0]?.toLowerCase() || language;
  const preferred = DEFAULT_TAFSIR_BY_LANGUAGE[lang];
  if (preferred && BY_ID.has(preferred)) return preferred;
  const first = QURAN_TAFSIR_EDITIONS.find((ed) => ed.language === lang);
  return first?.id;
}

export function tafsirEditionsForLanguage(language: string): QuranTafsirEditionDef[] {
  return QURAN_TAFSIR_EDITIONS.filter((ed) => ed.language === language);
}
