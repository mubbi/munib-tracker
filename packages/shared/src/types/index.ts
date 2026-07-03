export * from "./content";
export * from "./prayer";
export * from "./preferences";
export * from "./qaza";
export * from "./zikr";

/** Legacy tracker shape — retained for backward compatibility. */
export type TrackerCategory = "salah" | "dhikr" | "qadha";

export interface TrackerEntry {
  id: string;
  category: TrackerCategory;
  title: string;
  completed: boolean;
  date: string;
}

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
