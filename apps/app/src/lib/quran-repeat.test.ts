import { describe, expect, it } from "@jest/globals";

import {
  isPlaybackSettingsActive,
  nextIndexForRepeatPlan,
  normalizeRepeatPlan,
  resolvePlaybackSummary,
  surahNumberFromSourceHref,
} from "@/lib/quran-repeat";

describe("nextIndexForRepeatPlan", () => {
  it("advances and stops at end when off", () => {
    expect(nextIndexForRepeatPlan(0, 7, { mode: "off" })).toBe(1);
    expect(nextIndexForRepeatPlan(6, 7, { mode: "off" })).toBeNull();
  });

  it("replays the same verse forever", () => {
    expect(nextIndexForRepeatPlan(3, 7, { mode: "verse" })).toBe(3);
  });

  it("wraps the whole surah", () => {
    expect(nextIndexForRepeatPlan(6, 7, { mode: "surah" })).toBe(0);
    expect(nextIndexForRepeatPlan(2, 7, { mode: "surah" })).toBe(3);
  });

  it("loops within an ayah range", () => {
    const plan = { mode: "range" as const, start: 2, end: 4 };
    expect(nextIndexForRepeatPlan(1, 7, plan)).toBe(2); // ayah 2 → 3
    expect(nextIndexForRepeatPlan(3, 7, plan)).toBe(1); // ayah 4 → 2
  });
});

describe("normalizeRepeatPlan", () => {
  it("clamps range to ayah count", () => {
    expect(normalizeRepeatPlan("range", { start: 0, end: 99 }, 7)).toEqual({
      mode: "range",
      start: 1,
      end: 7,
    });
  });
});

describe("resolvePlaybackSummary", () => {
  it("is inactive when everything is off", () => {
    expect(resolvePlaybackSummary({ plan: { mode: "off" }, translationAudio: "off" })).toEqual({
      active: false,
      repeat: { kind: "off" },
      tts: false,
    });
  });

  it("marks TTS-only as active", () => {
    expect(resolvePlaybackSummary({ plan: { mode: "off" }, translationAudio: "after" })).toEqual({
      active: true,
      repeat: { kind: "off" },
      tts: true,
    });
  });

  it("includes range bounds", () => {
    expect(
      resolvePlaybackSummary({
        plan: { mode: "range", start: 1, end: 2 },
        translationAudio: "after",
      }),
    ).toEqual({
      active: true,
      repeat: { kind: "range", start: 1, end: 2 },
      tts: true,
    });
  });
});

describe("isPlaybackSettingsActive", () => {
  it("detects non-default modes", () => {
    expect(isPlaybackSettingsActive({ mode: "off" }, "off")).toBe(false);
    expect(isPlaybackSettingsActive({ mode: "verse" }, "off")).toBe(true);
    expect(isPlaybackSettingsActive({ mode: "off" }, "after")).toBe(true);
  });
});

describe("surahNumberFromSourceHref", () => {
  it("parses surah reader hrefs", () => {
    expect(surahNumberFromSourceHref("/quran/2")).toBe(2);
    expect(surahNumberFromSourceHref("/quran/114?ayah=3")).toBe(114);
    expect(surahNumberFromSourceHref("/quran/page/12")).toBeNull();
    expect(surahNumberFromSourceHref(null)).toBeNull();
  });
});
