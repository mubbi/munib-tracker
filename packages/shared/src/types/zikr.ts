import type { AuthenticWordingVariant } from "./content";
import type { AfterSalahPrayer } from "./prayer";

export type ZikrCategoryId =
  | "morning"
  | "evening"
  | "before_prayer"
  | "after_prayer"
  | "after_azan"
  | "before_sleep"
  | "anytime";

export interface ZikrItem {
  id: string;
  categoryId: ZikrCategoryId;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  virtues?: string;
  reference?: string;
  /**
   * Other authentic narrations of the same remembrance (same meaning, different
   * wording). Primary `arabic` / `reference` stay the displayed default.
   */
  variants?: AuthenticWordingVariant[];
  audioUri?: string;
  /** Dataset-sourced translations keyed by app locale (never AI-generated). */
  translations?: Partial<Record<string, string>>;
  /** Daily repetition target (a single recitation when absent). */
  targetCount?: number;
  /**
   * After-salah only: a different repetition after specific salah (e.g. the
   * Quls ×3 after Fajr and Maghrib, once after the others).
   */
  prayerTargets?: Partial<Record<AfterSalahPrayer, number>>;
  /**
   * Only weak (da'if) narrations support it: shown with a note, but never
   * required for its set to count as done.
   */
  optional?: boolean;
  /** Like `optional`, but only after these salah (the other salah have a sound chain). */
  optionalPrayers?: AfterSalahPrayer[];
  /**
   * For after-salah adhkar: the prayers this dhikr is specific to (fard or Witr).
   * Absent/empty ⇒ recited after every fard prayer (shown under every fard tab,
   * but not the Witr tab, which only holds Witr-specific adhkar).
   */
  prayers?: AfterSalahPrayer[];
  /** Hisnul Muslim chapter this zikr belongs to, when preserved from source. */
  chapter?: string;
  /** Position within its Hisnul Muslim chapter. */
  orderInChapter?: number;
}

export interface ZikrProgress {
  id: string;
  zikrId: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  count: number;
  target: number;
  completed: boolean;
  /**
   * When set, this progress is scoped to after-salah adhkar for one prayer
   * (a fard prayer or Witr). Absent ⇒ a single daily count (morning/evening,
   * or legacy after-salah).
   */
  prayerId?: AfterSalahPrayer;
  /** ISO datetime of the last change (used for sync last-write-wins). */
  updatedAt?: string;
}

/**
 * The full source hadith behind a zikr — why it is recited and its virtue.
 * Text is pulled verbatim from fawazahmed0/hadith-api at build time (never
 * hand-written); only the zikr → hadith mapping is curated + verified.
 */
export interface ZikrSourceHadith {
  /** fawazahmed0 collection slug (bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah). */
  collection: string;
  /** fawazahmed0 `hadithnumber` (Muslim's sequential number, not Abdul Baqi). */
  hadithNumber: number;
  /** Conventional citation, e.g. "Sahih Muslim 2723". */
  reference: string;
  /** Authenticity grade as published with the edition (e.g. "Sahih (Al-Albani)"). */
  grade?: string;
  arabic: string;
  english: string;
  /** Dataset translations keyed by app locale (ur, id, tr, bn, fr, ru). */
  translations?: Partial<Record<string, string>>;
}

export interface ZikrHadithContext {
  sources: ZikrSourceHadith[];
  /**
   * The narration lies outside the six books served by the hadith API (e.g.
   * Musnad Ahmad, an-Nasa'i's al-Kubra) — the item's `reference` is the citation.
   */
  outsideSixBooks?: boolean;
}
