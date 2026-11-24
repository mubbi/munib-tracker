/**
 * Pure helpers for TTS-only tracks in the global audio player
 * (`providers/audio-player-provider.tsx`), which run on a synthetic clock
 * because platform speech has no seekable media position.
 */
import { isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import type { AudioTrack } from "@/providers/audio-player-types";

/** Approximate mid-utterance seek by slicing at a word boundary. */
export function sliceTtsTextFromProgress(text: string, progress: number): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0.02) return trimmed;
  if (p >= 0.98) return "";
  const approx = Math.floor(trimmed.length * p);
  const space = trimmed.indexOf(" ", approx);
  const cut = space >= 0 ? space + 1 : approx;
  const sliced = trimmed.slice(cut).trim();
  return sliced || trimmed.slice(approx).trim();
}

/**
 * Synthetic TTS clock: the position (seconds) reached `nowMs` after speech
 * started at `startedAtMs` from `anchorSeconds`, capped at `duration`.
 */
export function ttsElapsedPosition(
  duration: number,
  anchorSeconds: number,
  startedAtMs: number,
  nowMs: number,
): number {
  return Math.min(duration, anchorSeconds + (nowMs - startedAtMs) / 1000);
}

/** A pending seek (seconds) as a 0–1 fraction of the utterance; 0 when there is none. */
export function ttsSeekProgress(pendingSeekSeconds: number | null, duration: number): number {
  return pendingSeekSeconds != null && duration > 0
    ? Math.min(1, Math.max(0, pendingSeekSeconds / duration))
    : 0;
}

/**
 * The queue with every TTS track re-voiced to `voiceId` (`undefined` = the
 * platform default), or `null` when the queue has no TTS track to change.
 */
export function withTtsVoice(
  queue: AudioTrack[],
  voiceId: string | undefined,
): AudioTrack[] | null {
  if (!queue.some((track) => isTtsPlaybackTrack(track))) return null;
  return queue.map((track) =>
    track.ttsPlayback ? { ...track, ttsPlayback: { ...track.ttsPlayback, voice: voiceId } } : track,
  );
}
