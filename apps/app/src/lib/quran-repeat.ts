import type {
  QuranRepeatMode,
  QuranRepeatPlan,
  QuranTranslationAudio,
} from "@munib-tracker/shared/types";

/**
 * Compute the next queue index after a track finishes, given a Quran repeat plan.
 * Returns `null` when playback should stop.
 *
 * @param currentIndex — 0-based index of the track that just finished
 * @param queueLength — number of tracks in the queue (usually ayah count)
 * @param plan — off / verse / range / surah
 */
export function nextIndexForRepeatPlan(
  currentIndex: number,
  queueLength: number,
  plan: QuranRepeatPlan,
): number | null {
  if (queueLength <= 0) return null;
  const clamped = Math.max(0, Math.min(currentIndex, queueLength - 1));

  switch (plan.mode) {
    case "verse":
      return clamped;
    case "surah": {
      const next = clamped + 1;
      return next < queueLength ? next : 0;
    }
    case "range": {
      const startAyah = Math.max(1, plan.start ?? 1);
      const endAyah = Math.max(startAyah, plan.end ?? queueLength);
      const startIdx = Math.min(queueLength - 1, startAyah - 1);
      const endIdx = Math.min(queueLength - 1, endAyah - 1);
      if (clamped < startIdx || clamped > endIdx) {
        // Outside range — jump back into the range start.
        return startIdx;
      }
      if (clamped >= endIdx) return startIdx;
      return clamped + 1;
    }
    default: {
      // "off" — advance once, stop at end (same as classic loop off).
      const next = clamped + 1;
      return next < queueLength ? next : null;
    }
  }
}

export function normalizeRepeatPlan(
  mode: QuranRepeatMode | undefined,
  range: { start: number; end: number } | undefined,
  ayahCount: number,
): QuranRepeatPlan {
  const safeMode = mode ?? "off";
  if (safeMode !== "range") return { mode: safeMode };
  const start = Math.max(1, Math.min(range?.start ?? 1, ayahCount || 1));
  const end = Math.max(start, Math.min(range?.end ?? (ayahCount || start), ayahCount || start));
  return { mode: "range", start, end };
}

/** True when repeat or translation TTS differs from the defaults. */
export function isPlaybackSettingsActive(
  plan: QuranRepeatPlan,
  translationAudio: QuranTranslationAudio | undefined,
): boolean {
  return plan.mode !== "off" || (translationAudio ?? "off") !== "off";
}

export type PlaybackSummaryInput = {
  plan: QuranRepeatPlan;
  translationAudio: QuranTranslationAudio | undefined;
};

/**
 * Structured bits for a compact playback-settings chip label
 * (e.g. "Range 1–2 · TTS"). Callers translate via i18n.
 */
export function resolvePlaybackSummary({ plan, translationAudio }: PlaybackSummaryInput): {
  active: boolean;
  repeat:
    | { kind: "off" }
    | { kind: "verse" }
    | { kind: "surah" }
    | { kind: "range"; start: number; end: number };
  tts: boolean;
} {
  const tts = (translationAudio ?? "off") === "after";
  if (plan.mode === "range") {
    return {
      active: true,
      repeat: { kind: "range", start: plan.start ?? 1, end: plan.end ?? plan.start ?? 1 },
      tts,
    };
  }
  if (plan.mode === "verse" || plan.mode === "surah") {
    return { active: true, repeat: { kind: plan.mode }, tts };
  }
  return { active: tts, repeat: { kind: "off" }, tts };
}

/** Surah number from a Qur'an reader source href (`/quran/2`, optional ayah query). */
export function surahNumberFromSourceHref(sourceHref: string | null | undefined): number | null {
  if (!sourceHref) return null;
  const match = sourceHref.match(/^\/quran\/(\d+)(?:\?|$)/);
  if (!match) return null;
  const n = Number.parseInt(match[1] ?? "", 10);
  return n >= 1 && n <= 114 ? n : null;
}
