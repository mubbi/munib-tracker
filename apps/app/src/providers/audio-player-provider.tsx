import type { AudioPlayer } from "expo-audio";
import { type ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import { useAudioKeepAwake } from "@/lib/audio-keep-awake";
import { deactivateLockScreenControls } from "@/lib/audio-lock-screen";
import {
  derivePlayerIsPlaying,
  initialQueueDurations,
  mergeTrackDuration,
  nextIndexAfterFinish,
  nextLoopMode,
  smoothQueueTimeline,
  willAutoAdvanceQueue,
} from "@/lib/audio-player-queue";
import { sliceTtsTextFromProgress, ttsSeekProgress, withTtsVoice } from "@/lib/audio-player-tts";
import {
  queuePosition as computeQueuePosition,
  prefetchTrackDurations,
  queueDurationForProgress,
} from "@/lib/audio-queue-timing";
import { warmUpcomingTrackUris } from "@/lib/audio-track-source";
import { buildAudioActivity } from "@/lib/continue-activity";
import { triggerHaptic } from "@/lib/haptics";
import { setSetting } from "@/lib/settings/shortcuts";
import { stopTts } from "@/lib/tts";
import { estimateTtsDurationSeconds, isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import { AudioEngineBoundary } from "@/providers/audio-player/audio-engine-boundary";
import { syncLockScreenForTrack } from "@/providers/audio-player/lock-screen-sync";
import { useAndroidFocusReconcile } from "@/providers/audio-player/use-android-focus-reconcile";
import { useDoubleBufferedPlayers } from "@/providers/audio-player/use-double-buffered-players";
import { useLatestRef } from "@/providers/audio-player/use-latest-ref";
import { useLoadedTrackSync } from "@/providers/audio-player/use-loaded-track-sync";
import { usePlatformAudioSession } from "@/providers/audio-player/use-platform-audio-session";
import {
  AUDIO_SPEED_SETTING,
  useFollowSavedRateVolume,
  usePlaybackRateVolume,
} from "@/providers/audio-player/use-playback-rate-volume";
import { useQueueNavigation } from "@/providers/audio-player/use-queue-navigation";
import {
  useQueueTransition,
  useSettleTransition,
} from "@/providers/audio-player/use-queue-transition";
import {
  NO_STUCK_LOAD_RETRIES,
  type StuckLoadRetries,
  useStuckLoadRecovery,
} from "@/providers/audio-player/use-stuck-load-recovery";
import { useTrackFinishHandler } from "@/providers/audio-player/use-track-finish-handler";
import { useTrackLoader } from "@/providers/audio-player/use-track-loader";
import { type PlayIndexFn, useTtsPlayback } from "@/providers/audio-player/use-tts-playback";
import { useWebMediaSession } from "@/providers/audio-player/use-web-media-session";
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

/**
 * The live engine: composes the player hooks in `providers/audio-player/` and
 * publishes the context value. Hook call order is effect order — keep the
 * session / follow-settings / recovery / sync / finish / Media Session sequence.
 */
function AudioPlayerProviderLive({
  onValueChange,
  onProgressChange,
}: {
  onValueChange: (value: AudioContextValue) => void;
  onProgressChange: (value: AudioProgressValue) => void;
}) {
  const engine = useDoubleBufferedPlayers();
  const {
    playerA,
    playerB,
    player,
    status,
    playersRef,
    activeSlotRef,
    stagedTrackIdRef,
    preloadTokenRef,
    playbackEpochRef,
    getActive,
    getIdleSlot,
    activateSlot,
    pauseAudioEngines,
  } = engine;

  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>({});
  const [loopMode, setLoopMode] = useState<LoopMode>("off");
  const [repeatPlan, setRepeatPlanState] = useState<QuranRepeatPlan>({ mode: "off" });
  const [translationAudio, setTranslationAudioState] = useState<TranslationAudioMode>("off");
  const [isSpeakingTranslation, setIsSpeakingTranslation] = useState(false);
  const [sourceHref, setSourceHref] = useState<string | null>(null);
  const [queueFinished, setQueueFinished] = useState(false);
  /** User explicitly paused; auto-advance queues ignore raw `playing` gaps between tracks. */
  const [userPaused, setUserPaused] = useState(false);

  // Refs keep the finish handler current without re-subscribing every render.
  const indexRef = useLatestRef(index);
  const loopRef = useLatestRef(loopMode);
  const repeatPlanRef = useLatestRef(repeatPlan);
  const translationAudioRef = useLatestRef(translationAudio);
  const queueRef = useLatestRef(queue);
  const trackDurationsRef = useLatestRef(trackDurations);
  const userPausedRef = useLatestRef(userPaused);
  const finishHandlingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const stableQueueDurationRef = useRef(0);
  const stableQueuePositionRef = useRef(0);
  const stuckLoadRetryRef = useRef<StuckLoadRetries>(NO_STUCK_LOAD_RETRIES);
  const playIndexRef = useRef<PlayIndexFn>(() => {});

  const {
    rate,
    rateRef,
    volume,
    volumeRef,
    applyRateVolume,
    applyRateToPlayers,
    applyVolumeLevel,
    setVolume,
  } = usePlaybackRateVolume(playersRef);

  const {
    ttsClock,
    clearTtsClock,
    startTtsClock,
    speakTtsSlice,
    toggleTts,
    seekTts,
    restartTtsAtRate,
    restartTtsForVoice,
    readTtsSeconds,
  } = useTtsPlayback({
    queueRef,
    indexRef,
    userPausedRef,
    setUserPaused,
    trackDurationsRef,
    rateRef,
    pendingSeekRef,
    playIndexRef,
  });

  const {
    isTransitioning,
    transitionRef,
    startedAtRef: transitionStartedAtRef,
    fromTimeRef: transitionFromTimeRef,
    lastEngineTimeRef,
    beginTransition,
    clearTransition,
  } = useQueueTransition();

  const current = queue[index] ?? null;

  // Native session mode + lock-screen play/pause mirroring; web play() guard.
  usePlatformAudioSession({
    playerA,
    playerB,
    activeSlotRef,
    transitionRef,
    queueRef,
    setUserPaused,
  });

  const syncLockScreen = useCallback(
    (targetPlayer: AudioPlayer, track: AudioTrack, trackIndex: number, tracks: AudioTrack[]) =>
      syncLockScreenForTrack(targetPlayer, track, trackIndex, tracks, trackDurationsRef.current),
    [trackDurationsRef],
  );

  const { stageNext, loadFileTrack } = useTrackLoader({
    engine,
    applyRateVolume,
    syncLockScreenForTrack: syncLockScreen,
    pendingSeekRef,
  });

  const resolveNextIndexAfterFinish = useCallback(
    (idx: number, finishingTrack: AudioTrack | undefined) => {
      const { nextIndex, consumedLoopOne } = nextIndexAfterFinish({
        index: idx,
        queueLength: queueRef.current.length,
        repeatPlan: repeatPlanRef.current,
        loopMode: loopRef.current,
        finishingTrack,
      });
      if (consumedLoopOne) {
        loopRef.current = "off";
        setLoopMode("off");
      }
      return nextIndex;
    },
    [queueRef, repeatPlanRef, loopRef],
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
  }, [clearTtsClock, resolveNextIndexAfterFinish, queueRef, indexRef, trackDurationsRef]);

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
        setTrackDurations((prev) => mergeTrackDuration(prev, track.id, duration));
        trackDurationsRef.current[track.id] = duration;

        const fromProgress = ttsSeekProgress(pendingSeekRef.current, duration);
        pendingSeekRef.current = null;

        const speakText = sliceTtsTextFromProgress(fullText, fromProgress);
        startTtsClock(fromProgress * duration, duration);
        clearTransition();

        if (!speakText) {
          advanceAfterTtsFinish();
          return;
        }
        speakTtsSlice(speakText, playback, duration, advanceAfterTtsFinish);
        return;
      }

      // File / remote audio — stop any prior TTS clock.
      clearTtsClock();
      void stopTts();
      loadFileTrack(tracks, startIndex, playbackEpoch);
    },
    [
      beginTransition,
      clearTransition,
      pauseAudioEngines,
      stageNext,
      startTtsClock,
      speakTtsSlice,
      advanceAfterTtsFinish,
      clearTtsClock,
      loadFileTrack,
      preloadTokenRef,
      playbackEpochRef,
      stagedTrackIdRef,
      activeSlotRef,
      rateRef,
      trackDurationsRef,
    ],
  );
  playIndexRef.current = playIndex;

  const cacheTrackDuration = useCallback((id: string, seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    setTrackDurations((prev) => mergeTrackDuration(prev, id, seconds));
  }, []);

  const play = useCallback(
    (tracks: AudioTrack[], startIndex = 0, options?: { sourceHref?: string }) => {
      void stopTts();
      clearTtsClock();
      setIsSpeakingTranslation(false);
      finishHandlingRef.current = false;

      const initialDurations = initialQueueDurations(tracks, rateRef.current);

      // Reset the double-buffer to slot 0 for a fresh queue.
      try {
        playersRef.current[getIdleSlot()].pause();
      } catch {
        // ignore
      }
      activateSlot(0);
      stagedTrackIdRef.current = [null, null];
      stuckLoadRetryRef.current = NO_STUCK_LOAD_RETRIES;

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
    [
      playIndex,
      cacheTrackDuration,
      getIdleSlot,
      clearTtsClock,
      activateSlot,
      rateRef,
      playersRef,
      stagedTrackIdRef,
    ],
  );

  const toggle = useCallback(() => {
    // Instant tactile feedback on the tap, before the (possibly buffering) audio
    // engine responds.
    triggerHaptic("light");
    const track = queueRef.current[indexRef.current];
    if (isTtsPlaybackTrack(track)) {
      toggleTts(track);
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
  }, [getActive, status.playing, status.isLoaded, toggleTts, queueRef, indexRef]);

  const seekTo = useCallback(
    (seconds: number) => {
      setQueueFinished(false);
      stableQueuePositionRef.current = seconds;
      const track = queueRef.current[indexRef.current];
      if (isTtsPlaybackTrack(track)) {
        seekTts(track, seconds);
        return;
      }
      void getActive()
        .seekTo(seconds)
        .catch(() => {});
    },
    [getActive, seekTts, queueRef, indexRef],
  );

  const { seekToQueuePosition, anchorQueueTimeline, next, previous, jumpTo, replay } =
    useQueueNavigation({
      queueRef,
      indexRef,
      loopRef,
      trackDurationsRef,
      stableQueuePositionRef,
      pendingSeekRef,
      setIndex,
      setQueueFinished,
      setUserPaused,
      playIndex,
      seekTo,
    });

  /** Apply a speed to both players (and restart a playing TTS slice) without persisting it. */
  const applyRate = useCallback(
    (nextRate: number) => {
      applyRateToPlayers(nextRate);
      restartTtsAtRate(nextRate);
    },
    [applyRateToPlayers, restartTtsAtRate],
  );

  // The mini-player speed control is a shortcut to Settings › Audio & voice.
  const setRate = useCallback(
    (nextRate: number) => {
      applyRate(nextRate);
      void setSetting(AUDIO_SPEED_SETTING, nextRate);
    },
    [applyRate],
  );

  const setTtsVoice = useCallback(
    (voiceId: string | undefined) => {
      const nextQueue = withTtsVoice(queueRef.current, voiceId);
      if (!nextQueue) return;
      queueRef.current = nextQueue;
      setQueue(nextQueue);
      restartTtsForVoice(nextQueue);
    },
    [restartTtsForVoice, queueRef],
  );

  useFollowSavedRateVolume({ rateRef, volumeRef, applyRate, applyVolumeLevel });

  const cycleLoopMode = useCallback(() => {
    setLoopMode(nextLoopMode);
  }, []);

  const setRepeatPlan = useCallback(
    (plan: QuranRepeatPlan) => {
      setRepeatPlanState(plan);
      repeatPlanRef.current = plan;
    },
    [repeatPlanRef],
  );

  const setTranslationAudio = useCallback(
    (mode: TranslationAudioMode) => {
      setTranslationAudioState(mode);
      translationAudioRef.current = mode;
      if (mode === "off") {
        void stopTts();
        setIsSpeakingTranslation(false);
      }
    },
    [translationAudioRef],
  );

  const stop = useCallback(() => {
    void stopTts();
    clearTtsClock();
    setIsSpeakingTranslation(false);
    finishHandlingRef.current = false;
    // Cancel any in-flight async peek→replace from a prior playIndex.
    playbackEpochRef.current++;
    preloadTokenRef.current++;
    pauseAudioEngines();
    deactivateLockScreenControls(playersRef.current[0]);
    deactivateLockScreenControls(playersRef.current[1]);
    setQueue([]);
    setIndex(0);
    setTrackDurations({});
    setSourceHref(null);
    setQueueFinished(false);
    pendingSeekRef.current = null;
    stagedTrackIdRef.current = [null, null];
    stuckLoadRetryRef.current = NO_STUCK_LOAD_RETRIES;
    setUserPaused(false);
    clearTransition();
    stableQueueDurationRef.current = 0;
    stableQueuePositionRef.current = 0;
  }, [
    clearTransition,
    clearTtsClock,
    pauseAudioEngines,
    playbackEpochRef,
    preloadTokenRef,
    playersRef,
    stagedTrackIdRef,
  ]);

  const statusCurrentTimeRef = useLatestRef(status.currentTime);

  const readPlaybackSeconds = useCallback(() => {
    const track = queueRef.current[indexRef.current];
    if (isTtsPlaybackTrack(track)) return readTtsSeconds();
    try {
      return getActive().currentTime;
    } catch {
      return statusCurrentTimeRef.current ?? 0;
    }
  }, [getActive, readTtsSeconds, queueRef, indexRef, statusCurrentTimeRef]);

  const ttsTrackActive = isTtsPlaybackTrack(current);
  const isLoaded = ttsTrackActive ? true : (status.isLoaded ?? false);

  useStuckLoadRecovery({
    current,
    ttsTrackActive,
    userPaused,
    isLoaded,
    isTransitioning,
    queueFinished,
    stuckLoadRetryRef,
    queueRef,
    indexRef,
    engine,
    playIndexRef,
  });

  useAndroidFocusReconcile({
    current,
    ttsTrackActive,
    userPaused,
    queueFinished,
    isSpeakingTranslation,
    isTransitioning,
    isLoaded,
    playing: status.playing,
    isBuffering: status.isBuffering,
    didJustFinish: status.didJustFinish,
    transitionRef,
    userPausedRef,
    setUserPaused,
    queueRef,
    indexRef,
    engine,
  });

  useLoadedTrackSync({
    current,
    queue,
    index,
    ttsTrackActive,
    isLoaded,
    isTransitioning,
    userPaused,
    playing: status.playing,
    currentTime: status.currentTime,
    loadedDuration: status.duration,
    player,
    playersRef,
    activeSlotRef,
    pendingSeekRef,
    userPausedRef,
    setUserPaused,
    cacheTrackDuration,
    applyRateVolume,
    seekTo,
  });

  useSettleTransition({
    isTransitioning,
    isLoaded,
    currentTime: status.currentTime,
    startedAtRef: transitionStartedAtRef,
    fromTimeRef: transitionFromTimeRef,
    clearTransition,
  });

  useTrackFinishHandler({
    didJustFinish: status.didJustFinish,
    finishedDuration: status.duration,
    engine,
    queueRef,
    indexRef,
    trackDurationsRef,
    stableQueuePositionRef,
    finishHandlingRef,
    translationAudioRef,
    loopRef,
    repeatPlanRef,
    setIndex,
    setQueueFinished,
    setIsSpeakingTranslation,
    playIndex,
    beginTransition,
    cacheTrackDuration,
    anchorQueueTimeline,
    applyRateVolume,
    stageNext,
    syncLockScreenForTrack: syncLockScreen,
    resolveNextIndexAfterFinish,
  });

  useWebMediaSession({
    current,
    queue,
    index,
    currentTime: status.currentTime,
    trackDurations,
    rate,
    next,
    previous,
  });

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

  const isQueueSessionActive = queue.length > 1 && !queueFinished;
  const willAutoAdvance = willAutoAdvanceQueue({
    didJustFinish: Boolean(status.didJustFinish),
    isSpeakingTranslation,
    queueLength: queue.length,
    index,
    loopMode,
    repeatPlan,
  });

  // Smoothed queue scrubber: held at track boundaries across hand-offs (render
  // phase, refs only — see smoothQueueTimeline).
  const timeline = smoothQueueTimeline({
    hold: isTransitioning || transitionRef.current || willAutoAdvance,
    held: { position: stableQueuePositionRef.current, duration: stableQueueDurationRef.current },
    queue,
    index,
    trackDurations,
    computedPosition: computeQueuePosition(queue, index, position, trackDurations),
    computedDuration: queueDurationForProgress(queue, index, position, trackDurations),
  });
  stableQueuePositionRef.current = timeline.held.position;
  stableQueueDurationRef.current = timeline.held.duration;
  const smoothQueueDuration = timeline.duration;
  const smoothQueuePosition = timeline.position;
  const smoothQueueProgress = timeline.progress;

  const isPlaying = derivePlayerIsPlaying({
    ttsTrackActive,
    hasCurrent: Boolean(current),
    userPaused,
    queueFinished,
    statusPlaying: status.playing,
    isQueueSessionActive,
    isTransitioning,
    willAutoAdvance,
  });

  // Keep the screen on while audio (or translation TTS) is playing so users can
  // read along without the idle timer locking the display.
  useAudioKeepAwake(isPlaying, isSpeakingTranslation);

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
