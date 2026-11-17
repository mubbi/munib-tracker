import type { AudioMode } from "expo-audio";

/**
 * The playback audio-session mode the shared player configures once. Qur'an
 * practice switches to {@link RECORDING_AUDIO_MODE} for a take and restores this
 * exact object afterwards (§7 Audio session) — one constant so the two cannot drift.
 */
export const PLAYBACK_AUDIO_MODE: Partial<AudioMode> = {
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  // Persistent exclusive focus (expo-audio 58; Android AUDIOFOCUS_GAIN, iOS no
  // "notify others on deactivation"). Qur'an recitation and the Adhan are
  // long-form, lock-screen-controlled playback, and the A/B queue briefly
  // abandons focus between ayahs: with transient `doNotMix` another app's music
  // would resume in every gap. Lock-screen controls accept either mode.
  interruptionMode: "doNotMixPersistent",
  allowsRecording: false,
};

/**
 * Record mode for a practice take. Capture never runs in the background. A take
 * is short, so transient `doNotMix` is right here.
 */
export const RECORDING_AUDIO_MODE: Partial<AudioMode> = {
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  interruptionMode: "doNotMix",
  allowsRecording: true,
};
