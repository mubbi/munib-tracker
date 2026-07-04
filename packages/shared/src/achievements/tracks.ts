import type { AchievementMetric, ProgressionTrackId } from "./types";

export type { ProgressionTrackId } from "./types";

export interface ProgressionTrackConfig {
  id: ProgressionTrackId;
  label: string;
  metric: AchievementMetric;
  /** Explicit thresholds for early levels; later levels extend via `incrementAfter`. */
  thresholds: number[];
  incrementAfter: number;
  /** Named titles for early levels; later levels use `titleForLevel`. */
  titles: string[];
  description: (threshold: number) => string;
}

export function titleForTrackLevel(track: ProgressionTrackConfig, level: number): string {
  const idx = level - 1;
  if (idx >= 0 && idx < track.titles.length) return track.titles[idx] ?? `${track.label} ${level}`;
  return `${track.label} ${level}`;
}

export function thresholdForTrackLevel(track: ProgressionTrackConfig, level: number): number {
  const idx = level - 1;
  if (idx < track.thresholds.length) return track.thresholds[idx] ?? track.incrementAfter;
  const last = track.thresholds[track.thresholds.length - 1] ?? track.incrementAfter;
  const overflow = idx - track.thresholds.length + 1;
  return last + overflow * track.incrementAfter;
}

/** Highest level whose threshold the current value has reached. */
export function completedLevelForValue(track: ProgressionTrackConfig, value: number): number {
  let level = 0;
  while (thresholdForTrackLevel(track, level + 1) <= value) level++;
  return level;
}

export const PROGRESSION_TRACKS: ProgressionTrackConfig[] = [
  {
    id: "salah",
    label: "Salah",
    metric: "prayersCompleted",
    thresholds: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 3500],
    incrementAfter: 500,
    titles: [
      "First Step",
      "Steady Start",
      "Daily Worshipper",
      "Faithful Servant",
      "Dedicated",
      "Hundred Prayers",
      "Quarter Thousand",
      "Half Thousand",
      "Thousand Lights",
      "Two Thousand",
      "Lifelong Salah",
    ],
    description: (n) => `Complete ${n} obligatory ${n === 1 ? "prayer" : "prayers"}`,
  },
  {
    id: "streak",
    label: "Streak",
    metric: "streak",
    thresholds: [1, 3, 7, 14, 21, 30, 45, 60, 90, 120, 180, 365],
    incrementAfter: 30,
    titles: [
      "Day One",
      "Getting Consistent",
      "One Week Strong",
      "Two Weeks Steady",
      "Three Week Habit",
      "A Month of Devotion",
      "Six Weeks Firm",
      "Two Months Steadfast",
      "Season of Steadfastness",
      "Four Months Strong",
      "Half Year of Light",
      "Year of Consistency",
    ],
    description: (n) => `Keep a ${n}-day prayer streak`,
  },
  {
    id: "zikr",
    label: "Zikr",
    metric: "zikrCompleted",
    thresholds: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
    incrementAfter: 250,
    titles: [
      "First Remembrance",
      "Heart Awakened",
      "Steady Dhikr",
      "Constant Remembrance",
      "Remembrance",
      "Hundred Sessions",
      "Deep Reflection",
      "Five Hundred Hearts",
      "Thousand Remembrances",
    ],
    description: (n) => `Complete ${n} zikr ${n === 1 ? "session" : "sessions"}`,
  },
  {
    id: "consistency",
    label: "Consistency",
    metric: "perfectDays",
    thresholds: [1, 3, 7, 14, 30, 60, 100, 200, 365],
    incrementAfter: 50,
    titles: [
      "Perfect Day",
      "Three Perfect Days",
      "Week of Excellence",
      "Two Weeks Complete",
      "Month of Excellence",
      "Two Months Complete",
      "Hundred Perfect Days",
      "Two Hundred Days",
      "Year of Perfect Days",
    ],
    description: (n) => `Complete all obligatory prayers on ${n} ${n === 1 ? "day" : "days"}`,
  },
];

export const LEGACY_ACHIEVEMENT_MAP: Record<string, string> = {
  "first-prayer": "salah:1",
  "perfect-day": "consistency:1",
  "streak-3": "streak:2",
  "streak-7": "streak:3",
  "streak-30": "streak:6",
  "prayers-100": "salah:6",
  "qaza-10": "qaza:debt:10:cleared",
  "qaza-100": "qaza:debt:100:cleared",
  "zikr-50": "zikr:5",
};
