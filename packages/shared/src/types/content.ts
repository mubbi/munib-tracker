export interface NameOfAllah {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  /** Longer explanation of the name's meaning, when available. */
  meaning?: string;
  audioUri?: string;
}

export type DuaCategoryId = "sunnah" | "quranic" | "daily";

export interface DuaItem {
  id: string;
  categoryId: DuaCategoryId;
  title: string;
  arabic: string;
  transliteration: string;
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
  transliteration: string;
  translation: string;
  virtues?: string;
  reference?: string;
  audioUri?: string;
}
