import { describe, expect, it } from "@jest/globals";

import { buildAudioTrack, buildTtsTrack, TTS_SAMPLE_TEXT } from "@/test-support/fixtures/audio";

import {
  sliceTtsTextFromProgress,
  ttsElapsedPosition,
  ttsSeekProgress,
  withTtsVoice,
} from "./audio-player-tts";

describe("sliceTtsTextFromProgress", () => {
  it("returns the whole (trimmed) text near the start", () => {
    expect(sliceTtsTextFromProgress(`  ${TTS_SAMPLE_TEXT} `, 0)).toBe(TTS_SAMPLE_TEXT);
    expect(sliceTtsTextFromProgress(TTS_SAMPLE_TEXT, 0.02)).toBe(TTS_SAMPLE_TEXT);
    expect(sliceTtsTextFromProgress(TTS_SAMPLE_TEXT, -1)).toBe(TTS_SAMPLE_TEXT);
  });

  it("returns nothing near the end", () => {
    expect(sliceTtsTextFromProgress(TTS_SAMPLE_TEXT, 0.98)).toBe("");
    expect(sliceTtsTextFromProgress(TTS_SAMPLE_TEXT, 2)).toBe("");
  });

  it("cuts mid-utterance at the next word boundary", () => {
    const sliced = sliceTtsTextFromProgress(TTS_SAMPLE_TEXT, 0.5);
    expect(TTS_SAMPLE_TEXT.endsWith(sliced)).toBe(true);
    expect(TTS_SAMPLE_TEXT.split(" ")).toContain(sliced.split(" ")[0]);
    expect(sliced.length).toBeLessThan(TTS_SAMPLE_TEXT.length / 2 + 1);
  });

  it("falls back to a character cut when there is no later space", () => {
    expect(sliceTtsTextFromProgress("abcdefghij", 0.5)).toBe("fghij");
  });

  it("returns empty for blank text", () => {
    expect(sliceTtsTextFromProgress("   ", 0.5)).toBe("");
  });
});

describe("ttsElapsedPosition", () => {
  it("adds wall-clock seconds since start to the anchor", () => {
    expect(ttsElapsedPosition(30, 5, 1_000, 3_500)).toBe(7.5);
  });

  it("caps at the utterance duration", () => {
    expect(ttsElapsedPosition(6, 5, 1_000, 10_000)).toBe(6);
  });
});

describe("ttsSeekProgress", () => {
  it("is the clamped fraction of the duration", () => {
    expect(ttsSeekProgress(5, 20)).toBe(0.25);
    expect(ttsSeekProgress(50, 20)).toBe(1);
    expect(ttsSeekProgress(-5, 20)).toBe(0);
  });

  it("is 0 without a pending seek or a duration", () => {
    expect(ttsSeekProgress(null, 20)).toBe(0);
    expect(ttsSeekProgress(5, 0)).toBe(0);
  });
});

describe("withTtsVoice", () => {
  it("re-voices every TTS track and leaves file tracks untouched", () => {
    const file = buildAudioTrack({ id: "file" });
    const queue = [buildTtsTrack({ id: "a" }), file, buildTtsTrack({ id: "b" })];
    const next = withTtsVoice(queue, "voice-2");
    expect(next?.map((t) => t.ttsPlayback?.voice)).toEqual(["voice-2", undefined, "voice-2"]);
    expect(next?.[1]).toBe(file);
    expect(queue[0].ttsPlayback?.voice).toBeUndefined();
  });

  it("clears the voice back to the platform default", () => {
    const queue = [
      buildTtsTrack({ id: "a", ttsPlayback: { text: "x y", lang: "en", voice: "v" } }),
    ];
    expect(withTtsVoice(queue, undefined)?.[0].ttsPlayback?.voice).toBeUndefined();
  });

  it("returns null when the queue has no TTS track", () => {
    expect(withTtsVoice([buildAudioTrack({ id: "file" })], "v")).toBeNull();
    expect(withTtsVoice([], "v")).toBeNull();
  });
});
