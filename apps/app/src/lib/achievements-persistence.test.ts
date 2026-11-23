import type { AchievementStats } from "@munib-tracker/shared/achievements";
import { earnedAchievementIds } from "@munib-tracker/shared/achievements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import {
  persistAchievementSync,
  readPersistedAchievementIds,
} from "@/lib/achievements-persistence";

function buildStats(overrides: Partial<AchievementStats> = {}): AchievementStats {
  return {
    streak: 7,
    bestStreak: 7,
    prayersCompleted: 100,
    zikrCompleted: 50,
    perfectDays: 3,
    qazaDebt: null,
    rozaDebt: null,
    ...overrides,
  };
}

const EMPTY = buildStats({
  streak: 0,
  bestStreak: 0,
  prayersCompleted: 0,
  zikrCompleted: 0,
  perfectDays: 0,
});

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.mocked(AsyncStorage.setItem).mockClear();
});

describe("readPersistedAchievementIds", () => {
  it("defaults to no achievements", async () => {
    await expect(readPersistedAchievementIds()).resolves.toEqual([]);
  });

  it("reads saved ids", async () => {
    await writeJSON(DB_KEYS.achievements, ["a"]);
    await expect(readPersistedAchievementIds()).resolves.toEqual(["a"]);
  });
});

describe("persistAchievementSync", () => {
  const earned = earnedAchievementIds(buildStats());

  it("persists newly earned achievements and reports them", async () => {
    const result = await persistAchievementSync(buildStats());
    expect(earned.length).toBeGreaterThan(0);
    expect(result).toEqual({ synced: earned, newlyUnlocked: earned });
    await expect(readJSON(DB_KEYS.achievements, [])).resolves.toEqual(earned);
  });

  it("does not rewrite storage when the set is unchanged", async () => {
    await persistAchievementSync(buildStats(), [...earned].reverse());
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("drops lapsed unlocks", async () => {
    await writeJSON(DB_KEYS.achievements, ["lapsed-id"]);
    const result = await persistAchievementSync(EMPTY);
    expect(result.synced).toEqual(earnedAchievementIds(EMPTY));
    await expect(readJSON(DB_KEYS.achievements, [])).resolves.toEqual(result.synced);
  });

  it("rewrites when a same-size set differs", async () => {
    const swapped = earned.map((id, i) => (i === 0 ? "other-id" : id));
    await persistAchievementSync(buildStats(), swapped);
    await expect(readJSON(DB_KEYS.achievements, [])).resolves.toEqual(earned);
  });
});
