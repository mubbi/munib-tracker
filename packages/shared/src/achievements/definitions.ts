import {
  buildActiveDebtGoals,
  buildClearedDebtMilestones,
  getDebtMilestoneById,
} from "./debt-goals";
import {
  completedLevelForValue,
  LEGACY_ACHIEVEMENT_MAP,
  PROGRESSION_TRACKS,
  type ProgressionTrackConfig,
  thresholdForTrackLevel,
  titleForTrackLevel,
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

/** @deprecated Use MilestoneProgress — kept for gradual UI migration. */
export interface AchievementProgress extends MilestoneProgress {}

/** Total noor required to reach devotion level `level` (level 0 = 0 noor). */
export function totalNoorForDevotionLevel(level: number): number {
  if (level <= 0) return 0;
  return (100 * level * (level + 1)) / 2;
}

/** Noor earned from worship activity — qaza/roza only count while debt is tracked. */
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
    title: titleForTrackLevel(track, level),
    description: track.description(threshold),
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
    title: devotionTitleForLevel(level),
    description: devotionDescriptionForLevel(level),
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

function devotionTitleForLevel(level: number): string {
  const titles = [
    "Seeker",
    "Beginner's Light",
    "Steady Soul",
    "Devoted Heart",
    "Faithful Traveler",
    "Guided Path",
    "Illuminated",
    "Steadfast",
    "Refined",
    "Master of Devotion",
  ];
  if (level <= 0) return "Starting Out";
  if (level <= titles.length) return titles[level - 1] ?? `Devotion ${level}`;
  return `Devotion ${level}`;
}

function devotionDescriptionForLevel(level: number): string {
  if (level <= 0) return "Begin your journey";
  const noor = totalNoorForDevotionLevel(level);
  return `Reach devotion level ${level} (${noor.toLocaleString()} Noor)`;
}

/** Evaluates infinite progression — active goals, devotion level, and unlocks. */
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

/** @deprecated Alias for evaluateProgression — returns active goals + unlocked milestones. */
export function evaluateAchievements(stats: AchievementStats): MilestoneProgress[] {
  const state = evaluateProgression(stats);
  return [...state.activeGoals, ...state.unlockedMilestones];
}

function normalizeAchievementId(id: string): string {
  const legacyQaza = /^qaza:(\d+)$/.exec(id);
  if (legacyQaza) return `qaza:debt:${legacyQaza[1]}:cleared`;
  return LEGACY_ACHIEVEMENT_MAP[id] ?? id;
}

/** Maps legacy fixed-badge ids to the new level-based ids. */
export function migrateLegacyAchievementIds(known: string[]): string[] {
  return Array.from(new Set(known.map(normalizeAchievementId)));
}

/** Resolves persisted achievement ids to unique milestones (last id wins per milestone). */
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

/** Milestone ids currently earned from live stats (not historical persistence). */
export function earnedAchievementIds(stats: AchievementStats): string[] {
  return evaluateProgression(stats)
    .unlockedMilestones.filter((m) => m.unlocked)
    .map((m) => m.id);
}

/** Reconciles persisted ids with current stats — prunes lapsed unlocks. */
export function syncAchievementIds(
  stats: AchievementStats,
  known: string[],
): { synced: string[]; newlyUnlocked: string[] } {
  const synced = earnedAchievementIds(stats);
  const knownSet = new Set(migrateLegacyAchievementIds(known));
  const newlyUnlocked = synced.filter((id) => !knownSet.has(id));
  return { synced, newlyUnlocked };
}

/** Returns milestone ids newly unlocked (not in `known`). */
export function newlyUnlocked(stats: AchievementStats, known: string[]): string[] {
  return syncAchievementIds(stats, known).newlyUnlocked;
}

/** Looks up a milestone title for celebrations and sharing. */
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

  const legacy = LEGACY_ACHIEVEMENT_MAP[id];
  if (legacy) return getMilestoneById(legacy, stats);

  const legacyQaza = /^qaza:(\d+)$/.exec(id);
  if (legacyQaza) {
    return getDebtMilestoneById(`qaza:debt:${legacyQaza[1]}:cleared`, {
      qaza: resolved.qazaDebt,
      roza: resolved.rozaDebt,
    });
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
