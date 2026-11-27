import type { TimedHit } from "./hit-dedupe";
import type { VoiceListener } from "./listener";
import { createLevelReporter, createMuteWindows, samplesToMs as toMs } from "./listener-shared";
import { createSegmenter } from "./vad";

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
  const mutes = createMuteWindows();
  const reportLevel = createLevelReporter(options.onLevel);
  let segmentStart: number | null = null;
  let disposed = false;

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
        if (mutes.covers(hit)) continue;
        if (!disposed) options.onHit(hit);
      }
    }
  };

  return {
    feed(pcm) {
      if (disposed) return;
      handle(segmenter.push(pcm));
      reportLevel(segmenter.samples, segmenter.levelDb);
    },
    mute(durationMs) {
      mutes.add(toMs(segmenter.samples), durationMs);
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
