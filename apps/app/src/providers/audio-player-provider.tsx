import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

export type AudioTrack = {
  id: string;
  title: string;
  subtitle?: string;
  uri: string;
};

interface AudioContextValue {
  current: AudioTrack | null;
  queue: AudioTrack[];
  isPlaying: boolean;
  position: number;
  duration: number;
  rate: number;
  play: (tracks: AudioTrack[], startIndex?: number) => void;
  toggle: () => void;
  seekTo: (seconds: number) => void;
  next: () => void;
  previous: () => void;
  setRate: (rate: number) => void;
  stop: () => void;
}

export const AUDIO_SPEEDS = [0.5, 1, 1.5, 2];

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [rate, setRateState] = useState(1);

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
        player.replace({ uri: track.uri });
        player.setPlaybackRate(rate);
        player.play();
      } catch {
        // unsupported source / platform
      }
    },
    [player, rate],
  );

  const play = useCallback(
    (tracks: AudioTrack[], startIndex = 0) => {
      setQueue(tracks);
      setIndex(startIndex);
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

  const next = useCallback(() => {
    setIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex < queue.length) {
        playIndex(queue, nextIndex);
        return nextIndex;
      }
      return prev;
    });
  }, [queue, playIndex]);

  const previous = useCallback(() => {
    setIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex >= 0) {
        playIndex(queue, prevIndex);
        return prevIndex;
      }
      return prev;
    });
  }, [queue, playIndex]);

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

  const stop = useCallback(() => {
    try {
      player.pause();
    } catch {
      // ignore
    }
    setQueue([]);
    setIndex(0);
  }, [player]);

  // Auto-advance when a track finishes.
  useEffect(() => {
    if (status.didJustFinish) next();
  }, [status.didJustFinish, next]);

  const value = useMemo<AudioContextValue>(
    () => ({
      current,
      queue,
      isPlaying: status.playing,
      position: status.currentTime ?? 0,
      duration: status.duration ?? 0,
      rate,
      play,
      toggle,
      seekTo,
      next,
      previous,
      setRate,
      stop,
    }),
    [
      current,
      queue,
      status.playing,
      status.currentTime,
      status.duration,
      rate,
      play,
      toggle,
      seekTo,
      next,
      previous,
      setRate,
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
