import { act, fireEvent, screen } from "@testing-library/react-native";

import { ReadingTtsButton } from "@/components/content/reading-tts-button";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockResolveTarget = jest.fn();
const mockIsTtsAvailable = jest.fn(async () => true);
const mockResolveVoice = jest.fn(async (_lang: string, voiceId?: string) => voiceId);
const mockSetTtsVoice = jest.fn(async (_lang: string, _voiceId?: string) => undefined);

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/lib/tts", () => ({
  ...jest.requireActual("@/lib/tts"),
  resolveReadingTtsTarget: (args: unknown) => mockResolveTarget(args),
  isTtsAvailable: () => mockIsTtsAvailable(),
  resolveTtsVoice: (lang: string, voiceId?: string) => mockResolveVoice(lang, voiceId),
}));
// Device voices are read and written through the settings layer (B4, §4.5.4).
jest.mock("@/lib/settings/tts-voice", () => ({
  useTtsVoice: (lang: string) => ({ "ar-SA": "old-voice" })[lang],
  setTtsVoice: (lang: string, voiceId?: string) => mockSetTtsVoice(lang, voiceId),
}));
jest.mock("@/components/tts-voice-sheet", () => {
  const { Pressable, Text, View } = require("react-native");
  return {
    TtsVoiceSheet: (props: {
      visible: boolean;
      lang: string;
      onSelectVoice: (id: string | undefined) => void;
      onClose: () => void;
    }) =>
      props.visible ? (
        <View>
          <Text>{`voices:${props.lang}`}</Text>
          <Pressable accessibilityLabel="pick-voice" onPress={() => props.onSelectVoice("v1")} />
          <Pressable
            accessibilityLabel="pick-default"
            onPress={() => props.onSelectVoice(undefined)}
          />
          <Pressable accessibilityLabel="close-voices" onPress={props.onClose} />
        </View>
      ) : null,
  };
});

type Props = Parameters<typeof ReadingTtsButton>[0];

async function renderButton(overrides: Partial<Props> = {}) {
  await renderWithTheme(
    <ReadingTtsButton
      id="dua-1"
      title="Morning dua"
      subtitle="Adhkar"
      sourceHref="/dua/1"
      arabic="بِسْمِ اللَّهِ"
      translation="In the name of Allah"
      {...overrides}
    />,
  );
}

async function settle() {
  await act(async () => {
    for (let i = 0; i < 5; i += 1) await Promise.resolve();
  });
}

async function openSheet() {
  await fireEvent.press(screen.getByLabelText("Listen to article"));
  await settle();
}

describe("ReadingTtsButton", () => {
  beforeEach(() => {
    resetAudioPlayerMock();
    mockResolveTarget.mockReset();
    mockResolveTarget.mockResolvedValue({ text: "بِسْمِ اللَّهِ", lang: "ar-SA" });
    mockIsTtsAvailable.mockResolvedValue(true);
    mockSetTtsVoice.mockClear();
  });

  it("renders nothing without any text", async () => {
    await renderButton({ arabic: " ", translation: undefined });
    expect(screen.queryByLabelText("Listen to article")).toBeNull();
  });

  it("opens the voice sheet for the resolved language", async () => {
    await renderButton();
    await openSheet();
    expect(screen.getByText("voices:ar-SA")).toBeTruthy();
  });

  it("keeps the sheet closed when no target resolves", async () => {
    mockResolveTarget.mockResolvedValue(null);
    await renderButton();
    await openSheet();
    expect(screen.queryByText(/voices:/)).toBeNull();
  });

  it("closes the voice sheet", async () => {
    await renderButton();
    await openSheet();
    await fireEvent.press(screen.getByLabelText("close-voices"));
    expect(screen.queryByText(/voices:/)).toBeNull();
  });

  it("saves the voice and queues speech in the mini-player", async () => {
    await renderButton();
    await openSheet();
    await fireEvent.press(screen.getByLabelText("pick-voice"));
    await settle();
    expect(mockSetTtsVoice).toHaveBeenCalledWith("ar-SA", "v1");
    expect(mockAudioPlayer.play).toHaveBeenCalledWith(
      [expect.objectContaining({ id: "dua-1:tts:0", title: "Morning dua" })],
      0,
      { sourceHref: "/dua/1" },
    );
  });

  it("clears the saved voice when the system default is chosen", async () => {
    await renderButton({ sourceHref: undefined, title: " " });
    await openSheet();
    await fireEvent.press(screen.getByLabelText("pick-default"));
    await settle();
    expect(mockSetTtsVoice).toHaveBeenCalledWith("ar-SA", undefined);
    expect(mockAudioPlayer.play).toHaveBeenCalledWith(
      [expect.objectContaining({ title: "Listen" })],
      0,
      undefined,
    );
  });

  it("does not queue empty speech", async () => {
    mockResolveTarget.mockResolvedValue({ text: "   ", lang: "ar-SA" });
    await renderButton();
    await openSheet();
    await fireEvent.press(screen.getByLabelText("pick-voice"));
    await settle();
    expect(mockAudioPlayer.play).not.toHaveBeenCalled();
  });

  it("shows a toast when text-to-speech is unavailable", async () => {
    mockIsTtsAvailable.mockResolvedValue(false);
    await renderButton();
    await openSheet();
    await fireEvent.press(screen.getByLabelText("pick-voice"));
    await settle();
    expect(mockToast.info).toHaveBeenCalledWith("Listening unavailable", expect.any(String));
  });

  it("stops its own active queue", async () => {
    mockAudioPlayer.current = { id: "dua-1:tts:0" };
    await renderButton();
    await fireEvent.press(screen.getByLabelText("Stop listening"));
    expect(mockAudioPlayer.stop).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("hides the control", async () => {
      await renderButton();
      expect(screen.queryByLabelText("Listen to article")).toBeNull();
    });
  });
});
