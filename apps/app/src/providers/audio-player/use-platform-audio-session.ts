import { type AudioPlayer, setAudioModeAsync } from "expo-audio";
import { type RefObject, useEffect } from "react";
import { Platform } from "react-native";

import { PLAYBACK_AUDIO_MODE } from "@/lib/audio-session-mode";
import { installWebPlayAbortGuard } from "@/lib/audio-web-media";
import type { AudioTrack } from "@/providers/audio-player-types";

import type { PlayerSlot } from "./use-double-buffered-players";

export type RemoteStatusEvent = { playing?: boolean; isLoaded?: boolean; didJustFinish?: boolean };

/**
 * The paused state a player status event implies for the in-app UI: playing →
 * not paused; a loaded, idle (not just-finished) source with a queue → paused
 * (the user paused from the lock screen / media notification); else no change.
 */
export function pausedStateFromStatusEvent(
  event: RemoteStatusEvent,
  queueLength: number,
): boolean | null {
  if (event.playing) return false;
  if (event.isLoaded && !event.didJustFinish && queueLength > 0) return true;
  return null;
}

/**
 * Platform audio-session plumbing for the global player:
 * - native: configure the session once and mirror lock-screen / media
 *   notification play-pause into the in-app UI;
 * - web: swallow expo-audio's benign `play()` AbortError.
 */
export function usePlatformAudioSession({
  playerA,
  playerB,
  activeSlotRef,
  transitionRef,
  queueRef,
  setUserPaused,
}: {
  playerA: AudioPlayer;
  playerB: AudioPlayer;
  activeSlotRef: RefObject<PlayerSlot>;
  transitionRef: RefObject<boolean>;
  queueRef: RefObject<AudioTrack[]>;
  setUserPaused: (paused: boolean) => void;
}) {
  // Configure the audio session once: keep playing through the iOS mute switch
  // (otherwise recitation is silent when the ringer is off) and in the background.
  // Native only — the web audio element ignores these.
  // Do NOT request notification permission here — that waits for onboarding or
  // first playback via ensureAndroidMediaNotificationPermission.
  useEffect(() => {
    if (Platform.OS === "web") return;
    // Shared with Qur'an practice, which restores exactly this after a take.
    setAudioModeAsync(PLAYBACK_AUDIO_MODE).catch(() => {
      // Non-fatal: playback still works, just without the preferred session mode.
    });
  }, []);

  // Keep in-app play/pause UI in sync when the user controls playback from the
  // lock screen or Android media notification (expo-audio drives the player directly).
  useEffect(() => {
    if (Platform.OS === "web") return;

    const onStatus = (slot: PlayerSlot) => (event: RemoteStatusEvent) => {
      if (slot !== activeSlotRef.current) return;
      if (transitionRef.current) return;
      const paused = pausedStateFromStatusEvent(event, queueRef.current.length);
      if (paused != null) setUserPaused(paused);
    };

    const subA = playerA.addListener("playbackStatusUpdate", onStatus(0));
    const subB = playerB.addListener("playbackStatusUpdate", onStatus(1));
    return () => {
      subA.remove();
      subB.remove();
    };
  }, [playerA, playerB, activeSlotRef, transitionRef, queueRef, setUserPaused]);

  // Web: swallow the benign AbortError expo-audio's fire-and-forget `play()`
  // leaves unhandled when playback is interrupted (see installWebPlayAbortGuard).
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    return installWebPlayAbortGuard();
  }, []);
}
