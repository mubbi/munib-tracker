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
 */
/** Per-platform ORT loader, shared with the FastConformer runner (`lib/speech`). */
export const enginePlatform: EnginePlatform = {
  async loadOrt() {
    const ort = (await import("onnxruntime-react-native")) as unknown as OrtNamespace;
    if (!ort?.InferenceSession) throw new PracticeError("runtime-unsupported");
    return ort;
  },
  async createSession(ort, assets: LoadedModelAssets) {
    if (!assets.modelPath) throw new PracticeError("model-missing");
    return ort.InferenceSession.create(assets.modelPath, {
      executionProviders: ["cpu"],
      graphOptimizationLevel: "all",
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
