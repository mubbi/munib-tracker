export type RevelationPlace = "makkah" | "madinah";

/** Reader layout mode for the Qur'an screen. */
export type QuranReaderLayout = "ayah" | "page" | "mushaf";

export interface Surah {
  number: number; // 1..114
  nameArabic: string; // ٱلْفَاتِحَة
  nameEnglish: string; // "The Opening"
  nameTransliteration: string; // "Al-Fatihah"
  revelationPlace: RevelationPlace;
  ayahCount: number;
  bismillahPre: boolean; // false only for At-Tawbah (9)
}

export interface Ayah {
  surah: number;
  ayah: number; // 1-based within surah
  global: number; // 1..6236
  arabic: string; // Uthmani, verbatim
  juz: number; // 1..30
  sajda: boolean;
  /** Madinah-mushaf page (1..604) and hizb (1..60). */
  hizb: number;
  page: number;
}

export type QuranEditionKind = "translation" | "transliteration" | "tafsir";

export interface QuranEdition {
  id: string; // "en-pickthall", "en-saheehinternational", ...
  kind: QuranEditionKind;
  language: string; // "en" | "ur" | "ar"
  name: string; // "Pickthall"
  bundled: boolean; // true = offline asset, false = fetched via remote CDN
  direction: "ltr" | "rtl";
}

export interface AyahText {
  surah: number;
  ayah: number;
  editionId: string;
  text: string;
}
