import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Alert } from "react-native";

import {
  LearnTtsProvider,
  useLearnTts,
  useRegisterLearnListenText,
} from "@/components/learn-tts-context";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import { isTtsAvailable, resolveTtsVoice } from "@/lib/tts";
import type { AudioTrack } from "@/providers/audio-player-provider";
import { defined } from "@/test-support/assert";
import {
  mockAudioPlayer as mockAudio,
  resetAudioPlayerMock,
} from "@/test-support/mocks/audio-player-provider";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/tts", () => ({
  ...jest.requireActual("@/lib/tts"),
  isTtsAvailable: jest.fn(async () => true),
  resolveTtsVoice: jest.fn(async (_lang: string, voiceId?: string) => voiceId ?? "default-voice"),
}));

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const mockQuranPrefs: { ttsVoiceByLang?: Record<string, string> } = {};
const mockSetTtsVoice = jest.fn(async (_lang: string, _voiceId?: string) => {});
// Device voices are read and written through the settings layer (B4, §4.5.4).
jest.mock("@/lib/settings/tts-voice", () => ({
  useTtsVoice: (lang: string) => mockQuranPrefs.ttsVoiceByLang?.[lang],
  setTtsVoice: (lang: string, voiceId?: string) => mockSetTtsVoice(lang, voiceId),
}));

const LANG = localeToBcp47("en");

type Texts = { first?: string | string[] | null; second?: string | null };

/** Two prose blocks registering with one provider, exposing the context. */
const renderLearnTts = (initial: Texts = {}, listenText?: string | null) =>
  renderHook(
    ({ first, second }: Texts) => {
      useRegisterLearnListenText(first);
      useRegisterLearnListenText(second);
      return defined(useLearnTts(), "LearnTts context");
    },
    {
      initialProps: initial,
      wrapper: ({ children }: { children: ReactNode }) => (
        <LearnTtsProvider listenText={listenText}>{children}</LearnTtsProvider>
      ),
    },
  );

const spokenText = () =>
  ((mockAudio.play.mock.lastCall?.[0] as AudioTrack[] | undefined) ?? [])
    .map((track) => track.ttsPlayback?.text)
    .join(" ");

beforeEach(() => {
  resetExpoRouterMock();
  resetAudioPlayerMock();
  jest.clearAllMocks();
  mockQuranPrefs.ttsVoiceByLang = { [LANG]: "saved-voice" };
  jest.mocked(isTtsAvailable).mockResolvedValue(true);
});

describe("LearnTtsProvider context", () => {
  it("has no text until prose registers", async () => {
    const { result } = await renderLearnTts();

    expect(result.current.hasText).toBe(false);
    expect(result.current.speaking).toBe(false);
  });

  it("exposes the locale language and saved voice", async () => {
    const { result } = await renderLearnTts();

    expect(result.current.lang).toBe(LANG);
    expect(result.current.preferredVoiceId).toBe("saved-voice");
  });

  it("collects registered prose, dropping blank paragraphs", async () => {
    const { result } = await renderLearnTts({ first: ["  Intro  ", " "], second: "Body" });

    expect(result.current.hasText).toBe(true);
  });

  it("clears a segment when its text empties", async () => {
    const { result, rerender } = await renderLearnTts({ first: "Intro" });

    await rerender({ first: "  " });

    expect(result.current.hasText).toBe(false);
  });

  it("ignores manual registration of blank text for unknown segments", async () => {
    const { result } = await renderLearnTts();

    await act(async () => {
      result.current.setSegment("ghost", "   ");
      result.current.clearSegment("ghost");
    });

    expect(result.current.hasText).toBe(false);
  });

  it("returns null outside the provider", async () => {
    const { result } = await renderHook(() => {
      useRegisterLearnListenText("Orphan");
      return useLearnTts();
    });

    expect(result.current).toBeNull();
  });
});

describe("LearnTtsProvider startWithVoice", () => {
  it("speaks registered segments in registration order", async () => {
    const { result } = await renderLearnTts({ first: "Intro", second: "Body" });

    await act(async () => result.current.startWithVoice("voice-1"));

    await waitFor(() => expect(spokenText()).toBe("Intro Body"));
  });

  it("updates a manually registered segment in place", async () => {
    const { result } = await renderLearnTts();
    await act(async () => {
      result.current.setSegment("a", "Intro");
      result.current.setSegment("b", "Body");
      result.current.setSegment("a", "Intro");
      result.current.setSegment("a", "New intro");
    });

    await act(async () => result.current.startWithVoice(undefined));

    await waitFor(() => expect(spokenText()).toBe("New intro Body"));
  });

  it("drops a manually registered segment set to blank", async () => {
    const { result } = await renderLearnTts();
    await act(async () => {
      result.current.setSegment("a", "Intro");
      result.current.setSegment("a", " ");
    });

    expect(result.current.hasText).toBe(false);
  });

  it("prefers the listenText override over registered prose", async () => {
    const { result } = await renderLearnTts({ first: "Intro" }, "  Full article  ");

    await act(async () => result.current.startWithVoice("voice-1"));

    await waitFor(() => expect(spokenText()).toBe("Full article"));
  });

  it("falls back to segments when the manual override is blank", async () => {
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.setOverrideText("Manual"));
    await act(async () => result.current.setOverrideText("  "));
    await act(async () => result.current.startWithVoice("voice-1"));

    await waitFor(() => expect(spokenText()).toBe("Intro"));
  });

  it("saves the picked voice for the language", async () => {
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.startWithVoice("voice-2"));

    await waitFor(() => expect(mockSetTtsVoice).toHaveBeenCalledWith(LANG, "voice-2"));
    expect(resolveTtsVoice).toHaveBeenCalledWith(LANG, "voice-2");
  });

  it("clears the saved voice when the system default is picked", async () => {
    mockQuranPrefs.ttsVoiceByLang = undefined;
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.startWithVoice(undefined));

    await waitFor(() => expect(mockSetTtsVoice).toHaveBeenCalledWith(LANG, undefined));
  });

  it.each([
    ["/learn/wudu", "/learn/wudu"],
    ["learn/wudu", "/learn/wudu"],
  ])("links the mini-player back to %s", async (pathname, sourceHref) => {
    setMockPathname(pathname);
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.startWithVoice("v"));

    await waitFor(() =>
      expect(mockAudio.play).toHaveBeenCalledWith(expect.any(Array), 0, { sourceHref }),
    );
  });

  it("omits the source link without a pathname", async () => {
    setMockPathname("");
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.startWithVoice("v"));

    await waitFor(() =>
      expect(mockAudio.play).toHaveBeenCalledWith(expect.any(Array), 0, undefined),
    );
  });

  it("does nothing without text", async () => {
    const { result } = await renderLearnTts();

    await act(async () => result.current.startWithVoice("v"));

    expect(isTtsAvailable).not.toHaveBeenCalled();
    expect(mockAudio.play).not.toHaveBeenCalled();
  });

  it("alerts when text-to-speech is unavailable", async () => {
    jest.mocked(isTtsAvailable).mockResolvedValue(false);
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.startWithVoice("v"));

    await waitFor(() => expect(alert).toHaveBeenCalled());
    expect(mockAudio.play).not.toHaveBeenCalled();
    alert.mockRestore();
  });
});

describe("LearnTtsProvider playback state", () => {
  const startPlayback = async () => {
    const hook = await renderLearnTts({ first: "Intro" });
    await act(async () => hook.result.current.startWithVoice("v"));
    await waitFor(() => expect(mockAudio.play).toHaveBeenCalled());
    mockAudio.current = (mockAudio.play.mock.calls[0][0] as AudioTrack[])[0] as never;
    await hook.rerender({ first: "Intro" });
    return hook;
  };

  it("reports speaking while its own queue plays", async () => {
    const { result } = await startPlayback();

    expect(result.current.speaking).toBe(true);
  });

  it("stops its own queue", async () => {
    const { result } = await startPlayback();

    await act(async () => result.current.stop());

    expect(mockAudio.stop).toHaveBeenCalledTimes(1);
  });

  it("is not speaking once the queue finishes", async () => {
    mockAudio.isQueueFinished = true;
    const { result } = await startPlayback();

    expect(result.current.speaking).toBe(false);
  });

  it("leaves other audio alone on stop", async () => {
    mockAudio.current = { id: "quran:1" };
    const { result } = await renderLearnTts({ first: "Intro" });

    await act(async () => result.current.stop());

    expect(mockAudio.stop).not.toHaveBeenCalled();
  });
});
