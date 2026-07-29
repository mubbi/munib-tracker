import type { AudioPlayer } from "expo-audio";

/**
 * Change playback speed without shifting pitch (time-stretch instead of varispeed).
 *
 * expo-audio defaults to varispeed on web unless pitch correction is enabled, and
 * Android requires `shouldCorrectPitch` before updating the rate.
 */
export function applyPlaybackRate(player: AudioPlayer, rate: number): void {
  player.shouldCorrectPitch = true;
  player.setPlaybackRate(rate, "high");
}
