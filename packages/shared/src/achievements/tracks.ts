import type { AchievementMetric, ProgressionTrackId } from "./types";

export type { ProgressionTrackId } from "./types";

export interface ProgressionTrackConfig {
  id: ProgressionTrackId;
  /** i18n key for the track label (`achievements.tracks.*`). */
  labelKey: string;
  metric: AchievementMetric;
  thresholds: number[];
  incrementAfter: number;
  /** Number of named title keys (`achievements.milestones.{id}.titles.{i}`). */
  titlesCount: number;
}

export function titleKeyForTrackLevel(track: ProgressionTrackConfig, level: number): string {
  const idx = level - 1;
  if (idx >= 0 && idx < track.titlesCount) {
    return `achievements.milestones.${track.id}.titles.${idx}`;
  }
  return `achievements.milestones.${track.id}.titleFallback`;
}

export function titleParamsForTrackLevel(
  track: ProgressionTrackConfig,
  level: number,
): Record<string, string | number> {
  const idx = level - 1;
  if (idx >= 0 && idx < track.titlesCount) return {};
  return { level };
}

export function descriptionKeyForTrack(track: ProgressionTrackConfig): string {
  return `achievements.milestones.${track.id}.description`;
}

export function descriptionParamsForTrack(
  _track: ProgressionTrackConfig,
  threshold: number,
): Record<string, number> {
  return { count: threshold };
}

export function thresholdForTrackLevel(track: ProgressionTrackConfig, level: number): number {
  const idx = level - 1;
  if (idx < track.thresholds.length) return track.thresholds[idx] ?? track.incrementAfter;
  const last = track.thresholds[track.thresholds.length - 1] ?? track.incrementAfter;
  const overflow = idx - track.thresholds.length + 1;
  return last + overflow * track.incrementAfter;
}

export function completedLevelForValue(track: ProgressionTrackConfig, value: number): number {
  let level = 0;
  while (thresholdForTrackLevel(track, level + 1) <= value) level++;
  return level;
}

export const PROGRESSION_TRACKS: ProgressionTrackConfig[] = [
  {
    id: "salah",
    labelKey: "achievements.tracks.salah",
    metric: "prayersCompleted",
    thresholds: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 3500],
    incrementAfter: 500,
    titlesCount: 11,
  },
  {
    id: "streak",
    labelKey: "achievements.tracks.streak",
    metric: "streak",
    thresholds: [1, 3, 7, 14, 21, 30, 45, 60, 90, 120, 180, 365],
    incrementAfter: 30,
    titlesCount: 12,
  },
  {
    id: "zikr",
    labelKey: "achievements.tracks.zikr",
    metric: "zikrCompleted",
    thresholds: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
    incrementAfter: 250,
    titlesCount: 9,
  },
  {
    id: "consistency",
    labelKey: "achievements.tracks.consistency",
    metric: "perfectDays",
    thresholds: [1, 3, 7, 14, 30, 60, 100, 200, 365],
    incrementAfter: 50,
    titlesCount: 9,
  },
];
