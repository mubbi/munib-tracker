import { describe, expect, it } from "@jest/globals";

import {
  buildReadingTtsQueue,
  estimateTtsDurationSeconds,
  isTtsPlaybackTrack,
  splitReadingTtsSegments,
} from "@/lib/tts-audio-tracks";

describe("tts-audio-tracks", () => {
  it("splits on sentence boundaries", () => {
    expect(splitReadingTtsSegments("One. Two! Three?")).toEqual(["One.", "Two!", "Three?"]);
  });

  it("builds a mini-player queue with ttsPlayback payloads", () => {
    const queue = buildReadingTtsQueue({
      id: "adhkar-1",
      title: "Morning",
      text: "First sentence. Second sentence.",
      lang: "en-US",
      voice: "en-US-x",
    });
    expect(queue).toHaveLength(2);
    expect(queue[0]?.id).toBe("adhkar-1:tts:0");
    expect(queue[0]?.ttsPlayback).toEqual({
      text: "First sentence.",
      lang: "en-US",
      voice: "en-US-x",
    });
    expect(queue[0]?.uri).toBe("");
    expect(isTtsPlaybackTrack(queue[0])).toBe(true);
  });

  it("estimates a positive duration from text length", () => {
    expect(estimateTtsDurationSeconds("Bismillah ir-Rahman ir-Rahim")).toBeGreaterThan(1);
  });
});

describe("tts-audio-tracks edges", () => {
  it.each([
    ["", 1, 0],
    ["   ", 1, 0],
    ["Hi", 1, 1.5],
    ["x".repeat(140), 1, 10],
    ["x".repeat(140), 0.1, 140 / (14 * 0.35)],
  ])("estimates %p at %px", (text, rate, seconds) => {
    expect(estimateTtsDurationSeconds(text, rate)).toBeCloseTo(seconds);
  });

  it("defaults to 1x when no rate is given", () => {
    expect(estimateTtsDurationSeconds("x".repeat(28))).toBe(2);
  });

  it("returns no segments or queue for blank text", () => {
    expect(splitReadingTtsSegments("  ")).toEqual([]);
    expect(buildReadingTtsQueue({ id: "r", title: "T", text: " ", lang: "en" })).toEqual([]);
  });

  it("keeps one long sentence as platform-safe chunks", () => {
    const segments = splitReadingTtsSegments("word ".repeat(200));
    expect(segments.length).toBeGreaterThan(1);
    expect(segments.every((s) => s.length <= 420)).toBe(true);
  });

  it.each([
    [undefined, "1/2"],
    ["Dua", "Dua · 1/2"],
  ])("numbers multi-segment subtitles (subtitle %p)", (subtitle, expected) => {
    const queue = buildReadingTtsQueue({
      id: "r",
      title: "T",
      subtitle,
      text: "One. Two.",
      lang: "en",
    });
    expect(queue[0].subtitle).toBe(expected);
  });

  it("keeps the plain subtitle for a single segment", () => {
    const queue = buildReadingTtsQueue({
      id: "r",
      title: "T",
      subtitle: "Dua",
      text: "One",
      lang: "en",
    });
    expect(queue.map((t) => t.subtitle)).toEqual(["Dua"]);
  });

  it.each([
    [null, false],
    [undefined, false],
    [{ id: "a", title: "a", uri: "x" }, false],
    [{ id: "a", title: "a", uri: "", ttsPlayback: { text: "  ", lang: "en" } }, false],
    [{ id: "a", title: "a", uri: "", ttsPlayback: { text: "Hi", lang: "en" } }, true],
  ])("isTtsPlaybackTrack(%p) → %p", (track, expected) => {
    expect(isTtsPlaybackTrack(track as never)).toBe(expected);
  });
});
