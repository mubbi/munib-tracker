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

/** Tajweed color-rule ids used by the ayah-study legend and colored Arabic renderer. */
export type TajweedRuleId =
  | "ham_wasl"
  | "laam_shamsiyah"
  | "slnt"
  | "madda_normal"
  | "madda_permissible"
  | "madda_necessary"
  | "madda_obligatory"
  | "qalqalah"
  | "ikhafa"
  | "ikhafa_shafawi"
  | "iqlab"
  | "idgham_ghunnah"
  | "idgham_wo_ghunnah"
  | "idgham_shafawi"
  | "ghunnah";

/** A contiguous run of Arabic text sharing one tajweed rule (or none). */
export interface TajweedSegment {
  text: string;
  rule?: TajweedRuleId;
}

/** One word of a verse for the ayah-study word-by-word view. */
export interface QuranWord {
  arabic: string;
  translit: string;
  gloss: string;
  audioUrl?: string;
}

/** Quran playback repeat plan (ayah-study / mini-player). */
export type QuranRepeatMode = "off" | "verse" | "range" | "surah";

export interface QuranRepeatPlan {
  mode: QuranRepeatMode;
  /** Inclusive 1-based ayah numbers when mode is `"range"`. */
  start?: number;
  end?: number;
}

/** Whether to speak the translation after each Arabic ayah via native TTS. */
export type QuranTranslationAudio = "off" | "after";
