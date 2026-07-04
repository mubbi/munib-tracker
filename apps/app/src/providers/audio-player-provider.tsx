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
import { Platform } from "react-native";
import { buildAudioActivity } from "@/lib/continue-activity";
import { triggerHaptic } from "@/lib/haptics";
import { recordContinueActivity } from "@/stores/continue-store";
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
  /** True while the player is fetching/decoding audio and not yet ready. */
  isBuffering: boolean;
  /** True once the current source has finished loading and can play. */
  isLoaded: boolean;
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
  jumpTo: (index: number) => void;
  setRate: (rate: number) => void;
  cycleLoopMode: () => void;
  stop: () => void;
}

export const AUDIO_SPEEDS = [0.5, 1, 1.5, 2];

/** Cycle order: off → repeat all → repeat once → off. */
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

  // On web, expo-audio's fire-and-forget `play()` rejects its pending media
  // promise when playback is interrupted by a near-immediate `pause()`/`replace()`
  // (rapid toggling or switching tracks). Because `play()` returns void we can't
  // `.catch()` it, so this surfaces as an "Uncaught (in promise) AbortError".
  // Swallow only that specific benign rejection; let everything else through.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { name?: string; message?: string } | undefined;
      if (reason?.name === "AbortError" && /play\(\)/.test(String(reason.message ?? ""))) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);

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

      const track = tracks[startIndex];
      const href = options?.sourceHref;
      if (track && href) {
        const activity = buildAudioActivity(href, track);
        if (activity) recordContinueActivity(activity);
      }
    },
    [playIndex],
  );

  const toggle = useCallback(() => {
    // Instant tactile feedback on the tap, before the (possibly buffering) audio
    // engine responds.
    triggerHaptic("light");
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

  const jumpTo = useCallback(
    (i: number) => {
      const q = queueRef.current;
      if (i < 0 || i >= q.length) return;
      setIndex(i);
      playIndex(q, i);
    },
    [playIndex],
  );

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

  // Auto-advance when a track finishes. "one" replays the current track a single
  // time and then clears itself (play again once, not forever); otherwise advance.
  useEffect(() => {
    if (!status.didJustFinish) return;
    if (loopRef.current === "one") {
      loopRef.current = "off";
      setLoopMode("off");
      playIndex(queueRef.current, indexRef.current);
    } else {
      next();
    }
  }, [status.didJustFinish, next, playIndex]);

  const isLoaded = status.isLoaded ?? false;
  // Treat an unloaded source with a live track as "buffering" too, so the play
  // button spins immediately after a tap while the engine spins up, not just
  // once expo-audio flips its own `isBuffering` flag.
  const isBuffering = Boolean(current) && ((status.isBuffering ?? false) || !isLoaded);

  const value = useMemo<AudioContextValue>(
    () => ({
      current,
      queue,
      index,
      isPlaying: status.playing,
      isBuffering,
      isLoaded,
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
      jumpTo,
      setRate,
      cycleLoopMode,
      stop,
    }),
    [
      current,
      queue,
      index,
      status.playing,
      isBuffering,
      isLoaded,
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
      jumpTo,
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
