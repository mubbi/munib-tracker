import { describe, expect, it } from "vitest";
import { type AchievementStats, evaluateAchievements, newlyUnlocked } from "./definitions";

const base: AchievementStats = {
  streak: 0,
  prayersCompleted: 0,
  qazaCompleted: 0,
  zikrCompleted: 0,
  bestDay: 0,
};

describe("evaluateAchievements", () => {
  it("unlocks based on thresholds and reports progress", () => {
    const result = evaluateAchievements({ ...base, prayersCompleted: 1, streak: 3 });
    const firstPrayer = result.find((a) => a.id === "first-prayer");
    const streak7 = result.find((a) => a.id === "streak-7");
    expect(firstPrayer?.unlocked).toBe(true);
    expect(streak7?.unlocked).toBe(false);
    expect(streak7?.progress).toBeCloseTo(3 / 7);
  });

  it("unlocks the perfect day badge at 6 prayers", () => {
    const result = evaluateAchievements({ ...base, bestDay: 6 });
    expect(result.find((a) => a.id === "perfect-day")?.unlocked).toBe(true);
  });
});

describe("newlyUnlocked", () => {
  it("only returns achievements not already known", () => {
    const stats: AchievementStats = { ...base, prayersCompleted: 100, streak: 7 };
    const fresh = newlyUnlocked(stats, ["first-prayer"]);
    expect(fresh).toContain("prayers-100");
    expect(fresh).toContain("streak-7");
    expect(fresh).not.toContain("first-prayer");
  });
});
