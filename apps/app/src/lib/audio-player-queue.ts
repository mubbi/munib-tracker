/**
 * Pure queue / playback-state rules for the global audio player
 * (`providers/audio-player-provider.tsx`). Kept free of React and expo-audio so
 * the auto-advance, loop and timeline-smoothing decisions are unit-testable.
 */
import {
  getCachedTrackDuration,
  queueDuration,
  queueStartBoundary,
} from "@/lib/audio-queue-timing";
import { nextIndexForRepeatPlan } from "@/lib/quran-repeat";
import { estimateTtsDurationSeconds, isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import type { AudioTrack, LoopMode, QuranRepeatPlan } from "@/providers/audio-player-types";

/** Cycle order: off → repeat all → repeat once → off. */
const LOOP_CYCLE: LoopMode[] = ["off", "all", "one"];

/** The loop mode after `prev` in the off → all → one → off cycle. */
export function nextLoopMode(prev: LoopMode): LoopMode {
  return LOOP_CYCLE[(LOOP_CYCLE.indexOf(prev) + 1) % LOOP_CYCLE.length];
}

/** Qur'an ayah track ids look like `2:255` — used to scope repeat/TTS to scripture queues. */
export function isQuranAyahTrack(track: AudioTrack | null | undefined): boolean {
  return Boolean(track?.id && /^\d+:\d+$/.test(track.id));
}

export type FinishedTrackNextIndex = {
  /** Queue index to play next, or `null` when the queue is done. */
  nextIndex: number | null;
  /** "Repeat once" was used up — the caller resets the loop mode to `off`. */
  consumedLoopOne: boolean;
};

/**
 * Which track plays after `index` finishes: the Qur'an repeat plan (ayah queues
 * only) wins, then the generic loop mode, else the next track or stop at the end.
 */
export function nextIndexAfterFinish({
  index,
  queueLength,
  repeatPlan,
  loopMode,
  finishingTrack,
}: {
  index: number;
  queueLength: number;
  repeatPlan: QuranRepeatPlan;
  loopMode: LoopMode;
  finishingTrack: AudioTrack | null | undefined;
}): FinishedTrackNextIndex {
  // Quran repeat modes only apply to ayah queues — never leak into adhkar/etc.
  if (repeatPlan.mode !== "off" && isQuranAyahTrack(finishingTrack)) {
    return {
      nextIndex: nextIndexForRepeatPlan(index, queueLength, repeatPlan),
      consumedLoopOne: false,
    };
  }
  if (loopMode === "one") return { nextIndex: index, consumedLoopOne: true };
  const atLast = queueLength > 0 && index >= queueLength - 1;
  if (atLast && loopMode !== "all") return { nextIndex: null, consumedLoopOne: false };
  return { nextIndex: index + 1 < queueLength ? index + 1 : 0, consumedLoopOne: false };
}

/** "Next": the following track, wrapping to the start when repeating all; `null` = stay. */
export function nextQueueIndex(prev: number, queueLength: number, loopMode: LoopMode) {
  const nextIndex = prev + 1;
  if (nextIndex < queueLength) return nextIndex;
  if (loopMode === "all" && queueLength > 0) return 0;
  return null;
}

/** "Previous": the preceding track, wrapping to the end when repeating all; `null` = stay. */
export function previousQueueIndex(prev: number, queueLength: number, loopMode: LoopMode) {
  const prevIndex = prev - 1;
  if (prevIndex >= 0) return prevIndex;
  if (loopMode === "all" && queueLength > 0) return queueLength - 1;
  return null;
}

/**
 * After a gapless swap to `nextIndex`, the track to stage into the now-idle
 * player: the following one, or the queue start when the queue loops.
 */
export function followIndexAfterSwap(
  nextIndex: number,
  queueLength: number,
  loopMode: LoopMode,
  repeatPlan: QuranRepeatPlan,
): number {
  return nextIndex + 1 < queueLength
    ? nextIndex + 1
    : loopMode === "all" || repeatPlan.mode === "surah"
      ? 0
      : nextIndex + 1;
}

/**
 * Store a measured/estimated duration, keeping the same map when it is within a
 * quarter second of the known value (avoids re-rendering on clock jitter).
 */
export function mergeTrackDuration(
  prev: Record<string, number>,
  id: string,
  seconds: number,
): Record<string, number> {
  const existing = prev[id];
  if (existing != null && Math.abs(existing - seconds) < 0.25) return prev;
  return { ...prev, [id]: seconds };
}

/**
 * Duration estimates known when a queue starts: TTS tracks get an estimate at
 * the current speaking `rate`; file tracks use a cached real duration if one
 * was seen before (the rest are filled in as they load / prefetch).
 */
export function initialQueueDurations(tracks: AudioTrack[], rate: number): Record<string, number> {
  const durations: Record<string, number> = {};
  for (const track of tracks) {
    if (isTtsPlaybackTrack(track) && track.ttsPlayback) {
      durations[track.id] = estimateTtsDurationSeconds(track.ttsPlayback.text, rate);
      continue;
    }
    const cached = getCachedTrackDuration(track.uri);
    if (cached != null) durations[track.id] = cached;
  }
  return durations;
}

/**
 * True while a finished track is about to hand off to another (or the
 * translation TTS is speaking first) — the UI keeps showing "playing".
 */
export function willAutoAdvanceQueue({
  didJustFinish,
  isSpeakingTranslation,
  queueLength,
  index,
  loopMode,
  repeatPlan,
}: {
  didJustFinish: boolean;
  isSpeakingTranslation: boolean;
  queueLength: number;
  index: number;
  loopMode: LoopMode;
  repeatPlan: QuranRepeatPlan;
}): boolean {
  const atLastTrack = queueLength > 0 && index >= queueLength - 1;
  return (
    (didJustFinish || isSpeakingTranslation) &&
    queueLength > 0 &&
    (loopMode === "one" ||
      loopMode === "all" ||
      repeatPlan.mode !== "off" ||
      !atLastTrack ||
      isSpeakingTranslation)
  );
}

/** What the play/pause control shows. */
export function derivePlayerIsPlaying({
  ttsTrackActive,
  hasCurrent,
  userPaused,
  queueFinished,
  statusPlaying,
  isQueueSessionActive,
  isTransitioning,
  willAutoAdvance,
}: {
  ttsTrackActive: boolean;
  hasCurrent: boolean;
  userPaused: boolean;
  queueFinished: boolean;
  statusPlaying: boolean;
  isQueueSessionActive: boolean;
  isTransitioning: boolean;
  willAutoAdvance: boolean;
}): boolean {
  return ttsTrackActive
    ? hasCurrent && !userPaused && !queueFinished
    : userPaused
      ? statusPlaying
      : isQueueSessionActive
        ? true
        : statusPlaying || isTransitioning || willAutoAdvance;
}

export type QueueTimelineHold = { position: number; duration: number };

/**
 * Smooth the queue-wide scrubber across track hand-offs.
 *
 * While `hold` (transitioning / about to auto-advance) the engine clock may
 * still report the *previous* track's time even though `index` has already
 * advanced — feeding that stale position into the queue position would
 * overshoot to the end of the incoming track. Anchor to the new track's start
 * boundary instead, keeping the value monotonic so the auto-advance render
 * (where `index` briefly lags) doesn't dip below the finishing track's end.
 *
 * Returns the next held values (the caller stores them) and what to show.
 */
export function smoothQueueTimeline({
  hold,
  held,
  queue,
  index,
  trackDurations,
  computedPosition,
  computedDuration,
}: {
  hold: boolean;
  held: QueueTimelineHold;
  queue: AudioTrack[];
  index: number;
  trackDurations: Record<string, number>;
  computedPosition: number;
  computedDuration: number;
}): { held: QueueTimelineHold; position: number; duration: number; progress: number } {
  let heldPosition = held.position;
  let heldDuration = held.duration;
  if (hold) {
    const boundaryPosition = queueStartBoundary(queue, index, trackDurations);
    heldPosition = Math.max(heldPosition, boundaryPosition);
    const boundaryDuration = queueDuration(queue, trackDurations);
    if (boundaryDuration > 0) {
      heldDuration = Math.max(heldDuration, boundaryDuration);
    }
  } else {
    heldPosition = computedPosition;
    heldDuration = Math.max(computedDuration, 0);
  }

  const duration = hold && heldDuration > 0 ? heldDuration : computedDuration;
  const position = hold ? heldPosition : computedPosition;
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  return { held: { position: heldPosition, duration: heldDuration }, position, duration, progress };
}
