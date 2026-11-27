import { type AudioPlayer, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { type RefObject, useCallback, useRef, useState } from "react";

import { useLatestRef } from "./use-latest-ref";

export type PlayerSlot = 0 | 1;

export type DoubleBufferedPlayers = {
  playerA: AudioPlayer;
  playerB: AudioPlayer;
  /** The player in the active slot (render value). */
  player: AudioPlayer;
  /** Status of the active player (render value). */
  status: ReturnType<typeof useAudioPlayerStatus>;
  playersRef: RefObject<[AudioPlayer, AudioPlayer]>;
  activeSlotRef: RefObject<PlayerSlot>;
  /** Track id (if any) each slot currently holds loaded. */
  stagedTrackIdRef: RefObject<[string | null, string | null]>;
  /** Invalidates in-flight idle-player staging when the active queue hop changes. */
  preloadTokenRef: RefObject<number>;
  /**
   * Invalidates in-flight `playIndex` async loads (native cache peek → replace).
   * Separate from {@link preloadTokenRef} so staging the next track cannot cancel
   * the load that just kicked off staging.
   */
  playbackEpochRef: RefObject<number>;
  getActive: () => AudioPlayer;
  getIdleSlot: () => PlayerSlot;
  /** Make `slot` the active player (ref first, so handlers see it before the re-render). */
  activateSlot: (slot: PlayerSlot) => void;
  /** Pause both players, ignoring engine errors. */
  pauseAudioEngines: () => void;
};

/**
 * Double-buffered expo-audio players: one plays the current track while the
 * other is preloaded with the next one, so auto-advance is a near-instant
 * hand-off instead of a `replace()` teardown + reload (which caused the audible
 * gap). Slot bookkeeping lives in refs so async preloaders and the finish
 * handler read live values without stale closures.
 */
export function useDoubleBufferedPlayers(): DoubleBufferedPlayers {
  const playerA = useAudioPlayer();
  const playerB = useAudioPlayer();
  const statusA = useAudioPlayerStatus(playerA);
  const statusB = useAudioPlayerStatus(playerB);

  const [activeSlot, setActiveSlot] = useState<PlayerSlot>(0);

  const playersRef = useLatestRef<[AudioPlayer, AudioPlayer]>([playerA, playerB]);
  const activeSlotRef = useLatestRef<PlayerSlot>(activeSlot);
  const stagedTrackIdRef = useRef<[string | null, string | null]>([null, null]);
  const preloadTokenRef = useRef(0);
  const playbackEpochRef = useRef(0);

  const getActive = useCallback(
    (): AudioPlayer => playersRef.current[activeSlotRef.current],
    [playersRef, activeSlotRef],
  );
  const getIdleSlot = useCallback(
    (): PlayerSlot => (activeSlotRef.current === 0 ? 1 : 0),
    [activeSlotRef],
  );

  const activateSlot = useCallback(
    (slot: PlayerSlot) => {
      activeSlotRef.current = slot;
      setActiveSlot(slot);
    },
    [activeSlotRef],
  );

  const pauseAudioEngines = useCallback(() => {
    try {
      playersRef.current[0].pause();
      playersRef.current[1].pause();
    } catch {
      // ignore
    }
  }, [playersRef]);

  return {
    playerA,
    playerB,
    player: activeSlot === 0 ? playerA : playerB,
    status: activeSlot === 0 ? statusA : statusB,
    playersRef,
    activeSlotRef,
    stagedTrackIdRef,
    preloadTokenRef,
    playbackEpochRef,
    getActive,
    getIdleSlot,
    activateSlot,
    pauseAudioEngines,
  };
}
