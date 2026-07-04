export * from "./content";
export * from "./hadith";
export * from "./prayer";
export * from "./preferences";
export * from "./qaza";
export * from "./quran";
export * from "./weather";
export * from "./zikr";

export interface DailySummary {
  /** ISO date YYYY-MM-DD */
  date: string;
  salahCompleted: number;
  salahTotal: number;
  zikrCompleted: number;
  zikrTotal: number;
  qazaRemaining: number;
  /** Sum of today's scheduled qaza targets (0 when no schedule is set). */
  qazaTargetToday: number;
  /** Qaza prayers performed today via the qaza manager. */
  qazaCompletedToday: number;
  streakDays: number;
}
