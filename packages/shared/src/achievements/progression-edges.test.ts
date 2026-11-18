import { describe, expect, it } from "vitest";
import { makeAchievementStats } from "../test-support/factories";
import { getDebtMilestoneById } from "./debt-goals";
import {
  computeDevotionProgress,
  evaluateAchievements,
  getMilestoneById,
  PROGRESSION_TRACKS,
  totalNoorForDevotionLevel,
} from "./definitions";
import {
  completedLevelForValue,
  descriptionKeyForTrack,
  descriptionParamsForTrack,
  type ProgressionTrackConfig,
  thresholdForTrackLevel,
  titleKeyForTrackLevel,
  titleParamsForTrackLevel,
} from "./tracks";

const TRACK: ProgressionTrackConfig = {
  id: "salah",
  labelKey: "x",
  metric: "prayersCompleted",
  thresholds: [2, 4],
  incrementAfter: 10,
  titlesCount: 2,
};

const NO_DEBT = { qaza: null, roza: null };

describe("track titles", () => {
  it.each([
    [1, "achievements.milestones.salah.titles.0", {}],
    [2, "achievements.milestones.salah.titles.1", {}],
    [3, "achievements.milestones.salah.titleFallback", { level: 3 }],
    [0, "achievements.milestones.salah.titleFallback", { level: 0 }],
  ])("level %i -> %s %j", (level, key, params) => {
    expect(titleKeyForTrackLevel(TRACK, level)).toBe(key);
    expect(titleParamsForTrackLevel(TRACK, level)).toEqual(params);
  });

  it("describes tracks with the threshold count", () => {
    expect(descriptionKeyForTrack(TRACK)).toBe("achievements.milestones.salah.description");
    expect(descriptionParamsForTrack(TRACK, 7)).toEqual({ count: 7 });
  });
});

describe("thresholdForTrackLevel", () => {
  it.each([
    ["a configured level", TRACK, 1, 2],
    ["the last configured level", TRACK, 2, 4],
    ["the first overflow level", TRACK, 3, 14],
    ["a later overflow level", TRACK, 5, 34],
    ["level 0 (no configured threshold)", TRACK, 0, 10],
    ["an empty threshold list", { ...TRACK, thresholds: [] }, 1, 20],
  ])("handles %s", (_label, track, level, expected) => {
    expect(thresholdForTrackLevel(track, level)).toBe(expected);
  });
});

describe("completedLevelForValue", () => {
  it.each([
    [0, 0],
    [4, 2],
    [14, 3],
  ])("value %i completes level %i", (value, expected) => {
    expect(completedLevelForValue(TRACK, value)).toBe(expected);
  });
});

describe("devotion progress", () => {
  it.each([
    [0, 0],
    [-3, 0],
    [3, 600],
  ])("totalNoorForDevotionLevel(%i) -> %i", (level, expected) => {
    expect(totalNoorForDevotionLevel(level)).toBe(expected);
  });

  it("computes level and fractional progress", () => {
    expect(computeDevotionProgress(makeAchievementStats({ prayersCompleted: 15 }))).toEqual({
      level: 1,
      noor: 150,
      noorForCurrentLevel: 100,
      noorForNextLevel: 300,
      progress: 0.25,
    });
  });
});

describe("getMilestoneById", () => {
  it.each(["unknown:1", "salah:abc"])("returns undefined for %s", (id) => {
    expect(getMilestoneById(id)).toBeUndefined();
  });

  it.each([
    [
      "devotion:0",
      {
        titleKey: "achievements.devotionRank.startingOut",
        descriptionKey: "achievements.devotionRank.beginJourney",
        titleParams: undefined,
        descriptionParams: undefined,
        progress: 0.5,
      },
    ],
    [
      "devotion:3",
      {
        titleKey: "achievements.devotionRank.titles.2",
        descriptionKey: "achievements.devotionRank.description",
        descriptionParams: { level: 3, noor: 600 },
        threshold: 600,
        progress: 1,
      },
    ],
    [
      "devotion:12",
      { titleKey: "achievements.devotionRank.titleFallback", titleParams: { level: 12 } },
    ],
  ])("builds the unlocked devotion milestone %s", (id, expected) => {
    const milestone = getMilestoneById(id, makeAchievementStats({ prayersCompleted: 5 }));

    expect(milestone).toMatchObject({ ...expected, unlocked: true });
  });

  it.each([
    ["salah:2", { value: 7, threshold: 5 }],
    ["streak:2", { value: 3, threshold: 3 }],
    ["zikr:3", { value: 11, threshold: 10 }],
    ["consistency:2", { value: 2, threshold: 3, progress: 2 / 3 }],
  ])("reads %s from its own metric", (id, expected) => {
    const stats = makeAchievementStats({
      prayersCompleted: 7,
      streak: 3,
      zikrCompleted: 11,
      perfectDays: 2,
    });

    expect(getMilestoneById(id, stats)).toMatchObject({ ...expected, unlocked: true });
  });

  it("uses fallback titles for levels beyond the named list", () => {
    const zikr = PROGRESSION_TRACKS.find((track) => track.id === "zikr");
    const level = (zikr?.titlesCount ?? 0) + 2;

    expect(getMilestoneById(`zikr:${level}`)).toMatchObject({
      titleKey: "achievements.milestones.zikr.titleFallback",
      titleParams: { level },
    });
  });

  it("resolves an active roza debt id from current stats", () => {
    const stats = makeAchievementStats({ rozaDebt: { total: 30, completed: 6, remaining: 24 } });

    expect(getMilestoneById("roza:debt:30", stats)).toMatchObject({
      trackId: "roza",
      value: 6,
      unlocked: false,
      titleKey: "achievements.debt.roza.activeTitle",
    });
  });

  it("resolves an active debt id from its embedded total when untracked", () => {
    expect(getMilestoneById("roza:debt:12")).toMatchObject({
      threshold: 12,
      value: 0,
      progress: 0,
    });
  });
});

describe("getDebtMilestoneById", () => {
  it("handles a zero-total debt id without dividing by zero", () => {
    expect(getDebtMilestoneById("qaza:debt:0", NO_DEBT)?.progress).toBe(0);
  });

  it("builds a cleared roza milestone from its id", () => {
    expect(getDebtMilestoneById("roza:debt:4:cleared", NO_DEBT)).toMatchObject({
      unlocked: true,
      progress: 1,
      titleKey: "achievements.debt.roza.clearedTitle",
    });
  });

  it("returns undefined for non-debt ids", () => {
    expect(getDebtMilestoneById("nope", NO_DEBT)).toBeUndefined();
  });
});

describe("evaluateAchievements", () => {
  it.each(["roza:debt:10:cleared", "qaza:debt:5", "devotion:1", "salah:4"])(
    "includes %s for a user with mixed progress",
    (id) => {
      const all = evaluateAchievements(
        makeAchievementStats({
          prayersCompleted: 30,
          rozaDebt: { total: 10, completed: 10, remaining: 0 },
          qazaDebt: { total: 5, completed: 1, remaining: 4 },
        }),
      );

      expect(all.map((milestone) => milestone.id)).toContain(id);
    },
  );
});
