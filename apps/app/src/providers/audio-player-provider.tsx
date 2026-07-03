import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

export type AudioTrack = {
  id: string;
  title: string;
  subtitle?: string;
  uri: string;
  /** Bundled asset module (from `require()`), used instead of `uri` when set. */
  source?: number;
};

export type LoopMode = "off" | "all" | "one";

interface AudioContextValue {
  current: AudioTrack | null;
  queue: AudioTrack[];
  index: number;
  isPlaying: boolean;
  position: number;
  duration: number;
  rate: number;
  loopMode: LoopMode;
  /** Route to return to for the currently-playing content (tap the mini-player). */
  sourceHref: string | null;
  play: (tracks: AudioTrack[], startIndex?: number, options?: { sourceHref?: string }) => void;
  toggle: () => void;
  seekTo: (seconds: number) => void;
  next: () => void;
  previous: () => void;
  setRate: (rate: number) => void;
  cycleLoopMode: () => void;
  stop: () => void;
}

export const AUDIO_SPEEDS = [0.5, 1, 1.5, 2];

/** Cycle order: off → repeat all → repeat one → off. */
const LOOP_CYCLE: LoopMode[] = ["off", "all", "one"];

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [rate, setRateState] = useState(1);
  const [loopMode, setLoopMode] = useState<LoopMode>("off");
  const [sourceHref, setSourceHref] = useState<string | null>(null);

  // Refs keep the finish handler current without re-subscribing every render.
  const indexRef = useRef(0);
  indexRef.current = index;
  const loopRef = useRef<LoopMode>("off");
  loopRef.current = loopMode;
  const queueRef = useRef<AudioTrack[]>(queue);
  queueRef.current = queue;

  const current = queue[index] ?? null;
  const prefsReady = usePreferencesReady();

  // Apply the saved playback speed once preferences have loaded, and re-apply if
  // the underlying player instance changes.
  useEffect(() => {
    if (!prefsReady) return;
    const saved = preferencesStore.getState().prefs.audioSpeed;
    if (saved) {
      setRateState(saved);
      try {
        player.setPlaybackRate(saved);
      } catch {
        // player not ready
      }
    }
  }, [prefsReady, player]);

  const playIndex = useCallback(
    (tracks: AudioTrack[], startIndex: number) => {
      const track = tracks[startIndex];
      if (!track) return;
      try {
        // Bundled assets are `require()`d module ids; remote tracks use a URI.
        player.replace(track.source ?? { uri: track.uri });
        player.setPlaybackRate(rate);
        player.play();
      } catch {
        // unsupported source / platform
      }
    },
    [player, rate],
  );

  const play = useCallback(
    (tracks: AudioTrack[], startIndex = 0, options?: { sourceHref?: string }) => {
      setQueue(tracks);
      setIndex(startIndex);
      setSourceHref(options?.sourceHref ?? null);
      playIndex(tracks, startIndex);
    },
    [playIndex],
  );

  const toggle = useCallback(() => {
    try {
      if (status.playing) player.pause();
      else player.play();
    } catch {
      // ignore
    }
  }, [player, status.playing]);

  const seekTo = useCallback(
    (seconds: number) => {
      void player.seekTo(seconds).catch(() => {});
    },
    [player],
  );

  // Advance to the next track; wrap to the start when repeating the whole queue.
  const next = useCallback(() => {
    setIndex((prev) => {
      const q = queueRef.current;
      const nextIndex = prev + 1;
      if (nextIndex < q.length) {
        playIndex(q, nextIndex);
        return nextIndex;
      }
      if (loopRef.current === "all" && q.length > 0) {
        playIndex(q, 0);
        return 0;
      }
      return prev;
    });
  }, [playIndex]);

  const previous = useCallback(() => {
    setIndex((prev) => {
      const q = queueRef.current;
      const prevIndex = prev - 1;
      if (prevIndex >= 0) {
        playIndex(q, prevIndex);
        return prevIndex;
      }
      if (loopRef.current === "all" && q.length > 0) {
        const last = q.length - 1;
        playIndex(q, last);
        return last;
      }
      return prev;
    });
  }, [playIndex]);

  const setRate = useCallback(
    (nextRate: number) => {
      setRateState(nextRate);
      try {
        player.setPlaybackRate(nextRate);
      } catch {
        // ignore
      }
      void preferencesStore.getState().update({ audioSpeed: nextRate });
    },
    [player],
  );

  const cycleLoopMode = useCallback(() => {
    setLoopMode((prev) => LOOP_CYCLE[(LOOP_CYCLE.indexOf(prev) + 1) % LOOP_CYCLE.length]);
  }, []);

  const stop = useCallback(() => {
    try {
      player.pause();
    } catch {
      // ignore
    }
    setQueue([]);
    setIndex(0);
    setSourceHref(null);
  }, [player]);

  // Auto-advance when a track finishes — repeat-one replays, otherwise advance.
  useEffect(() => {
    if (!status.didJustFinish) return;
    if (loopRef.current === "one") {
      playIndex(queueRef.current, indexRef.current);
    } else {
      next();
    }
  }, [status.didJustFinish, next, playIndex]);

  const value = useMemo<AudioContextValue>(
    () => ({
      current,
      queue,
      index,
      isPlaying: status.playing,
      position: status.currentTime ?? 0,
      duration: status.duration ?? 0,
      rate,
      loopMode,
      sourceHref,
      play,
      toggle,
      seekTo,
      next,
      previous,
      setRate,
      cycleLoopMode,
      stop,
    }),
    [
      current,
      queue,
      index,
      status.playing,
      status.currentTime,
      status.duration,
      rate,
      loopMode,
      sourceHref,
      play,
      toggle,
      seekTo,
      next,
      previous,
      setRate,
      cycleLoopMode,
      stop,
    ],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioPlayerContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioPlayerContext must be used within an AudioPlayerProvider");
  return context;
}
