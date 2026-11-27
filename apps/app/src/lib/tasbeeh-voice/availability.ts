import { Platform } from "react-native";

import { RECITATION_MODELS } from "@/constants/recitation-models";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { FASTCONFORMER_ENGINE, isFastConformerRuntimeSupported } from "@/lib/speech/fastconformer";

import { usesModel } from "./mode";
import { isShortZikrText } from "./steps";
import type { VoiceZikr } from "./voice-zikr";

/**
 * When the hands-free (voice) toggle may appear on a counter (NF-3.20):
 * - not TV (`isPracticeAvailable()` — TV has no microphone path),
 * - a microphone capture path exists on this platform,
 * - the FastConformer engine is pinned for the platform: native always; web once
 *   its files have a browser source (`webHosted`, D18 Hugging Face mirror),
 * - an ONNX runtime is available (wasm on web, ORT on native),
 * - and the counter listens for something: any zikr (D49) — a taught zikr counts
 *   by its voice pattern, an untaught one by pauses (or by the spotter for a
 *   catalog phrase, once it ships).
 *
 * Whether the model is downloaded is NOT part of availability — the first-use
 * sheet offers the (shared) download.
 */
export function isVoiceTasbeehPlatformAvailable(captureAvailable: boolean): boolean {
  if (!isPracticeAvailable() || !captureAvailable) return false;
  // Pause-count fallback (D24) runs no model: the microphone is enough.
  if (!usesModel()) return true;
  if (Platform.OS === "web" && !RECITATION_MODELS[FASTCONFORMER_ENGINE].webHosted) return false;
  return isFastConformerRuntimeSupported();
}

/**
 * The zikr itself can be counted by voice: its Arabic (when known) is short
 * enough to say in one breath (`isShortZikrText`). A long dua pause-counts once
 * per breath, and teaching refuses a sample over 8 s, so it stays tap-counted.
 */
export function isVoiceZikrSayable(zikr: VoiceZikr): boolean {
  const arabic = zikr.entry?.arabic?.trim() ?? "";
  return arabic === "" || isShortZikrText(arabic);
}

export function isVoiceTasbeehAvailable(
  zikr: VoiceZikr | null | undefined,
  captureAvailable: boolean,
): boolean {
  return (
    zikr != null && isVoiceZikrSayable(zikr) && isVoiceTasbeehPlatformAvailable(captureAvailable)
  );
}
