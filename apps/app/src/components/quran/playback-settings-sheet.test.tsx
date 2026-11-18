import { fireEvent, screen } from "@testing-library/react-native";

import {
  PlaybackSettingsSheet,
  type PlaybackSettingsSheetProps,
} from "@/components/quran/playback-settings-sheet";
import { getTtsVoices, type TtsVoice } from "@/lib/tts";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

jest.mock("@/lib/tts", () => ({ getTtsVoices: jest.fn(async () => []) }));

const getTtsVoicesMock = getTtsVoices as jest.MockedFunction<typeof getTtsVoices>;

const VOICES: TtsVoice[] = [
  { identifier: "voice-a", name: "Samantha", language: "en-US" },
  { identifier: "voice-b", name: "Daniel", language: "en-GB" },
];

async function renderSheet(overrides: Partial<PlaybackSettingsSheetProps> = {}) {
  const props: PlaybackSettingsSheetProps = {
    visible: true,
    onClose: jest.fn(),
    ayahCount: 7,
    repeatMode: "off",
    repeatRange: { start: 2, end: 5 },
    translationAudio: "off",
    ttsLang: "en-US",
    onRepeatModeChange: jest.fn(),
    onRepeatRangeChange: jest.fn(),
    onTranslationAudioChange: jest.fn(),
    onTtsVoiceChange: jest.fn(),
    ...overrides,
  };
  const utils = await renderWithTheme(<PlaybackSettingsSheet {...props} />);
  return { ...utils, props };
}

describe("PlaybackSettingsSheet", () => {
  beforeEach(() => {
    getTtsVoicesMock.mockReset();
    getTtsVoicesMock.mockResolvedValue([]);
  });

  it("changes the repeat mode", async () => {
    const { props } = await renderSheet();
    await fireEvent.press(screen.getByText("Verse"));
    expect(props.onRepeatModeChange).toHaveBeenCalledWith("verse");
  });

  it("changes translation audio", async () => {
    const { props } = await renderSheet();
    await fireEvent.press(screen.getByText("After each verse"));
    expect(props.onTranslationAudioChange).toHaveBeenCalledWith("after");
  });

  it("loads voices for the TTS language when shown", async () => {
    await renderSheet();
    expect(getTtsVoicesMock).toHaveBeenCalledWith("en-US");
  });

  it("hides the range fields and voice picker by default", async () => {
    await renderSheet();
    expect(screen.queryByText("From ayah")).toBeNull();
    expect(screen.queryByText("Translation speech voice")).toBeNull();
  });

  it("shows the current repeat range", async () => {
    await renderSheet({ repeatMode: "range" });
    expect(screen.getByLabelText("From ayah").props.value).toBe("2");
    expect(screen.getByLabelText("To ayah").props.value).toBe("5");
  });

  it.each([
    ["From ayah", "6", { start: 5, end: 6 }],
    ["To ayah", "99", { start: 2, end: 7 }],
    ["To ayah", "1", { start: 1, end: 2 }],
  ])("edits %p to %p, clamping and ordering the range", async (field, text, range) => {
    const { props } = await renderSheet({ repeatMode: "range" });
    await fireEvent.changeText(screen.getByLabelText(field), text);
    expect(props.onRepeatRangeChange).toHaveBeenLastCalledWith(range);
  });

  it("ignores non-numeric range input", async () => {
    const { props } = await renderSheet({ repeatMode: "range" });
    await fireEvent.changeText(screen.getByLabelText("From ayah"), "abc");
    expect(props.onRepeatRangeChange).not.toHaveBeenCalled();
  });

  it("explains when the device has no voices", async () => {
    await renderSheet({ translationAudio: "after" });
    expect(
      await screen.findByText("No voices found for this language on this device."),
    ).toBeTruthy();
  });

  it.each<[string | undefined, string | RegExp]>([
    [undefined, "Default for language"],
    ["voice-b", /Daniel/],
  ])("marks the chosen voice (%p)", async (ttsVoiceId, name) => {
    getTtsVoicesMock.mockResolvedValue(VOICES);
    await renderSheet({ translationAudio: "after", ttsVoiceId });
    expect(await screen.findByRole("radio", { name, selected: true })).toBeTruthy();
  });

  it("picks a voice", async () => {
    getTtsVoicesMock.mockResolvedValue(VOICES);
    const { props } = await renderSheet({ translationAudio: "after", ttsVoiceId: "voice-b" });
    await fireEvent.press(await screen.findByText("Samantha"));
    expect(props.onTtsVoiceChange).toHaveBeenCalledWith("voice-a");
  });

  it("resets to the default voice", async () => {
    getTtsVoicesMock.mockResolvedValue(VOICES);
    const { props } = await renderSheet({ translationAudio: "after", ttsVoiceId: "voice-b" });
    await fireEvent.press(await screen.findByText("Default for language"));
    expect(props.onTtsVoiceChange).toHaveBeenCalledWith(undefined);
  });

  it("ignores voices that resolve after the sheet closes", async () => {
    let resolveVoices: (voices: TtsVoice[]) => void = () => {};
    getTtsVoicesMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveVoices = resolve;
        }),
    );
    const { props, rerender } = await renderSheet({ translationAudio: "after" });
    await rerender(<PlaybackSettingsSheet {...props} visible={false} />);
    resolveVoices(VOICES);
    await rerender(<PlaybackSettingsSheet {...props} visible={false} />);
    expect(screen.queryByText("Samantha")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("hides translation audio and skips loading voices", async () => {
      await renderSheet();
      expect(screen.queryByText("Translation audio")).toBeNull();
      expect(getTtsVoicesMock).not.toHaveBeenCalled();
    });

    it.each([
      ["Decrease From ayah", true],
      ["Increase To ayah", true],
      ["Increase From ayah", false],
    ])("disables %p at the bounds: %p", async (label, disabled) => {
      await renderSheet({ repeatMode: "range", repeatRange: { start: 1, end: 7 } });
      expect(screen.getByLabelText(label).props.accessibilityState.disabled).toBe(disabled);
    });

    it.each([
      ["Increase From ayah", { start: 2, end: 7 }],
      ["Decrease To ayah", { start: 1, end: 6 }],
    ])("steps the range with %p", async (label, range) => {
      const { props } = await renderSheet({
        repeatMode: "range",
        repeatRange: { start: 1, end: 7 },
      });
      await fireEvent.press(screen.getByLabelText(label));
      expect(props.onRepeatRangeChange).toHaveBeenLastCalledWith(range);
    });
  });
});
