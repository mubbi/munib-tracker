import { useEffect } from "react";
import { Platform } from "react-native";

import { isQuranAyahTrack } from "@/lib/audio-player-queue";
import { queuePosition as computeQueuePosition, queueDuration } from "@/lib/audio-queue-timing";
import { setMediaSessionQueueHandlers } from "@/lib/audio-web-media";
import type { AudioTrack } from "@/providers/audio-player-types";

/**
 * Web Media Session wiring for the global player: route next/previous track
 * actions through the queue, and present a grouped Qur'an ayah queue as one
 * scrubbable item on the lock screen. (Native lock-screen Now Playing is set
 * per track in `syncLockScreenForTrack`.)
 */
export function useWebMediaSession({
  current,
  queue,
  index,
  currentTime,
  trackDurations,
  rate,
  next,
  previous,
}: {
  current: AudioTrack | null;
  queue: AudioTrack[];
  index: number;
  currentTime: number | undefined;
  trackDurations: Record<string, number>;
  rate: number;
  next: () => void;
  previous: () => void;
}) {
  // Web: override Media Session next/prev with real queue navigation.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof navigator === "undefined" || !navigator.mediaSession) {
      return;
    }
    if (!current || queue.length <= 1) {
      setMediaSessionQueueHandlers(null);
      return;
    }
    setMediaSessionQueueHandlers({ next, previous });
    return () => setMediaSessionQueueHandlers(null);
  }, [current, queue.length, next, previous]);

  // Web: present grouped Qur'an queue as one scrubbable item on the lock screen.
  useEffect(() => {
    if (Platform.OS !== "web" || !current || queue.length <= 1) return;
    if (!isQuranAyahTrack(current)) return;
    const playbackPosition = currentTime ?? 0;
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
  }, [current, queue, index, currentTime, trackDurations, rate]);
}
