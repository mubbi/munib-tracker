import type { AudioPlayer } from "expo-audio";

/** Clamp and apply in-app playback volume (0 = silent, 1 = full). */
export function applyVolume(player: AudioPlayer, volume: number): void {
  player.volume = Math.max(0, Math.min(1, volume));
}
