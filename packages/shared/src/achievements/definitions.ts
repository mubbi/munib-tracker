export type AchievementPeriod = "daily" | "weekly" | "monthly" | "yearly" | "lifetime";

export type AchievementMetric =
  | "streak"
  | "prayersCompleted"
  | "qazaCompleted"
  | "zikrCompleted"
  | "bestDay";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  period: AchievementPeriod;
  metric: AchievementMetric;
  threshold: number;
}

export interface AchievementStats {
  /** Current consecutive-day prayer streak. */
  streak: number;
  /** Lifetime obligatory prayers marked completed. */
  prayersCompleted: number;
  /** Lifetime qaza prayers made up. */
  qazaCompleted: number;
  /** Lifetime zikr entries completed. */
  zikrCompleted: number;
  /** Most obligatory prayers completed on a single day. */
  bestDay: number;
}

export interface AchievementProgress extends AchievementDefinition {
  value: number;
  unlocked: boolean;
  /** 0..1 progress toward the threshold. */
  progress: number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-prayer",
    title: "First Step",
    description: "Log your first prayer",
    period: "lifetime",
    metric: "prayersCompleted",
    threshold: 1,
  },
  {
    id: "perfect-day",
    title: "Perfect Day",
    description: "Complete all obligatory prayers in one day",
    period: "daily",
    metric: "bestDay",
    threshold: 6,
  },
  {
    id: "streak-3",
    title: "Getting Consistent",
    description: "Keep a 3-day streak",
    period: "weekly",
    metric: "streak",
    threshold: 3,
  },
  {
    id: "streak-7",
    title: "One Week Strong",
    description: "Keep a 7-day streak",
    period: "weekly",
    metric: "streak",
    threshold: 7,
  },
  {
    id: "streak-30",
    title: "A Month of Devotion",
    description: "Keep a 30-day streak",
    period: "monthly",
    metric: "streak",
    threshold: 30,
  },
  {
    id: "prayers-100",
    title: "Hundred Prayers",
    description: "Complete 100 prayers",
    period: "lifetime",
    metric: "prayersCompleted",
    threshold: 100,
  },
  {
    id: "qaza-10",
    title: "Making Amends",
    description: "Make up 10 qaza prayers",
    period: "lifetime",
    metric: "qazaCompleted",
    threshold: 10,
  },
  {
    id: "qaza-100",
    title: "Clearing the Debt",
    description: "Make up 100 qaza prayers",
    period: "lifetime",
    metric: "qazaCompleted",
    threshold: 100,
  },
  {
    id: "zikr-50",
    title: "Remembrance",
    description: "Complete 50 zikr sessions",
    period: "lifetime",
    metric: "zikrCompleted",
    threshold: 50,
  },
];

function valueFor(stats: AchievementStats, metric: AchievementMetric): number {
  switch (metric) {
    case "streak":
      return stats.streak;
    case "prayersCompleted":
      return stats.prayersCompleted;
    case "qazaCompleted":
      return stats.qazaCompleted;
    case "zikrCompleted":
      return stats.zikrCompleted;
    case "bestDay":
      return stats.bestDay;
  }
}

/** Evaluates every achievement against the given stats. */
export function evaluateAchievements(stats: AchievementStats): AchievementProgress[] {
  return ACHIEVEMENTS.map((def) => {
    const value = valueFor(stats, def.metric);
    return {
      ...def,
      value,
      unlocked: value >= def.threshold,
      progress: def.threshold > 0 ? Math.min(value / def.threshold, 1) : 0,
    };
  });
}

/** Returns the ids of achievements newly unlocked (unlocked now, not in `known`). */
export function newlyUnlocked(stats: AchievementStats, known: string[]): string[] {
  const knownSet = new Set(known);
  return evaluateAchievements(stats)
    .filter((a) => a.unlocked && !knownSet.has(a.id))
    .map((a) => a.id);
}
