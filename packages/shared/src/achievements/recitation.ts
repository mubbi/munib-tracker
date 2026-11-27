import type { MilestoneProgress } from "./types";

/**
 * Personal Qur'an recitation milestones (D68, D71). Computed on the device from the
 * user's own practice history — never compared with anyone, never on a
 * leaderboard, never shared unless the user shares a badge themselves.
 */
export interface RecitationStats {
  /** Finished practice / recite-along sessions. */
  sessions: number;
  /** Longest run of consecutive local days with a finished revision session. */
  bestRevisionStreak: number;
  /** Ayahs recited (heard well enough to count, `reading-credit.ts` rule), summed over sessions. */
  ayahsRecited: number;
}

export type RecitationMetric = keyof RecitationStats;

export interface RecitationMilestoneDef {
  /** Stable milestone id (`recitation:<slug>`). */
  id: string;
  metric: RecitationMetric;
  threshold: number;
  titleKey: string;
  descriptionKey: string;
}

/** In ladder order: first session → a week of revision → 100 ayahs recited. */
export const RECITATION_MILESTONES: readonly RecitationMilestoneDef[] = [
  {
    id: "recitation:first",
    metric: "sessions",
    threshold: 1,
    titleKey: "achievements.recitation.first.title",
    descriptionKey: "achievements.recitation.first.description",
  },
  {
    id: "recitation:revision-week",
    metric: "bestRevisionStreak",
    threshold: 7,
    titleKey: "achievements.recitation.revisionWeek.title",
    descriptionKey: "achievements.recitation.revisionWeek.description",
  },
  {
    id: "recitation:ayahs-100",
    metric: "ayahsRecited",
    threshold: 100,
    titleKey: "achievements.recitation.ayahs100.title",
    descriptionKey: "achievements.recitation.ayahs100.description",
  },
];

export const EMPTY_RECITATION_STATS: RecitationStats = {
  sessions: 0,
  bestRevisionStreak: 0,
  ayahsRecited: 0,
};

/**
 * A recitation milestone's progress — a `MilestoneProgress` on the `recitation`
 * track (D71). `evaluateProgression` puts it on Achievements beside the Salah /
 * zikr ladders (and earns Noor from the same stats, `NOOR_WEIGHTS`); the
 * Statistics practice card shows the unlocked ones.
 */
export type RecitationMilestoneProgress = MilestoneProgress & { trackId: "recitation" };

/** Every recitation milestone with its progress (`unlocked` once the threshold is reached). */
export function evaluateRecitationMilestones(
  stats: RecitationStats,
): RecitationMilestoneProgress[] {
  return RECITATION_MILESTONES.map((def, index) => {
    const value = Math.max(0, stats[def.metric] ?? 0);
    return {
      id: def.id,
      trackId: "recitation",
      level: index + 1,
      titleKey: def.titleKey,
      descriptionKey: def.descriptionKey,
      descriptionParams: { number: def.threshold },
      threshold: def.threshold,
      value,
      unlocked: value >= def.threshold,
      progress: Math.min(value / def.threshold, 1),
    };
  });
}

/**
 * The Recitation track's card goal: the first milestone not yet reached, in
 * ladder order — or the last one once every milestone is earned (the ladder is
 * finite, unlike the Salah / zikr ones, so the card then reads "complete").
 */
export function recitationTrackGoal(
  milestones: readonly RecitationMilestoneProgress[],
): RecitationMilestoneProgress | undefined {
  return milestones.find((m) => !m.unlocked) ?? milestones[milestones.length - 1];
}

/** True for a known recitation milestone id (`recitation:first`, …). */
export function isRecitationMilestoneId(id: string): boolean {
  return RECITATION_MILESTONES.some((m) => m.id === id);
}

/**
 * Resolves a stored `recitation:<slug>` id (persisted unlock list, unlock
 * celebration) to its milestone, marked unlocked like the other tracks' lookups.
 */
export function getRecitationMilestoneById(
  id: string,
  stats: RecitationStats | null | undefined,
): RecitationMilestoneProgress | undefined {
  const milestone = evaluateRecitationMilestones(stats ?? EMPTY_RECITATION_STATS).find(
    (m) => m.id === id,
  );
  return milestone ? { ...milestone, unlocked: true } : undefined;
}

/**
 * Longest run of consecutive calendar days in `days` (local `YYYY-MM-DD`,
 * any order, duplicates allowed).
 */
export function longestDayRun(days: Iterable<string>): number {
  const sorted = [...new Set(days)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of sorted) {
    const [y, m, d] = day.split("-").map(Number) as [number, number, number];
    const serial = Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
    run = prev != null && serial === prev + 1 ? run + 1 : 1;
    prev = serial;
    best = Math.max(best, run);
  }
  return best;
}
