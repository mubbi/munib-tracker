export * from "./aqeedah";
export * from "./battles";
export * from "./coach";
export * from "./content";
export * from "./content-report";
export * from "./debts";
export * from "./dhul-hijjah";
export * from "./family-ties";
export * from "./fasting";
export * from "./fidyah";
export * from "./focus-lock";
export * from "./friday";
export * from "./hadith";
export * from "./hajj-guide";
export * from "./heirs";
export * from "./islamic-history";
export * from "./jahannam";
export * from "./jannah";
export * from "./last-day";
export * from "./learn-dua";
export * from "./learn-guide";
export * from "./masjid";
export * from "./mizan";
export * from "./muhasabah";
export * from "./mushaf-layout";
export * from "./oss-content-download-failure";

export * from "./prayer";
export * from "./preferences";
export * from "./prophets";
export * from "./qaza";
export * from "./qibla-compass";
export * from "./quran";
export * from "./quran-guide";
export * from "./quran-notes";
export * from "./sahaba";
export * from "./salah-guide";
export * from "./seerah";
export * from "./sunnah-habits";
export * from "./taharah";
export * from "./tajweed-coaching";
export * from "./tasbeeh-appearance";
export * from "./umrah";
export * from "./wasiyyah";
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
