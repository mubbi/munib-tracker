import type { TFunction } from "i18next";

import { type PlaybackSummaryInput, resolvePlaybackSummary } from "@/lib/quran-repeat";

/**
 * Compact chip / trigger label for ayah-study playback settings
 * (e.g. "Range 1–2 · TTS", or the idle fallback when nothing is applied).
 */
export function formatPlaybackSettingsLabel(
  t: TFunction,
  input: PlaybackSummaryInput,
  idleKey: "quran.playback.open" | "quran.playback.title" = "quran.playback.open",
): { label: string; active: boolean } {
  const summary = resolvePlaybackSummary(input);
  if (!summary.active) {
    return { label: t(idleKey), active: false };
  }

  let repeatLabel: string;
  switch (summary.repeat.kind) {
    case "verse":
      repeatLabel = t("quran.playback.summaryVerse");
      break;
    case "surah":
      repeatLabel = t("quran.playback.summarySurah");
      break;
    case "range":
      repeatLabel = t("quran.playback.summaryRange", {
        start: summary.repeat.start,
        end: summary.repeat.end,
      });
      break;
    default:
      repeatLabel = t("quran.playback.summaryTts");
      break;
  }

  if (summary.tts && summary.repeat.kind !== "off") {
    return {
      label: t("quran.playback.summaryWithTts", { summary: repeatLabel }),
      active: true,
    };
  }

  return { label: repeatLabel, active: true };
}
