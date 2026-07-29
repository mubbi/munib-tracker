import { chunkTextForTts } from "@/lib/tts";
import type { AudioTrack } from "@/providers/audio-player-types";

/** Rough spoken duration estimate at 1× (used for progress UI while TTS runs). */
export function estimateTtsDurationSeconds(text: string, rate = 1): number {
  const chars = text.replace(/\s+/g, " ").trim().length;
  if (chars === 0) return 0;
  const charsPerSecond = 14 * Math.max(0.35, rate);
  return Math.max(1.5, chars / charsPerSecond);
}

/**
 * Split reading text into queueable TTS segments (sentences, falling back to
 * platform-safe chunks) so next/previous in the mini-player skips phrases.
 */
export function splitReadingTtsSegments(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const bySentence = normalized
    .split(/(?<=[.!?۔؟\n])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (bySentence.length > 1) return bySentence;
  return chunkTextForTts(normalized, 420);
}

export type BuildReadingTtsQueueOptions = {
  id: string;
  title: string;
  subtitle?: string;
  text: string;
  lang: string;
  voice?: string;
};

/**
 * Build a mini-player queue that plays via platform TTS (no audio file URI).
 */
export function buildReadingTtsQueue(options: BuildReadingTtsQueueOptions): AudioTrack[] {
  const segments = splitReadingTtsSegments(options.text);
  if (segments.length === 0) return [];

  return segments.map((segment, index) => ({
    id: `${options.id}:tts:${index}`,
    title: options.title,
    subtitle:
      segments.length > 1
        ? `${options.subtitle ? `${options.subtitle} · ` : ""}${index + 1}/${segments.length}`
        : options.subtitle,
    preview: segment.slice(0, 80),
    uri: "",
    ttsPlayback: {
      text: segment,
      lang: options.lang,
      voice: options.voice,
    },
  }));
}

export function isTtsPlaybackTrack(
  track: AudioTrack | null | undefined,
): track is AudioTrack & { ttsPlayback: NonNullable<AudioTrack["ttsPlayback"]> } {
  return Boolean(track?.ttsPlayback?.text?.trim());
}
