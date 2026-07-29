import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Hub section grouping on the Learn Dua screen. */
export type LearnDuaSection = "intro" | "daily" | "situational" | "categories" | "reference";

/** A featured dua block within a Learn Dua topic. */
export interface LearnDuaPhrase {
  id: string;
  title: string;
  when: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  /** Bundled Hisnul Muslim id when available. */
  duaId?: string;
}

/** A self-contained topic within the Learn Dua hub. */
export interface LearnDuaTopic {
  id: string;
  section: LearnDuaSection;
  title: string;
  summary: string;
  body: string[];
  phrases?: LearnDuaPhrase[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** Occasion card linking to bundled duas or Learn Dua topics. */
export interface LearnDuaOccasion {
  id: string;
  title: string;
  summary: string;
  topicId?: string;
  duaId?: string;
  category: "daily" | "situational" | "quranic";
}
