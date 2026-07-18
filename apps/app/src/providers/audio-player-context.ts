import { createContext, useContext } from "react";

import type {
  AudioTrack,
  LoopMode,
  QuranRepeatPlan,
  TranslationAudioMode,
} from "@/providers/audio-player-types";

export type { AudioTrack, LoopMode, QuranRepeatPlan, TranslationAudioMode };

/**
 * High-frequency playback clock. Kept in a separate context so screens that only
 * need session state (queue / now-playing / controls) do not re-render on every
 * `currentTime` tick — that was thrashing large FlatLists during playback.
 */
export interface AudioProgressValue {
  position: number;
  /** Elapsed time across the whole queue (sum of prior tracks + current position). */
  queuePosition: number;
  /** Smoothed 0–1 progress across the queue (for progress bars). */
  queueProgress: number;
}

export interface AudioContextValue {
  current: AudioTrack | null;
  queue: AudioTrack[];
  index: number;
  /** Cached/loaded duration per track id (for live queue progress UI). */
  trackDurations: Record<string, number>;
  isPlaying: boolean;
  /** True while the player is fetching/decoding audio and not yet ready. */
  isBuffering: boolean;
  /** True while auto-advancing or skipping within a queue (suppress UI flicker). */
  isTransitioning: boolean;
  /** True once the current source has finished loading and can play. */
  isLoaded: boolean;
  duration: number;
  /** Total duration across the whole queue. */
  queueDuration: number;
  /** True when playback has reached the end of the queue (loop off). */
  isQueueFinished: boolean;
  rate: number;
  volume: number;
  loopMode: LoopMode;
  /** Quran-specific repeat plan (overrides generic loop for ayah queues when not off). */
  repeatPlan: QuranRepeatPlan;
  /** Speak translation after each Arabic ayah via native TTS. */
  translationAudio: TranslationAudioMode;
  /** True while TTS is speaking a translation. */
  isSpeakingTranslation: boolean;
  /** Route to return to for the currently-playing content (tap the mini-player). */
  sourceHref: string | null;
  play: (tracks: AudioTrack[], startIndex?: number, options?: { sourceHref?: string }) => void;
  toggle: () => void;
  seekTo: (seconds: number) => void;
  /** Seek within a multi-track queue using a queue-wide timestamp. */
  seekToQueuePosition: (seconds: number) => void;
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  /** Restart a finished queue from the first track. */
  replay: () => void;
  setRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  /**
   * Change the TTS voice for the active TTS queue and restart the current
   * segment from the live position (no-op for file/remote audio).
   */
  setTtsVoice: (voiceId: string | undefined) => void;
  cycleLoopMode: () => void;
  setRepeatPlan: (plan: QuranRepeatPlan) => void;
  setTranslationAudio: (mode: TranslationAudioMode) => void;
  stop: () => void;
  /** Sync read of engine playback time (for rAF-driven progress UI). */
  readPlaybackSeconds: () => number;
}

/** Leaf module — keep free of provider/engine imports so Metro never duplicates this context. */
export const AudioContext = createContext<AudioContextValue | null>(null);

export const AudioProgressContext = createContext<AudioProgressValue>({
  position: 0,
  queuePosition: 0,
  queueProgress: 0,
});

/** No-op context for web SSR — `expo-audio` calls `new Audio()` which Node lacks. */
export const SSR_AUDIO_CONTEXT: AudioContextValue = {
  current: null,
  queue: [],
  index: 0,
  trackDurations: {},
  isPlaying: false,
  isBuffering: false,
  isTransitioning: false,
  isLoaded: false,
  duration: 0,
  queueDuration: 0,
  isQueueFinished: false,
  rate: 1,
  volume: 1,
  loopMode: "off",
  repeatPlan: { mode: "off" },
  translationAudio: "off",
  isSpeakingTranslation: false,
  sourceHref: null,
  play: () => {},
  toggle: () => {},
  seekTo: () => {},
  seekToQueuePosition: () => {},
  next: () => {},
  previous: () => {},
  jumpTo: () => {},
  replay: () => {},
  setRate: () => {},
  setVolume: () => {},
  setTtsVoice: () => {},
  cycleLoopMode: () => {},
  setRepeatPlan: () => {},
  setTranslationAudio: () => {},
  stop: () => {},
  readPlaybackSeconds: () => 0,
};

export const SSR_AUDIO_PROGRESS: AudioProgressValue = {
  position: 0,
  queuePosition: 0,
  queueProgress: 0,
};

export function useAudioPlayerContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioPlayerContext must be used within an AudioPlayerProvider");
  return context;
}

/** Subscribe only when you need the live scrubber clock (mini-player, etc.). */
export function useAudioProgressContext(): AudioProgressValue {
  return useContext(AudioProgressContext);
}
