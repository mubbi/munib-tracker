import type { QuranRepeatPlan, QuranTranslationAudio } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { resolvePlaybackSummary } from "@/lib/quran-repeat";

/**
 * Compact label for the playback-settings chip / filter row
 * (e.g. "Range 1–2 · TTS"), plus whether non-default settings are applied.
 */
export function usePlaybackSummaryLabel(
  plan: QuranRepeatPlan,
  translationAudio: QuranTranslationAudio | undefined,
  idleKey: "quran.playback.open" | "quran.playback.title" = "quran.playback.open",
): { label: string; active: boolean } {
  const { t } = useTranslation();

  return useMemo(() => {
    const summary = resolvePlaybackSummary({ plan, translationAudio });
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
  }, [idleKey, plan, t, translationAudio]);
}
