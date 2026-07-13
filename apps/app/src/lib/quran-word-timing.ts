/**
 * Resolve which word index is active given playback time (seconds) and
 * Quran.com segments `[wordSeq, startMs, endMs]` (already relative to ayah start).
 *
 * Falls back to an even time split across `wordCount` when segments are missing
 * (everyayah audio ≠ Quran.com chapter file, but still gives a moving highlight).
 */
export function activeWordIndexAt(
  currentTimeSec: number,
  segments: Array<[number, number, number]> | null | undefined,
  options?: { wordCount?: number; durationSec?: number },
): number | null {
  const wordCount = options?.wordCount;
  if (segments?.length) {
    const ms = Math.max(0, currentTimeSec * 1000);
    let lastStarted = -1;
    for (let i = 0; i < segments.length; i++) {
      const [wordSeq, start, end] = segments[i];
      if (ms >= start) lastStarted = Math.max(0, (wordSeq ?? i + 1) - 1);
      if (ms >= start && ms < end) {
        return Math.max(0, (wordSeq ?? i + 1) - 1);
      }
    }
    if (lastStarted >= 0) {
      const maxIdx = wordCount != null && wordCount > 0 ? wordCount - 1 : lastStarted;
      return Math.min(lastStarted, maxIdx);
    }
  }

  const durationSec = options?.durationSec;
  if (wordCount != null && wordCount > 0 && durationSec != null && durationSec > 0.25) {
    const ratio = Math.min(1, Math.max(0, currentTimeSec / durationSec));
    return Math.min(wordCount - 1, Math.floor(ratio * wordCount));
  }

  return null;
}
