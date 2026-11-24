import type { CtcLogprobs, FastConformerRunner } from "@/lib/speech/fastconformer-runner";
import { FASTCONFORMER_FRAME_MS } from "@/lib/speech/fastconformer-runner";

import { type CompiledPhrase, type SpotterVocab, spotPhrase } from "./ctc-keyword-spotter";
import { createHitTracker, type TimedHit } from "./hit-dedupe";
import { createLevelReporter, createMuteWindows, samplesToMs as toMs } from "./listener-shared";
import { createSegmenter } from "./vad";

/**
 * The voice-counting pipeline for one listening session (NF-3.20):
 *
 *   PCM (16 kHz) → VAD segmenter → windows (≤ 3 s, every ~1 s of speech)
 *     → FastConformer runner (one window at a time) → CTC keyword spotter
 *     → hit tracker (absolute-time de-dupe) → `onHit` (one call = one count)
 *
 * Silence never reaches the model. Windows are processed strictly one at a
 * time; if the model falls behind, older pending windows are dropped (a missed
 * count — the user taps — never a double one). No audio, transcript or score
 * leaves this module except the hit callback.
 */

export type VoiceListenerOptions = {
  runner: FastConformerRunner;
  phrase: CompiledPhrase;
  vocab: SpotterVocab;
  /** Two hits closer than this (start to start) are one hit. */
  minGapMs: number;
  /** Mean per-frame LLR a hit needs (gate.ts). */
  threshold: () => number;
  /** One committed phrase (= one count, or one calibration sample). */
  onHit: (hit: TimedHit) => void;
  onSpeech?: (speaking: boolean) => void;
  onLevel?: (db: number) => void;
  onError?: (error: unknown) => void;
  /** Windows allowed to wait for the model; older ones are dropped (default 2). */
  maxPendingWindows?: number;
};

export type VoiceListener = {
  /** Feed one chunk of 16 kHz mono PCM. */
  feed(pcm: Float32Array): void;
  /** Ignore hits that overlap the next `durationMs` of audio. */
  mute(durationMs: number): void;
  /** Flush the open segment and wait for queued windows. */
  finish(): Promise<void>;
  /** Stop without flushing; pending windows are dropped. */
  dispose(): void;
  /** Audio time (ms) since listening started. */
  readonly audioMs: number;
};

type Window = { startSample: number; audio: Float32Array; settledBeforeSample: number };

export function windowHits(
  logprobs: CtcLogprobs,
  phrase: CompiledPhrase,
  vocab: SpotterVocab,
  offsetMs: number,
  threshold: number,
): TimedHit[] {
  return spotPhrase(logprobs, phrase, vocab, { minScore: threshold }).map((hit) => ({
    startMs: offsetMs + hit.startFrame * FASTCONFORMER_FRAME_MS,
    endMs: offsetMs + (hit.endFrame + 1) * FASTCONFORMER_FRAME_MS,
    score: hit.score,
    variant: hit.variant,
  }));
}

export function createVoiceListener(options: VoiceListenerOptions): VoiceListener {
  const segmenter = createSegmenter();
  const tracker = createHitTracker(options.minGapMs);
  const maxPending = options.maxPendingWindows ?? 2;
  const queue: Window[] = [];
  const mutes = createMuteWindows();
  const reportLevel = createLevelReporter(options.onLevel);
  let running: Promise<void> | null = null;
  let disposed = false;

  const emit = (hits: TimedHit[]) => {
    for (const hit of hits) {
      if (disposed || mutes.covers(hit)) continue;
      options.onHit(hit);
    }
  };

  const process = async () => {
    while (queue.length && !disposed) {
      const window = queue.shift() as Window;
      try {
        const logprobs = await options.runner.run(window.audio);
        if (disposed) return;
        const hits = windowHits(
          logprobs,
          options.phrase,
          options.vocab,
          toMs(window.startSample),
          options.threshold(),
        );
        emit(tracker.offer(hits, toMs(window.settledBeforeSample)));
      } catch (error) {
        options.onError?.(error);
        return;
      }
    }
  };

  const kick = () => {
    if (running || disposed) return;
    running = process().finally(() => {
      running = null;
      if (queue.length && !disposed) kick();
    });
  };

  const handleEvents = (events: ReturnType<typeof segmenter.push>) => {
    for (const event of events) {
      if (event.type === "speech-start") options.onSpeech?.(true);
      else if (event.type === "speech-end") options.onSpeech?.(false);
      else {
        queue.push(event.window);
        // Never build a backlog: keep the newest windows.
        while (queue.length > maxPending) queue.shift();
        kick();
      }
    }
  };

  return {
    feed(pcm) {
      if (disposed) return;
      handleEvents(segmenter.push(pcm));
      reportLevel(segmenter.samples, segmenter.levelDb);
    },
    mute(durationMs) {
      mutes.add(toMs(segmenter.samples), durationMs);
    },
    async finish() {
      if (disposed) return;
      handleEvents(segmenter.flush());
      while (running) await running;
      emit(tracker.flush());
    },
    dispose() {
      disposed = true;
      queue.length = 0;
    },
    get audioMs() {
      return toMs(segmenter.samples);
    },
  };
}
