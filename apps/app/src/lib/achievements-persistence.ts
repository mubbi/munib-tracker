import type { AchievementStats } from "@munib-tracker/shared/achievements";
import {
  migrateLegacyAchievementIds,
  syncAchievementIds,
} from "@munib-tracker/shared/achievements";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

function sameAchievementSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((id) => setB.has(id));
}

export async function readPersistedAchievementIds(): Promise<string[]> {
  return migrateLegacyAchievementIds(await readJSON<string[]>(DB_KEYS.achievements, []));
}

/**
 * Persists achievement ids that match current stats; drops lapsed unlocks.
 *
 * Achievements are intentionally NOT a sync entity: they are a pure function of
 * the tracked stats (prayer logs, qaza, zikr), which already sync. Recomputing
 * them on each device from the synced stats reproduces the same set, so pushing
 * a separate achievements blob would be redundant and would be overwritten by
 * the next local recompute anyway.
 */
export async function persistAchievementSync(
  stats: AchievementStats,
  known?: string[],
): Promise<{ synced: string[]; newlyUnlocked: string[] }> {
  const persisted = known ?? (await readPersistedAchievementIds());
  const result = syncAchievementIds(stats, persisted);
  if (!sameAchievementSet(result.synced, persisted)) {
    await writeJSON(DB_KEYS.achievements, result.synced);
  }
  return result;
}
