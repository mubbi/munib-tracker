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
import { usesModel } from "./mode";
import { createPauseCounter } from "./pause-count";
import { phraseTokens } from "./phrase-tokens";
import { type PhraseKey, VOICE_PHRASES } from "./phrases";

/**
 * Starts one on-device listening pipeline (capture → VAD → FastConformer →
 * spotter → de-dupe) for a phrase. Used by the counter hook and by calibration.
 * The ORT session is created here and released by `stop()`. Throws a
 * `PracticeError` with a stable code; nothing about the audio is reported.
 */

export type VoicePipelineOptions = {
  capture: RecitationCapture;
  phrase: PhraseKey;
  threshold: () => number;
  onHit: (hit: TimedHit) => void;
  onSpeech?: (speaking: boolean) => void;
  onLevel?: (db: number) => void;
  /** The model or the microphone failed mid-session. */
  onFailure: (code: PracticeErrorCode) => void;
  /** A call, Siri or another app took the microphone. */
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
    releaseMicrophone(stop);
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

  try {
    await claimMicrophone("tasbeeh-voice", stop);
    if (!usesModel()) {
      // D24 fallback: count each spoken burst; no model is loaded.
      listener = createPauseCounter({
        onHit: options.onHit,
        onSpeech: options.onSpeech,
        onLevel: options.onLevel,
      });
      await enterRecordMode();
      const pauseListener = listener;
      await options.capture.start(
        (pcm) => pauseListener.feed(pcm),
        (status) => {
          if (status.interrupted) options.onInterrupted();
        },
      );
      return {
        mute(durationMs) {
          pauseListener.mute(durationMs);
        },
        stop,
      };
    }
    const { assets } = await loadInstalledModel();
    runner = await openFastConformerRunner(assets);
    if (stopped) {
      await runner.release();
      throw new PracticeError("interrupted");
    }
    const tokens = phraseTokens();
    listener = createVoiceListener({
      runner,
      phrase: compilePhrase(tokens.phrases[options.phrase].variants),
      vocab: { blankId: tokens.blankId, fillers: tokens.fillers },
      minGapMs: VOICE_PHRASES[options.phrase].minMs,
      threshold: options.threshold,
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
