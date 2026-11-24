import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect } from "react";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/** Tag so audio keep-awake does not fight other features using the default tag. */
export const AUDIO_KEEP_AWAKE_TAG = "munib-audio-playback";

function isKeepAwakeSupported(): boolean {
  switch (Platform.OS) {
    case "ios":
    case "android":
      return true;
    default:
      return false;
  }
}

/**
 * Hold or release one feature's screen wake lock. Each feature uses its own tag
 * (audio playback, Qur'an practice, pronunciation, voice tasbeeh) so releasing
 * one never drops another's. iOS / Android phones only (no-op on web and TV);
 * failures are swallowed so the feature is never blocked. Safe to call repeatedly.
 */
export async function setTaggedKeepAwake(tag: string, active: boolean): Promise<void> {
  if (!isKeepAwakeSupported()) return;
  if (isTV()) return;
  try {
    if (active) {
      await activateKeepAwakeAsync(tag);
      return;
    }
    await deactivateKeepAwake(tag);
  } catch {
    // Wake-lock APIs can fail on some devices; never block the feature for this.
  }
}

/**
 * Prevent auto-lock while the shared audio player is actively playing so users
 * can keep reading on-screen without touching (Qur'an, adhkar, TTS, etc.).
 */
export function setAudioKeepAwake(active: boolean): Promise<void> {
  return setTaggedKeepAwake(AUDIO_KEEP_AWAKE_TAG, active);
}

/**
 * Hold the screen awake while recitation/TTS is playing or translation TTS is
 * speaking after an ayah. Releases on pause, stop, or unmount.
 */
export function useAudioKeepAwake(isPlaying: boolean, isSpeakingTranslation = false): void {
  const active = isPlaying ? true : isSpeakingTranslation;
  useEffect(() => {
    if (!active) {
      return;
    }
    void setAudioKeepAwake(true);
    return () => {
      void setAudioKeepAwake(false);
    };
  }, [active]);
}
