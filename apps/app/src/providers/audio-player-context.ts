import { createContext, useContext } from "react";

import type { AudioTrack, LoopMode } from "@/providers/audio-player-types";

export type { AudioTrack, LoopMode };

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
  position: number;
  duration: number;
  /** Elapsed time across the whole queue (sum of prior tracks + current position). */
  queuePosition: number;
  /** Total duration across the whole queue. */
  queueDuration: number;
  /** Smoothed 0–1 progress across the queue (for progress bars). */
  queueProgress: number;
  /** True when playback has reached the end of the queue (loop off). */
  isQueueFinished: boolean;
  rate: number;
  volume: number;
  loopMode: LoopMode;
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
  cycleLoopMode: () => void;
  stop: () => void;
  /** Sync read of engine playback time (for rAF-driven progress UI). */
  readPlaybackSeconds: () => number;
}

/** Leaf module — keep free of provider/engine imports so Metro never duplicates this context. */
export const AudioContext = createContext<AudioContextValue | null>(null);

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
  position: 0,
  duration: 0,
  queuePosition: 0,
  queueDuration: 0,
  queueProgress: 0,
  isQueueFinished: false,
  rate: 1,
  volume: 1,
  loopMode: "off",
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
  cycleLoopMode: () => {},
  stop: () => {},
  readPlaybackSeconds: () => 0,
};

export function useAudioPlayerContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioPlayerContext must be used within an AudioPlayerProvider");
  return context;
}
