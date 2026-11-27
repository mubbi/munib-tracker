import type { SymbolViewProps } from "expo-symbols";
import { AUDIO_SPEEDS } from "@/providers/audio-player-provider";

export function volumeIconForLevel(volume: number): SymbolViewProps["name"] {
  if (volume <= 0) {
    return { ios: "speaker.slash.fill", android: "volume_off", web: "volume_off" };
  }
  if (volume < 0.5) {
    return { ios: "speaker.fill", android: "volume_down", web: "volume_down" };
  }
  return { ios: "speaker.wave.3.fill", android: "volume_up", web: "volume_up" };
}

const ONE_HOUR_SECONDS = 60 * 60;

/** Formats playback seconds as M:SS, or H:MM:SS when reference duration exceeds 60 minutes. */
export function formatTime(seconds: number, referenceDuration = seconds): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return referenceDuration >= ONE_HOUR_SECONDS ? "0:00:00" : "0:00";
  }
  const total = Math.floor(seconds);
  if (referenceDuration >= ONE_HOUR_SECONDS) {
    const h = Math.floor(total / ONE_HOUR_SECONDS);
    const m = Math.floor((total % ONE_HOUR_SECONDS) / 60);
    const s = total % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function nextPlaybackRate(rate: number): number {
  const idx = AUDIO_SPEEDS.indexOf(rate);
  return AUDIO_SPEEDS[(idx + 1) % AUDIO_SPEEDS.length] ?? 1;
}
