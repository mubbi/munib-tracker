import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Hub section grouping on The Day of Judgment screen. */
export type LastDaySection = "intro" | "journey" | "signs" | "events" | "outcomes" | "practice";

/** A self-contained educational topic within The Day of Judgment hub. */
export interface LastDayTopic {
  id: string;
  section: LastDaySection;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  misconceptions?: string[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** One stage on the Hereafter timeline — centerpiece of the module. */
export interface LastDayTimelineEvent {
  id: string;
  /** Display order from life through eternity. */
  order: number;
  title: string;
  body: string;
  /** Links to a topic article when applicable. */
  topicId?: string;
  /** Minor vs major sign grouping — only for sign events. */
  signType?: "minor" | "major";
}

/** Curated Qur'an verse for the verses browser. */
export interface LastDayVerseEntry {
  id: string;
  theme: "resurrection" | "accountability" | "paradise" | "hell" | "mercy" | "justice" | "hope";
  label: string;
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  excerpt: string;
  context: string;
  tafsirSummary?: string;
}

/** Authentic hadith for the hadith browser. */
export interface LastDayHadithEntry {
  id: string;
  theme: "death" | "grave" | "resurrection" | "reckoning" | "intercession" | "paradise" | "hell";
  hadith: JannahHadithRef;
  context?: string;
}

/** Quiz question — educational review, not spiritual ranking. */
export interface LastDayQuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "ordering" | "reflection";
  prompt: string;
  options?: string[];
  /** Index into options for scored types; omitted for reflection. */
  correctIndex?: number;
  explanation: string;
}

/** Reference source cited across the module. */
export interface LastDayReferenceEntry {
  id: string;
  title: string;
  note: string;
}
