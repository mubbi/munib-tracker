import { concatPcm, hush, tone } from "@/test-support/tasbeeh-voice";

import { createSegmenter, type SegmenterEvent } from "./vad";

type WindowEvent = Extract<SegmenterEvent, { type: "window" }>;
const windows = (events: SegmenterEvent[]) =>
  events.filter((e): e is WindowEvent => e.type === "window");

function feed(pcm: Float32Array, chunkMs = 100) {
  const seg = createSegmenter();
  const events: SegmenterEvent[] = [];
  const chunk = (16_000 * chunkMs) / 1000;
  for (let i = 0; i < pcm.length; i += chunk) events.push(...seg.push(pcm.subarray(i, i + chunk)));
  events.push(...seg.flush());
  return { seg, events };
}

describe("VAD segmenter", () => {
  it("keeps silence away from the model", () => {
    expect(windows(feed(hush(5000)).events)).toHaveLength(0);
  });

  it("hands one window to the model for a short utterance, after the hangover", () => {
    const { events } = feed(concatPcm(hush(1000), tone(700), hush(1000)));
    const w = windows(events);
    expect(w).toHaveLength(1);
    expect(w[0].window.segmentEnd).toBe(true);
    // Pre-roll keeps the phrase onset; the window covers the speech.
    expect(w[0].window.startSample).toBeLessThan(16_000);
    expect(w[0].window.audio.length).toBeGreaterThan(16_000 * 0.7);
    expect(w[0].window.settledBeforeSample).toBe(
      w[0].window.startSample + w[0].window.audio.length,
    );
    expect(events.map((e) => e.type)).toEqual(["speech-start", "window", "speech-end"]);
  });

  it("splits long continuous speech into overlapping windows of at most 3 s", () => {
    const w = windows(feed(concatPcm(hush(500), tone(6000), hush(1000))).events);
    expect(w.length).toBeGreaterThanOrEqual(5);
    for (const { window } of w) expect(window.audio.length).toBeLessThanOrEqual(3 * 16_000);
    for (let i = 1; i < w.length; i++) {
      const prev = w[i - 1].window;
      expect(w[i].window.startSample).toBeLessThan(prev.startSample + prev.audio.length);
    }
  });

  it("admits a low speaking voice", () => {
    expect(windows(feed(concatPcm(hush(1000), tone(800, 0.01), hush(1000))).events)).toHaveLength(
      1,
    );
  });

  it("adapts to a steady hum: it soon stops counting as speech", () => {
    const { seg, events } = feed(concatPcm(hush(300), tone(8000, 0.002)));
    // A hum that starts mid-session may open one short segment, never a stream of windows.
    expect(windows(events).length).toBeLessThanOrEqual(3);
    expect(seg.speaking).toBe(false);
    expect(seg.noiseFloorDb).toBeGreaterThan(-62);
  });

  it("reports a live level for the meter", () => {
    expect(feed(tone(500)).seg.levelDb).toBeGreaterThan(-30);
  });

  it("starts over on reset", () => {
    const { seg } = feed(tone(500));
    seg.reset();
    expect(seg.samples).toBe(0);
    expect(seg.speaking).toBe(false);
  });
});
