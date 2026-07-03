export interface NameOfAllah {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
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
