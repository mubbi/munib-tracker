import type { QuranWord } from "@munib-tracker/shared/types";
import { useEffect, useRef, useState } from "react";
import type { AyahFocusTracker } from "@/components/quran/surah-reader/ayah-focus-tracker";
import { quranComRecitationId } from "@/constants/tajweed";
import { useAyahWordSegments } from "@/hooks/use-quran";
import { activeWordIndexAt } from "@/lib/quran-word-timing";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

/**
 * Recitation follow-along for the ayah list: the TV focus tracker (which ayah
 * played before the current track) and, in word-by-word view, the word being
 * recited — real per-word timings when the reciter has them, else a
 * proportional split of the track duration. Ticks on `requestAnimationFrame`
 * only while this surah's audio is playing.
 */
export function useAudioFollowAlong({
  surahNumber,
  playingAyahNumber,
  showWordByWord,
  reciterDir,
  wordByWordByAyah,
}: {
  surahNumber: number;
  /** Ayah of this surah currently in the player, or `null`. */
  playingAyahNumber: number | null;
  showWordByWord: boolean;
  reciterDir: string;
  wordByWordByAyah: Record<string, QuranWord[]>;
}) {
  const audio = useAudioPlayerContext();
  // Primitives / stable methods only — the context value is a new object on
  // duration / buffering ticks; durations are read through refs in the rAF loop.
  const audioIsPlaying = audio.isPlaying;
  const currentAudioId = audio.current?.id;
  const readPlaybackSeconds = audio.readPlaybackSeconds;
  const audioDurationRef = useRef(audio.duration);
  audioDurationRef.current = audio.duration;
  const trackDurationsRef = useRef(audio.trackDurations);
  trackDurationsRef.current = audio.trackDurations;

  const ayahFocusRef = useRef<AyahFocusTracker>({ focused: null, prevPlaying: null });
  // Runs after the render that activated the new ayah, so cards compare the
  // focused ayah against the *previous* track when deciding to follow along.
  useEffect(() => {
    ayahFocusRef.current.prevPlaying = playingAyahNumber;
  }, [playingAyahNumber]);

  const segmentsQuery = useAyahWordSegments(
    quranComRecitationId(reciterDir),
    surahNumber,
    playingAyahNumber,
    showWordByWord && playingAyahNumber != null,
  );

  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  useEffect(() => {
    if (!showWordByWord || playingAyahNumber == null || !audioIsPlaying) {
      setActiveWordIndex(null);
      return;
    }
    const segments = segmentsQuery.data;
    const wordsForAyah = wordByWordByAyah[String(playingAyahNumber)] ?? [];
    const wordCount = wordsForAyah.length;
    // Need either real timings or a word count for the proportional fallback.
    if (!segments?.length && wordCount === 0) {
      setActiveWordIndex(null);
      return;
    }
    const playingTrackId = currentAudioId ?? "";
    let cancelled = false;
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const durationSec =
        audioDurationRef.current > 0
          ? audioDurationRef.current
          : (trackDurationsRef.current[playingTrackId] ?? 0);
      const next = activeWordIndexAt(readPlaybackSeconds(), segments, {
        wordCount,
        durationSec,
      });
      setActiveWordIndex((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [
    showWordByWord,
    playingAyahNumber,
    audioIsPlaying,
    readPlaybackSeconds,
    currentAudioId,
    segmentsQuery.data,
    wordByWordByAyah,
  ]);

  return { ayahFocusRef, activeWordIndex };
}
