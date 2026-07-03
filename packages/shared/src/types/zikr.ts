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
  audioUri?: string;
  /** daily target if applicable */
  targetCount?: number;
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
  /** ISO datetime of the last change (used for sync last-write-wins). */
  updatedAt?: string;
}
