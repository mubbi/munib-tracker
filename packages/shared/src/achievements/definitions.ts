import {
  buildActiveDebtGoals,
  buildClearedDebtMilestones,
  getDebtMilestoneById,
} from "./debt-goals";
import {
  completedLevelForValue,
  descriptionKeyForTrack,
  descriptionParamsForTrack,
  PROGRESSION_TRACKS,
  type ProgressionTrackConfig,
  thresholdForTrackLevel,
  titleKeyForTrackLevel,
  titleParamsForTrackLevel,
} from "./tracks";
import type {
  AchievementMetric,
  AchievementStats,
  DevotionProgress,
  MilestoneProgress,
  ProgressionState,
  ProgressionTrackId,
} from "./types";

export { summarizeQazaDebt, summarizeRozaDebt } from "./debt-goals";
export type {
  AchievementMetric,
  AchievementStats,
  DebtProgress,
  DebtTrackId,
  DevotionProgress,
  MilestoneProgress,
  MilestoneTrackId,
  ProgressionState,
  ProgressionTrackId,
} from "./types";

export function totalNoorForDevotionLevel(level: number): number {
  if (level <= 0) return 0;
  return (100 * level * (level + 1)) / 2;
}

export function computeDevotionNoor(stats: AchievementStats): number {
  const qazaNoor = stats.qazaDebt ? stats.qazaDebt.completed * 15 : 0;
  const rozaNoor = stats.rozaDebt ? stats.rozaDebt.completed * 15 : 0;

  return (
    stats.prayersCompleted * 10 +
    qazaNoor +
    rozaNoor +
    stats.zikrCompleted * 5 +
    stats.perfectDays * 50 +
    stats.streak * 3
  );
}

export function computeDevotionProgress(stats: AchievementStats): DevotionProgress {
  const noor = computeDevotionNoor(stats);
  let level = 0;
  while (totalNoorForDevotionLevel(level + 1) <= noor) level++;

  const noorForCurrentLevel = totalNoorForDevotionLevel(level);
  const noorForNextLevel = totalNoorForDevotionLevel(level + 1);
  const span = noorForNextLevel - noorForCurrentLevel;

  return {
    level,
    noor,
    noorForCurrentLevel,
    noorForNextLevel,
    progress: span > 0 ? Math.min((noor - noorForCurrentLevel) / span, 1) : 1,
  };
}

function valueFor(stats: AchievementStats, metric: AchievementMetric): number {
  switch (metric) {
    case "streak":
      return stats.streak;
    case "prayersCompleted":
      return stats.prayersCompleted;
    case "zikrCompleted":
      return stats.zikrCompleted;
    case "perfectDays":
      return stats.perfectDays;
    default: {
      const _exhaustive: never = metric;
      return _exhaustive;
    }
  }
}

function milestoneId(trackId: ProgressionTrackId | "devotion", level: number): string {
  return `${trackId}:${level}`;
}

function buildTrackMilestone(
  track: ProgressionTrackConfig,
  level: number,
  stats: AchievementStats,
  forceUnlocked = false,
): MilestoneProgress {
  const threshold = thresholdForTrackLevel(track, level);
  const value = valueFor(stats, track.metric);
  const unlocked = forceUnlocked || value >= threshold;

  return {
    id: milestoneId(track.id, level),
    trackId: track.id,
    level,
    titleKey: titleKeyForTrackLevel(track, level),
    titleParams: titleParamsForTrackLevel(track, level),
    descriptionKey: descriptionKeyForTrack(track),
    descriptionParams: descriptionParamsForTrack(track, threshold),
    threshold,
    value,
    unlocked,
    progress: threshold > 0 ? Math.min(value / threshold, 1) : 0,
  };
}

function buildDevotionMilestone(
  level: number,
  devotion: DevotionProgress,
  forceUnlocked = false,
): MilestoneProgress {
  const threshold = totalNoorForDevotionLevel(level);
  const unlocked = forceUnlocked || devotion.level >= level;

  return {
    id: milestoneId("devotion", level),
    trackId: "devotion",
    level,
    titleKey: devotionTitleKeyForLevel(level),
    titleParams: devotionTitleParamsForLevel(level),
    descriptionKey: devotionDescriptionKeyForLevel(level),
    descriptionParams: devotionDescriptionParamsForLevel(level),
    threshold,
    value: devotion.noor,
    unlocked,
    progress:
      level === 0
        ? Math.min(devotion.noor / totalNoorForDevotionLevel(1), 1)
        : unlocked
          ? 1
          : Math.min(devotion.noor / threshold, 1),
  };
}

function devotionTitleKeyForLevel(level: number): string {
  if (level <= 0) return "achievements.devotionRank.startingOut";
  if (level <= 10) return `achievements.devotionRank.titles.${level - 1}`;
  return "achievements.devotionRank.titleFallback";
}

function devotionTitleParamsForLevel(level: number): Record<string, number> | undefined {
  return level > 10 ? { level } : undefined;
}

function devotionDescriptionKeyForLevel(level: number): string {
  if (level <= 0) return "achievements.devotionRank.beginJourney";
  return "achievements.devotionRank.description";
}

function devotionDescriptionParamsForLevel(level: number): Record<string, number> | undefined {
  if (level <= 0) return undefined;
  return { level, noor: totalNoorForDevotionLevel(level) };
}

export function evaluateProgression(stats: AchievementStats): ProgressionState {
  const devotion = computeDevotionProgress(stats);
  const knownLevels = new Map<ProgressionTrackId, number>();

  const trackGoals = PROGRESSION_TRACKS.map((track) => {
    const value = valueFor(stats, track.metric);
    const completed = completedLevelForValue(track, value);
    knownLevels.set(track.id, completed);
    const nextLevel = completed + 1;
    return buildTrackMilestone(track, nextLevel, stats);
  });

  const debtGoals = buildActiveDebtGoals({
    qaza: stats.qazaDebt,
    roza: stats.rozaDebt,
  });

  const activeGoals = [...trackGoals, ...debtGoals];

  const unlockedMilestones: MilestoneProgress[] = [];

  for (const track of PROGRESSION_TRACKS) {
    const completed = knownLevels.get(track.id) ?? 0;
    for (let level = 1; level <= completed; level++) {
      unlockedMilestones.push(buildTrackMilestone(track, level, stats, true));
    }
  }

  unlockedMilestones.push(
    ...buildClearedDebtMilestones({
      qaza: stats.qazaDebt,
      roza: stats.rozaDebt,
    }),
  );

  for (let level = 1; level <= devotion.level; level++) {
    unlockedMilestones.push(buildDevotionMilestone(level, devotion, true));
  }

  return { devotion, activeGoals, unlockedMilestones, stats };
}

export function evaluateAchievements(stats: AchievementStats): MilestoneProgress[] {
  const state = evaluateProgression(stats);
  return [...state.activeGoals, ...state.unlockedMilestones];
}

export function resolveUnlockedMilestones(
  ids: string[],
  stats: AchievementStats,
): MilestoneProgress[] {
  const byId = new Map<string, MilestoneProgress>();
  for (const id of ids) {
    const milestone = getMilestoneById(id, stats);
    if (milestone) byId.set(milestone.id, milestone);
  }
  return [...byId.values()];
}

export function earnedAchievementIds(stats: AchievementStats): string[] {
  return evaluateProgression(stats)
    .unlockedMilestones.filter((m) => m.unlocked)
    .map((m) => m.id);
}

export function syncAchievementIds(
  stats: AchievementStats,
  known: string[],
): { synced: string[]; newlyUnlocked: string[] } {
  const synced = earnedAchievementIds(stats);
  const knownSet = new Set(known);
  const newlyUnlocked = synced.filter((id) => !knownSet.has(id));
  return { synced, newlyUnlocked };
}

export function newlyUnlocked(stats: AchievementStats, known: string[]): string[] {
  return syncAchievementIds(stats, known).newlyUnlocked;
}

export function getMilestoneById(
  id: string,
  stats?: AchievementStats,
): MilestoneProgress | undefined {
  const resolved = stats ?? emptyStats();

  const debt = getDebtMilestoneById(id, {
    qaza: resolved.qazaDebt,
    roza: resolved.rozaDebt,
  });
  if (debt) return debt;

  const devotionMatch = /^devotion:(\d+)$/.exec(id);
  if (devotionMatch) {
    const level = Number(devotionMatch[1]);
    const devotion = computeDevotionProgress(resolved);
    return buildDevotionMilestone(level, devotion, true);
  }

  const trackMatch = /^(salah|streak|zikr|consistency):(\d+)$/.exec(id);
  if (trackMatch) {
    const trackId = trackMatch[1] as ProgressionTrackId;
    const level = Number(trackMatch[2]);
    const track = PROGRESSION_TRACKS.find((t) => t.id === trackId);
    if (!track) return undefined;
    return buildTrackMilestone(track, level, resolved, true);
  }

  return undefined;
}

function emptyStats(): AchievementStats {
  return {
    streak: 0,
    prayersCompleted: 0,
    zikrCompleted: 0,
    perfectDays: 0,
    qazaDebt: null,
    rozaDebt: null,
  };
}

export { PROGRESSION_TRACKS } from "./tracks";
