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

describe("repeat plan edge cases", () => {
  it.each([
    [{ mode: "off" as const }, 0, 0, null],
    [{ mode: "off" as const }, 9, 3, null],
    [{ mode: "range" as const }, 1, 3, 2],
    [{ mode: "range" as const }, 2, 3, 0],
    [{ mode: "range" as const, start: 2, end: 3 }, 0, 5, 1],
    [{ mode: "range" as const, start: 0, end: 99 }, 4, 5, 0],
    [{ mode: "range" as const, start: 4, end: 2 }, 3, 5, 3],
  ])("plan %p at %p of %p → %p", (plan, current, length, expected) => {
    expect(nextIndexForRepeatPlan(current, length, plan)).toBe(expected);
  });

  it.each([
    [undefined, undefined, 7, { mode: "off" }],
    ["verse", undefined, 7, { mode: "verse" }],
    ["range", undefined, 7, { mode: "range", start: 1, end: 7 }],
    ["range", undefined, 0, { mode: "range", start: 1, end: 1 }],
    ["range", { start: 5, end: 2 }, 7, { mode: "range", start: 5, end: 5 }],
  ] as const)("normalizes %p %p over %p ayahs", (mode, range, count, expected) => {
    expect(normalizeRepeatPlan(mode, range, count)).toEqual(expected);
  });

  it.each([
    [{ mode: "range" as const }, undefined, { kind: "range", start: 1, end: 1 }, false],
    [
      { mode: "range" as const, start: 3 },
      "after" as const,
      { kind: "range", start: 3, end: 3 },
      true,
    ],
    [{ mode: "surah" as const }, "off" as const, { kind: "surah" }, false],
    [{ mode: "verse" as const }, undefined, { kind: "verse" }, false],
  ])("summarises %p with TTS %p", (plan, translationAudio, repeat, tts) => {
    expect(resolvePlaybackSummary({ plan, translationAudio })).toEqual({
      active: true,
      repeat,
      tts,
    });
  });

  it("treats unset translation audio as off", () => {
    expect(isPlaybackSettingsActive({ mode: "off" }, undefined)).toBe(false);
  });

  it.each([
    [null, null],
    [undefined, null],
    ["/quran/0", null],
    ["/quran/115", null],
    ["/quran/2?ayah=5", 2],
    ["/tracker", null],
  ])("surahNumberFromSourceHref(%p) → %p", (href, expected) => {
    expect(surahNumberFromSourceHref(href)).toBe(expected);
  });
});
