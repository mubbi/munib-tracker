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
