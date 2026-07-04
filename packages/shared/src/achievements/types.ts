export interface DebtProgress {
  /** Total debt tracked (remaining + completed). */
  total: number;
  completed: number;
  remaining: number;
}

export type ProgressionTrackId = "salah" | "streak" | "zikr" | "consistency";
export type DebtTrackId = "qaza" | "roza";
export type MilestoneTrackId = ProgressionTrackId | DebtTrackId | "devotion";

export interface AchievementStats {
  streak: number;
  prayersCompleted: number;
  zikrCompleted: number;
  perfectDays: number;
  qazaDebt: DebtProgress | null;
  rozaDebt: DebtProgress | null;
}

export interface MilestoneProgress {
  id: string;
  trackId: MilestoneTrackId;
  level: number;
  title: string;
  description: string;
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

export type AchievementMetric = "streak" | "prayersCompleted" | "zikrCompleted" | "perfectDays";
