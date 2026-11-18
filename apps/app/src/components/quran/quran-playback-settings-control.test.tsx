import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import type { PlaybackSettingsSheetProps } from "@/components/quran/playback-settings-sheet";
import { QuranPlaybackSettingsControl } from "@/components/quran/quran-playback-settings-control";
import type { QuranPrefs } from "@/db/repositories/quran-repository";
import { renderWithTheme } from "@/test-support/render";

const mockAudio = {
  sourceHref: "/quran/1" as string | null,
  queue: [] as unknown[],
  setRepeatPlan: jest.fn(),
  setTranslationAudio: jest.fn(),
};
const mockUpdatePrefs = jest.fn(async (_patch: Partial<QuranPrefs>) => undefined);
let mockPrefs: Partial<QuranPrefs> = {};
let mockSheetProps: PlaybackSettingsSheetProps | null = null;

jest.mock("@/providers/audio-player-provider", () => ({
  useAudioPlayerContext: () => mockAudio,
}));

jest.mock("@/stores/quran-store", () => ({
  useQuranPrefs: () => mockPrefs,
  useQuranActions: () => ({ updatePrefs: mockUpdatePrefs }),
}));

jest.mock("@/stores/preferences-store", () => ({
  ...jest.requireActual("@/stores/preferences-store"),
  usePreferences: () => ({ translationLocale: "en" }),
}));

// Capture the props the control hands to the sheet; the sheet itself has its own tests.
jest.mock("@/components/quran/playback-settings-sheet", () => ({
  PlaybackSettingsSheet: (props: PlaybackSettingsSheetProps) => {
    mockSheetProps = props;
    return null;
  },
}));

async function renderControl() {
  await renderWithTheme(
    <View>
      <QuranPlaybackSettingsControl />
      <Text>host</Text>
    </View>,
  );
}

function sheet(): PlaybackSettingsSheetProps {
  if (!mockSheetProps) throw new Error("sheet not rendered");
  return mockSheetProps;
}

async function openSheet(label: string | RegExp = "Playback settings") {
  await fireEvent.press(screen.getByRole("button", { name: label }));
}

describe("QuranPlaybackSettingsControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAudio.sourceHref = "/quran/1";
    mockAudio.queue = [];
    mockPrefs = {};
    mockSheetProps = null;
  });

  it.each([
    ["a non-surah source", "/zikr/detail/morning"],
    ["no source", null],
  ])("renders nothing for %s", async (_label, sourceHref) => {
    mockAudio.sourceHref = sourceHref;
    mockAudio.queue = sourceHref ? [{}, {}] : [];
    await renderControl();
    expect(screen.queryByRole("button")).toBeNull();
    expect(mockSheetProps).toBeNull();
  });

  it("keeps the sheet closed until the control is pressed", async () => {
    await renderControl();
    expect(sheet().visible).toBe(false);
    await openSheet();
    expect(sheet().visible).toBe(true);
  });

  it("closes the sheet", async () => {
    await renderControl();
    await openSheet();
    await act(() => sheet().onClose());
    expect(sheet().visible).toBe(false);
  });

  it("passes surah defaults to the sheet", async () => {
    await renderControl();
    expect(sheet()).toEqual(
      expect.objectContaining({
        ayahCount: 7,
        repeatMode: "off",
        repeatRange: { start: 1, end: 7 },
        translationAudio: "off",
        ttsLang: "en-US",
        ttsVoiceId: undefined,
      }),
    );
  });

  it.each([
    [{}, "Playback settings", false],
    [{ repeatMode: "range", repeatRange: { start: 2, end: 4 } }, "Range 2–4", true],
    [{ translationAudio: "after" }, "Translation TTS", true],
  ] as const)("labels prefs %j as %p (selected=%p)", async (prefs, name, selected) => {
    mockPrefs = prefs;
    await renderControl();
    expect(screen.getByRole("button", { name, selected })).toBeTruthy();
  });

  it("persists a repeat mode and updates the player plan", async () => {
    mockPrefs = { repeatRange: { start: 2, end: 4 } };
    await renderControl();
    await act(() => sheet().onRepeatModeChange("range"));
    expect(mockUpdatePrefs).toHaveBeenCalledWith({ repeatMode: "range" });
    expect(mockAudio.setRepeatPlan).toHaveBeenCalledWith({ mode: "range", start: 2, end: 4 });
  });

  it("persists a repeat range and updates the player plan", async () => {
    mockPrefs = { repeatMode: "range" };
    await renderControl();
    await act(() => sheet().onRepeatRangeChange({ start: 2, end: 3 }));
    expect(mockUpdatePrefs).toHaveBeenCalledWith({ repeatRange: { start: 2, end: 3 } });
    expect(mockAudio.setRepeatPlan).toHaveBeenCalledWith({ mode: "range", start: 2, end: 3 });
  });

  it("persists translation audio and updates the player", async () => {
    await renderControl();
    await act(() => sheet().onTranslationAudioChange("after"));
    expect(mockUpdatePrefs).toHaveBeenCalledWith({ translationAudio: "after" });
    expect(mockAudio.setTranslationAudio).toHaveBeenCalledWith("after");
  });

  it("passes the stored voice for the TTS language", async () => {
    mockPrefs = { ttsVoiceByLang: { "en-US": "voice-old" } };
    await renderControl();
    expect(sheet().ttsVoiceId).toBe("voice-old");
  });

  it.each([
    [undefined, "voice-x", { "en-US": "voice-x" }],
    [
      { "en-US": "voice-old", "ur-PK": "voice-ur" },
      "voice-x",
      { "en-US": "voice-x", "ur-PK": "voice-ur" },
    ],
    [{ "en-US": "voice-old", "ur-PK": "voice-ur" }, undefined, { "ur-PK": "voice-ur" }],
  ])("updates the voice map %j with %p", async (ttsVoiceByLang, voiceId, expected) => {
    mockPrefs = { ttsVoiceByLang };
    await renderControl();
    await act(() => sheet().onTtsVoiceChange(voiceId));
    expect(mockUpdatePrefs).toHaveBeenCalledWith({ ttsVoiceByLang: expected });
  });
});
