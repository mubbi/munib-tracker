import { describe, expect, it } from "vitest";
import { makeAchievementStats } from "../test-support/factories";
import {
  computeDevotionNoor,
  computeNoorBreakdown,
  earnedAchievementIds,
  evaluateProgression,
  getMilestoneById,
  NOOR_WEIGHTS,
  syncAchievementIds,
} from "./definitions";
import {
  EMPTY_RECITATION_STATS,
  evaluateRecitationMilestones,
  getRecitationMilestoneById,
  longestDayRun,
  RECITATION_MILESTONES,
  recitationTrackGoal,
} from "./recitation";

describe("recitation milestones (D68, personal only)", () => {
  it("has unique ids on the recitation track, in ladder order", () => {
    const ids = RECITATION_MILESTONES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["recitation:first", "recitation:revision-week", "recitation:ayahs-100"]);
  });

  it("starts with nothing unlocked", () => {
    const milestones = evaluateRecitationMilestones(EMPTY_RECITATION_STATS);
    expect(milestones.every((m) => !m.unlocked && m.progress === 0)).toBe(true);
    expect(milestones.every((m) => m.trackId === "recitation")).toBe(true);
  });

  it("unlocks the first recite-along, a week of revision and 100 ayahs at their thresholds", () => {
    const byId = (stats: Parameters<typeof evaluateRecitationMilestones>[0]) =>
      new Map(evaluateRecitationMilestones(stats).map((m) => [m.id, m]));
    const early = byId({ sessions: 1, bestRevisionStreak: 6, ayahsRecited: 99 });
    expect(early.get("recitation:first")?.unlocked).toBe(true);
    expect(early.get("recitation:revision-week")?.unlocked).toBe(false);
    expect(early.get("recitation:revision-week")?.progress).toBeCloseTo(6 / 7);
    expect(early.get("recitation:ayahs-100")?.unlocked).toBe(false);
    const later = byId({ sessions: 12, bestRevisionStreak: 7, ayahsRecited: 140 });
    expect(later.get("recitation:revision-week")?.unlocked).toBe(true);
    expect(later.get("recitation:ayahs-100")).toMatchObject({ unlocked: true, progress: 1 });
    expect(later.get("recitation:ayahs-100")?.descriptionParams).toEqual({ number: 100 });
  });
});

describe("longestDayRun", () => {
  it("counts consecutive calendar days, ignoring order and repeats", () => {
    expect(longestDayRun([])).toBe(0);
    expect(longestDayRun(["2026-11-03", "2026-11-01", "2026-11-02", "2026-11-02"])).toBe(3);
    expect(longestDayRun(["2026-11-01", "2026-11-03"])).toBe(1);
  });

  it("crosses month and year ends", () => {
    expect(longestDayRun(["2026-12-30", "2026-12-31", "2027-01-01", "2027-03-01"])).toBe(3);
    expect(longestDayRun(["2028-02-28", "2028-02-29", "2028-03-01"])).toBe(3);
  });

  it("ignores malformed days", () => {
    expect(longestDayRun(["nope", "2026-11-01"])).toBe(1);
  });
});

describe("Recitation track on Achievements (D71)", () => {
  const recitationOf = (state: ReturnType<typeof evaluateProgression>) => ({
    goals: state.activeGoals.filter((m) => m.trackId === "recitation"),
    unlocked: state.unlockedMilestones.filter((m) => m.trackId === "recitation"),
  });

  it("leaves the track out entirely when practice stats are unavailable (TV / not loaded)", () => {
    for (const recitation of [undefined, null]) {
      const stats = makeAchievementStats({ prayersCompleted: 3, recitation });
      const { goals, unlocked } = recitationOf(evaluateProgression(stats));
      expect(goals).toEqual([]);
      expect(unlocked).toEqual([]);
      expect(computeNoorBreakdown(stats).map((e) => e.source)).toEqual(["salah"]);
    }
  });

  it("shows the first-session goal at zero on a device that has practice", () => {
    const state = evaluateProgression(makeAchievementStats({ recitation: EMPTY_RECITATION_STATS }));
    const { goals, unlocked } = recitationOf(state);
    expect(goals.map((m) => [m.id, m.level, m.unlocked])).toEqual([["recitation:first", 1, false]]);
    expect(unlocked).toEqual([]);
    expect(computeDevotionNoor(makeAchievementStats({ recitation: EMPTY_RECITATION_STATS }))).toBe(
      0,
    );
  });

  it("aims at the first milestone not yet reached, in ladder order", () => {
    // 100 ayahs before a week of revision: the goal is still the revision week.
    const state = evaluateProgression(
      makeAchievementStats({
        recitation: { sessions: 9, bestRevisionStreak: 3, ayahsRecited: 120 },
      }),
    );
    const { goals, unlocked } = recitationOf(state);
    expect(goals.map((m) => m.id)).toEqual(["recitation:revision-week"]);
    expect(goals[0]).toMatchObject({ value: 3, threshold: 7, unlocked: false });
    expect(unlocked.map((m) => m.id)).toEqual(["recitation:first", "recitation:ayahs-100"]);
  });

  it("keeps the last milestone as a completed goal once the whole ladder is earned", () => {
    const stats = makeAchievementStats({
      recitation: { sessions: 30, bestRevisionStreak: 8, ayahsRecited: 400 },
    });
    const { goals, unlocked } = recitationOf(evaluateProgression(stats));
    expect(goals).toHaveLength(1);
    expect(goals[0]).toMatchObject({ id: "recitation:ayahs-100", unlocked: true, progress: 1 });
    expect(unlocked.map((m) => m.id)).toEqual(RECITATION_MILESTONES.map((m) => m.id));
    expect(earnedAchievementIds(stats)).toEqual(
      expect.arrayContaining(RECITATION_MILESTONES.map((m) => m.id)),
    );
  });

  it("earns Noor per session (5), per ayah recited (1) and per best revision-streak day (3)", () => {
    expect(NOOR_WEIGHTS).toMatchObject({
      recitationSession: 5,
      ayahRecited: 1,
      revisionStreakDay: 3,
    });
    const stats = makeAchievementStats({
      prayersCompleted: 10,
      recitation: { sessions: 12, bestRevisionStreak: 7, ayahsRecited: 140 },
    });
    expect(computeNoorBreakdown(stats)).toEqual([
      { source: "ayahRecited", count: 140, noor: 140 },
      { source: "salah", count: 10, noor: 100 },
      { source: "recitationSession", count: 12, noor: 60 },
      { source: "revisionStreakDay", count: 7, noor: 21 },
    ]);
    expect(computeDevotionNoor(stats)).toBe(321);
    // 321 Noor crosses level 2 (300) — recitation alone moved the devotion level.
    expect(evaluateProgression(stats).devotion.level).toBe(2);
    expect(evaluateProgression(makeAchievementStats({ prayersCompleted: 10 })).devotion.level).toBe(
      1,
    );
  });

  it("ignores negative or non-finite practice totals", () => {
    const stats = makeAchievementStats({
      recitation: { sessions: -2, bestRevisionStreak: Number.NaN, ayahsRecited: 3.7 },
    });
    expect(computeNoorBreakdown(stats)).toEqual([{ source: "ayahRecited", count: 3, noor: 3 }]);
  });

  it("resolves stored recitation ids for the unlock celebration", () => {
    const stats = makeAchievementStats({
      recitation: { sessions: 1, bestRevisionStreak: 0, ayahsRecited: 0 },
    });
    expect(getMilestoneById("recitation:first", stats)).toMatchObject({
      trackId: "recitation",
      titleKey: "achievements.recitation.first.title",
      unlocked: true,
    });
    expect(getMilestoneById("recitation:revision-week")?.descriptionParams).toEqual({ number: 7 });
    expect(getMilestoneById("recitation:nope", stats)).toBeUndefined();
    expect(getRecitationMilestoneById("recitation:ayahs-100", null)?.unlocked).toBe(true);
  });

  it("celebrates a newly reached recitation milestone once and never prunes it", () => {
    const before = makeAchievementStats({ recitation: EMPTY_RECITATION_STATS });
    const after = makeAchievementStats({
      recitation: { sessions: 1, bestRevisionStreak: 1, ayahsRecited: 4 },
    });
    const known = syncAchievementIds(before, []).synced;
    const next = syncAchievementIds(after, known);
    expect(next.newlyUnlocked).toEqual(["recitation:first"]);
    // Lower stats (deleted history) or none at all (TV / not loaded) keep the badge.
    for (const stats of [before, makeAchievementStats({ recitation: null })]) {
      const again = syncAchievementIds(stats, next.synced);
      expect(again.synced).toContain("recitation:first");
      expect(again.newlyUnlocked).toEqual([]);
    }
  });

  it("still prunes other lapsed milestones next to kept recitation ones", () => {
    const known = ["salah:1", "recitation:first", "recitation:first", "made-up:1"];
    const { synced } = syncAchievementIds(makeAchievementStats(), known);
    expect(synced).toEqual(["recitation:first"]);
  });

  it("recitationTrackGoal has no goal for an empty ladder", () => {
    expect(recitationTrackGoal([])).toBeUndefined();
  });
});
