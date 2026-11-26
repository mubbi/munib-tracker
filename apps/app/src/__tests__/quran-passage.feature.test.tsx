import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen, within } from "@testing-library/react-native";

import QuranPassageScreen from "@/app/quran/passage";
import { parsePassageParams, quranPassageHref } from "@/components/quran/passage-params";
import { quranNotesStore } from "@/stores/quran-notes-store";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
// Remote content (tajweed, word-by-word, tafsir, remote editions) is never fetched in tests.
jest.mock("@/hooks/use-quran", () => ({
  useAyahWordSegments: () => ({ data: undefined }),
  useRemoteEditionSurah: () => ({ data: undefined, isLoading: false, isError: false }),
  useSurahTajweed: () => ({ data: undefined }),
  useSurahWords: () => ({ data: undefined }),
  useTafsirSurah: () => ({ data: undefined, isLoading: false, isError: false }),
}));
jest.mock("@/hooks/use-share-content-card", () => ({
  ...jest.requireActual("@/hooks/use-share-content-card"),
  useShareContentCard: () => ({
    share: jest.fn(),
    activeShareKey: null,
    gesturePendingKey: null,
    SnapshotHost: null,
  }),
}));
jest.mock("@/components/content-report/content-report-button", () => ({
  ContentReportButton: () => null,
}));
jest.mock("@/lib/quran-pronunciation/availability", () => ({
  isPronunciationCheckPlatformAvailable: () => true,
}));

beforeEach(async () => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  resetAudioPlayerMock();
  await AsyncStorage.clear();
  await act(async () => {
    await quranNotesStore.getState().load();
  });
});

describe("parsePassageParams / quranPassageHref", () => {
  it("reads surah + from, with to defaulting to from (the Sunnah-habit link)", () => {
    expect(parsePassageParams({ surah: "2", from: "255", to: "255" })).toEqual({
      surah: 2,
      from: 255,
      to: 255,
    });
    expect(parsePassageParams({ surah: "2", from: "255" })).toEqual({
      surah: 2,
      from: 255,
      to: 255,
    });
    expect(parsePassageParams({ surah: "2", from: "285", to: "286" })).toEqual({
      surah: 2,
      from: 285,
      to: 286,
    });
  });

  it("rejects params that name no real ayahs", () => {
    expect(parsePassageParams({})).toBeNull();
    expect(parsePassageParams({ surah: "200", from: "1" })).toBeNull();
    expect(parsePassageParams({ surah: "2", from: "abc" })).toBeNull();
  });

  it("builds the same href shape the habit links push", () => {
    expect(quranPassageHref(2, 255)).toEqual({
      pathname: "/quran/passage",
      params: { surah: "2", from: "255", to: "255" },
    });
  });
});

describe("Qur'an passage screen", () => {
  it("shows only the passage's ayahs with the reader's ayah card", async () => {
    setMockSearchParams({ surah: "2", from: "255", to: "255" });
    await renderWithTheme(<QuranPassageScreen />);
    const list = await screen.findByTestId("quran-passage-ayahs");
    expect(within(list).getByTestId("ayah-row-255")).toBeTruthy();
    expect(within(list).queryByTestId("ayah-row-254")).toBeNull();
    expect(within(list).queryByTestId("ayah-row-256")).toBeNull();
    expect(screen.getByText("Al-Baqarah")).toBeTruthy();
    expect(screen.getByText("Recite along")).toBeTruthy();
  });

  it("queues audio for the passage only", async () => {
    setMockSearchParams({ surah: "2", from: "255", to: "257" });
    await renderWithTheme(<QuranPassageScreen />);
    await fireEvent.press(await screen.findByText("Play passage"));
    const [tracks, index, options] = mockAudioPlayer.play.mock.calls[0] as [
      { id: string }[],
      number,
      { sourceHref: string },
    ];
    expect(tracks.map((track) => track.id)).toEqual(["2:255", "2:256", "2:257"]);
    expect(index).toBe(0);
    expect(options.sourceHref).toBe("/quran/passage?surah=2&from=255&to=257");
    // A per-ayah Play starts the same passage queue at that ayah.
    await fireEvent.press(screen.getByLabelText("Play ayah 256"));
    expect(mockAudioPlayer.play).toHaveBeenLastCalledWith(expect.any(Array), 1, expect.any(Object));
  });

  it("pauses the passage while one of its ayahs plays", async () => {
    setMockSearchParams({ surah: "2", from: "255" });
    mockAudioPlayer.current = { id: "2:255" };
    mockAudioPlayer.isPlaying = true;
    await renderWithTheme(<QuranPassageScreen />);
    await fireEvent.press((await screen.findAllByText("Pause"))[0]);
    expect(mockAudioPlayer.toggle).toHaveBeenCalled();
    expect(mockAudioPlayer.play).not.toHaveBeenCalled();
  });

  it("expands the ayah's actions inline and opens the full surah at the ayah", async () => {
    setMockSearchParams({ surah: "2", from: "255" });
    await renderWithTheme(<QuranPassageScreen />);
    await fireEvent.press(await screen.findByLabelText("More actions for ayah 255"));
    expect(screen.getByTestId("ayah-inline-actions")).toBeTruthy();
    expect(screen.getByLabelText("Highlight ayah 2:255")).toBeTruthy();
    await fireEvent.press(screen.getByText("Open in full surah"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2", ayah: "255" },
    });
  });

  it("explains a passage that does not exist", async () => {
    setMockSearchParams({ surah: "999", from: "1" });
    await renderWithTheme(<QuranPassageScreen />);
    expect(await screen.findByText("Surah not found")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("opens the ayah action sheet with Select on the card", async () => {
      setMockSearchParams({ surah: "2", from: "255" });
      await renderWithTheme(<QuranPassageScreen />);
      expect(screen.queryByTestId("ayah-inline-actions")).toBeNull();
      await fireEvent.press(await screen.findByLabelText(/^2:255, /));
      expect(screen.getByTestId("sheet")).toBeTruthy();
    });
  });
});
