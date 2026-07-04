import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { prefetchAudioUri, resolveCachedAudioUri } from "@/lib/audio-cache";
import { applyPlaybackRate } from "@/lib/audio-playback-rate";
import {
  queuePosition as computeQueuePosition,
  getCachedTrackDuration,
  locateQueuePosition,
  prefetchTrackDurations,
  queueDuration,
  queueDurationForProgress,
  queueStartBoundary,
} from "@/lib/audio-queue-timing";
import { applyVolume } from "@/lib/audio-volume";
import { buildAudioActivity } from "@/lib/continue-activity";
import { triggerHaptic } from "@/lib/haptics";
import { recordContinueActivity } from "@/stores/continue-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

export type AudioTrack = {
  id: string;
  title: string;
  subtitle?: string;
  /** Short preview shown in the expanded player playlist (e.g. ayah opening). */
  preview?: string;
  /** Expanded-player playlist primary line (defaults to subtitle || title). */
  playlistPrimary?: string;
  /** Expanded-player playlist secondary line (defaults to preview). */
  playlistSecondary?: string;
  /** When true, `playlistPrimary` uses Arabic typography. */
  playlistPrimaryRtl?: boolean;
  uri: string;
  /** Bundled asset module (from `require()`), used instead of `uri` when set. */
  source?: number;
};

export type LoopMode = "off" | "all" | "one";

interface AudioContextValue {
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

export const AUDIO_SPEEDS = [0.5, 1, 1.5, 2];

/** Cycle order: off → repeat all → repeat once → off. */
const LOOP_CYCLE: LoopMode[] = ["off", "all", "one"];

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>({});
  const [rate, setRateState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [loopMode, setLoopMode] = useState<LoopMode>("off");
  const [sourceHref, setSourceHref] = useState<string | null>(null);
  const [queueFinished, setQueueFinished] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  /** User explicitly paused; auto-advance queues ignore raw `playing` gaps between tracks. */
  const [userPaused, setUserPaused] = useState(false);

  // Refs keep the finish handler current without re-subscribing every render.
  const indexRef = useRef(0);
  indexRef.current = index;
  const loopRef = useRef<LoopMode>("off");
  loopRef.current = loopMode;
  const queueRef = useRef<AudioTrack[]>(queue);
  queueRef.current = queue;
  const trackDurationsRef = useRef<Record<string, number>>(trackDurations);
  trackDurationsRef.current = trackDurations;
  const pendingSeekRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionRef = useRef(false);
  const transitionStartedAtRef = useRef(0);
  const stableQueueDurationRef = useRef(0);
  const stableQueuePositionRef = useRef(0);
  // Engine time at the moment a transition began. Lets us detect when the new
  // source's clock has genuinely reset (vs. still reporting the outgoing track).
  const transitionFromTimeRef = useRef(0);
  const lastEngineTimeRef = useRef(0);

  const clearTransition = useCallback(() => {
    transitionRef.current = false;
    setIsTransitioning(false);
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const beginTransition = useCallback(() => {
    transitionRef.current = true;
    transitionStartedAtRef.current = Date.now();
    transitionFromTimeRef.current = lastEngineTimeRef.current;
    setIsTransitioning(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    // Safety net if the next source never reports loaded/playing.
    transitionTimerRef.current = setTimeout(clearTransition, 2500);
  }, [clearTransition]);

  const current = queue[index] ?? null;
  const prefsReady = usePreferencesReady();

  // Configure the audio session once: keep playing through the iOS mute switch
  // (otherwise recitation is silent when the ringer is off) and in the background.
  // Native only — the web audio element ignores these.
  useEffect(() => {
    if (Platform.OS === "web") return;
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    }).catch(() => {
      // Non-fatal: playback still works, just without the preferred session mode.
    });
  }, []);

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
        applyPlaybackRate(player, saved);
      } catch {
        // player not ready
      }
    }
  }, [prefsReady, player]);

  useEffect(() => {
    if (!prefsReady) return;
    const saved = preferencesStore.getState().prefs.audioVolume;
    if (saved != null) {
      setVolumeState(saved);
      try {
        applyVolume(player, saved);
      } catch {
        // player not ready
      }
    }
  }, [prefsReady, player]);

  const playIndex = useCallback(
    (tracks: AudioTrack[], startIndex: number, seamless = false) => {
      const track = tracks[startIndex];
      if (!track) return;
      if (seamless) beginTransition();
      else clearTransition();

      const startPlayback = (resolved: number | { uri: string }) => {
        try {
          if (typeof resolved === "number") {
            player.replace(resolved);
          } else {
            player.replace(resolved);
          }
          applyPlaybackRate(player, rate);
          applyVolume(player, volume);
          player.play();

          const nextTrack = tracks[startIndex + 1];
          if (nextTrack && nextTrack.source == null) prefetchAudioUri(nextTrack.uri);
        } catch {
          // unsupported source / platform
        }
      };

      if (track.source != null) {
        startPlayback(track.source);
        return;
      }

      // Web resolves immediately; avoid a microtask gap before replace().
      if (Platform.OS === "web") {
        startPlayback({ uri: track.uri });
        return;
      }

      void (async () => {
        try {
          const uri = await resolveCachedAudioUri(track.uri);
          startPlayback({ uri });
        } catch {
          // unsupported source / platform
        }
      })();
    },
    [player, rate, volume, beginTransition, clearTransition],
  );

  const cacheTrackDuration = useCallback((id: string, seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    setTrackDurations((prev) => {
      const existing = prev[id];
      if (existing != null && Math.abs(existing - seconds) < 0.25) return prev;
      return { ...prev, [id]: seconds };
    });
  }, []);

  const play = useCallback(
    (tracks: AudioTrack[], startIndex = 0, options?: { sourceHref?: string }) => {
      const initialDurations: Record<string, number> = {};
      for (const track of tracks) {
        const cached = getCachedTrackDuration(track.uri);
        if (cached != null) initialDurations[track.id] = cached;
      }

      setQueue(tracks);
      setIndex(startIndex);
      setTrackDurations(initialDurations);
      setQueueFinished(false);
      setUserPaused(false);
      setSourceHref(options?.sourceHref ?? null);
      stableQueuePositionRef.current = 0;
      stableQueueDurationRef.current = 0;
      playIndex(tracks, startIndex);

      void prefetchTrackDurations(tracks, cacheTrackDuration);

      const track = tracks[startIndex];
      const href = options?.sourceHref;
      if (track && href) {
        const activity = buildAudioActivity(href, track);
        if (activity) recordContinueActivity(activity);
      }
    },
    [playIndex, cacheTrackDuration],
  );

  const toggle = useCallback(() => {
    // Instant tactile feedback on the tap, before the (possibly buffering) audio
    // engine responds.
    triggerHaptic("light");
    try {
      if (status.playing) {
        player.pause();
        setUserPaused(true);
      } else {
        player.play();
        setUserPaused(false);
      }
    } catch {
      // ignore
    }
  }, [player, status.playing]);

  const seekTo = useCallback(
    (seconds: number) => {
      setQueueFinished(false);
      stableQueuePositionRef.current = seconds;
      void player.seekTo(seconds).catch(() => {});
    },
    [player],
  );

  const seekToQueuePosition = useCallback(
    (seconds: number) => {
      setQueueFinished(false);
      stableQueuePositionRef.current = seconds;
      const q = queueRef.current;
      if (q.length <= 1) {
        seekTo(seconds);
        return;
      }
      const { index: targetIndex, offset } = locateQueuePosition(
        q,
        seconds,
        trackDurationsRef.current,
      );
      if (targetIndex === indexRef.current) {
        seekTo(offset);
        return;
      }
      pendingSeekRef.current = offset;
      setIndex(targetIndex);
      playIndex(q, targetIndex, true);
    },
    [playIndex, seekTo],
  );

  // Anchor the smoothed queue timeline to a track's start boundary so an
  // explicit jump (forward or backward) moves the bar cleanly rather than being
  // pinned by the monotonic hold from the previous track.
  const anchorQueueTimeline = useCallback((targetIndex: number) => {
    stableQueuePositionRef.current = queueStartBoundary(
      queueRef.current,
      targetIndex,
      trackDurationsRef.current,
    );
  }, []);

  // Advance to the next track; wrap to the start when repeating the whole queue.
  const next = useCallback(() => {
    setQueueFinished(false);
    setIndex((prev) => {
      const q = queueRef.current;
      const nextIndex = prev + 1;
      if (nextIndex < q.length) {
        anchorQueueTimeline(nextIndex);
        playIndex(q, nextIndex, true);
        return nextIndex;
      }
      if (loopRef.current === "all" && q.length > 0) {
        anchorQueueTimeline(0);
        playIndex(q, 0, true);
        return 0;
      }
      return prev;
    });
  }, [playIndex, anchorQueueTimeline]);

  const jumpTo = useCallback(
    (i: number) => {
      const q = queueRef.current;
      if (i < 0 || i >= q.length) return;
      setQueueFinished(false);
      anchorQueueTimeline(i);
      setIndex(i);
      playIndex(q, i, q.length > 1);
    },
    [playIndex, anchorQueueTimeline],
  );

  const replay = useCallback(() => {
    triggerHaptic("light");
    setUserPaused(false);
    jumpTo(0);
  }, [jumpTo]);

  const previous = useCallback(() => {
    setQueueFinished(false);
    setIndex((prev) => {
      const q = queueRef.current;
      const prevIndex = prev - 1;
      if (prevIndex >= 0) {
        anchorQueueTimeline(prevIndex);
        playIndex(q, prevIndex, true);
        return prevIndex;
      }
      if (loopRef.current === "all" && q.length > 0) {
        const last = q.length - 1;
        anchorQueueTimeline(last);
        playIndex(q, last, true);
        return last;
      }
      return prev;
    });
  }, [playIndex, anchorQueueTimeline]);

  const setRate = useCallback(
    (nextRate: number) => {
      setRateState(nextRate);
      try {
        applyPlaybackRate(player, nextRate);
      } catch {
        // ignore
      }
      void preferencesStore.getState().update({ audioSpeed: nextRate });
    },
    [player],
  );

  const setVolume = useCallback(
    (nextVolume: number) => {
      const clamped = Math.max(0, Math.min(1, nextVolume));
      setVolumeState(clamped);
      try {
        applyVolume(player, clamped);
      } catch {
        // ignore
      }
      void preferencesStore.getState().update({ audioVolume: clamped });
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
    setTrackDurations({});
    setSourceHref(null);
    setQueueFinished(false);
    pendingSeekRef.current = null;
    setUserPaused(false);
    clearTransition();
    stableQueueDurationRef.current = 0;
    stableQueuePositionRef.current = 0;
  }, [player, clearTransition]);

  const readPlaybackSeconds = useCallback(() => {
    try {
      return player.currentTime;
    } catch {
      return status.currentTime ?? 0;
    }
  }, [player, status.currentTime]);

  const isLoaded = status.isLoaded ?? false;

  // Replace estimates with the loaded duration for the active track.
  useEffect(() => {
    if (!current || !isLoaded || isTransitioning) return;
    const loadedDuration = status.duration ?? 0;
    if (loadedDuration > 0) cacheTrackDuration(current.id, loadedDuration);
    // Re-apply after the native/web source loads so pitch correction sticks.
    try {
      applyPlaybackRate(player, rate);
      applyVolume(player, volume);
    } catch {
      // player not ready
    }
  }, [
    current,
    isLoaded,
    isTransitioning,
    status.duration,
    cacheTrackDuration,
    player,
    rate,
    volume,
  ]);

  // Apply a pending queue-wide seek once the target track has loaded.
  useEffect(() => {
    if (!isLoaded || pendingSeekRef.current == null) return;
    const target = pendingSeekRef.current;
    pendingSeekRef.current = null;
    seekTo(target);
  }, [isLoaded, seekTo]);

  // End the seamless transition only once the new source's clock has genuinely
  // reset. After `player.replace()` the engine can keep reporting the outgoing
  // track's near-end time for a frame or two; lifting the hold then would make
  // the queue bar jump to the end of the incoming track and snap back. We wait
  // until `currentTime` has clearly dropped below where the previous track left
  // off (or there was no meaningful prior time to begin with).
  useEffect(() => {
    if (!isTransitioning || !isLoaded) return;
    const elapsed = Date.now() - transitionStartedAtRef.current;
    const from = transitionFromTimeRef.current;
    const now = status.currentTime ?? 0;
    const clockReset = from <= 0.75 || now < from - 0.5;
    if (!clockReset || elapsed < 150) return;
    clearTransition();
  }, [isTransitioning, isLoaded, status.currentTime, clearTransition]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  // Auto-advance when a track finishes. "one" replays the current track a single
  // time and then clears itself (play again once, not forever); otherwise advance.
  // useLayoutEffect so isTransitioning flips before paint — avoids play/progress flicker.
  useLayoutEffect(() => {
    if (!status.didJustFinish) return;

    const q = queueRef.current;
    const idx = indexRef.current;
    const finishingTrack = q[idx];
    const finishedDuration =
      status.duration ?? trackDurationsRef.current[finishingTrack?.id ?? ""] ?? 0;
    if (finishingTrack && finishedDuration > 0) {
      trackDurationsRef.current[finishingTrack.id] = finishedDuration;
      cacheTrackDuration(finishingTrack.id, finishedDuration);
      stableQueuePositionRef.current = Math.max(
        stableQueuePositionRef.current,
        computeQueuePosition(q, idx, finishedDuration, trackDurationsRef.current),
      );
    }

    if (loopRef.current === "one") {
      loopRef.current = "off";
      setLoopMode("off");
      beginTransition();
      playIndex(q, idx, true);
      return;
    }
    const atLast = q.length > 0 && idx >= q.length - 1;
    if (atLast && loopRef.current !== "all") {
      setQueueFinished(true);
      return;
    }
    setQueueFinished(false);
    beginTransition();
    next();
  }, [status.didJustFinish, status.duration, next, playIndex, beginTransition, cacheTrackDuration]);

  // Treat an unloaded source with a live track as "buffering" too, so the play
  // button spins immediately after a tap while the engine spins up, not just
  // once expo-audio flips its own `isBuffering` flag. Suppress during queue hops.
  const isBuffering =
    Boolean(current) &&
    !isTransitioning &&
    !transitionRef.current &&
    ((status.isBuffering ?? false) || !isLoaded);

  const position = status.currentTime ?? 0;
  const duration = status.duration ?? 0;
  lastEngineTimeRef.current = position;
  const computedQueueDurationForProgress = queueDurationForProgress(
    queue,
    index,
    position,
    trackDurations,
  );
  const computedQueuePosition = computeQueuePosition(queue, index, position, trackDurations);

  const isQueueSessionActive = queue.length > 1 && !queueFinished;
  const atLastTrack = queue.length > 0 && index >= queue.length - 1;
  const willAutoAdvance =
    Boolean(status.didJustFinish) &&
    queue.length > 0 &&
    (loopMode === "one" || loopMode === "all" || !atLastTrack);

  const holdQueueTimeline = isTransitioning || transitionRef.current || willAutoAdvance;

  if (holdQueueTimeline) {
    // While transitioning, the engine clock may still report the *previous*
    // track's time even though `index` has already advanced — feeding that stale
    // position into `computeQueuePosition` would overshoot to the end of the
    // incoming track. Anchor to the new track's start boundary instead, keeping
    // the value monotonic so the auto-advance render (where `index` briefly lags)
    // doesn't dip below the finishing track's end.
    const boundaryPosition = queueStartBoundary(queue, index, trackDurations);
    stableQueuePositionRef.current = Math.max(stableQueuePositionRef.current, boundaryPosition);
    const boundaryDuration = queueDuration(queue, trackDurations);
    if (boundaryDuration > 0) {
      stableQueueDurationRef.current = Math.max(stableQueueDurationRef.current, boundaryDuration);
    }
  } else {
    stableQueuePositionRef.current = computedQueuePosition;
    stableQueueDurationRef.current =
      computedQueueDurationForProgress > 0 ? computedQueueDurationForProgress : 0;
  }

  const smoothQueueDuration =
    holdQueueTimeline && stableQueueDurationRef.current > 0
      ? stableQueueDurationRef.current
      : computedQueueDurationForProgress;
  const smoothQueuePosition = holdQueueTimeline
    ? stableQueuePositionRef.current
    : computedQueuePosition;

  const smoothQueueProgress =
    smoothQueueDuration > 0 ? Math.min(smoothQueuePosition / smoothQueueDuration, 1) : 0;

  const isPlaying = userPaused
    ? status.playing
    : isQueueSessionActive
      ? true
      : status.playing || isTransitioning || willAutoAdvance;
  const value = useMemo<AudioContextValue>(
    () => ({
      current,
      queue,
      index,
      trackDurations,
      isPlaying,
      isBuffering,
      isTransitioning,
      isLoaded,
      position,
      duration,
      queuePosition: smoothQueuePosition,
      queueDuration: smoothQueueDuration,
      queueProgress: smoothQueueProgress,
      isQueueFinished: queueFinished && queue.length > 0,
      rate,
      volume,
      loopMode,
      sourceHref,
      play,
      toggle,
      seekTo,
      seekToQueuePosition,
      next,
      previous,
      jumpTo,
      replay,
      setRate,
      setVolume,
      cycleLoopMode,
      stop,
      readPlaybackSeconds,
    }),
    [
      current,
      queue,
      index,
      trackDurations,
      isPlaying,
      isTransitioning,
      isBuffering,
      isLoaded,
      position,
      duration,
      smoothQueuePosition,
      smoothQueueDuration,
      smoothQueueProgress,
      queueFinished,
      rate,
      volume,
      loopMode,
      sourceHref,
      play,
      toggle,
      seekTo,
      seekToQueuePosition,
      next,
      previous,
      jumpTo,
      replay,
      setRate,
      setVolume,
      cycleLoopMode,
      stop,
      readPlaybackSeconds,
    ],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioPlayerContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioPlayerContext must be used within an AudioPlayerProvider");
  return context;
}
