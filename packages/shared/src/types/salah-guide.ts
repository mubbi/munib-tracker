import type { FiqhDifferenceId } from "../fiqh/differences";
import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";
import type { QazaPrayer } from "./prayer";
import type { MadhhabId } from "./preferences";

/** Learning journey phase — mirrors how a person actually learns salah. */
export type SalahGuideJourney =
  | "why"
  | "prepare"
  | "learn"
  | "practice"
  | "perfect"
  | "consistency";

/**
 * Fiqh ruling of a salah action:
 * - `fard` — a pillar (rukn); the prayer is invalid without it.
 * - `wajib` — required; a forgotten one is mended by sujud as-sahw (some schools count it a sunnah).
 * - `sunnah` — recommended and rewarded; the prayer is valid without it.
 */
export type SalahStepRuling = "fard" | "wajib" | "sunnah";

/** One ordered step within a procedural topic (wudu, salah postures, etc.). */
export interface SalahGuideStep {
  title: string;
  body: string;
  arabic?: string;
  transliteration?: string;
  /** Translation of the Arabic phrase recited in this step. */
  translation?: string;
  /** Fiqh ruling of this action — pillar (fard), required (wajib), or recommended (sunnah). */
  ruling?: SalahStepRuling;
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
  /** NF-3.0a: structured fiqh differences rendered as `<MadhhabNote>`s under the prose. */
  differenceIds?: readonly FiqhDifferenceId[];
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
  /** Sunnah mu'akkadah (the rawatib) before / after the fard. */
  sunnahBefore: number;
  sunnahAfter: number;
  /**
   * Recommended but not emphasised (ghayr mu'akkadah) — the rawatib hub's optional
   * extras, at their default rakahs (`RAWATIB_RAKAH_OPTIONS`). Never part of the 12 / 10.
   */
  optionalBefore: number;
  optionalAfter: number;
  /** Extra note, e.g. Witr being wajib for Hanafis. */
  note?: string;
}

/** Quiz question — educational review, not spiritual ranking. */
export interface SalahGuideQuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "ordering" | "reflection";
  prompt: string;
  options?: string[];
  /** Index into options for scored types; omitted for reflection. */
  correctIndex?: number;
  explanation: string;
  /**
   * NF-3.0a: set when the correct answer depends on the school. Such questions
   * are skipped in "all views" mode, and shown only to the schools in
   * `answerSchools` (those for which `correctIndex` is right).
   */
  differenceId?: FiqhDifferenceId;
  answerSchools?: readonly MadhhabId[];
}
