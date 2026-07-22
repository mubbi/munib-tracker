import {
  type AudioPlayer,
  preload as preloadExpoAudio,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  invalidateCachedAudioUri,
  isAudioLocalCacheEnabled,
  peekCachedAudioUri,
  peekNativeCachedAudioUri,
  prefetchAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";
import {
  activateLockScreenControls,
  deactivateLockScreenControls,
  ensureAndroidMediaNotificationPermission,
  type LockScreenQueueContext,
} from "@/lib/audio-lock-screen";
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
import { nextIndexForRepeatPlan } from "@/lib/quran-repeat";
import {
  canPauseTts,
  pauseTts,
  playerRateToSpeechRate,
  resumeTts,
  speak as speakTts,
  stopTts,
} from "@/lib/tts";
import { estimateTtsDurationSeconds, isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import {
  AudioContext,
  type AudioContextValue,
  AudioProgressContext,
  type AudioProgressValue,
  SSR_AUDIO_CONTEXT,
  SSR_AUDIO_PROGRESS,
} from "@/providers/audio-player-context";
import type {
  AudioTrack,
  LoopMode,
  QuranRepeatPlan,
  TranslationAudioMode,
} from "@/providers/audio-player-types";
import { recordContinueActivity } from "@/stores/continue-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

export {
  useAudioPlayerContext,
  useAudioProgressContext,
} from "@/providers/audio-player-context";
export type {
  AudioTrack,
  LoopMode,
  QuranRepeatPlan,
  TranslationAudioMode,
} from "@/providers/audio-player-types";

export const AUDIO_SPEEDS = [0.5, 1, 1.5, 2];

/**
 * How many upcoming tracks to warm into the byte cache alongside the current
 * one. The very next track is fully staged into the idle player (see
 * double-buffering below); the rest are only fetched into the cache so their
 * bytes are local by the time they are staged.
 */
const PREFETCH_AHEAD = 3;

/**
 * How long a local (file:// / blob:) source may take to report `isLoaded` before
 * we treat the cache entry as corrupt and fall back to the remote URL.
 */
const LOCAL_SOURCE_READY_MS = 4000;

/**
 * If the active remote/local source never becomes loaded, retry playback this
 * many times (first retry invalidates cache) before giving up.
 */
const STUCK_LOAD_RETRY_LIMIT = 2;

/** Delay before treating a still-unloaded track as stuck and reloading. */
const STUCK_LOAD_RETRY_MS = 8000;

/** Cycle order: off → repeat all → repeat once → off. */
const LOOP_CYCLE: LoopMode[] = ["off", "all", "one"];

/** True when `uri` is a local playback source (not http(s)). */
function isLocalPlaybackUri(uri: string): boolean {
  return (
    uri.startsWith("file:") ||
    uri.startsWith("blob:") ||
    uri.startsWith("content:") ||
    uri.startsWith("asset:") ||
    uri.startsWith("/")
  );
}

/** Qur'an ayah track ids look like `2:255` — used to scope repeat/TTS to scripture queues. */
function isQuranAyahTrack(track: AudioTrack | null | undefined): boolean {
  return Boolean(track?.id && /^\d+:\d+$/.test(track.id));
}

/** Approximate mid-utterance seek by slicing at a word boundary. */
function sliceTtsTextFromProgress(text: string, progress: number): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0.02) return trimmed;
  if (p >= 0.98) return "";
  const approx = Math.floor(trimmed.length * p);
  const space = trimmed.indexOf(" ", approx);
  const cut = space >= 0 ? space + 1 : approx;
  const sliced = trimmed.slice(cut).trim();
  return sliced || trimmed.slice(approx).trim();
}

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
    if (!track || track.source != null || track.ttsPlayback || !track.uri) continue;
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

/** Isolates expo-audio engine failures so the app tree keeps a working context shell. */
class AudioEngineBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error("[AudioPlayerProvider] Engine failed to start:", error, info.componentStack);
    }
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Stable context shell for all platforms. The live expo-audio engine mounts as a
 * headless sibling so children always see a Provider — even before web hydration
 * (SSR no-op value) or if the engine fails to initialize.
 *
 * Web: defer `useAudioPlayer` until after hydration (`new Audio()` is browser-only).
 * Native: mount the engine on the first paint.
 */
export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<AudioContextValue>(SSR_AUDIO_CONTEXT);
  const [progress, setProgress] = useState<AudioProgressValue>(SSR_AUDIO_PROGRESS);
  const [live, setLive] = useState(() => Platform.OS !== "web");

  useLayoutEffect(() => {
    if (Platform.OS === "web") setLive(true);
  }, []);

  return (
    <AudioContext.Provider value={value}>
      <AudioProgressContext.Provider value={progress}>
        <AudioEngineBoundary>
          {live ? (
            <AudioPlayerProviderLive onValueChange={setValue} onProgressChange={setProgress} />
          ) : null}
        </AudioEngineBoundary>
        {children}
      </AudioProgressContext.Provider>
    </AudioContext.Provider>
  );
}

function AudioPlayerProviderLive({
  onValueChange,
  onProgressChange,
}: {
  onValueChange: (value: AudioContextValue) => void;
  onProgressChange: (value: AudioProgressValue) => void;
}) {
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
  const [repeatPlan, setRepeatPlanState] = useState<QuranRepeatPlan>({ mode: "off" });
  const [translationAudio, setTranslationAudioState] = useState<TranslationAudioMode>("off");
  const [isSpeakingTranslation, setIsSpeakingTranslation] = useState(false);
  const [sourceHref, setSourceHref] = useState<string | null>(null);
  const [queueFinished, setQueueFinished] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  /** User explicitly paused; auto-advance queues ignore raw `playing` gaps between tracks. */
  const [userPaused, setUserPaused] = useState(false);
  /** Synthetic clock for TTS-only tracks (no expo-audio source). */
  const [ttsClock, setTtsClock] = useState<{ position: number; duration: number } | null>(null);

  // Refs keep the finish handler current without re-subscribing every render.
  const indexRef = useRef(0);
  indexRef.current = index;
  const loopRef = useRef<LoopMode>("off");
  loopRef.current = loopMode;
  const repeatPlanRef = useRef<QuranRepeatPlan>({ mode: "off" });
  repeatPlanRef.current = repeatPlan;
  const translationAudioRef = useRef<TranslationAudioMode>("off");
  translationAudioRef.current = translationAudio;
  const finishHandlingRef = useRef(false);
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
  const ttsGenerationRef = useRef(0);
  const ttsTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ttsProgressAnchorRef = useRef(0);
  const ttsStartedAtRef = useRef<number | null>(null);
  const ttsPausedPositionRef = useRef(0);
  const ttsNeedsRestartRef = useRef(false);
  const playIndexRef = useRef<
    (tracks: AudioTrack[], startIndex: number, seamless?: boolean) => void
  >(() => {});
  const userPausedRef = useRef(false);
  userPausedRef.current = userPaused;

  // Which physical player is active, and what track id (if any) each player
  // currently holds — kept in refs so the async preloader and the finish
  // handler read live values without stale closures.
  const playersRef = useRef<[AudioPlayer, AudioPlayer]>([playerA, playerB]);
  playersRef.current = [playerA, playerB];
  const activeSlotRef = useRef<0 | 1>(0);
  activeSlotRef.current = activeSlot;
  const stagedTrackIdRef = useRef<[string | null, string | null]>([null, null]);
  /** Invalidates in-flight idle-player staging when the active queue hop changes. */
  const preloadTokenRef = useRef(0);
  /**
   * Invalidates in-flight `playIndex` async loads (native cache peek → replace).
   * Separate from {@link preloadTokenRef} so staging the next track cannot cancel
   * the load that just kicked off staging.
   */
  const playbackEpochRef = useRef(0);
  /** Tracks how many times we auto-retried a still-unloaded source for a track id. */
  const stuckLoadRetryRef = useRef<{ trackId: string; count: number }>({
    trackId: "",
    count: 0,
  });

  const getActive = useCallback((): AudioPlayer => playersRef.current[activeSlotRef.current], []);
  const getIdleSlot = useCallback((): 0 | 1 => (activeSlotRef.current === 0 ? 1 : 0), []);

  const clearTtsClock = useCallback(() => {
    ttsGenerationRef.current += 1;
    if (ttsTickRef.current) {
      clearInterval(ttsTickRef.current);
      ttsTickRef.current = null;
    }
    ttsStartedAtRef.current = null;
    ttsProgressAnchorRef.current = 0;
    ttsPausedPositionRef.current = 0;
    setTtsClock(null);
  }, []);

  const pauseAudioEngines = useCallback(() => {
    try {
      playersRef.current[0].pause();
      playersRef.current[1].pause();
    } catch {
      // ignore
    }
  }, []);

  const resolveNextIndexAfterFinish = useCallback(
    (idx: number, finishingTrack: AudioTrack | undefined) => {
      const q = queueRef.current;
      const plan = repeatPlanRef.current;
      if (plan.mode !== "off" && isQuranAyahTrack(finishingTrack)) {
        return nextIndexForRepeatPlan(idx, q.length, plan);
      }
      if (loopRef.current === "one") {
        loopRef.current = "off";
        setLoopMode("off");
        return idx;
      }
      const atLast = q.length > 0 && idx >= q.length - 1;
      if (atLast && loopRef.current !== "all") return null;
      return idx + 1 < q.length ? idx + 1 : 0;
    },
    [],
  );

  const advanceAfterTtsFinish = useCallback(() => {
    const q = queueRef.current;
    const idx = indexRef.current;
    const finishingTrack = q[idx];
    const finishedDuration = trackDurationsRef.current[finishingTrack?.id ?? ""] ?? 0;
    if (finishingTrack && finishedDuration > 0) {
      stableQueuePositionRef.current = Math.max(
        stableQueuePositionRef.current,
        computeQueuePosition(q, idx, finishedDuration, trackDurationsRef.current),
      );
    }

    const nextIdx = resolveNextIndexAfterFinish(idx, finishingTrack);
    finishHandlingRef.current = false;
    if (nextIdx == null) {
      setQueueFinished(true);
      setUserPaused(true);
      clearTtsClock();
      return;
    }
    setQueueFinished(false);
    setIndex(nextIdx);
    playIndexRef.current(q, nextIdx, true);
  }, [clearTtsClock, resolveNextIndexAfterFinish]);

  const startTtsTick = useCallback((duration: number) => {
    if (ttsTickRef.current) clearInterval(ttsTickRef.current);
    ttsTickRef.current = setInterval(() => {
      if (userPausedRef.current || ttsStartedAtRef.current == null) return;
      const elapsed = (Date.now() - ttsStartedAtRef.current) / 1000;
      const position = Math.min(duration, ttsProgressAnchorRef.current + elapsed);
      setTtsClock({ position, duration });
    }, 200);
  }, []);

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
  // Do NOT request notification permission here — that waits for onboarding or
  // first playback via ensureAndroidMediaNotificationPermission.
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

  // Keep in-app play/pause UI in sync when the user controls playback from the
  // lock screen or Android media notification (expo-audio drives the player directly).
  useEffect(() => {
    if (Platform.OS === "web") return;

    const onStatus = (slot: 0 | 1) => {
      return (event: { playing?: boolean; isLoaded?: boolean; didJustFinish?: boolean }) => {
        if (slot !== activeSlotRef.current) return;
        if (transitionRef.current) return;
        if (event.playing) {
          setUserPaused(false);
        } else if (event.isLoaded && !event.didJustFinish && queueRef.current.length > 0) {
          setUserPaused(true);
        }
      };
    };

    const subA = playerA.addListener("playbackStatusUpdate", onStatus(0));
    const subB = playerB.addListener("playbackStatusUpdate", onStatus(1));
    return () => {
      subA.remove();
      subB.remove();
    };
  }, [playerA, playerB]);

  const syncLockScreenForTrack = useCallback(
    (targetPlayer: AudioPlayer, track: AudioTrack, trackIndex: number, tracks: AudioTrack[]) => {
      const queueCtx: LockScreenQueueContext = {
        queueIndex: trackIndex,
        queueLength: tracks.length,
        queuePosition: computeQueuePosition(tracks, trackIndex, 0, trackDurationsRef.current),
        queueDuration: queueDuration(tracks, trackDurationsRef.current),
      };
      // Prompt only if still undetermined (e.g. user skipped onboarding permissions).
      void ensureAndroidMediaNotificationPermission().then(() => {
        activateLockScreenControls(targetPlayer, track, queueCtx, track.id);
      });
    },
    [],
  );

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

      if (!track || isTtsPlaybackTrack(track)) {
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
          // Prefer the session blob URL so the idle player does not re-buffer
          // from the network on seamless auto-advance.
          const peek = peekCachedAudioUri(track.uri);
          const uri = peek ?? (await resolveCachedAudioUri(track.uri).catch(() => track.uri));
          await preloadTrackUri(uri);
          playbackSource = { uri };
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

      // A fresh load on the active player invalidates any in-flight stage AND
      // any prior async peek→replace that has not applied yet.
      preloadTokenRef.current++;
      const playbackEpoch = ++playbackEpochRef.current;

      if (isTtsPlaybackTrack(track)) {
        pauseAudioEngines();
        stagedTrackIdRef.current[activeSlotRef.current] = track.id;
        stageNext(tracks, startIndex + 1);

        const playback = track.ttsPlayback;
        const fullText = playback.text.trim();
        const duration = estimateTtsDurationSeconds(fullText, rateRef.current);
        setTrackDurations((prev) => {
          const previous = prev[track.id];
          return previous != null && Math.abs(previous - duration) < 0.25
            ? prev
            : { ...prev, [track.id]: duration };
        });
        trackDurationsRef.current[track.id] = duration;

        const fromProgress =
          pendingSeekRef.current != null && duration > 0
            ? Math.min(1, Math.max(0, pendingSeekRef.current / duration))
            : 0;
        pendingSeekRef.current = null;

        const speakText = sliceTtsTextFromProgress(fullText, fromProgress);
        const startPosition = fromProgress * duration;
        ttsProgressAnchorRef.current = startPosition;
        ttsPausedPositionRef.current = startPosition;
        ttsStartedAtRef.current = Date.now();
        setTtsClock({ position: startPosition, duration });
        userPausedRef.current = false;
        setUserPaused(false);
        ttsNeedsRestartRef.current = false;
        startTtsTick(duration);
        clearTransition();

        if (!speakText) {
          advanceAfterTtsFinish();
          return;
        }

        const generation = ++ttsGenerationRef.current;
        void (async () => {
          await stopTts();
          if (generation !== ttsGenerationRef.current) return;
          await speakTts(speakText, {
            lang: playback.lang,
            voice: playback.voice,
            rate: playerRateToSpeechRate(rateRef.current),
            onDone: () => {
              if (generation !== ttsGenerationRef.current) return;
              if (userPausedRef.current) return;
              setTtsClock({ position: duration, duration });
              advanceAfterTtsFinish();
            },
            onError: () => {
              if (generation !== ttsGenerationRef.current) return;
              advanceAfterTtsFinish();
            },
          });
        })();
        return;
      }

      // File / remote audio — stop any prior TTS clock.
      clearTtsClock();
      void stopTts();

      if (track.clipStart != null && track.clipStart > 0) {
        pendingSeekRef.current = track.clipStart;
      }

      const isStale = () => playbackEpoch !== playbackEpochRef.current;
      const slotAtStart = activeSlotRef.current;

      const startPlayback = (resolved: number | { uri: string }) => {
        if (isStale()) return false;
        try {
          const player = playersRef.current[activeSlotRef.current];
          player.replace(resolved);
          applyRateVolume(player);
          player.play();
          stagedTrackIdRef.current[activeSlotRef.current] = track.id;
          syncLockScreenForTrack(player, track, startIndex, tracks);
          // Stage the immediate next track into the idle player for a gapless
          // hand-off, and warm the ones after it.
          stageNext(tracks, startIndex + 1);
          return true;
        } catch {
          return false;
        }
      };

      /**
       * Prefer a local cache hit, but if the engine never reports loaded, drop
       * the bad entry and stream the remote URL. Without this, a truncated or
       * undecodable cache file pins the UI on "Buffering…" until next/prev.
       */
      const startPlaybackPreferringLocal = (localUri: string) => {
        if (!startPlayback({ uri: localUri })) {
          startPlayback({ uri: track.uri });
          return;
        }
        if (!isLocalPlaybackUri(localUri) || !track.uri.startsWith("http")) return;
        void (async () => {
          const player = playersRef.current[slotAtStart];
          const ready = await waitForPlayerReady(player, LOCAL_SOURCE_READY_MS);
          if (isStale()) return;
          // Slot swapped or a newer track already owns this player — do not
          // tear down whatever is playing now with a stale remote fallback.
          if (activeSlotRef.current !== slotAtStart) return;
          if (stagedTrackIdRef.current[slotAtStart] !== track.id) return;
          if (ready) return;
          try {
            await invalidateCachedAudioUri(track.uri);
          } catch {
            // Best-effort — still try the remote URL.
          }
          if (isStale()) return;
          if (activeSlotRef.current !== slotAtStart) return;
          if (stagedTrackIdRef.current[slotAtStart] !== track.id) return;
          startPlayback({ uri: track.uri });
        })();
      };

      if (track.source != null) {
        if (startPlayback(track.source)) return;
        // Bundled asset rejected — fall through to remote uri when present.
        if (!track.uri) return;
      }

      // Prefer an already-local copy; otherwise stream the remote URL immediately
      // and warm the cache in the background. Waiting for a full download before
      // `play()` left Learn → Adhan stuck on "Buffering…" whenever the native
      // cache path was invalid or the download was slow.
      if (!isAudioLocalCacheEnabled()) {
        startPlayback({ uri: track.uri });
        return;
      }

      if (Platform.OS === "web") {
        const localUri = peekCachedAudioUri(track.uri);
        if (localUri) {
          startPlaybackPreferringLocal(localUri);
          return;
        }
        startPlayback({ uri: track.uri });
        void resolveCachedAudioUri(track.uri).catch(() => {});
        return;
      }

      void (async () => {
        try {
          const localUri = await peekNativeCachedAudioUri(track.uri);
          if (isStale()) return;
          if (localUri) {
            startPlaybackPreferringLocal(localUri);
            return;
          }
        } catch {
          // Fall through to streaming.
        }
        if (isStale()) return;
        startPlayback({ uri: track.uri });
        void resolveCachedAudioUri(track.uri).catch(() => {});
      })();
    },
    [
      applyRateVolume,
      stageNext,
      beginTransition,
      clearTransition,
      syncLockScreenForTrack,
      pauseAudioEngines,
      clearTtsClock,
      startTtsTick,
      advanceAfterTtsFinish,
    ],
  );
  playIndexRef.current = playIndex;

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
      void stopTts();
      clearTtsClock();
      setIsSpeakingTranslation(false);
      finishHandlingRef.current = false;

      const initialDurations: Record<string, number> = {};
      for (const track of tracks) {
        if (isTtsPlaybackTrack(track) && track.ttsPlayback) {
          initialDurations[track.id] = estimateTtsDurationSeconds(
            track.ttsPlayback.text,
            rateRef.current,
          );
          continue;
        }
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
      stuckLoadRetryRef.current = { trackId: "", count: 0 };

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
    [playIndex, cacheTrackDuration, getIdleSlot, clearTtsClock],
  );

  const toggle = useCallback(() => {
    // Instant tactile feedback on the tap, before the (possibly buffering) audio
    // engine responds.
    triggerHaptic("light");
    const track = queueRef.current[indexRef.current];
    if (isTtsPlaybackTrack(track)) {
      if (userPausedRef.current) {
        userPausedRef.current = false;
        setUserPaused(false);
        if (canPauseTts() && !ttsNeedsRestartRef.current) {
          ttsStartedAtRef.current = Date.now();
          ttsProgressAnchorRef.current = ttsPausedPositionRef.current;
          void resumeTts();
        } else {
          ttsNeedsRestartRef.current = false;
          pendingSeekRef.current = ttsPausedPositionRef.current;
          playIndexRef.current(queueRef.current, indexRef.current, false);
        }
      } else {
        const duration = ttsClock?.duration ?? trackDurationsRef.current[track.id] ?? 0;
        let position = ttsPausedPositionRef.current;
        if (ttsStartedAtRef.current != null) {
          position = Math.min(
            duration,
            ttsProgressAnchorRef.current + (Date.now() - ttsStartedAtRef.current) / 1000,
          );
        }
        ttsPausedPositionRef.current = position;
        ttsStartedAtRef.current = null;
        setTtsClock(duration > 0 ? { position, duration } : null);
        userPausedRef.current = true;
        setUserPaused(true);
        if (canPauseTts()) {
          void pauseTts();
        } else {
          ttsNeedsRestartRef.current = true;
          void stopTts();
        }
      }
      return;
    }

    try {
      if (status.playing) {
        getActive().pause();
        setUserPaused(true);
      } else if (!(status.isLoaded ?? false)) {
        // Source never finished loading (stale replace / corrupt cache / hung
        // network). Bare `play()` cannot recover — reload the current track.
        setUserPaused(false);
        playIndexRef.current(queueRef.current, indexRef.current, false);
      } else {
        getActive().play();
        setUserPaused(false);
      }
    } catch {
      // ignore
    }
  }, [getActive, status.playing, status.isLoaded, ttsClock?.duration]);

  const seekTo = useCallback(
    (seconds: number) => {
      setQueueFinished(false);
      stableQueuePositionRef.current = seconds;
      const track = queueRef.current[indexRef.current];
      if (isTtsPlaybackTrack(track)) {
        const duration =
          ttsClock?.duration ??
          trackDurationsRef.current[track.id] ??
          estimateTtsDurationSeconds(track.ttsPlayback?.text ?? "", rateRef.current);
        const clamped = Math.min(Math.max(0, seconds), Math.max(duration, 0));
        ttsNeedsRestartRef.current = true;
        if (userPausedRef.current) {
          ttsPausedPositionRef.current = clamped;
          ttsProgressAnchorRef.current = clamped;
          setTtsClock({ position: clamped, duration });
          return;
        }
        pendingSeekRef.current = clamped;
        playIndexRef.current(queueRef.current, indexRef.current, false);
        return;
      }
      void getActive()
        .seekTo(seconds)
        .catch(() => {});
    },
    [getActive, ttsClock?.duration],
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

    const track = queueRef.current[indexRef.current];
    if (!isTtsPlaybackTrack(track) || userPausedRef.current) return;

    // Restart the current TTS slice at the new speaking rate.
    const duration =
      trackDurationsRef.current[track.id] ??
      estimateTtsDurationSeconds(track.ttsPlayback?.text ?? "", nextRate);
    let position = ttsPausedPositionRef.current;
    if (ttsStartedAtRef.current != null) {
      position = Math.min(
        duration,
        ttsProgressAnchorRef.current + (Date.now() - ttsStartedAtRef.current) / 1000,
      );
    }
    pendingSeekRef.current = position;
    playIndexRef.current(queueRef.current, indexRef.current, false);
  }, []);

  const setTtsVoice = useCallback((voiceId: string | undefined) => {
    const q = queueRef.current;
    if (!q.some((track) => isTtsPlaybackTrack(track))) return;

    const nextQueue = q.map((track) =>
      track.ttsPlayback
        ? {
            ...track,
            ttsPlayback: {
              ...track.ttsPlayback,
              voice: voiceId,
            },
          }
        : track,
    );
    queueRef.current = nextQueue;
    setQueue(nextQueue);

    const track = nextQueue[indexRef.current];
    if (!isTtsPlaybackTrack(track)) return;

    const duration =
      trackDurationsRef.current[track.id] ??
      estimateTtsDurationSeconds(track.ttsPlayback?.text ?? "", rateRef.current);
    let position = ttsPausedPositionRef.current;
    if (!userPausedRef.current && ttsStartedAtRef.current != null) {
      position = Math.min(
        duration,
        ttsProgressAnchorRef.current + (Date.now() - ttsStartedAtRef.current) / 1000,
      );
    }
    ttsPausedPositionRef.current = position;
    ttsProgressAnchorRef.current = position;
    ttsNeedsRestartRef.current = true;

    if (userPausedRef.current) {
      setTtsClock(duration > 0 ? { position, duration } : null);
      return;
    }

    pendingSeekRef.current = position;
    playIndexRef.current(nextQueue, indexRef.current, false);
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

  const setRepeatPlan = useCallback((plan: QuranRepeatPlan) => {
    setRepeatPlanState(plan);
    repeatPlanRef.current = plan;
  }, []);

  const setTranslationAudio = useCallback((mode: TranslationAudioMode) => {
    setTranslationAudioState(mode);
    translationAudioRef.current = mode;
    if (mode === "off") {
      void stopTts();
      setIsSpeakingTranslation(false);
    }
  }, []);

  const stop = useCallback(() => {
    void stopTts();
    clearTtsClock();
    setIsSpeakingTranslation(false);
    finishHandlingRef.current = false;
    // Cancel any in-flight async peek→replace from a prior playIndex.
    playbackEpochRef.current++;
    preloadTokenRef.current++;
    try {
      playersRef.current[0].pause();
      playersRef.current[1].pause();
    } catch {
      // ignore
    }
    deactivateLockScreenControls(playersRef.current[0]);
    deactivateLockScreenControls(playersRef.current[1]);
    setQueue([]);
    setIndex(0);
    setTrackDurations({});
    setSourceHref(null);
    setQueueFinished(false);
    pendingSeekRef.current = null;
    stagedTrackIdRef.current = [null, null];
    stuckLoadRetryRef.current = { trackId: "", count: 0 };
    setUserPaused(false);
    clearTransition();
    stableQueueDurationRef.current = 0;
    stableQueuePositionRef.current = 0;
  }, [clearTransition, clearTtsClock]);

  const ttsClockRef = useRef(ttsClock);
  ttsClockRef.current = ttsClock;
  const statusCurrentTimeRef = useRef(status.currentTime);
  statusCurrentTimeRef.current = status.currentTime;

  const readPlaybackSeconds = useCallback(() => {
    const track = queueRef.current[indexRef.current];
    if (isTtsPlaybackTrack(track)) {
      return ttsClockRef.current?.position ?? ttsPausedPositionRef.current;
    }
    try {
      return getActive().currentTime;
    } catch {
      return statusCurrentTimeRef.current ?? 0;
    }
  }, [getActive]);

  const ttsTrackActive = isTtsPlaybackTrack(current);
  const isLoaded = ttsTrackActive ? true : (status.isLoaded ?? false);

  // Reset stuck-load retries once the engine actually accepts the source.
  useEffect(() => {
    if (!current || !isLoaded) return;
    if (stuckLoadRetryRef.current.trackId === current.id) {
      stuckLoadRetryRef.current = { trackId: "", count: 0 };
    }
  }, [current, isLoaded]);

  // Auto-recover when a track sits unloaded for too long (corrupt cache, aborted
  // replace after a rapid skip, or a hung CDN response). Matches the user
  // workaround of pressing next/prev — without requiring it.
  useEffect(() => {
    if (!current || ttsTrackActive || userPaused || isLoaded || isTransitioning) return;
    if (queueFinished) return;
    const trackId = current.id;
    const remoteUri = current.uri;
    const timer = setTimeout(() => {
      if (queueRef.current[indexRef.current]?.id !== trackId) return;
      const active = playersRef.current[activeSlotRef.current];
      try {
        if (active.isLoaded) return;
      } catch {
        // player not ready — still retry
      }
      const prev = stuckLoadRetryRef.current;
      const count = prev.trackId === trackId ? prev.count + 1 : 1;
      stuckLoadRetryRef.current = { trackId, count };
      if (count > STUCK_LOAD_RETRY_LIMIT) return;
      if (count === 1 && remoteUri?.startsWith("http")) {
        void invalidateCachedAudioUri(remoteUri).catch(() => {});
      }
      playIndexRef.current(queueRef.current, indexRef.current, false);
    }, STUCK_LOAD_RETRY_MS);
    return () => clearTimeout(timer);
  }, [current, ttsTrackActive, userPaused, isLoaded, isTransitioning, queueFinished]);

  // Replace estimates with the loaded duration for the active track.
  useEffect(() => {
    if (!current || ttsTrackActive || !isLoaded || isTransitioning) return;
    const loadedDuration = status.duration ?? 0;
    if (loadedDuration > 0) cacheTrackDuration(current.id, loadedDuration);
    // Re-apply after the native/web source loads so pitch correction sticks.
    applyRateVolume(player);
  }, [
    current,
    ttsTrackActive,
    isLoaded,
    isTransitioning,
    status.duration,
    cacheTrackDuration,
    player,
    applyRateVolume,
  ]);

  // Apply a pending queue-wide seek once the target track has loaded.
  useEffect(() => {
    if (ttsTrackActive) return;
    if (!isLoaded || pendingSeekRef.current == null) return;
    const target = pendingSeekRef.current;
    pendingSeekRef.current = null;
    seekTo(target);
  }, [isLoaded, seekTo, ttsTrackActive]);

  // End Learn Qur'an word/phrase clips once playback reaches clipEnd.
  useEffect(() => {
    if (ttsTrackActive || !isLoaded || userPaused) return;
    if (!status.playing) return;
    const track = queue[index];
    const clipEnd = track?.clipEnd;
    if (clipEnd == null || !track) return;
    const now = status.currentTime ?? 0;
    if (now < clipEnd - 0.05) return;
    try {
      playersRef.current[activeSlotRef.current].pause();
    } catch {
      // ignore
    }
    setUserPaused(true);
    userPausedRef.current = true;
  }, [ttsTrackActive, isLoaded, userPaused, status.playing, status.currentTime, queue, index]);

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
      if (ttsTickRef.current) clearInterval(ttsTickRef.current);
    },
    [],
  );

  // Auto-advance when a track finishes. Optional TTS translation runs first;
  // then Quran repeatPlan (when not off) or the generic loopMode decides next.
  // useLayoutEffect so isTransitioning flips before paint — avoids play/progress flicker.
  useLayoutEffect(() => {
    if (!status.didJustFinish) return;
    if (finishHandlingRef.current) return;

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

    const advanceAfterFinish = (nextIdx: number | null) => {
      finishHandlingRef.current = false;
      setIsSpeakingTranslation(false);
      if (nextIdx == null) {
        setQueueFinished(true);
        return;
      }
      setQueueFinished(false);
      if (nextIdx === idx) {
        beginTransition();
        playIndex(q, idx, true);
        return;
      }

      const nextTrack = q[nextIdx];
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
        setIndex(nextIdx);
        anchorQueueTimeline(nextIdx);
        if (nextTrack) {
          syncLockScreenForTrack(incoming, nextTrack, nextIdx, q);
        }
        const followIndex =
          nextIdx + 1 < q.length
            ? nextIdx + 1
            : loopRef.current === "all" || repeatPlanRef.current.mode === "surah"
              ? 0
              : nextIdx + 1;
        stageNext(q, followIndex);
        return;
      }

      beginTransition();
      playIndex(q, nextIdx, true);
    };

    const resolveNextIndex = (): number | null => {
      const plan = repeatPlanRef.current;
      // Quran repeat modes only apply to ayah queues — never leak into adhkar/etc.
      if (plan.mode !== "off" && isQuranAyahTrack(finishingTrack)) {
        return nextIndexForRepeatPlan(idx, q.length, plan);
      }

      if (loopRef.current === "one") {
        loopRef.current = "off";
        setLoopMode("off");
        return idx;
      }

      const atLast = q.length > 0 && idx >= q.length - 1;
      if (atLast && loopRef.current !== "all") return null;
      return idx + 1 < q.length ? idx + 1 : 0;
    };

    finishHandlingRef.current = true;
    const nextIdx = resolveNextIndex();
    const tts = finishingTrack?.tts;
    const shouldSpeak =
      translationAudioRef.current === "after" &&
      isQuranAyahTrack(finishingTrack) &&
      Boolean(tts?.text?.trim());

    if (shouldSpeak && tts) {
      setIsSpeakingTranslation(true);
      void speakTts(tts.text, {
        lang: tts.lang,
        voice: tts.voice,
        onDone: () => advanceAfterFinish(nextIdx),
        onError: () => advanceAfterFinish(nextIdx),
      });
      return;
    }

    advanceAfterFinish(nextIdx);
  }, [
    status.didJustFinish,
    status.duration,
    playIndex,
    beginTransition,
    cacheTrackDuration,
    anchorQueueTimeline,
    getIdleSlot,
    applyRateVolume,
    stageNext,
    syncLockScreenForTrack,
  ]);

  // Web: override Media Session next/prev with real queue navigation.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof navigator === "undefined" || !navigator.mediaSession) {
      return;
    }
    if (!current || queue.length <= 1) {
      try {
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      } catch {
        // ignore
      }
      return;
    }
    try {
      navigator.mediaSession.setActionHandler("nexttrack", next);
      navigator.mediaSession.setActionHandler("previoustrack", previous);
    } catch {
      // ignore
    }
    return () => {
      try {
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      } catch {
        // ignore
      }
    };
  }, [current, queue.length, next, previous]);

  // Web: present grouped Qur'an queue as one scrubbable item on the lock screen.
  useEffect(() => {
    if (Platform.OS !== "web" || !current || queue.length <= 1) return;
    if (!/^\d+:\d+$/.test(current.id)) return;
    const playbackPosition = status.currentTime ?? 0;
    const total = queueDuration(queue, trackDurations);
    if (!Number.isFinite(total) || total <= 0) return;
    const pos = computeQueuePosition(queue, index, playbackPosition, trackDurations);
    try {
      navigator.mediaSession.setPositionState({
        duration: total,
        playbackRate: rate,
        position: Math.min(Math.max(pos, 0), total),
      });
    } catch {
      // ignore
    }
  }, [current, queue, index, status.currentTime, trackDurations, rate]);

  // Native lock-screen Now Playing is activated in `syncLockScreenForTrack` via
  // `setActiveForLockScreen`. Do NOT call `updateLockScreenMetadata` on every
  // `currentTime` tick — Android logs "service not connected" while the media
  // playback service is still binding after activate.

  // Treat an unloaded source with a live track as "buffering" too, so the play
  // button spins immediately after a tap while the engine spins up, not just
  // once expo-audio flips its own `isBuffering` flag. Suppress during queue hops.
  const isBuffering =
    Boolean(current) &&
    !ttsTrackActive &&
    !isTransitioning &&
    !transitionRef.current &&
    ((status.isBuffering ?? false) || !(status.isLoaded ?? false));

  const position = ttsTrackActive ? (ttsClock?.position ?? 0) : (status.currentTime ?? 0);
  const duration = ttsTrackActive
    ? (ttsClock?.duration ?? trackDurations[current?.id ?? ""] ?? 0)
    : (status.duration ?? 0);
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
    (Boolean(status.didJustFinish) || isSpeakingTranslation) &&
    queue.length > 0 &&
    (loopMode === "one" ||
      loopMode === "all" ||
      repeatPlan.mode !== "off" ||
      !atLastTrack ||
      isSpeakingTranslation);

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

  const isPlaying = ttsTrackActive
    ? Boolean(current) && !userPaused && !queueFinished
    : userPaused
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
      duration,
      queueDuration: smoothQueueDuration,
      isQueueFinished: queueFinished && queue.length > 0,
      rate,
      volume,
      loopMode,
      repeatPlan,
      translationAudio,
      isSpeakingTranslation,
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
      setTtsVoice,
      cycleLoopMode,
      setRepeatPlan,
      setTranslationAudio,
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
      duration,
      smoothQueueDuration,
      queueFinished,
      rate,
      volume,
      loopMode,
      repeatPlan,
      translationAudio,
      isSpeakingTranslation,
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
      setTtsVoice,
      cycleLoopMode,
      setRepeatPlan,
      setTranslationAudio,
      stop,
      readPlaybackSeconds,
    ],
  );

  const progressValue = useMemo<AudioProgressValue>(
    () => ({
      position,
      queuePosition: smoothQueuePosition,
      queueProgress: smoothQueueProgress,
    }),
    [position, smoothQueuePosition, smoothQueueProgress],
  );

  useLayoutEffect(() => {
    onValueChange(value);
  }, [onValueChange, value]);

  useLayoutEffect(() => {
    onProgressChange(progressValue);
  }, [onProgressChange, progressValue]);

  // Parent shell owns AudioContext.Provider + children (avoids remount / context gaps).
  return null;
}
