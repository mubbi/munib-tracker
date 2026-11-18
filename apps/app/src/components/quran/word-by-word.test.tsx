import type { QuranWord } from "@munib-tracker/shared/types";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";

import {
  QuranWordStudyProviders,
  useQuranPlayback,
  WordByWord,
} from "@/components/quran/word-by-word";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockPlayer = {
  pause: jest.fn(),
  play: jest.fn(),
  seekTo: jest.fn(),
  replace: jest.fn(async () => undefined),
};

jest.mock("expo-audio", () => ({
  useAudioPlayer: () => mockPlayer,
}));

jest.mock("expo-symbols", () => ({
  SymbolView: "SymbolView",
}));

const wordsByAyah: Record<string, QuranWord[]> = {
  "1": [
    {
      arabic: "بِسْمِ",
      translit: "bismi",
      gloss: "In the name",
      audioUrl: "https://example.com/1.mp3",
    },
    {
      arabic: "اللَّهِ",
      translit: "allahi",
      gloss: "of Allah",
      audioUrl: "https://example.com/2.mp3",
    },
  ],
};

function PlaybackProbe() {
  const { ayah, isPlaying } = useQuranPlayback();
  return <Text testID="playback">{`${ayah}:${isPlaying}`}</Text>;
}

async function renderStudy(
  child: ReactNode,
  providers: {
    wordAudioEnabled?: boolean;
    playingAyah?: number | null;
    audioIsPlaying?: boolean;
    activeWordIndex?: number | null;
    wordsByAyah?: Record<string, QuranWord[]>;
  } = {},
) {
  return await renderWithTheme(
    <QuranWordStudyProviders
      wordAudioEnabled={providers.wordAudioEnabled ?? false}
      playingAyah={providers.playingAyah ?? null}
      audioIsPlaying={providers.audioIsPlaying}
      activeWordIndex={providers.activeWordIndex ?? null}
      wordsByAyah={providers.wordsByAyah}
    >
      {child}
    </QuranWordStudyProviders>,
  );
}

describe("WordByWord", () => {
  beforeEach(() => {
    mockPlayer.pause.mockReset();
    mockPlayer.play.mockReset();
    mockPlayer.seekTo.mockReset();
    mockPlayer.replace.mockReset().mockResolvedValue(undefined);
  });

  it("renders words from study context without a words prop", async () => {
    await renderStudy(
      <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />,
      {
        wordsByAyah,
      },
    );

    expect(screen.getByText("بِسْمِ")).toBeTruthy();
    expect(screen.getByText("bismi")).toBeTruthy();
    expect(screen.getByText("In the name")).toBeTruthy();
  });

  it("prefers an explicit words prop over the study context map", async () => {
    await renderStudy(
      <WordByWord
        ayahNumber={1}
        words={[
          {
            arabic: "الرَّحْمَٰنِ",
            translit: "ar-rahmani",
            gloss: "the Most Gracious",
          },
        ]}
        arabicSize={22}
        translitSize={14}
        glossSize={13}
      />,
      { wordsByAyah },
    );

    expect(screen.getByText("الرَّحْمَٰنِ")).toBeTruthy();
    expect(screen.queryByText("بِسْمِ")).toBeNull();
  });

  it("renders nothing when the ayah has no words", async () => {
    await renderStudy(
      <WordByWord ayahNumber={99} arabicSize={22} translitSize={14} glossSize={13} />,
      {
        wordsByAyah,
      },
    );

    expect(screen.queryByText("Word by word")).toBeNull();
  });

  it("omits transliteration and gloss when they are empty", async () => {
    await renderStudy(
      <WordByWord
        ayahNumber={1}
        words={[{ arabic: "بِسْمِ", translit: "", gloss: "" }]}
        arabicSize={22}
        translitSize={14}
        glossSize={13}
      />,
    );

    expect(screen.getByText("بِسْمِ")).toBeTruthy();
    expect(screen.queryByText("bismi")).toBeNull();
    expect(screen.queryByText("In the name")).toBeNull();
  });

  it("exposes recitation playback from context", async () => {
    await renderStudy(<PlaybackProbe />, {
      playingAyah: 4,
      audioIsPlaying: true,
      activeWordIndex: 1,
    });

    expect(screen.getByTestId("playback").props.children).toBe("4:true");
  });

  it("defaults playback to idle when audioIsPlaying is omitted", async () => {
    await renderStudy(<PlaybackProbe />, { playingAyah: 2, activeWordIndex: 0 });

    expect(screen.getByTestId("playback").props.children).toBe("2:false");
  });

  it("plays a word, replays the same uri, then loads a different uri", async () => {
    await renderStudy(
      <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />,
      {
        wordAudioEnabled: true,
        wordsByAyah,
      },
    );

    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    await waitFor(() => {
      expect(mockPlayer.replace).toHaveBeenCalledWith({ uri: "https://example.com/1.mp3" });
    });
    expect(mockPlayer.play).toHaveBeenCalled();

    mockPlayer.replace.mockClear();
    mockPlayer.play.mockClear();
    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    await waitFor(() => {
      expect(mockPlayer.seekTo).toHaveBeenCalledWith(0);
    });
    expect(mockPlayer.play).toHaveBeenCalled();
    expect(mockPlayer.replace).not.toHaveBeenCalled();

    mockPlayer.play.mockClear();
    await fireEvent.press(screen.getByLabelText("اللَّهِ. allahi. of Allah"));
    await waitFor(() => {
      expect(mockPlayer.replace).toHaveBeenCalledWith({ uri: "https://example.com/2.mp3" });
    });
    expect(mockPlayer.play).toHaveBeenCalled();
  });

  it("does not play a word without audio", async () => {
    await renderStudy(
      <WordByWord
        ayahNumber={1}
        words={[{ arabic: "بِسْمِ", translit: "bismi", gloss: "In the name" }]}
        arabicSize={22}
        translitSize={14}
        glossSize={13}
      />,
      { wordAudioEnabled: true },
    );

    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    expect(mockPlayer.replace).not.toHaveBeenCalled();
    expect(mockPlayer.play).not.toHaveBeenCalled();
  });

  it("marks a tapped word even when shared word audio is disabled", async () => {
    await renderStudy(
      <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />,
      {
        wordsByAyah,
      },
    );

    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    await waitFor(() => {
      expect(screen.getByText("بِسْمِ")).toBeTruthy();
    });
    expect(mockPlayer.replace).not.toHaveBeenCalled();
  });

  it("clears a tap highlight once recitation starts progressing", async () => {
    const { rerender } = await renderStudy(
      <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />,
      { wordAudioEnabled: true, playingAyah: 1, wordsByAyah },
    );

    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    await waitFor(() => {
      expect(mockPlayer.replace).toHaveBeenCalled();
    });

    await rerender(
      <QuranWordStudyProviders
        wordAudioEnabled
        playingAyah={1}
        activeWordIndex={0}
        wordsByAyah={wordsByAyah}
      >
        <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />
      </QuranWordStudyProviders>,
    );

    expect(screen.getByText("بِسْمِ")).toBeTruthy();
  });

  it("pauses the shared player on unmount and ignores pause failures", async () => {
    const { unmount } = await renderStudy(
      <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />,
      { wordAudioEnabled: true, wordsByAyah },
    );

    mockPlayer.pause.mockImplementationOnce(() => {
      throw new Error("already released");
    });
    await expect(unmount()).resolves.toBeUndefined();
    expect(mockPlayer.pause).toHaveBeenCalled();
  });

  it("resets playback state when replace fails so the next tap can retry", async () => {
    mockPlayer.replace.mockRejectedValueOnce(new Error("network"));
    await renderStudy(
      <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />,
      {
        wordAudioEnabled: true,
        wordsByAyah,
      },
    );

    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    await waitFor(() => {
      expect(mockPlayer.replace).toHaveBeenCalledTimes(1);
    });

    mockPlayer.replace.mockResolvedValue(undefined);
    await fireEvent.press(screen.getByLabelText("بِسْمِ. bismi. In the name"));
    await waitFor(() => {
      expect(mockPlayer.replace).toHaveBeenCalledTimes(2);
    });
  });

  it("uses TV tile sizes when running on television", async () => {
    const restorePlatform = setPlatform({ isTV: true });
    try {
      await renderStudy(
        <WordByWord ayahNumber={1} arabicSize={28} translitSize={16} glossSize={15} />,
        {
          wordsByAyah,
        },
      );

      expect(screen.getByText("بِسْمِ")).toBeTruthy();
      expect(screen.getByText("Word by word")).toBeTruthy();
    } finally {
      restorePlatform();
    }
  });
});
