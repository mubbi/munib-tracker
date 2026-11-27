import { useEffect, useState } from "react";
import {
  queuePosition as computeQueuePosition,
  queueDurationForProgress,
} from "@/lib/audio-queue-timing";
import type { AudioTrack } from "@/providers/audio-player-provider";

/** rAF-driven progress from the engine clock — smooth without status polling. */
export function useLivePlaybackUi({
  readSeconds,
  isPlaying,
  isTransitioning,
  hasQueue,
  queue,
  index,
  trackDurations,
  heldPosition,
  heldProgress,
  trackDuration,
}: {
  readSeconds: () => number;
  isPlaying: boolean;
  isTransitioning: boolean;
  hasQueue: boolean;
  queue: AudioTrack[];
  index: number;
  trackDurations: Record<string, number>;
  heldPosition: number;
  heldProgress: number;
  trackDuration: number;
}) {
  const frozen = !isPlaying || isTransitioning;
  const [live, setLive] = useState({ position: heldPosition, progress: heldProgress });

  useEffect(() => {
    if (frozen) {
      setLive({ position: heldPosition, progress: heldProgress });
      return;
    }

    let frame = 0;
    // Same values → same state object, so React skips the re-render. The clock
    // often stands still between frames (TTS has no engine clock; buffering,
    // sub-frame updates), and a new object every frame re-rendered the whole
    // player at 60 fps for nothing.
    const publish = (position: number, progress: number) =>
      setLive((prev) =>
        prev.position === position && prev.progress === progress ? prev : { position, progress },
      );
    const tick = () => {
      const trackPos = Math.max(0, readSeconds());
      if (hasQueue) {
        const position = computeQueuePosition(queue, index, trackPos, trackDurations);
        const duration = queueDurationForProgress(queue, index, trackPos, trackDurations);
        publish(position, duration > 0 ? Math.min(position / duration, 1) : 0);
      } else {
        publish(trackPos, trackDuration > 0 ? Math.min(trackPos / trackDuration, 1) : 0);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [
    frozen,
    readSeconds,
    hasQueue,
    queue,
    index,
    trackDurations,
    heldPosition,
    heldProgress,
    trackDuration,
  ]);

  return frozen ? { position: heldPosition, progress: heldProgress } : live;
}
