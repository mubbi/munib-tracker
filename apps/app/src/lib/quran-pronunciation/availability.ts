import { Platform } from "react-native";

import { RECITATION_MODELS } from "@/constants/recitation-models";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { FASTCONFORMER_ENGINE, isFastConformerRuntimeSupported } from "@/lib/speech/fastconformer";

/**
 * When "Check pronunciation" may appear (NF-3.24) — the same gates as NF-3.20:
 * - not TV (`isPracticeAvailable()` — TV has no microphone path),
 * - a microphone capture path exists on this platform,
 * - the FastConformer engine is pinned for the platform: native always; web
 *   once its files have a browser source (`webHosted`, D18),
 * - an ONNX runtime is available.
 *
 * Whether the model is downloaded is NOT part of availability — the check screen
 * offers the (shared) download.
 */
export function isPronunciationCheckAvailable(captureAvailable: boolean): boolean {
  if (!isPracticeAvailable() || !captureAvailable) return false;
  if (Platform.OS === "web" && !RECITATION_MODELS[FASTCONFORMER_ENGINE].webHosted) return false;
  return isFastConformerRuntimeSupported();
}

/** Platform-only gate for entry points that can't see a capture yet (menus, action sheets). */
export function isPronunciationCheckPlatformAvailable(): boolean {
  if (!isPracticeAvailable()) return false;
  if (Platform.OS === "web" && !RECITATION_MODELS[FASTCONFORMER_ENGINE].webHosted) return false;
  return true;
}
