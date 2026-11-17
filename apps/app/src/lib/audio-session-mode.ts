import type { AudioMode } from "expo-audio";

/**
 * The playback audio-session mode the shared player configures once. Qur'an
 * practice switches to {@link RECORDING_AUDIO_MODE} for a take and restores this
 * exact object afterwards (§7 Audio session) — one constant so the two cannot drift.
 */
export const PLAYBACK_AUDIO_MODE: Partial<AudioMode> = {
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: "doNotMix",
  allowsRecording: false,
};

/** Record mode for a practice take. Capture never runs in the background. */
export const RECORDING_AUDIO_MODE: Partial<AudioMode> = {
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  interruptionMode: "doNotMix",
  allowsRecording: true,
};
