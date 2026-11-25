import type { OrtNamespace } from "@/lib/quran-companion/engine/types";

import {
  createFastConformerRunner,
  FASTCONFORMER_SAMPLE_RATE,
  type OrtInferenceSession,
} from "./fastconformer-runner";

/**
 * One throw-away inference right after a speech session is created, so the
 * first real chunk does not pay ORT's first-run costs (kernel selection, arena
 * and buffer allocation, wasm JIT tiers) while the reciter is already talking.
 *
 * The feed goes through the same path the features use — the FastConformer
 * runner (`audio_signal` + `length`) or Tilawa's Zipformer runner (one chunk of
 * zero fbank frames with zero cache states) — on a throw-away runner, so no
 * feature state is touched. Warm-up is best effort: it never throws; a real
 * failure surfaces on the first real chunk exactly as before.
 */

/** Half a second of silence at 16 kHz. */
export const WARM_UP_SAMPLES = FASTCONFORMER_SAMPLE_RATE / 2;

export type WarmUpKind = "fastconformer" | "zipformer";

/** Which warm-up feed fits this graph, from its input names (null → skip). */
export function warmUpKind(session: Pick<OrtInferenceSession, "inputNames">): WarmUpKind | null {
  const names = session.inputNames ?? [];
  if (names.includes("audio_signal") && names.includes("length")) return "fastconformer";
  if (names.includes("x") && names.some((n) => n.startsWith("cached_"))) return "zipformer";
  return null;
}

type ZipformerIo = { T: number; featureDim: number };
type ZipformerRunnerLike = { accept(frames: Float32Array[]): Promise<unknown> };
type TilawaWarmUpApi = {
  DEFAULT_ZIPFORMER_IO: ZipformerIo;
  ZipformerRunner: {
    fromSession(session: never, io: never, Tensor: never): ZipformerRunnerLike;
  };
};

/** Run the warm-up inference. Resolves the kind that ran, or null (skipped / failed). */
export async function warmUpSpeechSession(
  ort: Pick<OrtNamespace, "Tensor">,
  session: OrtInferenceSession,
): Promise<WarmUpKind | null> {
  try {
    const kind = warmUpKind(session);
    if (kind === "fastconformer") {
      // No release(): the runner would release the shared session.
      await createFastConformerRunner(ort, session).run(new Float32Array(WARM_UP_SAMPLES));
      return kind;
    }
    if (kind === "zipformer") {
      // Already loaded by the practice route that opens Zipformer (tilawa-adapter).
      const tilawa = (await import("@tilawa/core")) as unknown as TilawaWarmUpApi;
      const io = tilawa.DEFAULT_ZIPFORMER_IO;
      const runner = tilawa.ZipformerRunner.fromSession(
        session as never,
        io as never,
        ort.Tensor as never,
      );
      // Exactly one model chunk (T frames ≈ 0.6 s) of silent features.
      await runner.accept(Array.from({ length: io.T }, () => new Float32Array(io.featureDim)));
      return kind;
    }
  } catch {
    // Best effort only.
  }
  return null;
}
