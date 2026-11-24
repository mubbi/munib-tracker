import { type RefObject, useEffect } from "react";

import { invalidateCachedAudioUri } from "@/lib/audio-cache";
import type { AudioTrack } from "@/providers/audio-player-types";

import type { DoubleBufferedPlayers } from "./use-double-buffered-players";
import type { PlayIndexFn } from "./use-tts-playback";

/**
 * If the active remote/local source never becomes loaded, retry playback this
 * many times (first retry invalidates cache) before giving up.
 */
export const STUCK_LOAD_RETRY_LIMIT = 2;

/** Delay before treating a still-unloaded track as stuck and reloading. */
export const STUCK_LOAD_RETRY_MS = 8000;

/** How many times a still-unloaded source was auto-retried, per track id. */
export type StuckLoadRetries = { trackId: string; count: number };

export const NO_STUCK_LOAD_RETRIES: StuckLoadRetries = { trackId: "", count: 0 };

/**
 * Next retry step for a track that is still unloaded: the updated counter,
 * whether to reload at all (bounded by {@link STUCK_LOAD_RETRY_LIMIT}), and
 * whether to drop its cache entry first (first retry of a remote track only).
 */
export function planStuckLoadRetry(
  prev: StuckLoadRetries,
  trackId: string,
  remoteUri: string | undefined,
): { retries: StuckLoadRetries; reload: boolean; invalidateCache: boolean } {
  const count = prev.trackId === trackId ? prev.count + 1 : 1;
  const reload = count <= STUCK_LOAD_RETRY_LIMIT;
  return {
    retries: { trackId, count },
    reload,
    invalidateCache: reload && count === 1 && Boolean(remoteUri?.startsWith("http")),
  };
}

/**
 * Auto-recover when a track sits unloaded for too long (corrupt cache, aborted
 * replace after a rapid skip, or a hung CDN response). Matches the user
 * workaround of pressing next/prev — without requiring it.
 */
export function useStuckLoadRecovery({
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
}: {
  current: AudioTrack | null;
  ttsTrackActive: boolean;
  userPaused: boolean;
  isLoaded: boolean;
  isTransitioning: boolean;
  queueFinished: boolean;
  stuckLoadRetryRef: RefObject<StuckLoadRetries>;
  queueRef: RefObject<AudioTrack[]>;
  indexRef: RefObject<number>;
  engine: DoubleBufferedPlayers;
  playIndexRef: RefObject<PlayIndexFn>;
}) {
  const { playersRef, activeSlotRef } = engine;

  // Reset stuck-load retries once the engine actually accepts the source.
  useEffect(() => {
    if (!current || !isLoaded) return;
    if (stuckLoadRetryRef.current.trackId === current.id) {
      stuckLoadRetryRef.current = NO_STUCK_LOAD_RETRIES;
    }
  }, [current, isLoaded, stuckLoadRetryRef]);

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
      const plan = planStuckLoadRetry(stuckLoadRetryRef.current, trackId, remoteUri);
      stuckLoadRetryRef.current = plan.retries;
      if (!plan.reload) return;
      if (plan.invalidateCache) {
        void invalidateCachedAudioUri(remoteUri).catch(() => {});
      }
      playIndexRef.current(queueRef.current, indexRef.current, false);
    }, STUCK_LOAD_RETRY_MS);
    return () => clearTimeout(timer);
  }, [
    current,
    ttsTrackActive,
    userPaused,
    isLoaded,
    isTransitioning,
    queueFinished,
    queueRef,
    indexRef,
    playersRef,
    activeSlotRef,
    stuckLoadRetryRef,
    playIndexRef,
  ]);
}
