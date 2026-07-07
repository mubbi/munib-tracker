import {
  type AudioPlayer,
  preload as preloadExpoAudio,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
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
import {
  isAudioLocalCacheEnabled,
  peekCachedAudioUri,
  prefetchAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";
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

/**
 * How many upcoming tracks to warm into the byte cache alongside the current
 * one. The very next track is fully staged into the idle player (see
 * double-buffering below); the rest are only fetched into the cache so their
 * bytes are local by the time they are staged.
 */
const PREFETCH_AHEAD = 3;

/** Cycle order: off → repeat all → repeat once → off. */
const LOOP_CYCLE: LoopMode[] = ["off", "all", "one"];

/**
 * Resolve a track to a playable source, preferring a fully-local copy so the
 * staged player can start instantly with no network round-trip. On web this
 * returns a `blob:` object URL (downloading the bytes first if needed); on
 * native a cached `file://` path. Falls back to the remote URL on any failure.
 */
async function resolveTrackSource(track: AudioTrack): Promise<number | { uri: string }> {
  if (track.source != null) return track.source;
  if (Platform.OS === "web") {
    const local = peekCachedAudioUri(track.uri);
    if (local) return { uri: local };
  }
  try {
    const uri = await resolveCachedAudioUri(track.uri);
    return { uri };
  } catch {
    return { uri: track.uri };
  }
}

/**
 * Kick off expo-audio's own preload for a remote clip. The web build of
 * `preload()` returns `void` (fire-and-forget) while native returns a Promise,
 * so we can't blindly `.catch()` the result — normalize both here.
 */
function preloadTrackUri(uri: string): Promise<void> {
  try {
    const result = preloadExpoAudio({ uri }) as Promise<void> | void;
    return result && typeof result.then === "function" ? result.catch(() => {}) : Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

/** Warm the byte cache (and expo-audio's web preload cache) for upcoming clips. */
function warmUpcomingTrackUris(tracks: AudioTrack[], fromIndex: number): void {
  if (!isAudioLocalCacheEnabled()) return;
  const end = Math.min(fromIndex + PREFETCH_AHEAD + 1, tracks.length);
  for (let i = fromIndex; i < end; i++) {
    const track = tracks[i];
    if (track.source != null) continue;
    prefetchAudioUri(track.uri);
    void preloadTrackUri(track.uri);
  }
}

/** Poll until the player's media element has fired `loadeddata` (or timeout). */
async function waitForPlayerReady(player: AudioPlayer, timeoutMs = 12000): Promise<boolean> {
  try {
    if (player.isLoaded) return true;
  } catch {
    // player not ready
  }
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 25));
    try {
      if (player.isLoaded) return true;
    } catch {
      // player not ready
    }
  }
  try {
    return player.isLoaded;
  } catch {
    return false;
  }
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  // Double-buffered players: one plays the current track while the other is
  // preloaded with the next one, so auto-advance is a near-instant hand-off
  // instead of a `replace()` teardown + reload (which caused the audible gap).
  const playerA = useAudioPlayer();
  const playerB = useAudioPlayer();
  const statusA = useAudioPlayerStatus(playerA);
  const statusB = useAudioPlayerStatus(playerB);

  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const player = activeSlot === 0 ? playerA : playerB;
  const status = activeSlot === 0 ? statusA : statusB;

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
  const rateRef = useRef(1);
  rateRef.current = rate;
  const volumeRef = useRef(1);
  volumeRef.current = volume;
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

  // Which physical player is active, and what track id (if any) each player
  // currently holds — kept in refs so the async preloader and the finish
  // handler read live values without stale closures.
  const playersRef = useRef<[AudioPlayer, AudioPlayer]>([playerA, playerB]);
  playersRef.current = [playerA, playerB];
  const activeSlotRef = useRef<0 | 1>(0);
  activeSlotRef.current = activeSlot;
  const stagedTrackIdRef = useRef<[string | null, string | null]>([null, null]);
  const preloadTokenRef = useRef(0);

  const getActive = useCallback((): AudioPlayer => playersRef.current[activeSlotRef.current], []);
  const getIdleSlot = useCallback((): 0 | 1 => (activeSlotRef.current === 0 ? 1 : 0), []);

  const applyRateVolume = useCallback((p: AudioPlayer) => {
    try {
      applyPlaybackRate(p, rateRef.current);
    } catch {
      // player not ready
    }
    try {
      applyVolume(p, volumeRef.current);
    } catch {
      // player not ready
    }
  }, []);

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

  // On web, expo-audio's fire-and-forget `play()` calls `HTMLMediaElement.play()`
  // without awaiting the promise it returns. When playback is interrupted by a
  // near-immediate `pause()`/`replace()` (rapid toggling or switching tracks) that
  // promise rejects with a benign AbortError. Since expo-audio drops the promise,
  // the rejection is unhandled and surfaces as an error (both in the browser and
  // through React Native's own promise-rejection tracker, which a DOM
  // `preventDefault` alone can't suppress). Patch `play()` at the source so the
  // returned promise always swallows that specific benign rejection; keep the
  // `unhandledrejection` listener as a belt-and-suspenders fallback.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    let restorePlay: (() => void) | undefined;
    const mediaProto =
      typeof HTMLMediaElement !== "undefined" ? HTMLMediaElement.prototype : undefined;
    if (mediaProto && !(mediaProto.play as { __munibPatched?: boolean }).__munibPatched) {
      const originalPlay = mediaProto.play;
      const patchedPlay = function patchedPlay(this: HTMLMediaElement) {
        const result = originalPlay.call(this);
        // The rejection only ever originates from a media-element play() here, so
        // swallowing the benign AbortError (interrupted by pause) is safe; other
        // errors still propagate.
        if (result && typeof result.then === "function") {
          return result.catch((error: { name?: string }) => {
            if (error?.name === "AbortError") return;
            throw error;
          });
        }
        return result;
      } as typeof mediaProto.play & { __munibPatched?: boolean };
      patchedPlay.__munibPatched = true;
      mediaProto.play = patchedPlay;
      restorePlay = () => {
        if (mediaProto.play === patchedPlay) mediaProto.play = originalPlay;
      };
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { name?: string; message?: string } | undefined;
      if (reason?.name === "AbortError" && /play\(\)/.test(String(reason.message ?? ""))) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      restorePlay?.();
    };
  }, []);

  // Apply the saved playback speed once preferences have loaded, to both players.
  useEffect(() => {
    if (!prefsReady) return;
    const saved = preferencesStore.getState().prefs.audioSpeed;
    if (saved) {
      setRateState(saved);
      try {
        applyPlaybackRate(playerA, saved);
        applyPlaybackRate(playerB, saved);
      } catch {
        // player not ready
      }
    }
  }, [prefsReady, playerA, playerB]);

  useEffect(() => {
    if (!prefsReady) return;
    const saved = preferencesStore.getState().prefs.audioVolume;
    if (saved != null) {
      setVolumeState(saved);
      try {
        applyVolume(playerA, saved);
        applyVolume(playerB, saved);
      } catch {
        // player not ready
      }
    }
  }, [prefsReady, playerA, playerB]);

  // Stage the next track into the idle (inactive) player and warm the clips
  // after it into the byte cache. Staging = load the source but stay paused, so
  // the finish handler can swap to an already-decoded player with no gap.
  const stageNext = useCallback(
    (tracks: AudioTrack[], nextIndex: number) => {
      const idle = getIdleSlot();
      const track = tracks[nextIndex];

      // Warm this clip plus the next few so their bytes are local before staging.
      warmUpcomingTrackUris(tracks, nextIndex);

      if (!track) {
        stagedTrackIdRef.current[idle] = null;
        return;
      }
      if (stagedTrackIdRef.current[idle] === track.id) return; // already staged & ready

      const token = ++preloadTokenRef.current;
      stagedTrackIdRef.current[idle] = null; // stale until loaded
      void (async () => {
        let playbackSource: number | { uri: string };
        if (track.source != null) {
          playbackSource = track.source;
        } else if (!isAudioLocalCacheEnabled()) {
          playbackSource = { uri: track.uri };
        } else if (Platform.OS === "web") {
          await resolveCachedAudioUri(track.uri).catch(() => track.uri);
          await preloadTrackUri(track.uri);
          playbackSource = { uri: track.uri };
        } else {
          playbackSource = await resolveTrackSource(track);
        }
        if (token !== preloadTokenRef.current) return;
        const slot = getIdleSlot();
        const p = playersRef.current[slot];
        try {
          p.replace(playbackSource);
          p.pause();
          applyRateVolume(p);
          const ready = await waitForPlayerReady(p);
          if (token !== preloadTokenRef.current) return;
          if (!ready) {
            stagedTrackIdRef.current[slot] = null;
            return;
          }
          stagedTrackIdRef.current[slot] = track.id;
        } catch {
          stagedTrackIdRef.current[slot] = null;
        }
      })();
    },
    [getIdleSlot, applyRateVolume],
  );

  const playIndex = useCallback(
    (tracks: AudioTrack[], startIndex: number, seamless = false) => {
      const track = tracks[startIndex];
      if (!track) return;
      if (seamless) beginTransition();
      else clearTransition();

      // A fresh load on the active player invalidates any in-flight stage.
      preloadTokenRef.current++;

      const active = getActive();
      const startPlayback = (resolved: number | { uri: string }) => {
        try {
          active.replace(resolved);
          applyRateVolume(active);
          active.play();
          stagedTrackIdRef.current[activeSlotRef.current] = track.id;
          // Stage the immediate next track into the idle player for a gapless
          // hand-off, and warm the ones after it.
          stageNext(tracks, startIndex + 1);
        } catch {
          // unsupported source / platform
        }
      };

      if (track.source != null) {
        startPlayback(track.source);
        return;
      }

      // Web: replays reuse an already-resolved local `blob:` URL synchronously
      // (no network, no buffering). On the first play we stream the remote URL
      // so the user's tap isn't blocked, then resolve a local blob in the
      // background so every subsequent replay is served entirely from cache.
      if (Platform.OS === "web") {
        if (isAudioLocalCacheEnabled()) {
          const localUri = peekCachedAudioUri(track.uri);
          if (localUri) {
            startPlayback({ uri: localUri });
            return;
          }
        }
        startPlayback({ uri: track.uri });
        if (isAudioLocalCacheEnabled()) {
          void resolveCachedAudioUri(track.uri).catch(() => {});
        }
        return;
      }

      if (!isAudioLocalCacheEnabled()) {
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
    [getActive, applyRateVolume, stageNext, beginTransition, clearTransition],
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

      // Reset the double-buffer to slot 0 for a fresh queue.
      try {
        playersRef.current[getIdleSlot()].pause();
      } catch {
        // ignore
      }
      activeSlotRef.current = 0;
      setActiveSlot(0);
      stagedTrackIdRef.current = [null, null];

      setQueue(tracks);
      setIndex(startIndex);
      setTrackDurations(initialDurations);
      setQueueFinished(false);
      setUserPaused(false);
      setSourceHref(options?.sourceHref ?? null);
      stableQueuePositionRef.current = 0;
      stableQueueDurationRef.current = 0;
      warmUpcomingTrackUris(tracks, startIndex);
      playIndex(tracks, startIndex);

      void prefetchTrackDurations(tracks, cacheTrackDuration);

      const track = tracks[startIndex];
      const href = options?.sourceHref;
      if (track && href) {
        const activity = buildAudioActivity(href, track);
        if (activity) recordContinueActivity(activity);
      }
    },
    [playIndex, cacheTrackDuration, getIdleSlot],
  );

  const toggle = useCallback(() => {
    // Instant tactile feedback on the tap, before the (possibly buffering) audio
    // engine responds.
    triggerHaptic("light");
    try {
      if (status.playing) {
        getActive().pause();
        setUserPaused(true);
      } else {
        getActive().play();
        setUserPaused(false);
      }
    } catch {
      // ignore
    }
  }, [getActive, status.playing]);

  const seekTo = useCallback(
    (seconds: number) => {
      setQueueFinished(false);
      stableQueuePositionRef.current = seconds;
      void getActive()
        .seekTo(seconds)
        .catch(() => {});
    },
    [getActive],
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

  const setRate = useCallback((nextRate: number) => {
    setRateState(nextRate);
    rateRef.current = nextRate;
    try {
      applyPlaybackRate(playersRef.current[0], nextRate);
      applyPlaybackRate(playersRef.current[1], nextRate);
    } catch {
      // ignore
    }
    void preferencesStore.getState().update({ audioSpeed: nextRate });
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = Math.max(0, Math.min(1, nextVolume));
    setVolumeState(clamped);
    volumeRef.current = clamped;
    try {
      applyVolume(playersRef.current[0], clamped);
      applyVolume(playersRef.current[1], clamped);
    } catch {
      // ignore
    }
    void preferencesStore.getState().update({ audioVolume: clamped });
  }, []);

  const cycleLoopMode = useCallback(() => {
    setLoopMode((prev) => LOOP_CYCLE[(LOOP_CYCLE.indexOf(prev) + 1) % LOOP_CYCLE.length]);
  }, []);

  const stop = useCallback(() => {
    try {
      playersRef.current[0].pause();
      playersRef.current[1].pause();
    } catch {
      // ignore
    }
    setQueue([]);
    setIndex(0);
    setTrackDurations({});
    setSourceHref(null);
    setQueueFinished(false);
    pendingSeekRef.current = null;
    stagedTrackIdRef.current = [null, null];
    setUserPaused(false);
    clearTransition();
    stableQueueDurationRef.current = 0;
    stableQueuePositionRef.current = 0;
  }, [clearTransition]);

  const readPlaybackSeconds = useCallback(() => {
    try {
      return getActive().currentTime;
    } catch {
      return status.currentTime ?? 0;
    }
  }, [getActive, status.currentTime]);

  const isLoaded = status.isLoaded ?? false;

  // Replace estimates with the loaded duration for the active track.
  useEffect(() => {
    if (!current || !isLoaded || isTransitioning) return;
    const loadedDuration = status.duration ?? 0;
    if (loadedDuration > 0) cacheTrackDuration(current.id, loadedDuration);
    // Re-apply after the native/web source loads so pitch correction sticks.
    applyRateVolume(player);
  }, [
    current,
    isLoaded,
    isTransitioning,
    status.duration,
    cacheTrackDuration,
    player,
    applyRateVolume,
  ]);

  // Apply a pending queue-wide seek once the target track has loaded.
  useEffect(() => {
    if (!isLoaded || pendingSeekRef.current == null) return;
    const target = pendingSeekRef.current;
    pendingSeekRef.current = null;
    seekTo(target);
  }, [isLoaded, seekTo]);

  // End the seamless transition only once the new source's clock has genuinely
  // reset. After a swap/replace the engine can briefly report the outgoing
  // track's near-end time; lifting the hold then would make the queue bar jump
  // to the end of the incoming track and snap back. We wait until `currentTime`
  // has clearly dropped below where the previous track left off (or there was
  // no meaningful prior time to begin with).
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
  // time and then clears itself (play again once, not forever); otherwise advance
  // — swapping to the preloaded idle player for a gapless hand-off when possible.
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

    const nextIndex = idx + 1 < q.length ? idx + 1 : 0;
    const nextTrack = q[nextIndex];
    setQueueFinished(false);

    // Gapless hand-off: if the idle player already holds the next track *and* its
    // media element is decoded, start it immediately — no replace(), no buffer UI.
    const idleSlot = getIdleSlot();
    const incoming = playersRef.current[idleSlot];
    const canSwap =
      nextTrack && stagedTrackIdRef.current[idleSlot] === nextTrack.id && incoming.isLoaded;
    if (canSwap) {
      const outgoing = playersRef.current[activeSlotRef.current];
      try {
        applyRateVolume(incoming);
        incoming.play();
      } catch {
        // ignore
      }
      try {
        outgoing.pause();
      } catch {
        // ignore
      }
      activeSlotRef.current = idleSlot;
      setActiveSlot(idleSlot);
      setIndex(nextIndex);
      anchorQueueTimeline(nextIndex);
      // Stage the track after this one into the now-idle player.
      const followIndex =
        nextIndex + 1 < q.length ? nextIndex + 1 : loopRef.current === "all" ? 0 : nextIndex + 1;
      stageNext(q, followIndex);
      return;
    }

    // Fallback: next track wasn't staged/decoded in time — reload on the active player.
    beginTransition();
    next();
  }, [
    status.didJustFinish,
    status.duration,
    next,
    playIndex,
    beginTransition,
    cacheTrackDuration,
    anchorQueueTimeline,
    getIdleSlot,
    applyRateVolume,
    stageNext,
  ]);

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
