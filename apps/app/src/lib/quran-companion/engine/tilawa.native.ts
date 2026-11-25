import { acquireSpeechSession, speechSessionKey } from "@/lib/speech/session-cache";
import { warmUpSpeechSession } from "@/lib/speech/warm-up";

import { PracticeError } from "../error-codes";
import type { LoadedModelAssets } from "../model/types";
import type { EngineId } from "../types";
import { createTilawaEngine } from "./tilawa-adapter";
import type { EnginePlatform, OrtNamespace, RecitationEngine } from "./types";

/**
 * iOS / Android: `onnxruntime-react-native`. RN cannot hand ORT the model as an
 * ArrayBuffer, so the session is created from the downloaded file's *path* and
 * passed to Tilawa with the runtime's `Tensor` (Tilawa README, React Native).
 * TV builds resolve `onnxruntime-react-native` to a stub (metro.config.js) and
 * never reach this code (`isPracticeAvailable()`).
 *
 * Sessions are shared and kept warm by `lib/speech/session-cache` (practice,
 * pronunciation check and hands-free tasbeeh lease the same FastConformer
 * session) and get one warm-up inference when created (`lib/speech/warm-up`).
 */

/**
 * Only options `onnxruntime-react-native` 1.24.3 parses (cpp/SessionUtils.cpp).
 *
 * - CPU EP only. XNNPACK / CoreML / NNAPI need per-device measurements first
 *   (docs/BACKLOG.md). Note: a plain `"cpu"` entry makes SessionUtils call
 *   `AppendExecutionProvider_CPU(0)` (`useArena` unset); unchanged here.
 * - `intraOpNumThreads: 2`: ORT's default is one intra-op thread per physical
 *   core, all spinning during a run. Two leave cores free for audio capture,
 *   the JS thread and UI while a chunk is decoded
 *   (onnxruntime.ai/docs/performance/tune-performance/threading.html).
 *   Thread count is a device-QA tuning item, not a measured optimum.
 * - `enableCpuMemArena` stays at ORT's default.
 */
export const NATIVE_SESSION_OPTIONS = {
  executionProviders: ["cpu"],
  graphOptimizationLevel: "all",
  intraOpNumThreads: 2,
} as const;

/** Per-platform ORT loader, shared with the FastConformer runner (`lib/speech`). */
export const enginePlatform: EnginePlatform = {
  async loadOrt() {
    const ort = (await import("onnxruntime-react-native")) as unknown as OrtNamespace;
    if (!ort?.InferenceSession) throw new PracticeError("runtime-unsupported");
    return ort;
  },
  async createSession(ort, assets: LoadedModelAssets) {
    const modelPath = assets.modelPath;
    const key = speechSessionKey(assets);
    if (!modelPath || !key) throw new PracticeError("model-missing");
    return acquireSpeechSession(key, async () => {
      const session = await ort.InferenceSession.create(modelPath, { ...NATIVE_SESSION_OPTIONS });
      await warmUpSpeechSession(ort, session);
      return session;
    });
  },
};

export function createPlatformEngine(
  engine: EngineId,
  assets: LoadedModelAssets,
): Promise<RecitationEngine> {
  return createTilawaEngine(engine, assets, enginePlatform);
}

export function isEngineRuntimeSupported(): boolean {
  return true;
}
