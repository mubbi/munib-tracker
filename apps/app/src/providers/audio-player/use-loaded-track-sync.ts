import type { AudioPlayer } from "expo-audio";
import { type RefObject, useEffect } from "react";

import type { AudioTrack } from "@/providers/audio-player-types";

/** Tolerance before `clipEnd` at which a clip counts as finished (engine tick granularity). */
const CLIP_END_TOLERANCE_S = 0.05;

/** Whether playback at `currentTime` has reached a clip's `clipEnd` (seconds). */
export function hasReachedClipEnd(clipEnd: number, currentTime: number): boolean {
  return currentTime >= clipEnd - CLIP_END_TOLERANCE_S;
}

/**
 * Once the active file source has loaded: record its real duration (and
 * re-apply speed / volume), apply a pending seek, and end Learn Qur'an
 * word/phrase clips at `clipEnd`.
 */
export function useLoadedTrackSync({
  current,
  queue,
  index,
  ttsTrackActive,
  isLoaded,
  isTransitioning,
  userPaused,
  playing,
  currentTime,
  loadedDuration,
  player,
  playersRef,
  activeSlotRef,
  pendingSeekRef,
  userPausedRef,
  setUserPaused,
  cacheTrackDuration,
  applyRateVolume,
  seekTo,
}: {
  current: AudioTrack | null;
  queue: AudioTrack[];
  index: number;
  ttsTrackActive: boolean;
  isLoaded: boolean;
  isTransitioning: boolean;
  userPaused: boolean;
  playing: boolean;
  currentTime: number | undefined;
  loadedDuration: number | undefined;
  player: AudioPlayer;
  playersRef: RefObject<[AudioPlayer, AudioPlayer]>;
  activeSlotRef: RefObject<0 | 1>;
  pendingSeekRef: RefObject<number | null>;
  userPausedRef: RefObject<boolean>;
  setUserPaused: (paused: boolean) => void;
  cacheTrackDuration: (id: string, seconds: number) => void;
  applyRateVolume: (player: AudioPlayer) => void;
  seekTo: (seconds: number) => void;
}) {
  // Replace estimates with the loaded duration for the active track.
  useEffect(() => {
    if (!current || ttsTrackActive || !isLoaded || isTransitioning) return;
    const duration = loadedDuration ?? 0;
    if (duration > 0) cacheTrackDuration(current.id, duration);
    // Re-apply after the native/web source loads so pitch correction sticks.
    applyRateVolume(player);
  }, [
    current,
    ttsTrackActive,
    isLoaded,
    isTransitioning,
    loadedDuration,
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
  }, [isLoaded, seekTo, ttsTrackActive, pendingSeekRef]);

  // End Learn Qur'an word/phrase clips once playback reaches clipEnd.
  useEffect(() => {
    if (ttsTrackActive || !isLoaded || userPaused) return;
    if (!playing) return;
    const track = queue[index];
    const clipEnd = track?.clipEnd;
    if (clipEnd == null || !track) return;
    if (!hasReachedClipEnd(clipEnd, currentTime ?? 0)) return;
    try {
      playersRef.current[activeSlotRef.current].pause();
    } catch {
      // ignore
    }
    setUserPaused(true);
    userPausedRef.current = true;
  }, [
    ttsTrackActive,
    isLoaded,
    userPaused,
    playing,
    currentTime,
    queue,
    index,
    playersRef,
    activeSlotRef,
    setUserPaused,
    userPausedRef,
  ]);
}
