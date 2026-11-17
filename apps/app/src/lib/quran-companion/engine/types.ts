import type { LoadedModelAssets } from "../model/types";
import type { CompanionEvent, EngineId, Passage } from "../types";

export type EngineMode = "tracking" | "correction";

/** §8 `RecitationEngine`: what the session screen talks to. */
export type RecitationEngine = {
  id: EngineId;
  readonly ready: boolean;
  /** Whether issues can reach "try again" (pinned constant + correction support). */
  readonly confirmsMismatches: boolean;
  start(passage: Passage, mode: EngineMode): Promise<void>;
  /** Queue 16 kHz mono PCM. Never runs two engine feeds concurrently. */
  feed(pcm16kMono: Float32Array): void;
  /** End of the take: flush the tail, emit the last events, then `completed`. */
  stop(): Promise<void>;
  dispose(): Promise<void>;
  subscribe(listener: (event: CompanionEvent) => void): () => void;
  /** Engine word list for an ayah (Uthmani), used for §6 alignment. */
  engineWords(surah: number, ayah: number): string[];
};

/** A minimal `ort` namespace shape both runtimes satisfy. */
export type OrtNamespace = {
  InferenceSession: {
    create(
      model: string | ArrayBuffer | Uint8Array,
      options?: Record<string, unknown>,
    ): Promise<{
      run(
        feeds: Record<string, unknown>,
      ): Promise<Record<string, { data: unknown; dims: readonly number[] }>>;
      outputNames: readonly string[];
      release?: () => Promise<void>;
    }>;
  };
  Tensor: new (type: string, data: unknown, dims: readonly number[]) => unknown;
  env?: { wasm?: { numThreads?: number; wasmPaths?: string } };
};

/** Per-platform pieces the shared adapter needs. */
export type EnginePlatform = {
  loadOrt(): Promise<OrtNamespace>;
  /** Create the inference session from what the model store loaded. */
  createSession(
    ort: OrtNamespace,
    assets: LoadedModelAssets,
  ): ReturnType<OrtNamespace["InferenceSession"]["create"]>;
};
