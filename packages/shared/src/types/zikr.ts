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
  /** daily target if applicable */
  targetCount?: number;
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
