import { framesToMs } from "./features";
import type { TimedHit } from "./hit-dedupe";
import type { VoiceListener } from "./listener";
import {
  createLevelReporter,
  createMuteWindows,
  samplesToMs as ms,
  msToSamples as samplesOf,
} from "./listener-shared";
import { MAX_SAMPLE_MS, MIN_SAMPLE_MS, matchUtterance, type TaughtPattern } from "./matcher";
import { createSegmenter } from "./vad";

/**
 * Listeners for "teach a zikr" counting (NF-3.20, D48–D51). Pure (no React, no
 * microphone): fed 16 kHz PCM like the other listeners.
 *
 * - `createTemplateCounter`: the energy VAD cuts the audio into spoken bursts;
 *   each burst is searched for the taught zikr (`matcher.ts`) and every match is
 *   one hit. During long unbroken speech (fast repeats with no pause) the open
 *   burst is searched about once a second and matches that are clearly complete
 *   count straight away, so counting keeps up.
 * - `createTeachRecorder`: each spoken burst while teaching is handed over as one
 *   sample (its PCM lives only in memory, until it is turned into features).
 */

/** Audio kept before a burst starts (the VAD's pre-roll reaches back this far). */
const LOOKBACK_MS = 1000;
/** Search an open burst after this much new speech. */
const OPEN_BURST_HOP_MS = 1000;
/** A match ending closer than this to the live edge may still be growing. */
const SETTLE_MS = 450;

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
};

export function createTemplateCounter(options: TemplateCounterOptions): VoiceListener {
  const segmenter = createSegmenter();
  const buffer = new PcmBuffer();
  const mutes = createMuteWindows();
  const reportLevel = createLevelReporter(options.onLevel);
  const longestTemplateMs = Math.max(
    ...options.pattern.templates.map((t) => framesToMs(t.frames)),
    MIN_SAMPLE_MS,
  );
  let burstFrom: number | null = null;
  let lastSearchAt = 0;
  let disposed = false;

  /** Search absolute [from, to); count matches that end before `settledBefore`. Returns where the next search starts. */
  const search = (from: number, to: number, settledBefore: number): number => {
    const pcm = buffer.slice(from, to);
    let next = from;
    for (const match of matchUtterance(options.pattern, pcm)) {
      const hit: TimedHit = {
        startMs: ms(from) + match.startMs,
        endMs: ms(from) + match.endMs,
        score: -match.cost,
      };
      if (hit.endMs > ms(settledBefore)) break;
      next = from + samplesOf(match.endMs);
      if (!disposed && !mutes.covers(hit)) options.onHit(hit);
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

  /** Long unbroken speech: count the repeats that are already complete. */
  const searchOpenBurst = () => {
    if (burstFrom == null) return;
    const now = segmenter.samples;
    if (now - lastSearchAt < samplesOf(OPEN_BURST_HOP_MS)) return;
    if (now - burstFrom < samplesOf(longestTemplateMs * 1.3)) return;
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
