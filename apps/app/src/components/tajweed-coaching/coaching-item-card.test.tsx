import { fireEvent, screen } from "@testing-library/react-native";

import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";
import { bundledAyahWords, coachingState } from "@/test-support/tajweed-coaching";

import { CoachingItemCard } from "./coaching-item-card";
import { WordCoachingCard } from "./word-coaching-card";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
// Study words resolve from the bundled corpus (by reference), with a word-audio URL.
jest.mock("@/api/quran-words", () => ({
  fetchSurahWords: jest.fn(async (surah: number) => {
    const { bundledAyahWords: words } = require("@/test-support/tajweed-coaching");
    const out: Record<string, unknown[]> = {};
    for (const ayah of [1, 2, 3, 4]) {
      out[String(ayah)] = words(surah, ayah).map((arabic: string, i: number) => ({
        arabic,
        translit: "",
        gloss: "",
        audioUrl: `https://audio.example/${surah}/${ayah}/${i}.mp3`,
      }));
    }
    return out;
  }),
}));

const qalqalahItem = {
  head: "qalqalah" as const,
  words: [{ surah: 112, ayah: 3, wordIndex: 1 }],
  occurrences: 2,
};

describe("CoachingItemCard", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    resetAudioPlayerMock();
  });

  it("uses the reviewed 'These ayahs include' line and words from the person's recitation", async () => {
    await renderWithTheme(
      <CoachingItemCard item={qalqalahItem} state={coachingState()} canPractise />,
    );
    expect(
      screen.getByText(
        "These ayahs include qalqalah — let's practise it with words from your recitation.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Ready to practise today")).toBeTruthy();
    expect(await screen.findByText(bundledAyahWords(112, 3)[1])).toBeTruthy();
    expect(screen.queryByText(/mistake|%|score/i)).toBeNull();
  });

  it("plays the reciter's word audio and opens the drill", async () => {
    await renderWithTheme(
      <CoachingItemCard item={qalqalahItem} state={coachingState()} canPractise />,
    );
    await fireEvent.press(await screen.findByLabelText(/ayah 3, word 2/));
    expect(mockAudioPlayer.play).toHaveBeenCalledWith(
      [expect.objectContaining({ uri: "https://audio.example/112/3/1.mp3" })],
      0,
    );
    await fireEvent.press(screen.getByText("Practise this sound"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/learn-quran/tajweed/coach/[item]",
      params: { item: "qalqalah" },
    });
  });

  it("is read-only without a microphone path (TV)", async () => {
    await renderWithTheme(
      <CoachingItemCard
        item={{ head: "listen:madd", words: [] }}
        state={coachingState()}
        canPractise={false}
      />,
    );
    expect(screen.getByText(/These ayahs include madd \(lengthening\) — listen/)).toBeTruthy();
    expect(screen.queryByText("Listen and repeat", { exact: true })).toBeNull();
  });

  it("shows spacing, never a score, once a head was practised", async () => {
    const state = coachingState({
      heads: {
        qalqalah: {
          attempts: 2,
          matched: 1,
          tryAgain: 1,
          notSure: 0,
          nextDueAt: "2999-01-01",
        },
      },
    });
    await renderWithTheme(<CoachingItemCard item={qalqalahItem} state={state} canPractise />);
    expect(screen.getByText(/^Next practice in \d+ days$/)).toBeTruthy();
  });
});

describe("WordCoachingCard (Phase B)", () => {
  it("names the rule the word contains, never a broken rule", async () => {
    await renderWithTheme(
      <WordCoachingCard
        card={{ surah: 112, ayah: 3, wordIndex: 1, categories: ["qalqalah"] }}
        canPractise
      />,
    );
    expect(
      screen.getByText("This word has qalqalah — listen to the reciter and try it again."),
    ).toBeTruthy();
    expect(screen.getByText(/not that a rule was broken/)).toBeTruthy();
  });
});
