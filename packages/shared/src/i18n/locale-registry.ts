import type { AppLocale } from "./app-locale";

/** Delivery phase this locale shipped in (documentation only — all listed locales are live). */
export type LocalePhase = 1 | 2 | 3 | 4;

/** Writing system a locale's translated UI text is authored in. */
export type LocaleScript = "latin" | "arabic" | "bengali" | "cyrillic";

export interface LocaleDefinition {
  code: AppLocale;
  /** Language's own name for itself, e.g. "Bahasa Indonesia". */
  nativeName: string;
  /** English name, e.g. "Indonesian". */
  englishName: string;
  /** BCP-47 tag used for `Intl` formatters. */
  bcp47: string;
  direction: "ltr" | "rtl";
  /** Writing system this locale's catalog is authored in — drives font selection and the i18n-guard script-leakage check. */
  script: LocaleScript;
  /** Lowercase key into `FLAG_ASSETS` / flag file name (not always an ISO region — see `ku`). */
  regionCode: string;
  /** Open Graph `og:locale` value, e.g. "id_ID". */
  ogLocale: string;
  /** `hreflang` / `<html lang>` value. */
  hreflang: string;
  /** Stable ordering for language pickers and docs. */
  sortOrder: number;
  phase: LocalePhase;
  /** Default fawazahmed0 Qur'an edition slug for this locale, when one exists. */
  quranEditionId?: string;
  /** Whether a bundled dua/zikr/durood/name translation exists for this locale. */
  scriptureSupported?: boolean;
}

/**
 * Single source of truth for every locale the app ships. Every consumer that
 * used to hardcode `en`/`ar`/`ur` (RTL set, flags, BCP-47, SEO, PWA, language
 * picker, Hijri months, etc.) reads from this registry instead, so adding a
 * locale is a one-file change here plus its translation catalog.
 */
export const LOCALE_REGISTRY: readonly LocaleDefinition[] = [
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
    bcp47: "en-US",
    direction: "ltr",
    script: "latin",
    regionCode: "us",
    ogLocale: "en_US",
    hreflang: "en",
    sortOrder: 1,
    phase: 1,
    quranEditionId: "en-pickthall",
    scriptureSupported: true,
  },
  {
    code: "ar",
    nativeName: "العربية",
    englishName: "Arabic",
    bcp47: "ar",
    direction: "rtl",
    script: "arabic",
    regionCode: "sa",
    ogLocale: "ar_AR",
    hreflang: "ar",
    sortOrder: 2,
    phase: 1,
    quranEditionId: "ar-tafsir-muyassar",
    scriptureSupported: true,
  },
  {
    code: "ur",
    nativeName: "اردو",
    englishName: "Urdu",
    bcp47: "ur",
    direction: "rtl",
    script: "arabic",
    regionCode: "pk",
    ogLocale: "ur_PK",
    hreflang: "ur",
    sortOrder: 3,
    phase: 1,
    quranEditionId: "ur-jalandhry",
    scriptureSupported: false,
  },
  {
    code: "id",
    nativeName: "Bahasa Indonesia",
    englishName: "Indonesian",
    bcp47: "id-ID",
    direction: "ltr",
    script: "latin",
    regionCode: "id",
    ogLocale: "id_ID",
    hreflang: "id",
    sortOrder: 4,
    phase: 2,
    quranEditionId: "id-indonesianislam",
    scriptureSupported: true,
  },
  {
    code: "tr",
    nativeName: "Türkçe",
    englishName: "Turkish",
    bcp47: "tr-TR",
    direction: "ltr",
    script: "latin",
    regionCode: "tr",
    ogLocale: "tr_TR",
    hreflang: "tr",
    sortOrder: 5,
    phase: 2,
    quranEditionId: "tr-diyanet",
    scriptureSupported: false,
  },
  {
    code: "bn",
    nativeName: "বাংলা",
    englishName: "Bengali",
    bcp47: "bn-BD",
    direction: "ltr",
    script: "bengali",
    regionCode: "bd",
    ogLocale: "bn_BD",
    hreflang: "bn",
    sortOrder: 6,
    phase: 2,
    quranEditionId: "bn-muhiuddinkhan",
    scriptureSupported: true,
  },
  {
    code: "ms",
    nativeName: "Bahasa Melayu",
    englishName: "Malay",
    bcp47: "ms-MY",
    direction: "ltr",
    script: "latin",
    regionCode: "my",
    ogLocale: "ms_MY",
    hreflang: "ms",
    sortOrder: 7,
    phase: 2,
    quranEditionId: "ms-basmeih",
    scriptureSupported: true,
  },
  {
    code: "fa",
    nativeName: "فارسی",
    englishName: "Persian",
    bcp47: "fa-IR",
    direction: "rtl",
    script: "arabic",
    regionCode: "ir",
    ogLocale: "fa_IR",
    hreflang: "fa",
    sortOrder: 8,
    phase: 2,
    quranEditionId: "fa-makarem",
    scriptureSupported: false,
  },
  {
    code: "fr",
    nativeName: "Français",
    englishName: "French",
    bcp47: "fr-FR",
    direction: "ltr",
    script: "latin",
    regionCode: "fr",
    ogLocale: "fr_FR",
    hreflang: "fr",
    sortOrder: 9,
    phase: 3,
    quranEditionId: "fr-hamidullah",
    scriptureSupported: false,
  },
  {
    code: "ha",
    nativeName: "Hausa",
    englishName: "Hausa",
    bcp47: "ha-NG",
    direction: "ltr",
    script: "latin",
    regionCode: "ng",
    ogLocale: "ha_NG",
    hreflang: "ha",
    sortOrder: 10,
    phase: 3,
    quranEditionId: "ha-gumi",
    scriptureSupported: false,
  },
  {
    code: "sw",
    nativeName: "Kiswahili",
    englishName: "Swahili",
    bcp47: "sw-TZ",
    direction: "ltr",
    script: "latin",
    regionCode: "tz",
    ogLocale: "sw_TZ",
    hreflang: "sw",
    sortOrder: 11,
    phase: 3,
    quranEditionId: "sw-basmeih",
    scriptureSupported: false,
  },
  {
    code: "ru",
    nativeName: "Русский",
    englishName: "Russian",
    bcp47: "ru-RU",
    direction: "ltr",
    script: "cyrillic",
    regionCode: "ru",
    ogLocale: "ru_RU",
    hreflang: "ru",
    sortOrder: 12,
    phase: 3,
    quranEditionId: "ru-kuliev",
    scriptureSupported: false,
  },
  {
    code: "az",
    nativeName: "Azərbaycanca",
    englishName: "Azerbaijani",
    bcp47: "az-AZ",
    direction: "ltr",
    script: "latin",
    regionCode: "az",
    ogLocale: "az_AZ",
    hreflang: "az",
    sortOrder: 13,
    phase: 3,
    quranEditionId: "az-mammadaliyev",
    scriptureSupported: false,
  },
  {
    code: "ps",
    nativeName: "پښتو",
    englishName: "Pashto",
    bcp47: "ps-AF",
    direction: "rtl",
    script: "arabic",
    regionCode: "af",
    ogLocale: "ps_AF",
    hreflang: "ps",
    sortOrder: 14,
    phase: 3,
    quranEditionId: "ps-khan",
    scriptureSupported: false,
  },
  {
    code: "so",
    nativeName: "Soomaali",
    englishName: "Somali",
    bcp47: "so-SO",
    direction: "ltr",
    script: "latin",
    regionCode: "so",
    ogLocale: "so_SO",
    hreflang: "so",
    sortOrder: 15,
    phase: 4,
    quranEditionId: "so-hassan",
    scriptureSupported: false,
  },
  {
    code: "uz",
    nativeName: "Oʻzbekcha",
    englishName: "Uzbek",
    bcp47: "uz-UZ",
    direction: "ltr",
    script: "latin",
    regionCode: "uz",
    ogLocale: "uz_UZ",
    hreflang: "uz",
    sortOrder: 16,
    phase: 4,
    quranEditionId: "uz-mansour",
    scriptureSupported: false,
  },
  {
    code: "kk",
    nativeName: "Қазақша",
    englishName: "Kazakh",
    bcp47: "kk-KZ",
    direction: "ltr",
    script: "cyrillic",
    regionCode: "kz",
    ogLocale: "kk_KZ",
    hreflang: "kk",
    sortOrder: 17,
    phase: 4,
    quranEditionId: "kk-altai",
    scriptureSupported: false,
  },
  {
    code: "ku",
    nativeName: "کوردی",
    englishName: "Kurdish (Sorani)",
    bcp47: "ku",
    direction: "rtl",
    script: "arabic",
    regionCode: "ku",
    ogLocale: "ku_IQ",
    hreflang: "ku",
    sortOrder: 18,
    phase: 4,
    quranEditionId: "ku-tanzil",
    scriptureSupported: false,
  },
  {
    code: "bs",
    nativeName: "Bosanski",
    englishName: "Bosnian",
    bcp47: "bs-BA",
    direction: "ltr",
    script: "latin",
    regionCode: "ba",
    ogLocale: "bs_BA",
    hreflang: "bs",
    sortOrder: 19,
    phase: 4,
    quranEditionId: "bs-korkut",
    scriptureSupported: false,
  },
  {
    code: "sq",
    nativeName: "Shqip",
    englishName: "Albanian",
    bcp47: "sq-AL",
    direction: "ltr",
    script: "latin",
    regionCode: "al",
    ogLocale: "sq_AL",
    hreflang: "sq",
    sortOrder: 20,
    phase: 4,
    quranEditionId: "sq-ahmeti",
    scriptureSupported: false,
  },
  {
    code: "ky",
    nativeName: "Кыргызча",
    englishName: "Kyrgyz",
    bcp47: "ky-KG",
    direction: "ltr",
    script: "cyrillic",
    regionCode: "kg",
    ogLocale: "ky_KG",
    hreflang: "ky",
    sortOrder: 21,
    phase: 4,
    quranEditionId: "ky-hakim",
    scriptureSupported: false,
  },
  {
    code: "tg",
    nativeName: "Тоҷикӣ",
    englishName: "Tajik",
    bcp47: "tg-TJ",
    direction: "ltr",
    script: "cyrillic",
    regionCode: "tj",
    ogLocale: "tg_TJ",
    hreflang: "tg",
    sortOrder: 22,
    phase: 4,
    quranEditionId: "tg-ayati",
    scriptureSupported: false,
  },
  {
    code: "tk",
    nativeName: "Türkmençe",
    englishName: "Turkmen",
    bcp47: "tk-TM",
    direction: "ltr",
    script: "latin",
    regionCode: "tm",
    ogLocale: "tk_TM",
    hreflang: "tk",
    sortOrder: 23,
    phase: 4,
    /**
     * No Turkmen Qur'an edition exists in fawazahmed0/quran-api; nearest approved
     * Turkic translation is Turkish Diyanet (shared with `tr`).
     */
    quranEditionId: "tr-diyanet",
    scriptureSupported: false,
  },
] satisfies readonly LocaleDefinition[];

const BY_CODE: ReadonlyMap<AppLocale, LocaleDefinition> = new Map(
  LOCALE_REGISTRY.map((entry) => [entry.code, entry]),
);

export function getLocaleDefinition(code: AppLocale): LocaleDefinition {
  const entry = BY_CODE.get(code);
  if (!entry) throw new Error(`Unknown app locale: ${code}`);
  return entry;
}

export function getLocaleDefinitionOrNull(code: string): LocaleDefinition | null {
  return BY_CODE.get(code as AppLocale) ?? null;
}

export const SORTED_LOCALE_REGISTRY: readonly LocaleDefinition[] = [...LOCALE_REGISTRY].sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

/** Locales that read right-to-left and require an `I18nManager` layout flip. */
export const RTL_LOCALE_CODES: ReadonlySet<AppLocale> = new Set(
  LOCALE_REGISTRY.filter((entry) => entry.direction === "rtl").map((entry) => entry.code),
);

export function isRtlLocale(code: AppLocale): boolean {
  return RTL_LOCALE_CODES.has(code);
}

/** Maps an app locale to its BCP-47 tag for `Intl` formatters. */
export function resolveIntlLocale(code: AppLocale): string {
  return getLocaleDefinition(code).bcp47;
}

/** Normalizes any string (e.g. a raw device locale) to a known `AppLocale`, defaulting to `en`. */
export function normalizeAppLocale(raw?: string | null): AppLocale {
  if (!raw) return "en";
  const base = raw.split("-")[0]?.toLowerCase();
  if (!base) return "en";
  const exact = getLocaleDefinitionOrNull(raw.toLowerCase());
  if (exact) return exact.code;
  const byBase = getLocaleDefinitionOrNull(base);
  return byBase ? byBase.code : "en";
}

/**
 * Maps a device BCP-47 tag (from `expo-localization`) to the nearest supported
 * `AppLocale`, matching on base language subtag. Returns `null` when nothing
 * in the registry matches, so callers can fall back to their own default.
 */
export function matchDeviceLocale(deviceTags: readonly string[]): AppLocale | null {
  for (const tag of deviceTags) {
    if (typeof tag !== "string" || !tag) continue;
    const base = tag.split("-")[0]?.toLowerCase();
    if (!base) continue;
    const match = getLocaleDefinitionOrNull(base);
    if (match) return match.code;
  }
  return null;
}

/**
 * Unicode letter ranges for each writing system, used by `i18n-guard.test.ts`
 * to flag text leaked from the wrong script (e.g. English words left inside a
 * Bengali value) rather than assuming every non-English locale is Arabic-script.
 */
export const SCRIPT_UNICODE_RANGES: Record<LocaleScript, RegExp> = {
  latin: /[A-Za-z]/,
  arabic: /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/,
  bengali: /[ঀ-৿]/,
  cyrillic: /[Ѐ-ӿ]/,
};
