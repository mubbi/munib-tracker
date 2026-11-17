import { setAudioModeAsync } from "expo-audio";
import { Platform } from "react-native";

import { PLAYBACK_AUDIO_MODE, RECORDING_AUDIO_MODE } from "@/lib/audio-session-mode";

/**
 * §7 Audio session. Before capture: record mode. After capture (and in the
 * route's cleanup `finally`): the player's exact playback mode, so the mini-player
 * does not end up on the iOS earpiece. Web ignores audio modes.
 */
export async function enterRecordMode(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await setAudioModeAsync(RECORDING_AUDIO_MODE);
  } catch {
    // Non-fatal: capture may still work in the default session.
  }
}

export async function restorePlaybackMode(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await setAudioModeAsync(PLAYBACK_AUDIO_MODE);
  } catch {
    // Non-fatal.
  }
}
