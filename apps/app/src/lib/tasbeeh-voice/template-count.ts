import { extractVoicedFeatures, framesToMs } from "./features";
import type { TimedHit } from "./hit-dedupe";
import type { VoiceListener } from "./listener";
import {
  createLevelReporter,
  createMuteWindows,
  samplesToMs as ms,
  msToSamples as samplesOf,
} from "./listener-shared";
import {
  DEFAULT_TUNING,
  LEARN_COST_RATIO,
  learnFromMatch,
  MAX_SAMPLE_MS,
  MIN_SAMPLE_MS,
  matchFeatures,
  noiseAdjustedThreshold,
  patternTemplates,
  type TaughtPattern,
} from "./matcher";
import { createSegmenter } from "./vad";

/**
 * Listeners for "teach a zikr" counting (NF-3.20, D48–D51). Pure (no React, no
 * microphone): fed 16 kHz PCM like the other listeners.
 *
 * - `createTemplateCounter`: the energy VAD cuts the audio into spoken bursts;
 *   each burst is searched for the taught zikr (`matcher.ts`) and every match is
 *   one hit. While a burst is still open (fast repeats with no pause) it is
 *   searched every {@link OPEN_BURST_HOP_MS} from the last counted repeat on, and
 *   a match that ended {@link SETTLE_MS} ago counts straight away — so a count
 *   lands ~0.3–0.5 s after each zikr even back-to-back. Confident matches teach
 *   the pattern (adaptive templates, features only) and the threshold follows
 *   the room's noise within safe bounds (`noiseAdjustedThreshold`).
 * - `createTeachRecorder`: each spoken burst while teaching is handed over as one
 *   sample (its PCM lives only in memory, until it is turned into features).
 */

/** Audio kept before a burst starts (the VAD's pre-roll reaches back this far). */
const LOOKBACK_MS = 1000;
/** Search an open burst this often (incrementally: from the last counted repeat on). */
export const OPEN_BURST_HOP_MS = 250;
/** A match ending closer than this to the live edge may still be growing. */
export const SETTLE_MS = 280;
/** Learn at most one template per this much audio (adaptive templates). */
export const LEARN_INTERVAL_MS = 12_000;
/** Audio kept around a match when its features are re-extracted to learn from. */
const LEARN_PAD_MS = 40;

/** Append-only PCM with absolute sample indices; old audio is dropped explicitly. */
class PcmBuffer {
  private chunks: Float32Array[] = [];
  private start = 0;
  private length = 0;

  get end(): number {
    return this.start + this.length;
  }

  append(pcm: Float32Array): void {
    if (pcm.length === 0) return;
    this.chunks.push(pcm.slice());
    this.length += pcm.length;
  }

  /** Forget everything before absolute sample `at`. */
  dropBefore(at: number): void {
    while (this.chunks.length > 0 && this.start + this.chunks[0].length <= at) {
      this.start += this.chunks[0].length;
      this.length -= this.chunks[0].length;
      this.chunks.shift();
    }
  }

  /** Audio for absolute [from, to), clipped to what is still held. */
  slice(from: number, to: number): Float32Array {
    const a = Math.max(from, this.start);
    const b = Math.min(to, this.end);
    const out = new Float32Array(Math.max(0, b - a));
    let at = this.start;
    let written = 0;
    for (const chunk of this.chunks) {
      const chunkEnd = at + chunk.length;
      if (chunkEnd > a && at < b) {
        const s = Math.max(a, at) - at;
        const e = Math.min(b, chunkEnd) - at;
        out.set(chunk.subarray(s, e), written);
        written += e - s;
      }
      at = chunkEnd;
      if (at >= b) break;
    }
    return out;
  }

  clear(): void {
    this.chunks = [];
    this.start = this.end;
    this.length = 0;
  }
}

export type TemplateCounterOptions = {
  pattern: TaughtPattern;
  onHit: (hit: TimedHit) => void;
  onSpeech?: (speaking: boolean) => void;
  onLevel?: (db: number) => void;
  /**
   * Adaptive templates: called with the whole updated pattern when a confident
   * match was learned (features only — the caller may persist it). Absent → the
   * counter still matches with what it learned this session.
   */
  onPatternLearned?: (pattern: TaughtPattern) => void;
  /** False turns learning off (eval baselines). Default on. */
  learn?: boolean;
};

export function createTemplateCounter(options: TemplateCounterOptions): VoiceListener {
  const segmenter = createSegmenter();
  const buffer = new PcmBuffer();
  const mutes = createMuteWindows();
  const reportLevel = createLevelReporter(options.onLevel);
  let pattern = options.pattern;
  const lengths = () => patternTemplates(pattern).map((t) => framesToMs(t.frames));
  let longestTemplateMs = Math.max(...lengths(), MIN_SAMPLE_MS);
  let shortestTemplateMs = Math.max(Math.min(...lengths()), MIN_SAMPLE_MS);
  let burstFrom: number | null = null;
  let lastSearchAt = 0;
  let lastLearnAt = Number.NEGATIVE_INFINITY;
  let disposed = false;

  /** A confident match teaches the pattern (rate-limited, features only). */
  const maybeLearn = (pcm: Float32Array, startMs: number, endMs: number, cost: number) => {
    if (options.learn === false) return;
    const nowMs = ms(segmenter.samples);
    if (nowMs - lastLearnAt < LEARN_INTERVAL_MS) return;
    if (cost > pattern.threshold * LEARN_COST_RATIO) return;
    const from = Math.max(0, samplesOf(startMs - LEARN_PAD_MS));
    const to = Math.min(pcm.length, samplesOf(endMs + LEARN_PAD_MS));
    const next = learnFromMatch(pattern, extractVoicedFeatures(pcm.subarray(from, to)), cost);
    if (!next) return;
    lastLearnAt = nowMs;
    pattern = next;
    longestTemplateMs = Math.max(...lengths(), MIN_SAMPLE_MS);
    shortestTemplateMs = Math.max(Math.min(...lengths()), MIN_SAMPLE_MS);
    options.onPatternLearned?.(next);
  };

  /** Search absolute [from, to); count matches that end before `settledBefore`. Returns where the next search starts. */
  const search = (from: number, to: number, settledBefore: number): number => {
    const pcm = buffer.slice(from, to);
    const features = extractVoicedFeatures(pcm);
    if (!features) return from;
    let peak = -100;
    for (let f = 0; f < features.frames; f++) peak = Math.max(peak, features.energyDb[f]);
    const threshold = noiseAdjustedThreshold(pattern.threshold, segmenter.noiseFloorDb, peak);
    let next = from;
    for (const match of matchFeatures(pattern, features, DEFAULT_TUNING, threshold)) {
      const startMs = framesToMs(match.start + features.offsetFrames);
      const endMs = framesToMs(match.end + features.offsetFrames);
      const hit: TimedHit = {
        startMs: ms(from) + startMs,
        endMs: ms(from) + endMs,
        score: -match.cost,
      };
      if (hit.endMs > ms(settledBefore)) break;
      next = from + samplesOf(endMs);
      if (disposed || mutes.covers(hit)) continue;
      options.onHit(hit);
      maybeLearn(pcm, startMs, endMs, match.cost);
    }
    return next;
  };

  const handle = (events: ReturnType<typeof segmenter.push>) => {
    for (const event of events) {
      if (event.type === "speech-start") {
        burstFrom = event.atSample;
        lastSearchAt = segmenter.samples;
        options.onSpeech?.(true);
      } else if (event.type === "speech-end") {
        options.onSpeech?.(false);
        if (burstFrom != null) search(burstFrom, event.atSample, event.atSample);
        burstFrom = null;
        buffer.dropBefore(segmenter.samples - samplesOf(LOOKBACK_MS));
      }
    }
  };

  /** Unbroken speech: count each repeat as soon as it is complete. */
  const searchOpenBurst = () => {
    if (burstFrom == null) return;
    const now = segmenter.samples;
    if (now - lastSearchAt < samplesOf(OPEN_BURST_HOP_MS)) return;
    // Not even the shortest repeat (at the fastest pace) could have finished yet.
    const minRepeatMs = shortestTemplateMs * DEFAULT_TUNING.minLengthRatio;
    if (now - burstFrom < samplesOf(minRepeatMs + SETTLE_MS)) return;
    lastSearchAt = now;
    let next = search(burstFrom, now, now - samplesOf(SETTLE_MS));
    // Nothing matched for a long stretch: keep only enough audio for one more repeat.
    const keep = samplesOf(longestTemplateMs * 2 + SETTLE_MS);
    if (next === burstFrom && now - burstFrom > keep + samplesOf(longestTemplateMs)) {
      next = now - keep;
    }
    burstFrom = next;
    buffer.dropBefore(burstFrom);
  };

  return {
    feed(pcm) {
      if (disposed) return;
      buffer.append(pcm);
      handle(segmenter.push(pcm));
      searchOpenBurst();
      if (burstFrom == null) buffer.dropBefore(segmenter.samples - samplesOf(LOOKBACK_MS));
      reportLevel(segmenter.samples, segmenter.levelDb);
    },
    mute(durationMs) {
      mutes.add(ms(segmenter.samples), durationMs);
    },
    async finish() {
      if (!disposed) handle(segmenter.flush());
    },
    dispose() {
      disposed = true;
      buffer.clear();
    },
    get audioMs() {
      return ms(segmenter.samples);
    },
  };
}

export type TeachRecorderOptions = {
  /** One spoken burst (pre-roll included). The PCM is never stored. */
  onSample: (pcm: Float32Array) => void;
  /** Speech went on far longer than one zikr. */
  onTooLong?: () => void;
  onSpeech?: (speaking: boolean) => void;
  onLevel?: (db: number) => void;
};

export function createTeachRecorder(options: TeachRecorderOptions): VoiceListener {
  const segmenter = createSegmenter();
  const buffer = new PcmBuffer();
  const reportLevel = createLevelReporter(options.onLevel);
  let burstFrom: number | null = null;
  let disposed = false;
  let tooLong = false;

  const handle = (events: ReturnType<typeof segmenter.push>) => {
    for (const event of events) {
      if (event.type === "speech-start") {
        burstFrom = event.atSample;
        tooLong = false;
        options.onSpeech?.(true);
      } else if (event.type === "speech-end") {
        options.onSpeech?.(false);
        if (burstFrom != null && !tooLong && !disposed) {
          options.onSample(buffer.slice(burstFrom, event.atSample));
        }
        burstFrom = null;
      }
    }
  };

  return {
    feed(pcm) {
      if (disposed) return;
      buffer.append(pcm);
      handle(segmenter.push(pcm));
      const now = segmenter.samples;
      if (burstFrom != null && !tooLong && now - burstFrom > samplesOf(MAX_SAMPLE_MS + 1000)) {
        tooLong = true;
        options.onTooLong?.();
      }
      if (burstFrom == null || tooLong) buffer.dropBefore(now - samplesOf(LOOKBACK_MS));
      reportLevel(now, segmenter.levelDb);
    },
    mute() {},
    async finish() {
      if (!disposed) handle(segmenter.flush());
    },
    dispose() {
      disposed = true;
      buffer.clear();
    },
    get audioMs() {
      return ms(segmenter.samples);
    },
  };
}
