import type { TimedHit } from "./hit-dedupe";
import { VAD_SAMPLE_RATE } from "./vad";

/**
 * Bookkeeping shared by every voice listener (model spotter, pause count, taught
 * pattern): sample ↔ ms conversion, mute windows and throttled level reports.
 * No DSP lives here — the eval-pinned constants stay in their own modules.
 */

/** Samples at the 16 kHz VAD rate → milliseconds. */
export const samplesToMs = (samples: number) => (samples / VAD_SAMPLE_RATE) * 1000;

/** Milliseconds → whole samples at the 16 kHz VAD rate. */
export const msToSamples = (milliseconds: number) =>
  Math.round((milliseconds * VAD_SAMPLE_RATE) / 1000);

/** Mute windows kept (older ones are dropped; a session never needs more). */
const MAX_MUTE_WINDOWS = 16;

/**
 * Time windows where hits are ignored (e.g. while the app's own completion sound
 * plays). A hit is muted when it overlaps any window.
 */
export function createMuteWindows() {
  const windows: { from: number; to: number }[] = [];
  return {
    add(fromMs: number, durationMs: number): void {
      windows.push({ from: fromMs, to: fromMs + durationMs });
      if (windows.length > MAX_MUTE_WINDOWS) windows.shift();
    },
    covers(hit: TimedHit): boolean {
      return windows.some((m) => hit.startMs < m.to && m.from < hit.endMs);
    },
  };
}

/** Level reports at most every 100 ms of audio. */
const LEVEL_INTERVAL_SAMPLES = VAD_SAMPLE_RATE / 10;

/** Throttles `onLevel` to one report per 100 ms of audio (no-op without a callback). */
export function createLevelReporter(onLevel: ((db: number) => void) | undefined) {
  let lastAt = 0;
  return (samples: number, levelDb: number): void => {
    if (!onLevel || samples - lastAt < LEVEL_INTERVAL_SAMPLES) return;
    lastAt = samples;
    onLevel(levelDb);
  };
}
