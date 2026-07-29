import type {
  JannahAppLink,
  JannahDuaEntry,
  JannahHadithRef,
  JannahImportance,
  JannahQuranRef,
} from "./jannah";

/** Hub section grouping on the Understanding Jahannam screen. */
export type JahannamSection =
  | "intro"
  | "understanding"
  | "nature"
  | "warnings"
  | "major-sins"
  | "mercy";

/** A self-contained educational topic within Understanding Jahannam. */
export interface JahannamTopic {
  id: string;
  section: JahannamSection;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** Qur'anic name of Hell with scholarly context. */
export interface JahannamNameEntry {
  id: string;
  name: string;
  transliteration: string;
  meaning: string;
  quran: JannahQuranRef;
  context: string;
  tafsirNote: string;
  /** Where scholars differ — e.g. whether each name is a separate level. */
  scholarlyNote?: string;
}

/** Gate of Hell — Qur'an states seven; details vary in tafsir. */
export interface JahannamGateEntry {
  id: string;
  /** Ordinal label when scholars name gates; may be omitted where texts are silent. */
  label: string;
  quranNote: string;
  scholarlyNote?: string;
}

/** Curated Qur'an verse for the verses browser. */
export interface JahannamVerseEntry {
  id: string;
  theme: "warnings" | "mercy" | "repentance" | "accountability" | "justice" | "hope";
  label: string;
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  excerpt: string;
  context?: string;
  tafsirSummary?: string;
}

/** Authentic hadith for the hadith browser. */
export interface JahannamHadithEntry {
  id: string;
  theme: "warning" | "mercy" | "repentance" | "accountability" | "protection";
  hadith: JannahHadithRef;
  context?: string;
}

/** Daily self-accountability question — links to trackers where helpful. */
export interface JahannamReflectionEntry {
  id: string;
  question: string;
  appLink?: JannahAppLink;
}

/** Reference source cited across the module. */
export interface JahannamReferenceEntry {
  id: string;
  title: string;
  note: string;
}

export type JahannamDuaEntry = JannahDuaEntry;
