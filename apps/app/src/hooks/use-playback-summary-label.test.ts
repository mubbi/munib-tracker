import type { QuranRepeatPlan } from "@munib-tracker/shared/types";
import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";

import { usePlaybackSummaryLabel } from "./use-playback-summary-label";

async function labelFor(
  plan: Partial<QuranRepeatPlan>,
  translationAudio?: "off" | "after",
  idleKey?: "quran.playback.open" | "quran.playback.title",
) {
  const { result } = await renderHook(() =>
    usePlaybackSummaryLabel(plan as QuranRepeatPlan, translationAudio, idleKey),
  );
  return result.current;
}

describe("usePlaybackSummaryLabel", () => {
  it("shows the idle label when nothing is customised", async () => {
    expect(await labelFor({ mode: "off" })).toEqual({
      label: i18n.t("quran.playback.open"),
      active: false,
    });
  });

  it("uses a custom idle key", async () => {
    expect((await labelFor({ mode: "off" }, "off", "quran.playback.title")).label).toBe(
      i18n.t("quran.playback.title"),
    );
  });

  it.each([
    [{ mode: "verse" }, i18n.t("quran.playback.summaryVerse")],
    [{ mode: "surah" }, i18n.t("quran.playback.summarySurah")],
    [
      { mode: "range", start: 1, end: 2 },
      i18n.t("quran.playback.summaryRange", { start: 1, end: 2 }),
    ],
  ] as const)("labels repeat plan %j", async (plan, expected) => {
    expect(await labelFor(plan)).toEqual({ label: expected, active: true });
  });

  it("labels translation audio on its own", async () => {
    expect(await labelFor({ mode: "off" }, "after")).toEqual({
      label: i18n.t("quran.playback.summaryTts"),
      active: true,
    });
  });

  it("combines a repeat plan with translation audio", async () => {
    const summary = i18n.t("quran.playback.summaryVerse");
    expect(await labelFor({ mode: "verse" }, "after")).toEqual({
      label: i18n.t("quran.playback.summaryWithTts", { summary }),
      active: true,
    });
  });
});
