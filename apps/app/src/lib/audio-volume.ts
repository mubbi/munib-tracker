import type { AudioPlayer } from "expo-audio";
import { Platform } from "react-native";

/** Safari/WebKit on iOS blocks programmatic media volume; only hardware buttons work. */
export function supportsProgrammaticVolume(): boolean {
  if (Platform.OS !== "web" || typeof navigator === "undefined") return true;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return false;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  if (nav.userAgentData?.platform === "iOS") return false;
  return true;
}

/** Clamp and apply in-app playback volume (0 = silent, 1 = full). */
export function applyVolume(player: AudioPlayer, volume: number): void {
  if (!supportsProgrammaticVolume()) return;
  player.volume = Math.max(0, Math.min(1, volume));
}
