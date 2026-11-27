import type { AudioPlayer } from "expo-audio";
import { type RefObject, useLayoutEffect } from "react";

import { followIndexAfterSwap, isQuranAyahTrack } from "@/lib/audio-player-queue";
import { queuePosition as computeQueuePosition } from "@/lib/audio-queue-timing";
import { isTV } from "@/lib/platform/is-tv";
import { speak as speakTts } from "@/lib/tts";
import type {
  AudioTrack,
  LoopMode,
  QuranRepeatPlan,
  TranslationAudioMode,
} from "@/providers/audio-player-types";

import type { DoubleBufferedPlayers } from "./use-double-buffered-players";
import type { PlayIndexFn } from "./use-tts-playback";

/**
 * Whether the optional translation should be spoken after `finishingTrack`.
 * TV has no device TTS (expo-speech is stubbed) — a phone-synced "after"
 * preference must not stall the queue waiting for speech that never ends.
 */
export function shouldSpeakTranslationAfter(
  translationAudio: TranslationAudioMode,
  finishingTrack: AudioTrack | undefined,
  onTV: boolean,
): boolean {
  return (
    !onTV &&
    translationAudio === "after" &&
    isQuranAyahTrack(finishingTrack) &&
    Boolean(finishingTrack?.tts?.text?.trim())
  );
}

/**
 * Auto-advance when a file track finishes. Optional TTS translation runs first;
 * then the Qur'an repeat plan (when not off) or the generic loop mode decides
 * next. Hands off to the staged idle player when it is ready (gapless),
 * otherwise loads the next track fresh.
 *
 * A layout effect so `isTransitioning` flips before paint — avoids
 * play/progress flicker.
 */
export function useTrackFinishHandler({
  didJustFinish,
  finishedDuration: statusDuration,
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
  syncLockScreenForTrack,
  resolveNextIndexAfterFinish,
}: {
  didJustFinish: boolean | undefined;
  /** Engine-reported duration of the finishing source, if known. */
  finishedDuration: number | undefined;
  engine: DoubleBufferedPlayers;
  queueRef: RefObject<AudioTrack[]>;
  indexRef: RefObject<number>;
  trackDurationsRef: RefObject<Record<string, number>>;
  stableQueuePositionRef: RefObject<number>;
  finishHandlingRef: RefObject<boolean>;
  translationAudioRef: RefObject<TranslationAudioMode>;
  loopRef: RefObject<LoopMode>;
  repeatPlanRef: RefObject<QuranRepeatPlan>;
  setIndex: (index: number) => void;
  setQueueFinished: (finished: boolean) => void;
  setIsSpeakingTranslation: (speaking: boolean) => void;
  playIndex: PlayIndexFn;
  beginTransition: () => void;
  cacheTrackDuration: (id: string, seconds: number) => void;
  anchorQueueTimeline: (index: number) => void;
  applyRateVolume: (player: AudioPlayer) => void;
  stageNext: (tracks: AudioTrack[], nextIndex: number) => void;
  syncLockScreenForTrack: (
    player: AudioPlayer,
    track: AudioTrack,
    trackIndex: number,
    tracks: AudioTrack[],
  ) => void;
  resolveNextIndexAfterFinish: (
    index: number,
    finishingTrack: AudioTrack | undefined,
  ) => number | null;
}) {
  const { playersRef, activeSlotRef, stagedTrackIdRef, getIdleSlot, activateSlot } = engine;

  useLayoutEffect(() => {
    if (!didJustFinish) return;
    if (finishHandlingRef.current) return;

    const q = queueRef.current;
    const idx = indexRef.current;
    const finishingTrack = q[idx];
    const finishedDuration =
      statusDuration ?? trackDurationsRef.current[finishingTrack?.id ?? ""] ?? 0;
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
        activateSlot(idleSlot);
        setIndex(nextIdx);
        anchorQueueTimeline(nextIdx);
        if (nextTrack) {
          syncLockScreenForTrack(incoming, nextTrack, nextIdx, q);
        }
        stageNext(
          q,
          followIndexAfterSwap(nextIdx, q.length, loopRef.current, repeatPlanRef.current),
        );
        return;
      }

      // Not staged: load it fresh — but still move the queue cursor, or the UI
      // keeps showing the finished track and the next finish replays this one.
      setIndex(nextIdx);
      anchorQueueTimeline(nextIdx);
      beginTransition();
      playIndex(q, nextIdx, true);
    };

    finishHandlingRef.current = true;
    const nextIdx = resolveNextIndexAfterFinish(idx, finishingTrack);
    const tts = finishingTrack?.tts;

    if (shouldSpeakTranslationAfter(translationAudioRef.current, finishingTrack, isTV()) && tts) {
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
    didJustFinish,
    statusDuration,
    playIndex,
    beginTransition,
    cacheTrackDuration,
    anchorQueueTimeline,
    getIdleSlot,
    applyRateVolume,
    stageNext,
    syncLockScreenForTrack,
    resolveNextIndexAfterFinish,
    activateSlot,
    finishHandlingRef,
    queueRef,
    indexRef,
    trackDurationsRef,
    stableQueuePositionRef,
    translationAudioRef,
    loopRef,
    repeatPlanRef,
    playersRef,
    activeSlotRef,
    stagedTrackIdRef,
    setIndex,
    setQueueFinished,
    setIsSpeakingTranslation,
  ]);
}
