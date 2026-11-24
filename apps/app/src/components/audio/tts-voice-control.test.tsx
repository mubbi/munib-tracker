import { fireEvent, screen } from "@testing-library/react-native";

import { TtsVoiceControl } from "@/components/audio/tts-voice-control";
import type { AudioTrack } from "@/providers/audio-player-types";
import { buildAudioTrack, buildTtsTrack } from "@/test-support/fixtures/audio";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockAudio: { current: AudioTrack | null; setTtsVoice: jest.Mock } = {
  current: null,
  setTtsVoice: jest.fn(),
};
const mockPrefs: { ttsVoiceByLang?: Record<string, string> } = {};
const mockSetTtsVoice = jest.fn(async (_lang: string, _voiceId: string | undefined) => undefined);

jest.mock("@/providers/audio-player-provider", () => ({
  useAudioPlayerContext: () => mockAudio,
}));

// Device voices are read and written through the settings layer (B4, §4.5.4).
jest.mock("@/lib/settings/tts-voice", () => ({
  useTtsVoices: () => mockPrefs.ttsVoiceByLang ?? {},
  useTtsVoice: (lang: string) => mockPrefs.ttsVoiceByLang?.[lang],
  setTtsVoice: (lang: string, voiceId: string | undefined) => mockSetTtsVoice(lang, voiceId),
}));

jest.mock("@/lib/tts", () => ({
  getTtsVoices: jest.fn(async () => [
    { identifier: "voice-x", name: "Voice X", language: "en-US" },
  ]),
}));

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

function speechTrack(voice?: string): AudioTrack {
  return buildTtsTrack({ ttsPlayback: { text: "Hello world", lang: "en", voice } });
}

async function renderControl(current: AudioTrack | null) {
  mockAudio.current = current;
  return await renderWithTheme(<TtsVoiceControl />);
}

async function openVoiceSheet() {
  await fireEvent.press(screen.getByLabelText("Voice"));
  await screen.findByText("Voice X");
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAudio.current = null;
  delete mockPrefs.ttsVoiceByLang;
});

describe("TtsVoiceControl", () => {
  it.each([
    ["no track is playing", null],
    ["the track is file audio", buildAudioTrack()],
  ])("renders nothing when %s", async (_case, current) => {
    await renderControl(current);
    expect(screen.queryByLabelText("Voice")).toBeNull();
  });

  it.each([
    ["no saved or track voice", undefined, undefined, false],
    ["a saved voice for the language", undefined, { en: "voice-x" }, true],
    ["a voice carried on the track", "voice-x", { en: "other" }, true],
  ])("marks the control selected for %s", async (_case, trackVoice, saved, selected) => {
    mockPrefs.ttsVoiceByLang = saved;
    await renderControl(speechTrack(trackVoice));
    expect(screen.getByLabelText("Voice").props.accessibilityState).toEqual(
      expect.objectContaining({ selected }),
    );
  });

  it("highlights the resolved voice in the picker", async () => {
    mockPrefs.ttsVoiceByLang = { en: "voice-x" };
    await renderControl(speechTrack());
    await openVoiceSheet();
    expect(screen.getByRole("radio", { name: /Voice X/ }).props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("saves a picked voice for the track's language and applies it to playback", async () => {
    mockPrefs.ttsVoiceByLang = { ar: "arabic-voice" };
    await renderControl(speechTrack());
    await openVoiceSheet();
    await fireEvent.press(screen.getByText("Voice X"));

    expect(mockSetTtsVoice).toHaveBeenCalledWith("en", "voice-x");
    expect(mockAudio.setTtsVoice).toHaveBeenCalledWith("voice-x");
  });

  it("clears the language's saved voice when the system default is picked", async () => {
    mockPrefs.ttsVoiceByLang = { en: "voice-x", ar: "arabic-voice" };
    await renderControl(speechTrack());
    await openVoiceSheet();
    await fireEvent.press(screen.getByText("System default"));

    expect(mockSetTtsVoice).toHaveBeenCalledWith("en", undefined);
    expect(mockAudio.setTtsVoice).toHaveBeenCalledWith(undefined);
  });

  it("closes the picker after a choice", async () => {
    await renderControl(speechTrack());
    await openVoiceSheet();
    await fireEvent.press(screen.getByText("System default"));
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("renders nothing (no speech voices to pick)", async () => {
      await renderControl(speechTrack());
      expect(screen.queryByLabelText("Voice")).toBeNull();
    });
  });
});
