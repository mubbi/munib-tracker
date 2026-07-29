export * from "./aqeedah";
export * from "./battles";
export * from "./content";
export * from "./content-report";
export * from "./fidyah";
export * from "./friday";
export * from "./hadith";
export * from "./hajj-guide";
export * from "./islamic-history";
export * from "./jahannam";
export * from "./jannah";
export * from "./last-day";
export * from "./learn-dua";
export * from "./learn-guide";
export * from "./mushaf-layout";
export * from "./oss-content-download-failure";

export * from "./prayer";
export * from "./preferences";
export * from "./prophets";
export * from "./qaza";
export * from "./quran";
export * from "./quran-guide";
export * from "./sahaba";
export * from "./salah-guide";
export * from "./seerah";
export * from "./taharah";
export * from "./weather";
export * from "./white-days";
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
