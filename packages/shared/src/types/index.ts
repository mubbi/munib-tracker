export type TrackerCategory = "salah" | "dhikr" | "qadha";

export interface TrackerEntry {
  id: string;
  category: TrackerCategory;
  title: string;
  completed: boolean;
  date: string;
}

export interface DailySummary {
  salahCompleted: number;
  salahTotal: number;
  dhikrCount: number;
  qadhaPending: number;
}
