import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/** Tag so audio keep-awake does not fight other features using the default tag. */
export const AUDIO_KEEP_AWAKE_TAG = "munib-audio-playback";

function isKeepAwakeSupported(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}

/**
 * Prevent auto-lock while the shared audio player is actively playing so users
 * can keep reading on-screen without touching (Qur'an, adhkar, TTS, etc.).
 * No-op on web/TV. Safe to call repeatedly.
 */
export async function setAudioKeepAwake(active: boolean): Promise<void> {
  if (!isKeepAwakeSupported() || isTV()) return;
  try {
    if (active) {
      await activateKeepAwakeAsync(AUDIO_KEEP_AWAKE_TAG);
    } else {
      await deactivateKeepAwake(AUDIO_KEEP_AWAKE_TAG);
    }
  } catch {
    // Wake-lock APIs can fail on some devices; never block playback for this.
  }
}
