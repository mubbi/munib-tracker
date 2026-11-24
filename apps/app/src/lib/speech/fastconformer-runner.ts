import type { OrtNamespace } from "@/lib/quran-companion/engine/types";

/**
 * Shared FastConformer CTC runner (NF-3.20, reused by NF-3.24 pronunciation and
 * NF-3.15 coaching). One call = one window of 16 kHz mono audio in, the model's
 * raw CTC log-probabilities out. Preprocessing (features) is inside the ONNX
 * graph, so the caller only hands it PCM.
 *
 * Measured on the pinned `fastconformer_full_mixed.onnx` (2026-11-23):
 * - input `audio_signal` float32 [1, N] + `length` int64 [1]
 * - output `log_probs` float32 [1, T, 1025], one frame per ~80 ms
 * - vocab = SentencePiece BPE pieces (`vocab.json`), blank id 1024; the "mixed"
 *   model emits both bare and diacritised (harakat) pieces.
 *
 * Runs entirely on the device (D3): native `onnxruntime-react-native`, web
 * `onnxruntime-web` (wasm). Never OS or cloud speech recognition.
 */

/** Log-probabilities in row-major order: `logprobs[t * vocabSize + v]`. */
export type CtcLogprobs = {
  logprobs: Float32Array;
  timeSteps: number;
  vocabSize: number;
};

export type OrtInferenceSession = Awaited<ReturnType<OrtNamespace["InferenceSession"]["create"]>>;

export type FastConformerRunner = {
  /** Run one window. Resolves the CTC posteriors for that window only (no state). */
  run(audio16kMono: Float32Array): Promise<CtcLogprobs>;
  /** Release the ORT session. Safe to call twice. */
  release(): Promise<void>;
};

export const FASTCONFORMER_SAMPLE_RATE = 16_000;
/** Encoder frame hop in ms (8× subsampling of 10 ms features). */
export const FASTCONFORMER_FRAME_MS = 80;
/** CTC blank (export_metadata.json `blank_id`). */
export const FASTCONFORMER_BLANK_ID = 1024;
export const FASTCONFORMER_VOCAB_SIZE = 1025;

/** Frames the model emits for `samples` of audio (used to map frame ↔ time). */
export function framesToMs(frames: number): number {
  return frames * FASTCONFORMER_FRAME_MS;
}

export function createFastConformerRunner(
  ort: Pick<OrtNamespace, "Tensor">,
  session: OrtInferenceSession,
): FastConformerRunner {
  let released = false;
  return {
    async run(audio) {
      if (released) throw new Error("runner released");
      const input = new ort.Tensor("float32", audio, [1, audio.length]);
      const length = new ort.Tensor("int64", BigInt64Array.from([BigInt(audio.length)]), [1]);
      const results = await session.run({ audio_signal: input, length });
      const output = results[session.outputNames[0]];
      const [, timeSteps, vocabSize] = output.dims as number[];
      const data =
        output.data instanceof Float32Array
          ? output.data
          : Float32Array.from(output.data as ArrayLike<number>);
      return { logprobs: data, timeSteps, vocabSize };
    },
    async release() {
      if (released) return;
      released = true;
      try {
        await session.release?.();
      } catch {
        // already released
      }
    },
  };
}

/** Greedy CTC path: best piece id per frame (used by eval tools and the greedy spotter). */
export function greedyPath({ logprobs, timeSteps, vocabSize }: CtcLogprobs): Int32Array {
  const out = new Int32Array(timeSteps);
  for (let t = 0; t < timeSteps; t++) {
    const offset = t * vocabSize;
    let best = 0;
    let bestValue = logprobs[offset];
    for (let v = 1; v < vocabSize; v++) {
      const value = logprobs[offset + v];
      if (value > bestValue) {
        bestValue = value;
        best = v;
      }
    }
    out[t] = best;
  }
  return out;
}
