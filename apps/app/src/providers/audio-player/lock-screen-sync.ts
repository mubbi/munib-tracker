import type { AudioPlayer } from "expo-audio";

import {
  activateLockScreenControls,
  ensureAndroidMediaNotificationPermission,
  type LockScreenQueueContext,
} from "@/lib/audio-lock-screen";
import { queueDuration, queuePosition } from "@/lib/audio-queue-timing";
import type { AudioTrack } from "@/providers/audio-player-types";

/** Queue context the lock screen shows for `trackIndex` (positioned at the track's start). */
export function lockScreenQueueContext(
  tracks: AudioTrack[],
  trackIndex: number,
  durations: Record<string, number>,
): LockScreenQueueContext {
  return {
    queueIndex: trackIndex,
    queueLength: tracks.length,
    queuePosition: queuePosition(tracks, trackIndex, 0, durations),
    queueDuration: queueDuration(tracks, durations),
  };
}

/**
 * Point the native lock-screen Now Playing / Android media notification at
 * `track` on `targetPlayer`. Called once per track start or hand-off — do NOT
 * call `updateLockScreenMetadata` on every `currentTime` tick (Android logs
 * "service not connected" while the media service is still binding).
 */
export function syncLockScreenForTrack(
  targetPlayer: AudioPlayer,
  track: AudioTrack,
  trackIndex: number,
  tracks: AudioTrack[],
  durations: Record<string, number>,
): void {
  const queueCtx = lockScreenQueueContext(tracks, trackIndex, durations);
  // Prompt only if still undetermined (e.g. user skipped onboarding permissions).
  void ensureAndroidMediaNotificationPermission().then(() => {
    activateLockScreenControls(targetPlayer, track, queueCtx, track.id);
  });
}
