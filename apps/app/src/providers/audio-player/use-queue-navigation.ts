import { type Dispatch, type RefObject, type SetStateAction, useCallback } from "react";

import { nextQueueIndex, previousQueueIndex } from "@/lib/audio-player-queue";
import { locateQueuePosition, queueStartBoundary } from "@/lib/audio-queue-timing";
import { triggerHaptic } from "@/lib/haptics";
import type { AudioTrack, LoopMode } from "@/providers/audio-player-types";

import type { PlayIndexFn } from "./use-tts-playback";

/** Queue cursor moves: next / previous / jump / replay and queue-wide seeks. */
export function useQueueNavigation({
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
}: {
  queueRef: RefObject<AudioTrack[]>;
  indexRef: RefObject<number>;
  loopRef: RefObject<LoopMode>;
  trackDurationsRef: RefObject<Record<string, number>>;
  stableQueuePositionRef: RefObject<number>;
  pendingSeekRef: RefObject<number | null>;
  setIndex: Dispatch<SetStateAction<number>>;
  setQueueFinished: (finished: boolean) => void;
  setUserPaused: (paused: boolean) => void;
  playIndex: PlayIndexFn;
  seekTo: (seconds: number) => void;
}) {
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
    [
      playIndex,
      seekTo,
      setQueueFinished,
      setIndex,
      stableQueuePositionRef,
      queueRef,
      indexRef,
      trackDurationsRef,
      pendingSeekRef,
    ],
  );

  // Anchor the smoothed queue timeline to a track's start boundary so an
  // explicit jump (forward or backward) moves the bar cleanly rather than being
  // pinned by the monotonic hold from the previous track.
  const anchorQueueTimeline = useCallback(
    (targetIndex: number) => {
      stableQueuePositionRef.current = queueStartBoundary(
        queueRef.current,
        targetIndex,
        trackDurationsRef.current,
      );
    },
    [stableQueuePositionRef, queueRef, trackDurationsRef],
  );

  /** Move the cursor to `pickTarget`'s index (if any) and play it seamlessly. */
  const stepTo = useCallback(
    (pickTarget: (prev: number, length: number, loop: LoopMode) => number | null) => {
      setQueueFinished(false);
      setIndex((prev) => {
        const q = queueRef.current;
        const target = pickTarget(prev, q.length, loopRef.current);
        if (target == null) return prev;
        anchorQueueTimeline(target);
        playIndex(q, target, true);
        return target;
      });
    },
    [playIndex, anchorQueueTimeline, setQueueFinished, setIndex, queueRef, loopRef],
  );

  // Advance to the next track; wrap to the start when repeating the whole queue.
  const next = useCallback(() => stepTo(nextQueueIndex), [stepTo]);
  const previous = useCallback(() => stepTo(previousQueueIndex), [stepTo]);

  const jumpTo = useCallback(
    (i: number) => {
      const q = queueRef.current;
      if (i < 0 || i >= q.length) return;
      setQueueFinished(false);
      anchorQueueTimeline(i);
      setIndex(i);
      playIndex(q, i, q.length > 1);
    },
    [playIndex, anchorQueueTimeline, setQueueFinished, setIndex, queueRef],
  );

  const replay = useCallback(() => {
    triggerHaptic("light");
    setUserPaused(false);
    jumpTo(0);
  }, [jumpTo, setUserPaused]);

  return { seekToQueuePosition, anchorQueueTimeline, next, previous, jumpTo, replay };
}
