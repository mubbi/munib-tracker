import { describe, expect, it } from "vitest";
import {
  buildActiveDebtGoals,
  buildClearedDebtMilestones,
  summarizeQazaDebt,
  summarizeRozaDebt,
} from "./debt-goals";
import {
  type AchievementStats,
  computeDevotionNoor,
  evaluateProgression,
  getMilestoneById,
  migrateLegacyAchievementIds,
  newlyUnlocked,
  resolveUnlockedMilestones,
  totalNoorForDevotionLevel,
} from "./definitions";

const base: AchievementStats = {
  streak: 0,
  prayersCompleted: 0,
  zikrCompleted: 0,
  perfectDays: 0,
  qazaDebt: null,
  rozaDebt: null,
};

describe.concurrent("evaluateProgression", () => {
  it("returns four infinite track goals when no qaza or roza debt is tracked", () => {
    const state = evaluateProgression(base);
    expect(state.activeGoals).toHaveLength(4);
    expect(state.activeGoals.every((g) => g.trackId !== "qaza" && g.trackId !== "roza")).toBe(true);
  });

  it("adds a dynamic qaza goal when the user tracks qaza debt", () => {
    const state = evaluateProgression({
      ...base,
      qazaDebt: { total: 100, completed: 10, remaining: 90 },
    });
    const qazaGoal = state.activeGoals.find((g) => g.trackId === "qaza");
    expect(qazaGoal?.threshold).toBe(100);
    expect(qazaGoal?.value).toBe(10);
    expect(qazaGoal?.progress).toBeCloseTo(0.1);
  });

  it("hides qaza goals when debt total is zero", () => {
    expect(summarizeQazaDebt([{ remaining: 0, completed: 0 }])).toBeNull();
    const state = evaluateProgression(base);
    expect(state.activeGoals.some((g) => g.trackId === "qaza")).toBe(false);
  });

  it("updates the qaza target when debt changes", () => {
    const smaller = evaluateProgression({
      ...base,
      qazaDebt: { total: 50, completed: 10, remaining: 40 },
    });
    const larger = evaluateProgression({
      ...base,
      qazaDebt: { total: 150, completed: 10, remaining: 140 },
    });
    expect(smaller.activeGoals.find((g) => g.trackId === "qaza")?.threshold).toBe(50);
    expect(larger.activeGoals.find((g) => g.trackId === "qaza")?.threshold).toBe(150);
  });

  it("unlocks qaza cleared milestone when remaining hits zero", () => {
    const state = evaluateProgression({
      ...base,
      qazaDebt: { total: 10, completed: 10, remaining: 0 },
    });
    expect(state.unlockedMilestones.some((m) => m.id === "qaza:debt:10:cleared")).toBe(true);
    expect(state.activeGoals.some((g) => g.trackId === "qaza")).toBe(false);
  });

  it("adds roza goal only when roza debt is tracked", () => {
    const state = evaluateProgression({
      ...base,
      rozaDebt: { total: 30, completed: 5, remaining: 25 },
    });
    const rozaGoal = state.activeGoals.find((g) => g.trackId === "roza");
    expect(rozaGoal?.threshold).toBe(30);
    expect(rozaGoal?.value).toBe(5);
  });

  it("unlocks based on infinite track thresholds", () => {
    const state = evaluateProgression({ ...base, prayersCompleted: 1, streak: 3 });
    expect(state.unlockedMilestones.some((m) => m.id === "salah:1")).toBe(true);
    expect(state.activeGoals.find((g) => g.trackId === "streak")?.progress).toBeCloseTo(3 / 7);
  });
});

describe.concurrent("debt helpers", () => {
  it("summarizes qaza and roza debt totals", () => {
    expect(
      summarizeQazaDebt([
        { remaining: 5, completed: 10 },
        { remaining: 2, completed: 3 },
      ]),
    ).toEqual({ total: 20, completed: 13, remaining: 7 });

    expect(summarizeRozaDebt({ remaining: 4, completed: 6 })).toEqual({
      total: 10,
      completed: 6,
      remaining: 4,
    });
  });

  it("builds active goals only while debt remains", () => {
    expect(
      buildActiveDebtGoals({
        qaza: { total: 10, completed: 10, remaining: 0 },
        roza: null,
      }),
    ).toHaveLength(0);

    expect(
      buildClearedDebtMilestones({
        qaza: { total: 10, completed: 10, remaining: 0 },
        roza: null,
      }),
    ).toHaveLength(1);
  });
});

describe.concurrent("devotion noor", () => {
  it("only counts qaza and roza noor while debt is tracked", () => {
    const withDebt = computeDevotionNoor({
      ...base,
      qazaDebt: { total: 10, completed: 10, remaining: 0 },
      rozaDebt: { total: 5, completed: 2, remaining: 3 },
    });
    const withoutDebt = computeDevotionNoor(base);
    expect(withDebt).toBe(10 * 15 + 2 * 15);
    expect(withoutDebt).toBe(0);
  });

  it("uses an ever-increasing noor curve", () => {
    expect(totalNoorForDevotionLevel(2)).toBeGreaterThan(totalNoorForDevotionLevel(1));
  });
});

describe.concurrent("newlyUnlocked", () => {
  it("returns qaza cleared milestones not already known", () => {
    const stats: AchievementStats = {
      ...base,
      qazaDebt: { total: 10, completed: 10, remaining: 0 },
    };
    const fresh = newlyUnlocked(stats, []);
    expect(fresh).toContain("qaza:debt:10:cleared");
  });

  it("migrates legacy badge ids", () => {
    const migrated = migrateLegacyAchievementIds(["first-prayer", "qaza-10"]);
    expect(migrated).toContain("salah:1");
    expect(migrated).toContain("qaza:debt:10:cleared");
  });

  it("normalizes legacy qaza numeric ids", () => {
    const migrated = migrateLegacyAchievementIds(["qaza:35042", "qaza:debt:35042:cleared"]);
    expect(migrated).toEqual(["qaza:debt:35042:cleared"]);
  });
});

describe.concurrent("getMilestoneById", () => {
  it("resolves debt milestones from current stats", () => {
    const stats: AchievementStats = {
      ...base,
      qazaDebt: { total: 100, completed: 100, remaining: 0 },
    };
    expect(getMilestoneById("qaza:debt:100:cleared", stats)?.title).toBe("Qaza Debt Cleared");
  });

  it("uses the total embedded in cleared debt ids", () => {
    const stats: AchievementStats = {
      ...base,
      qazaDebt: { total: 35042, completed: 35042, remaining: 0 },
    };
    const historical = getMilestoneById("qaza:debt:10:cleared", stats);
    expect(historical?.id).toBe("qaza:debt:10:cleared");
    expect(historical?.description).toContain("10");
  });
});

describe.concurrent("resolveUnlockedMilestones", () => {
  it("dedupes ids that resolve to the same milestone", () => {
    const stats: AchievementStats = {
      ...base,
      qazaDebt: { total: 35042, completed: 35042, remaining: 0 },
    };
    const milestones = resolveUnlockedMilestones(
      ["qaza:35042", "qaza:debt:35042:cleared", "qaza:debt:10:cleared"],
      stats,
    );
    expect(milestones.map((m) => m.id)).toEqual([
      "qaza:debt:35042:cleared",
      "qaza:debt:10:cleared",
    ]);
  });
});
