import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FOCUS_HIGHLIGHT_FADE_MS,
  FOCUS_HIGHLIGHT_HOLD_MS,
} from "@/components/quran/surah-reader/constants";
import { focusWordTarget } from "@/lib/quran-surah-reader";

const FOCUS_HIGHLIGHT_MS = FOCUS_HIGHLIGHT_HOLD_MS + FOCUS_HIGHLIGHT_FADE_MS;

/**
 * Temporary focus ring on an ayah: the deep-linked one (`?ayah=`, plus its
 * `?word=` in word-by-word view) on open, or a side-pane jump target. The ring
 * clears after the hold + fade so audio playback can own the border again.
 */
export function useAyahFocusHighlight({
  surahNumber,
  focusAyah,
  focusWordNumber,
}: {
  surahNumber: number;
  focusAyah: number | undefined;
  /** NF-3.22 root search: 1-based bundled word inside `focusAyah`. */
  focusWordNumber: number | undefined;
}) {
  const [focusHighlightAyah, setFocusHighlightAyah] = useState<number | undefined>(focusAyah);
  const focusTargetKey = focusAyah != null ? `${surahNumber}:${focusAyah}` : null;
  const focusWordValue = useMemo(
    () => focusWordTarget(focusHighlightAyah, focusAyah, focusWordNumber),
    [focusAyah, focusHighlightAyah, focusWordNumber],
  );

  // Flash the deep-linked ayah, then drop the highlight.
  useEffect(() => {
    if (!focusTargetKey) {
      setFocusHighlightAyah(undefined);
      return;
    }
    setFocusHighlightAyah(focusAyah);
    const timer = setTimeout(() => setFocusHighlightAyah(undefined), FOCUS_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [focusAyah, focusTargetKey]);

  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    },
    [],
  );

  /** Stable — ring `ayahNumber` for the same hold + fade (explicit jumps). */
  const flashAyah = useCallback((ayahNumber: number) => {
    setFocusHighlightAyah(ayahNumber);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFocusHighlightAyah(undefined), FOCUS_HIGHLIGHT_MS);
  }, []);

  return { focusHighlightAyah, focusWordValue, flashAyah };
}
