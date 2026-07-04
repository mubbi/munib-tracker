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

/** Persists achievement ids that match current stats; drops lapsed unlocks. */
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
