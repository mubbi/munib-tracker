import { render, screen } from "@testing-library/react-native";

import { QuranWordStudyProviders, WordByWord } from "@/components/quran/word-by-word";
import { MunibThemeProvider } from "@/providers/theme-provider";

jest.mock("expo-audio", () => ({
  useAudioPlayer: () => ({
    pause: jest.fn(),
    play: jest.fn(),
    seekTo: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("expo-symbols", () => ({
  SymbolView: "SymbolView",
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

const wordsByAyah = {
  "1": [
    {
      arabic: "بِسْمِ",
      translit: "bismi",
      gloss: "In the name",
      audioUrl: "https://example.com/1.mp3",
    },
  ],
};

describe("WordByWord", () => {
  it("renders words from study context without a words prop", async () => {
    render(
      <MunibThemeProvider>
        <QuranWordStudyProviders
          wordAudioEnabled={false}
          playingAyah={null}
          activeWordIndex={null}
          wordsByAyah={wordsByAyah}
        >
          <WordByWord ayahNumber={1} arabicSize={22} translitSize={14} glossSize={13} />
        </QuranWordStudyProviders>
      </MunibThemeProvider>,
    );

    expect(screen.getByText("بِسْمِ")).toBeTruthy();
    expect(screen.getByText("bismi")).toBeTruthy();
    expect(screen.getByText("In the name")).toBeTruthy();
  });
});
