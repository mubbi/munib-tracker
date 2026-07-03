export * from "./content";
export * from "./hadith";
export * from "./prayer";
export * from "./preferences";
export * from "./qaza";
export * from "./quran";
export * from "./zikr";

export interface DailySummary {
  /** ISO date YYYY-MM-DD */
  date: string;
  salahCompleted: number;
  salahTotal: number;
  zikrCompleted: number;
  zikrTotal: number;
  qazaRemaining: number;
  qazaCompletedToday: number;
  streakDays: number;
}
