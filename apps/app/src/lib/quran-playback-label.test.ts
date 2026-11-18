import type { TFunction } from "i18next";
import { formatPlaybackSettingsLabel } from "@/lib/quran-playback-label";
import { resolvePlaybackSummary } from "@/lib/quran-repeat";

jest.mock("@/lib/quran-repeat", () => ({ resolvePlaybackSummary: jest.fn() }));

const summary = resolvePlaybackSummary as jest.Mock;
const t = ((key: string, opts?: Record<string, unknown>) =>
  opts ? `${key}(${JSON.stringify(opts)})` : key) as unknown as TFunction;
const input = {} as never;

describe("formatPlaybackSettingsLabel", () => {
  it("returns the idle key when nothing is active", () => {
    summary.mockReturnValue({ active: false, repeat: { kind: "off" }, tts: false });
    expect(formatPlaybackSettingsLabel(t, input)).toEqual({
      label: "quran.playback.open",
      active: false,
    });
    expect(formatPlaybackSettingsLabel(t, input, "quran.playback.title").label).toBe(
      "quran.playback.title",
    );
  });

  it.each([
    ["verse", "quran.playback.summaryVerse"],
    ["surah", "quran.playback.summarySurah"],
  ])("labels %s repeat", (kind, key) => {
    summary.mockReturnValue({ active: true, repeat: { kind }, tts: false });
    expect(formatPlaybackSettingsLabel(t, input)).toEqual({ label: key, active: true });
  });

  it("labels a range repeat with its bounds", () => {
    summary.mockReturnValue({
      active: true,
      repeat: { kind: "range", start: 1, end: 2 },
      tts: false,
    });
    expect(formatPlaybackSettingsLabel(t, input).label).toBe(
      'quran.playback.summaryRange({"start":1,"end":2})',
    );
  });

  it("wraps a repeat label with TTS", () => {
    summary.mockReturnValue({ active: true, repeat: { kind: "verse" }, tts: true });
    expect(formatPlaybackSettingsLabel(t, input)).toEqual({
      label: 'quran.playback.summaryWithTts({"summary":"quran.playback.summaryVerse"})',
      active: true,
    });
  });

  it("uses the TTS-only label when repeat is off", () => {
    summary.mockReturnValue({ active: true, repeat: { kind: "off" }, tts: true });
    expect(formatPlaybackSettingsLabel(t, input)).toEqual({
      label: "quran.playback.summaryTts",
      active: true,
    });
  });
});
