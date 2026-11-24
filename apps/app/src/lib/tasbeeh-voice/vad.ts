/**
 * Energy voice-activity detector + windowing (NF-3.20 step 1). Pure; no imports.
 *
 * - 20 ms frames, RMS in dBFS.
 * - Adaptive noise floor: follows quiet frames quickly, rises slowly, so a fan or
 *   car hum becomes the floor rather than "speech".
 * - Speech = a frame `marginDb` above the floor AND above an absolute minimum
 *   that still admits a low speaking voice (the feature never asks anyone to
 *   raise their voice).
 * - ~300 ms hangover and a minimum segment length.
 *
 * Silence never reaches the model (battery). During long continuous speech
 * (fast repeated zikr) the segmenter emits windows of ≤ 3 s every ~1 s of new
 * audio (overlap = window − hop), so latency stays low; `hit-dedupe.ts` merges
 * the overlap.
 */

export const VAD_SAMPLE_RATE = 16_000;
export const VAD_FRAME_MS = 20;
const FRAME = (VAD_SAMPLE_RATE * VAD_FRAME_MS) / 1000;

export type VadOptions = {
  marginDb: number;
  absoluteMinDb: number;
  hangoverMs: number;
  minSegmentMs: number;
  preRollMs: number;
};

export const DEFAULT_VAD: VadOptions = {
  marginDb: 9,
  absoluteMinDb: -58,
  hangoverMs: 300,
  minSegmentMs: 160,
  preRollMs: 240,
};

export type WindowOptions = {
  /** Longest window handed to the model. */
  windowMs: number;
  /** Run a window at least this often during continuous speech. */
  hopMs: number;
};

/** See `makeWindow`: how close to a window's end a phrase may end and still count from it. */
export const SETTLE_GUARD_MS = 480;

export const DEFAULT_WINDOWING: WindowOptions = { windowMs: 3000, hopMs: 1000 };

/** RMS of a frame in dBFS (−100 for digital silence). */
export function frameDb(samples: Float32Array, start = 0, length = samples.length): number {
  let sum = 0;
  for (let i = start; i < start + length; i++) sum += samples[i] * samples[i];
  const rms = Math.sqrt(sum / Math.max(1, length));
  return rms > 0 ? Math.max(-100, 20 * Math.log10(rms)) : -100;
}

export type AnalysisWindow = {
  /** Absolute sample index of `audio[0]` since listening started. */
  startSample: number;
  audio: Float32Array;
  /**
   * Audio before this absolute sample will never be in a later window, so hits
   * that end before it can be committed.
   */
  settledBeforeSample: number;
  /** The speech segment ended with this window. */
  segmentEnd: boolean;
};

export type SegmenterEvent =
  | { type: "speech-start"; atSample: number }
  | { type: "speech-end"; atSample: number }
  | { type: "window"; window: AnalysisWindow };

export type Segmenter = {
  /** Feed 16 kHz mono PCM; returns VAD transitions and windows to analyse. */
  push(pcm: Float32Array): SegmenterEvent[];
  /** Flush a segment that is still open (stop listening). */
  flush(): SegmenterEvent[];
  /** Current input level in dBFS (level meter). */
  readonly levelDb: number;
  readonly speaking: boolean;
  readonly noiseFloorDb: number;
  /** Total samples pushed. */
  readonly samples: number;
  reset(): void;
};

export function createSegmenter(
  vad: VadOptions = DEFAULT_VAD,
  windowing: WindowOptions = DEFAULT_WINDOWING,
): Segmenter {
  const windowSamples = Math.round((windowing.windowMs * VAD_SAMPLE_RATE) / 1000);
  const hopSamples = Math.round((windowing.hopMs * VAD_SAMPLE_RATE) / 1000);
  const preRoll = Math.round((vad.preRollMs * VAD_SAMPLE_RATE) / 1000);
  const settleGuard = Math.round((SETTLE_GUARD_MS * VAD_SAMPLE_RATE) / 1000);
  const hangFrames = Math.ceil(vad.hangoverMs / VAD_FRAME_MS);
  const minSegFrames = Math.ceil(vad.minSegmentMs / VAD_FRAME_MS);
  /** Keep enough history for one window plus the pre-roll. */
  const historyCap = windowSamples + preRoll + FRAME;

  let history = new Float32Array(historyCap);
  let historyLen = 0;
  let total = 0;
  let pendingFrame = new Float32Array(FRAME);
  let pendingLen = 0;
  let floor = -60;
  let level = -100;
  let speaking = false;
  let silentFrames = 0;
  let speechFrames = 0;
  let segmentStart = 0;
  let lastWindowEnd = 0;

  const appendHistory = (samples: Float32Array) => {
    if (samples.length >= historyCap) {
      history.set(samples.subarray(samples.length - historyCap));
      historyLen = historyCap;
      return;
    }
    const overflow = historyLen + samples.length - historyCap;
    if (overflow > 0) {
      history.copyWithin(0, overflow, historyLen);
      historyLen -= overflow;
    }
    history.set(samples, historyLen);
    historyLen += samples.length;
  };

  /** Audio for absolute [from, to) that is still in history. */
  const slice = (from: number, to: number): { start: number; audio: Float32Array } => {
    const historyStart = total - historyLen;
    const start = Math.max(from, historyStart, to - windowSamples);
    return {
      start,
      audio: history.slice(start - historyStart, to - historyStart),
    };
  };

  const makeWindow = (end: number, segmentEnd: boolean): SegmenterEvent => {
    const { start, audio } = slice(segmentStart, end);
    lastWindowEnd = end;
    // A phrase that ends more than `settleGuard` before the window end is complete
    // in this window, so it may count now (low latency); one ending closer may be
    // cut off and waits for the next, overlapping window. A later window that
    // re-finds a committed phrase is blocked by hit-dedupe. At a segment end
    // everything is settled.
    const settled = segmentEnd ? end : Math.max(start, end - settleGuard);
    return {
      type: "window",
      window: { startSample: start, audio, settledBeforeSample: settled, segmentEnd },
    };
  };

  const onFrame = (frame: Float32Array, events: SegmenterEvent[]) => {
    const db = frameDb(frame);
    level = db;
    const isSpeech = db > floor + vad.marginDb && db > vad.absoluteMinDb;
    if (!isSpeech) {
      // Track the floor: fall fast, rise slowly.
      floor = db < floor ? floor + (db - floor) * 0.3 : floor + (db - floor) * 0.02;
    } else {
      // Creep up even through "speech" so a steady hum that starts mid-session
      // (fan, car) becomes the floor within ~1–2 s. Real speech dips between
      // syllables and words, which pulls the floor back down.
      floor += (db - floor) * 0.004;
    }
    if (isSpeech) {
      silentFrames = 0;
      speechFrames += 1;
      if (!speaking && speechFrames >= 2) {
        speaking = true;
        segmentStart = Math.max(0, total - speechFrames * FRAME - preRoll);
        // The first mid-speech window comes `hop` after speech was detected.
        lastWindowEnd = total;
        events.push({ type: "speech-start", atSample: segmentStart });
      }
    } else if (speaking) {
      silentFrames += 1;
      if (silentFrames >= hangFrames) {
        speaking = false;
        const voicedFrames = speechFrames;
        speechFrames = 0;
        if (voicedFrames >= minSegFrames) events.push(makeWindow(total, true));
        events.push({ type: "speech-end", atSample: total });
      }
    } else {
      speechFrames = 0;
    }
    // Mid-speech windows only while voice is actually heard (not during the hangover).
    if (speaking && isSpeech && total - lastWindowEnd >= hopSamples) {
      events.push(makeWindow(total, false));
    }
  };

  return {
    push(pcm) {
      const events: SegmenterEvent[] = [];
      let offset = 0;
      while (offset < pcm.length) {
        const take = Math.min(FRAME - pendingLen, pcm.length - offset);
        pendingFrame.set(pcm.subarray(offset, offset + take), pendingLen);
        pendingLen += take;
        offset += take;
        if (pendingLen === FRAME) {
          appendHistory(pendingFrame);
          total += FRAME;
          onFrame(pendingFrame, events);
          pendingLen = 0;
        }
      }
      return events;
    },
    flush() {
      if (!speaking) return [];
      speaking = false;
      speechFrames = 0;
      silentFrames = 0;
      return [makeWindow(total, true), { type: "speech-end", atSample: total }];
    },
    get levelDb() {
      return level;
    },
    get speaking() {
      return speaking;
    },
    get noiseFloorDb() {
      return floor;
    },
    get samples() {
      return total;
    },
    reset() {
      history = new Float32Array(historyCap);
      historyLen = 0;
      total = 0;
      pendingFrame = new Float32Array(FRAME);
      pendingLen = 0;
      floor = -60;
      level = -100;
      speaking = false;
      silentFrames = 0;
      speechFrames = 0;
      segmentStart = 0;
      lastWindowEnd = 0;
    },
  };
}
