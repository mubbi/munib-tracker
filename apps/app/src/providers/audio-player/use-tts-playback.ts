import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { ttsElapsedPosition } from "@/lib/audio-player-tts";
import {
  canPauseTts,
  pauseTts,
  playerRateToSpeechRate,
  resumeTts,
  speak as speakTts,
  stopTts,
} from "@/lib/tts";
import { estimateTtsDurationSeconds, isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import type { AudioTrack } from "@/providers/audio-player-types";

import { useLatestRef } from "./use-latest-ref";

export type TtsClock = { position: number; duration: number };

type TtsSpeech = NonNullable<AudioTrack["ttsPlayback"]>;

export type PlayIndexFn = (tracks: AudioTrack[], startIndex: number, seamless?: boolean) => void;

export type TtsPlaybackDeps = {
  queueRef: RefObject<AudioTrack[]>;
  indexRef: RefObject<number>;
  userPausedRef: RefObject<boolean>;
  setUserPaused: (paused: boolean) => void;
  trackDurationsRef: RefObject<Record<string, number>>;
  rateRef: RefObject<number>;
  pendingSeekRef: RefObject<number | null>;
  /** Late-bound `playIndex` (restarts the current TTS slice from `pendingSeekRef`). */
  playIndexRef: RefObject<PlayIndexFn>;
};

/**
 * TTS-only tracks (no expo-audio source): platform speech plus a synthetic
 * clock, because speech has no seekable media position. Seeking / rate / voice
 * changes restart the utterance from the word nearest the clock position.
 */
export function useTtsPlayback({
  queueRef,
  indexRef,
  userPausedRef,
  setUserPaused,
  trackDurationsRef,
  rateRef,
  pendingSeekRef,
  playIndexRef,
}: TtsPlaybackDeps) {
  const [ttsClock, setTtsClock] = useState<TtsClock | null>(null);
  const ttsClockRef = useLatestRef(ttsClock);
  const ttsDuration = ttsClock?.duration;

  const generationRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnchorRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const pausedPositionRef = useRef(0);
  const needsRestartRef = useRef(false);

  useEffect(
    () => () => {
      if (tickRef.current) clearInterval(tickRef.current);
    },
    [],
  );

  /** Clock position right now: live while speaking, frozen once paused. */
  const elapsedPosition = useCallback((duration: number) => {
    if (startedAtRef.current == null) return pausedPositionRef.current;
    return ttsElapsedPosition(
      duration,
      progressAnchorRef.current,
      startedAtRef.current,
      Date.now(),
    );
  }, []);

  const clearTtsClock = useCallback(() => {
    generationRef.current += 1;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    startedAtRef.current = null;
    progressAnchorRef.current = 0;
    pausedPositionRef.current = 0;
    setTtsClock(null);
  }, []);

  const startTtsTick = useCallback(
    (duration: number) => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        if (userPausedRef.current || startedAtRef.current == null) return;
        const position = ttsElapsedPosition(
          duration,
          progressAnchorRef.current,
          startedAtRef.current,
          Date.now(),
        );
        setTtsClock({ position, duration });
      }, 200);
    },
    [userPausedRef],
  );

  /** Start the synthetic clock (playing) for a slice beginning at `startPosition`. */
  const startTtsClock = useCallback(
    (startPosition: number, duration: number) => {
      progressAnchorRef.current = startPosition;
      pausedPositionRef.current = startPosition;
      startedAtRef.current = Date.now();
      setTtsClock({ position: startPosition, duration });
      userPausedRef.current = false;
      setUserPaused(false);
      needsRestartRef.current = false;
      startTtsTick(duration);
    },
    [userPausedRef, setUserPaused, startTtsTick],
  );

  /**
   * Speak `text` as the current slice. `onFinish` runs when it completes (unless
   * paused) or errors; a newer slice / clock reset supersedes it.
   */
  const speakTtsSlice = useCallback(
    (text: string, playback: TtsSpeech, duration: number, onFinish: () => void) => {
      const generation = ++generationRef.current;
      void (async () => {
        await stopTts();
        if (generation !== generationRef.current) return;
        await speakTts(text, {
          lang: playback.lang,
          voice: playback.voice,
          rate: playerRateToSpeechRate(rateRef.current),
          onDone: () => {
            if (generation !== generationRef.current) return;
            if (userPausedRef.current) return;
            setTtsClock({ position: duration, duration });
            onFinish();
          },
          onError: () => {
            if (generation !== generationRef.current) return;
            onFinish();
          },
        });
      })();
    },
    [rateRef, userPausedRef],
  );

  /** Play/pause toggle for a TTS track. */
  const toggleTts = useCallback(
    (track: AudioTrack) => {
      if (userPausedRef.current) {
        userPausedRef.current = false;
        setUserPaused(false);
        if (canPauseTts() && !needsRestartRef.current) {
          startedAtRef.current = Date.now();
          progressAnchorRef.current = pausedPositionRef.current;
          void resumeTts();
        } else {
          needsRestartRef.current = false;
          pendingSeekRef.current = pausedPositionRef.current;
          playIndexRef.current(queueRef.current, indexRef.current, false);
        }
        return;
      }
      const duration = ttsDuration ?? trackDurationsRef.current[track.id] ?? 0;
      const position = elapsedPosition(duration);
      pausedPositionRef.current = position;
      startedAtRef.current = null;
      setTtsClock(duration > 0 ? { position, duration } : null);
      userPausedRef.current = true;
      setUserPaused(true);
      if (canPauseTts()) {
        void pauseTts();
      } else {
        needsRestartRef.current = true;
        void stopTts();
      }
    },
    [
      ttsDuration,
      elapsedPosition,
      userPausedRef,
      setUserPaused,
      pendingSeekRef,
      playIndexRef,
      queueRef,
      indexRef,
      trackDurationsRef,
    ],
  );

  /** Seek within a TTS track: restart speech there, or move the paused clock. */
  const seekTts = useCallback(
    (track: AudioTrack, seconds: number) => {
      const duration =
        ttsDuration ??
        trackDurationsRef.current[track.id] ??
        estimateTtsDurationSeconds(track.ttsPlayback?.text ?? "", rateRef.current);
      const clamped = Math.min(Math.max(0, seconds), Math.max(duration, 0));
      needsRestartRef.current = true;
      if (userPausedRef.current) {
        pausedPositionRef.current = clamped;
        progressAnchorRef.current = clamped;
        setTtsClock({ position: clamped, duration });
        return;
      }
      pendingSeekRef.current = clamped;
      playIndexRef.current(queueRef.current, indexRef.current, false);
    },
    [
      ttsDuration,
      trackDurationsRef,
      rateRef,
      userPausedRef,
      pendingSeekRef,
      playIndexRef,
      queueRef,
      indexRef,
    ],
  );

  /** Restart the current (playing) TTS slice at a new speaking rate. */
  const restartTtsAtRate = useCallback(
    (nextRate: number) => {
      const track = queueRef.current[indexRef.current];
      if (!isTtsPlaybackTrack(track) || userPausedRef.current) return;
      const duration =
        trackDurationsRef.current[track.id] ??
        estimateTtsDurationSeconds(track.ttsPlayback?.text ?? "", nextRate);
      pendingSeekRef.current = elapsedPosition(duration);
      playIndexRef.current(queueRef.current, indexRef.current, false);
    },
    [
      queueRef,
      indexRef,
      userPausedRef,
      trackDurationsRef,
      pendingSeekRef,
      playIndexRef,
      elapsedPosition,
    ],
  );

  /**
   * After the queue's TTS voice changed (`nextQueue`), re-speak the current
   * slice from where it is — or just hold the clock there while paused.
   */
  const restartTtsForVoice = useCallback(
    (nextQueue: AudioTrack[]) => {
      const track = nextQueue[indexRef.current];
      if (!isTtsPlaybackTrack(track)) return;

      const duration =
        trackDurationsRef.current[track.id] ??
        estimateTtsDurationSeconds(track.ttsPlayback?.text ?? "", rateRef.current);
      const position = userPausedRef.current
        ? pausedPositionRef.current
        : elapsedPosition(duration);
      pausedPositionRef.current = position;
      progressAnchorRef.current = position;
      needsRestartRef.current = true;

      if (userPausedRef.current) {
        setTtsClock(duration > 0 ? { position, duration } : null);
        return;
      }

      pendingSeekRef.current = position;
      playIndexRef.current(nextQueue, indexRef.current, false);
    },
    [
      indexRef,
      trackDurationsRef,
      rateRef,
      userPausedRef,
      elapsedPosition,
      pendingSeekRef,
      playIndexRef,
    ],
  );

  /** Seconds into the current TTS slice (synthetic clock). */
  const readTtsSeconds = useCallback(
    () => ttsClockRef.current?.position ?? pausedPositionRef.current,
    [ttsClockRef],
  );

  return {
    ttsClock,
    clearTtsClock,
    startTtsClock,
    speakTtsSlice,
    toggleTts,
    seekTts,
    restartTtsAtRate,
    restartTtsForVoice,
    readTtsSeconds,
  };
}
