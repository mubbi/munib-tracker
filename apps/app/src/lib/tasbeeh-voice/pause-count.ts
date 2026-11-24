import type { TimedHit } from "./hit-dedupe";
import type { VoiceListener } from "./listener";
import { createSegmenter, VAD_SAMPLE_RATE } from "./vad";

/**
 * "Pause count (basic)" — the NF-3.20 documented fallback (D24): every separate
 * spoken burst the VAD hears counts once. No model, no download, works for any
 * phrase, but it cannot tell WHAT was said, so the UI labels it "Counts each
 * pause — less accurate". Pure; same interface as the model listener.
 */

/** A burst shorter than this is a cough or a click, not a phrase. */
export const PAUSE_MIN_SEGMENT_MS = 280;

export type PauseCounterOptions = {
  onHit: (hit: TimedHit) => void;
  onSpeech?: (speaking: boolean) => void;
  onLevel?: (db: number) => void;
  minSegmentMs?: number;
};

export function createPauseCounter(options: PauseCounterOptions): VoiceListener {
  const segmenter = createSegmenter();
  const minMs = options.minSegmentMs ?? PAUSE_MIN_SEGMENT_MS;
  const mutes: { from: number; to: number }[] = [];
  let segmentStart: number | null = null;
  let disposed = false;
  let lastLevelAt = 0;
  const toMs = (samples: number) => (samples / VAD_SAMPLE_RATE) * 1000;

  const handle = (events: ReturnType<typeof segmenter.push>) => {
    for (const event of events) {
      if (event.type === "speech-start") {
        segmentStart = event.atSample;
        options.onSpeech?.(true);
      } else if (event.type === "speech-end") {
        options.onSpeech?.(false);
        if (segmentStart == null) continue;
        const hit: TimedHit = {
          startMs: toMs(segmentStart),
          endMs: toMs(event.atSample),
          score: 0,
        };
        segmentStart = null;
        // The segment includes ~0.5 s of pre-roll + hangover around the voice.
        if (hit.endMs - hit.startMs < minMs + 500) continue;
        if (mutes.some((m) => hit.startMs < m.to && m.from < hit.endMs)) continue;
        if (!disposed) options.onHit(hit);
      }
    }
  };

  return {
    feed(pcm) {
      if (disposed) return;
      handle(segmenter.push(pcm));
      if (options.onLevel && segmenter.samples - lastLevelAt >= VAD_SAMPLE_RATE / 10) {
        lastLevelAt = segmenter.samples;
        options.onLevel(segmenter.levelDb);
      }
    },
    mute(durationMs) {
      const from = toMs(segmenter.samples);
      mutes.push({ from, to: from + durationMs });
      if (mutes.length > 16) mutes.shift();
    },
    async finish() {
      if (!disposed) handle(segmenter.flush());
    },
    dispose() {
      disposed = true;
    },
    get audioMs() {
      return toMs(segmenter.samples);
    },
  };
}
