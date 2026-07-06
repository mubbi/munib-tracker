import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";
import type { QazaPrayer } from "./prayer";

/** Learning journey phase — mirrors how a person actually learns salah. */
export type SalahGuideJourney =
  | "why"
  | "prepare"
  | "learn"
  | "practice"
  | "perfect"
  | "consistency";

/** One ordered step within a procedural topic (wudu, salah postures, etc.). */
export interface SalahGuideStep {
  title: string;
  body: string;
  arabic?: string;
  transliteration?: string;
  /** Optional tip — common mistake or practical note. */
  tip?: string;
}

/** A self-contained guide topic within the Learn Salah hub. */
export interface SalahGuideTopic {
  id: string;
  journey: SalahGuideJourney;
  title: string;
  summary: string;
  body: string[];
  /** Procedural steps — wudu, how-to-pray, adhan sentences, etc. */
  steps?: SalahGuideStep[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** A phrase recited in salah with translation and deeper meaning. */
export interface SalahGuidePhrase {
  id: string;
  title: string;
  when: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  reference?: string;
}

/** Rakat counts for one prayer — fard plus commonly-prayed sunnah around it. */
export interface PrayerRakatSummary {
  prayerId: QazaPrayer;
  fard: number;
  sunnahBefore: number;
  sunnahAfter: number;
  /** Extra note, e.g. Witr being wajib for Hanafis. */
  note?: string;
}
