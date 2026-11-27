import type { RecitationStats } from "./recitation";

export interface DebtProgress {
  /** Total debt tracked (remaining + completed). */
  total: number;
  completed: number;
  remaining: number;
}

export type ProgressionTrackId = "salah" | "streak" | "zikr" | "consistency";
export type DebtTrackId = "qaza" | "roza";
/** D71: the fixed recitation ladder (`recitation.ts`), fed by Qur'an practice history. */
export type RecitationTrackId = "recitation";
export type MilestoneTrackId = ProgressionTrackId | DebtTrackId | RecitationTrackId | "devotion";

export interface AchievementStats {
  /** Current salah streak (days, ending today). */
  streak: number;
  /**
   * Longest salah streak ever kept. Streak milestones and the streak share of
   * Noor use this, so a broken streak never takes back what was earned.
   */
  bestStreak: number;
  prayersCompleted: number;
  zikrCompleted: number;
  perfectDays: number;
  qazaDebt: DebtProgress | null;
  rozaDebt: DebtProgress | null;
  /**
   * D71: Qur'an practice totals for the Recitation track and its Noor. `null` /
   * absent = practice is unavailable here (TV) or not loaded — the track is then
   * left out entirely (no card, no milestones, no Noor) rather than shown empty.
   */
  recitation?: RecitationStats | null;
}

export interface MilestoneProgress {
  id: string;
  trackId: MilestoneTrackId;
  level: number;
  titleKey: string;
  descriptionKey: string;
  titleParams?: Record<string, string | number>;
  descriptionParams?: Record<string, string | number>;
  threshold: number;
  value: number;
  unlocked: boolean;
  progress: number;
}

export interface DevotionProgress {
  level: number;
  noor: number;
  noorForCurrentLevel: number;
  noorForNextLevel: number;
  progress: number;
}

export interface ProgressionState {
  devotion: DevotionProgress;
  activeGoals: MilestoneProgress[];
  unlockedMilestones: MilestoneProgress[];
  stats: AchievementStats;
}

export type AchievementMetric =
  | "streak"
  | "bestStreak"
  | "prayersCompleted"
  | "zikrCompleted"
  | "perfectDays";
