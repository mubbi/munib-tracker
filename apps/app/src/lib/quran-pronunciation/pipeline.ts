import { enterRecordMode, restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import type { RecitationCapture } from "@/lib/quran-companion/audio/types";
import { PracticeError, toPracticeErrorCode } from "@/lib/quran-companion/error-codes";
import type { LoadedModelAssets } from "@/lib/quran-companion/model/types";
import { isFastConformerManifest, openFastConformerRunner } from "@/lib/speech/fastconformer";
import type { CtcLogprobs, FastConformerRunner } from "@/lib/speech/fastconformer-runner";
import { claimMicrophone, type MicRelease, releaseMicrophone } from "@/lib/speech/mic-owner";
import { loadInstalledModel } from "@/stores/quran-listener-store";

import {
  buildPieceIndex,
  corpusIndex,
  type PieceIndex,
  type QuranCorpusRow,
  type VocabJson,
} from "./ayah-tokens";
import { MAX_TAKE_MS } from "./session";

/**
 * On-device recorder + model run for pronunciation checks (NF-3.24, D3):
 *
 *   RecitationCapture (16 kHz, memory only) → take buffer (≤ 40 s)
 *     → shared FastConformer runner (one pass over the take) → CTC logprobs
 *
 * The runner is opened once per screen and released by `dispose()`. Audio never
 * leaves the device and is never written to disk; the take is dropped as soon
 * as the model has run (the caller keeps nothing but word states). Throws
 * `PracticeError`s with stable codes only.
 */

const SAMPLE_RATE = 16_000;
const MAX_SAMPLES = (MAX_TAKE_MS / 1000) * SAMPLE_RATE;

export type PronunciationModel = {
  pieces: PieceIndex;
  corpus: ReadonlyMap<string, string>;
  version: string;
};

export type TakeCallbacks = {
  onLevel?: (level: number) => void;
  /** A call, Siri, another app or another in-app listener took the microphone. */
  onInterrupted?: () => void;
  /** The take reached {@link MAX_TAKE_MS}. */
  onCap?: () => void;
};

export type PronunciationRecorder = {
  readonly model: PronunciationModel;
  /** Claim the mic and start a take. */
  startTake(capture: RecitationCapture, callbacks?: TakeCallbacks): Promise<void>;
  /** Stop the take and run the model over it. `null` when the take was too short. */
  finishTake(minMs: number): Promise<CtcLogprobs | null>;
  /** Stop the take and drop it. */
  cancelTake(): Promise<void>;
  /** Release the model session (screen closed). */
  dispose(): Promise<void>;
};

function levelOf(pcm: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) sum += pcm[i] * pcm[i];
  const db = 10 * Math.log10(sum / Math.max(1, pcm.length) + 1e-12);
  return Math.max(0, Math.min(1, (db + 60) / 50));
}

export function modelFromAssets(assets: LoadedModelAssets, version: string): PronunciationModel {
  const vocab = assets.json["vocab.json"] as VocabJson | undefined;
  const meta = assets.json["export_metadata.json"] as { blank_id?: number } | undefined;
  const quran = assets.json["quran.json"] as QuranCorpusRow[] | undefined;
  if (!vocab || !Array.isArray(quran)) throw new PracticeError("model-missing");
  return {
    pieces: buildPieceIndex(vocab, meta?.blank_id ?? 1024),
    corpus: corpusIndex(quran),
    version,
  };
}

export async function openPronunciationRecorder(): Promise<PronunciationRecorder> {
  const { manifest, assets } = await loadInstalledModel();
  // Pronunciation needs FastConformer's CTC output (Zipformer is phoneme-level).
  if (!isFastConformerManifest(manifest)) throw new PracticeError("model-missing");
  const model = modelFromAssets(assets, manifest.version);
  let runner: FastConformerRunner | null = await openFastConformerRunner(assets);
  let capture: RecitationCapture | null = null;
  let chunks: Float32Array[] = [];
  let samples = 0;
  let recording = false;
  /** This take's mic-owner preemption handler (stable for the take). */
  let onPreempted: MicRelease = cancelTake;

  const stopCapture = async () => {
    if (!recording) return;
    recording = false;
    releaseMicrophone(onPreempted);
    try {
      await capture?.stop();
    } catch {
      // already stopped
    }
    try {
      await restorePlaybackMode();
    } catch {
      // best effort
    }
  };

  async function cancelTake() {
    await stopCapture();
    chunks = [];
    samples = 0;
  }

  return {
    model,
    async startTake(nextCapture, callbacks = {}) {
      if (!runner) throw new PracticeError("engine-init-failed");
      await cancelTake();
      // Another feature claimed the mic: stop capture (keep the take) and let the
      // screen finish it, exactly like a call interrupting.
      onPreempted = async () => {
        if (!recording) return;
        await stopCapture();
        callbacks.onInterrupted?.();
      };
      await claimMicrophone("pronunciation", onPreempted);
      capture = nextCapture;
      chunks = [];
      samples = 0;
      recording = true;
      try {
        await enterRecordMode();
        await nextCapture.start(
          (pcm) => {
            if (!recording) return;
            if (samples >= MAX_SAMPLES) return;
            const room = MAX_SAMPLES - samples;
            const part = pcm.length > room ? pcm.slice(0, room) : pcm.slice();
            chunks.push(part);
            samples += part.length;
            callbacks.onLevel?.(levelOf(pcm));
            if (samples >= MAX_SAMPLES) callbacks.onCap?.();
          },
          (status) => {
            if (status.interrupted) callbacks.onInterrupted?.();
          },
        );
      } catch (error) {
        await cancelTake();
        throw error instanceof PracticeError
          ? error
          : new PracticeError(toPracticeErrorCode(error, "capture-failed"));
      }
    },
    async finishTake(minMs) {
      await stopCapture();
      const take = new Float32Array(samples);
      let at = 0;
      for (const chunk of chunks) {
        take.set(chunk, at);
        at += chunk.length;
      }
      chunks = [];
      samples = 0;
      if ((take.length / SAMPLE_RATE) * 1000 < minMs) return null;
      if (!runner) throw new PracticeError("engine-init-failed");
      try {
        return await runner.run(take);
      } catch (error) {
        throw new PracticeError(toPracticeErrorCode(error, "engine-runtime"));
      }
    },
    cancelTake,
    async dispose() {
      await cancelTake();
      const r = runner;
      runner = null;
      await r?.release();
    },
  };
}
