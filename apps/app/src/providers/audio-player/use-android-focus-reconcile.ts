import { type RefObject, useEffect } from "react";
import { Platform } from "react-native";

import type { AudioTrack } from "@/providers/audio-player-types";

import type { DoubleBufferedPlayers } from "./use-double-buffered-players";

/** Android: how long a loaded source may sit idle (focus refused) before the UI shows paused. */
export const FOCUS_REFUSED_RECONCILE_MS = 1500;

export type FocusRefusalInput = {
  hasCurrent: boolean;
  ttsTrackActive: boolean;
  userPaused: boolean;
  queueFinished: boolean;
  isSpeakingTranslation: boolean;
  isTransitioning: boolean;
  isLoaded: boolean;
  playing: boolean;
  isBuffering: boolean;
  didJustFinish: boolean;
};

/**
 * Whether the render state looks like a refused `play()`: a loaded, idle,
 * non-buffering file source that should be playing (not paused, finished,
 * speaking a translation or mid-hop).
 */
export function looksLikeRefusedPlayback(s: FocusRefusalInput): boolean {
  if (!s.hasCurrent || s.ttsTrackActive || s.userPaused || s.queueFinished) return false;
  if (s.isSpeakingTranslation || s.isTransitioning || !s.isLoaded) return false;
  return !s.playing && !s.isBuffering && !s.didJustFinish;
}

/**
 * expo-audio 58 on Android refuses to start playback when audio focus is
 * denied (an ongoing call, another app holding exclusive focus). The refused
 * `play()` usually lands inside a seamless hand-off, whose status events are
 * ignored, so nothing would flip the UI to paused and a queue session would
 * keep showing "playing" in silence. Reconcile: a loaded, idle, non-buffering
 * source that should be playing is shown as paused (tap play to retry).
 */
export function useAndroidFocusReconcile({
  current,
  ttsTrackActive,
  userPaused,
  queueFinished,
  isSpeakingTranslation,
  isTransitioning,
  isLoaded,
  playing,
  isBuffering,
  didJustFinish,
  transitionRef,
  userPausedRef,
  setUserPaused,
  queueRef,
  indexRef,
  engine,
}: {
  current: AudioTrack | null;
  ttsTrackActive: boolean;
  userPaused: boolean;
  queueFinished: boolean;
  isSpeakingTranslation: boolean;
  isTransitioning: boolean;
  isLoaded: boolean;
  playing: boolean;
  isBuffering: boolean | undefined;
  didJustFinish: boolean | undefined;
  transitionRef: RefObject<boolean>;
  userPausedRef: RefObject<boolean>;
  setUserPaused: (paused: boolean) => void;
  queueRef: RefObject<AudioTrack[]>;
  indexRef: RefObject<number>;
  engine: DoubleBufferedPlayers;
}) {
  const { playersRef, activeSlotRef } = engine;

  useEffect(() => {
    if (Platform.OS !== "android" || !current) return;
    const suspect = looksLikeRefusedPlayback({
      hasCurrent: true,
      ttsTrackActive,
      userPaused,
      queueFinished,
      isSpeakingTranslation,
      isTransitioning,
      isLoaded,
      playing,
      isBuffering: Boolean(isBuffering),
      didJustFinish: Boolean(didJustFinish),
    });
    if (!suspect) return;
    const trackId = current.id;
    const timer = setTimeout(() => {
      if (transitionRef.current || userPausedRef.current) return;
      if (queueRef.current[indexRef.current]?.id !== trackId) return;
      const active = playersRef.current[activeSlotRef.current];
      try {
        if (!active.isLoaded || active.playing || active.isBuffering) return;
      } catch {
        return;
      }
      userPausedRef.current = true;
      setUserPaused(true);
    }, FOCUS_REFUSED_RECONCILE_MS);
    return () => clearTimeout(timer);
  }, [
    current,
    ttsTrackActive,
    userPaused,
    queueFinished,
    isSpeakingTranslation,
    isTransitioning,
    isLoaded,
    playing,
    isBuffering,
    didJustFinish,
    transitionRef,
    userPausedRef,
    setUserPaused,
    queueRef,
    indexRef,
    playersRef,
    activeSlotRef,
  ]);
}
