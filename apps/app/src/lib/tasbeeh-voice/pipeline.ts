import { enterRecordMode, restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import type { RecitationCapture } from "@/lib/quran-companion/audio/types";
import { PracticeError, toPracticeErrorCode } from "@/lib/quran-companion/error-codes";
import type { PracticeErrorCode } from "@/lib/quran-companion/types";
import { openFastConformerRunner } from "@/lib/speech/fastconformer";
import type { FastConformerRunner } from "@/lib/speech/fastconformer-runner";
import { claimMicrophone, releaseMicrophone } from "@/lib/speech/mic-owner";
import { loadInstalledModel } from "@/stores/quran-listener-store";

import { compilePhrase } from "./ctc-keyword-spotter";
import type { TimedHit } from "./hit-dedupe";
import { createVoiceListener, type VoiceListener } from "./listener";
import type { TaughtPattern } from "./matcher";
import type { SessionCountingMode } from "./mode";
import { createPauseCounter } from "./pause-count";
import { phraseTokens } from "./phrase-tokens";
import { type PhraseKey, VOICE_PHRASES } from "./phrases";
import { createTeachRecorder, createTemplateCounter } from "./template-count";

/**
 * Starts one on-device listening pipeline for a session. Used by the counter
 * hook and by calibration:
 * - "spotter": capture → VAD → FastConformer → CTC spotter → de-dupe (needs
 *   `phrase`; the ORT session is created here and released by `stop()`);
 * - "pause": capture → VAD, one hit per spoken burst (D24 fallback);
 * - "template": capture → VAD → taught-pattern matcher (D48–D51, needs `pattern`);
 * - "teach": capture → VAD, each burst handed to `onSample` (never stored).
 * Throws a `PracticeError` with a stable code; nothing about the audio is reported.
 */

export type VoicePipelineOptions = {
  capture: RecitationCapture;
  mode: SessionCountingMode | "teach";
  /** Spotter only. */
  phrase?: PhraseKey | null;
  /** Template only. */
  pattern?: TaughtPattern | null;
  threshold?: () => number;
  onHit: (hit: TimedHit) => void;
  /** Teach only: one spoken burst (16 kHz PCM, in memory only). */
  onSample?: (pcm: Float32Array) => void;
  /** Teach only: the speech ran far longer than one zikr. */
  onTooLong?: () => void;
  onSpeech?: (speaking: boolean) => void;
  onLevel?: (db: number) => void;
  /** The model or the microphone failed mid-session. */
  onFailure: (code: PracticeErrorCode) => void;
  /** A call, Siri, another app or another in-app listener took the microphone. */
  onInterrupted: () => void;
};

export type VoicePipeline = {
  mute(durationMs: number): void;
  /** Stop capture, drop pending audio, release the model and the mic. Idempotent. */
  stop(): Promise<void>;
};

export async function startVoicePipeline(options: VoicePipelineOptions): Promise<VoicePipeline> {
  let runner: FastConformerRunner | null = null;
  let listener: VoiceListener | null = null;
  let stopped = false;

  const stop = async () => {
    if (stopped) return;
    stopped = true;
    listener?.dispose();
    releaseMicrophone(preempted);
    const steps = [
      () => options.capture.stop(),
      () => runner?.release(),
      () => restorePlaybackMode(),
    ];
    for (const step of steps) {
      try {
        await step();
      } catch {
        // best effort — the session is over either way
      }
    }
  };

  // Another feature claimed the mic: stop, then tell the screen (same as a call).
  const preempted = async () => {
    if (stopped) return;
    await stop();
    options.onInterrupted();
  };

  try {
    await claimMicrophone("tasbeeh-voice", preempted);
    if (options.mode !== "spotter") {
      // No model: pause count (D24), taught pattern (D48–D51) or teaching.
      const { onHit, onSpeech, onLevel } = options;
      let modelFree: VoiceListener;
      if (options.mode === "teach") {
        modelFree = createTeachRecorder({
          onSample: (pcm) => options.onSample?.(pcm),
          onTooLong: options.onTooLong,
          onSpeech,
          onLevel,
        });
      } else if (options.mode === "template" && options.pattern) {
        modelFree = createTemplateCounter({ pattern: options.pattern, onHit, onSpeech, onLevel });
      } else {
        modelFree = createPauseCounter({ onHit, onSpeech, onLevel });
      }
      listener = modelFree;
      await enterRecordMode();
      await options.capture.start(
        (pcm) => modelFree.feed(pcm),
        (status) => {
          if (status.interrupted) options.onInterrupted();
        },
      );
      return {
        mute(durationMs) {
          modelFree.mute(durationMs);
        },
        stop,
      };
    }
    if (!options.phrase) throw new PracticeError("engine-init-failed");
    const phrase = options.phrase;
    const { assets } = await loadInstalledModel();
    runner = await openFastConformerRunner(assets);
    if (stopped) {
      await runner.release();
      throw new PracticeError("interrupted");
    }
    const tokens = phraseTokens();
    listener = createVoiceListener({
      runner,
      phrase: compilePhrase(tokens.phrases[phrase].variants),
      vocab: { blankId: tokens.blankId, fillers: tokens.fillers },
      minGapMs: VOICE_PHRASES[phrase].minMs,
      threshold: options.threshold ?? (() => 0),
      onHit: options.onHit,
      onSpeech: options.onSpeech,
      onLevel: options.onLevel,
      onError: (error) => {
        void stop();
        options.onFailure(toPracticeErrorCode(error, "engine-runtime"));
      },
    });
    await enterRecordMode();
    const active = listener;
    await options.capture.start(
      (pcm) => active.feed(pcm),
      (status) => {
        if (status.interrupted) options.onInterrupted();
      },
    );
  } catch (error) {
    await stop();
    throw error instanceof PracticeError
      ? error
      : new PracticeError(toPracticeErrorCode(error, "capture-failed"), (error as Error)?.message);
  }

  return {
    mute(durationMs) {
      listener?.mute(durationMs);
    },
    stop,
  };
}
