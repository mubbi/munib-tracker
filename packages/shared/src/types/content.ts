export interface NameOfAllah {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  /** Longer explanation of the name's meaning, when available. */
  meaning?: string;
  audioUri?: string;
}

/**
 * Situational + source-based dua categories, mirroring how the Hisnul Muslim
 * (Fortress of the Muslim) corpus is grouped in mainstream apps (GTAF, Athan,
 * IslamicFinder). `quranic` is a source-based cross-cut for Rabbana duas.
 */
export type DuaCategoryId =
  | "morning_evening"
  | "sleep"
  | "prayer"
  | "purification"
  | "food"
  | "home"
  | "travel"
  | "forgiveness"
  | "distress"
  | "protection"
  | "illness"
  | "family"
  | "weather"
  | "hajj"
  | "social"
  | "quranic";

export interface DuaItem {
  id: string;
  categoryId: DuaCategoryId;
  title: string;
  arabic: string;
  /**
   * Latin transliteration. Optional: the full Hisnul Muslim corpus is ingested
   * verbatim for breadth, and only a subset has a clean open-source
   * transliteration (never auto-generated — accuracy is critical).
   */
  transliteration?: string;
  translation: string;
  virtues?: string;
  reference?: string;
  audioUri?: string;
  /** Hisnul Muslim chapter this dua belongs to, when preserved from source. */
  chapter?: string;
  /** Position within its Hisnul Muslim chapter. */
  orderInChapter?: number;
}

export interface DurudItem {
  id: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  virtues?: string;
  reference?: string;
  audioUri?: string;
}
