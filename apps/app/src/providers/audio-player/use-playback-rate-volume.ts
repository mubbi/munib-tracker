import type { AudioPlayer } from "expo-audio";
import { type RefObject, useCallback, useEffect, useState } from "react";

import { applyPlaybackRate } from "@/lib/audio-playback-rate";
import { applyVolume } from "@/lib/audio-volume";
import { setSetting } from "@/lib/settings/shortcuts";
import { useSetting } from "@/lib/settings/use-setting";
import { usePreferencesReady } from "@/stores/preferences-store";

import { useLatestRef } from "./use-latest-ref";

/** Registered settings the player follows and writes (§4.5.4 shortcuts). */
export const AUDIO_SPEED_SETTING = "audio.speed";
export const AUDIO_VOLUME_SETTING = "audio.volume";

/** The slider writes whole percentages; a smaller gap is the rounding echo of its own write. */
const VOLUME_ECHO_TOLERANCE = 0.006;

/** Clamp a volume to the 0–1 range the players accept. */
export function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}

/**
 * Whether a stored volume percentage is just the rounding echo of the slider's
 * own whole-percent write of the live 0–1 level (so there is nothing to apply).
 */
export function isVolumeEcho(savedPct: number, liveVolume: number): boolean {
  return Math.abs(savedPct / 100 - liveVolume) < VOLUME_ECHO_TOLERANCE;
}

/** Playback speed + volume, applied to both double-buffered players. */
export function usePlaybackRateVolume(playersRef: RefObject<[AudioPlayer, AudioPlayer]>) {
  const [rate, setRateState] = useState(1);
  const rateRef = useLatestRef(rate);
  const [volume, setVolumeState] = useState(1);
  const volumeRef = useLatestRef(volume);

  /** Re-apply the current speed + volume to one player (e.g. after a source load). */
  const applyRateVolume = useCallback(
    (p: AudioPlayer) => {
      try {
        applyPlaybackRate(p, rateRef.current);
      } catch {
        // player not ready
      }
      try {
        applyVolume(p, volumeRef.current);
      } catch {
        // player not ready
      }
    },
    [rateRef, volumeRef],
  );

  /** Apply a speed to both players without persisting it. */
  const applyRateToPlayers = useCallback(
    (nextRate: number) => {
      setRateState(nextRate);
      rateRef.current = nextRate;
      try {
        applyPlaybackRate(playersRef.current[0], nextRate);
        applyPlaybackRate(playersRef.current[1], nextRate);
      } catch {
        // ignore
      }
    },
    [rateRef, playersRef],
  );

  /** Apply a 0–1 volume to both players without persisting it. */
  const applyVolumeLevel = useCallback(
    (nextVolume: number) => {
      const clamped = clampVolume(nextVolume);
      setVolumeState(clamped);
      volumeRef.current = clamped;
      try {
        applyVolume(playersRef.current[0], clamped);
        applyVolume(playersRef.current[1], clamped);
      } catch {
        // ignore
      }
      return clamped;
    },
    [volumeRef, playersRef],
  );

  // The mini-player volume slider is a shortcut to Settings › Audio & voice
  // (stored as a whole percentage, a device preference).
  const setVolume = useCallback(
    (nextVolume: number) => {
      const clamped = applyVolumeLevel(nextVolume);
      void setSetting(AUDIO_VOLUME_SETTING, Math.round(clamped * 100));
    },
    [applyVolumeLevel],
  );

  return {
    rate,
    rateRef,
    volume,
    volumeRef,
    applyRateVolume,
    applyRateToPlayers,
    applyVolumeLevel,
    setVolume,
  };
}

/**
 * Follow the stored speed / volume — on load and whenever Settings (or a sync
 * pull) changes them — so a running player picks the change up immediately.
 */
export function useFollowSavedRateVolume({
  rateRef,
  volumeRef,
  applyRate,
  applyVolumeLevel,
}: {
  rateRef: RefObject<number>;
  volumeRef: RefObject<number>;
  applyRate: (rate: number) => void;
  applyVolumeLevel: (volume: number) => number;
}) {
  const prefsReady = usePreferencesReady();
  const savedSpeed = useSetting<number>(AUDIO_SPEED_SETTING).value;
  const savedVolumePct = useSetting<number>(AUDIO_VOLUME_SETTING).value;

  useEffect(() => {
    if (!prefsReady || !savedSpeed || savedSpeed === rateRef.current) return;
    applyRate(savedSpeed);
  }, [prefsReady, savedSpeed, applyRate, rateRef]);

  useEffect(() => {
    if (!prefsReady) return;
    if (isVolumeEcho(savedVolumePct, volumeRef.current)) return;
    applyVolumeLevel(savedVolumePct / 100);
  }, [prefsReady, savedVolumePct, applyVolumeLevel, volumeRef]);
}
