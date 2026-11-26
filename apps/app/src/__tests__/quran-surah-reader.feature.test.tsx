import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen, within } from "@testing-library/react-native";

import SurahReaderScreen from "@/app/quran/[surah]";
import { quranNotesStore } from "@/stores/quran-notes-store";
import { resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
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
    SnapshotHost: () => null,
  }),
}));
jest.mock("@/hooks/use-quran-reading-recorder", () => ({
  useQuranReadingRecorder: () => ({
    resume: jest.fn(),
    pause: jest.fn(),
    tick: jest.fn(),
    noteAyahRange: jest.fn(),
    notePage: jest.fn(),
  }),
}));
jest.mock("@/components/content-report/content-report-button", () => ({
  ContentReportButton: () => null,
}));
jest.mock("@/lib/quran-companion/availability", () => ({
  isPracticeAvailable: () => true,
}));
jest.mock("@/lib/quran-pronunciation/availability", () => ({
  isPronunciationCheckPlatformAvailable: () => true,
}));
let mockListDetail = false;
jest.mock("@/hooks/use-large-screen-layout", () => ({
  useLargeScreenLayout: () =>
    mockListDetail
      ? { isListDetail: true, width: 1280, sideRailWidth: 0 }
      : { isListDetail: false, width: 390, sideRailWidth: 0 },
}));

beforeEach(async () => {
  jest.clearAllMocks();
  mockListDetail = false;
  resetExpoRouterMock();
  resetAudioPlayerMock();
  await AsyncStorage.clear();
  await act(async () => {
    await quranNotesStore.getState().load();
  });
  setMockSearchParams({ surah: "1" });
});

describe("Surah reader (phone)", () => {
  it("keeps a compact action row and expands the rest inline under More", async () => {
    await renderWithTheme(<SurahReaderScreen />);
    const more = await screen.findByLabelText("More actions for ayah 1");
    // Inline: Play · Save · Share · More — tafsir / note / highlight / practise live behind More.
    expect(screen.queryAllByText("Practice")).toHaveLength(0);
    expect(screen.queryAllByText("Highlight")).toHaveLength(0);
    await fireEvent.press(more);
    const row = within(screen.getByTestId("ayah-row-1")).getByTestId("ayah-inline-actions");
    expect(within(row).getByText("Tafsir")).toBeTruthy();
    expect(within(row).getByText("Highlight")).toBeTruthy();
    expect(within(row).getByText("Practice")).toBeTruthy();
    expect(within(row).getByLabelText("Highlight ayah 1:1")).toBeTruthy();
    // No bottom sheet: More turns into Less and collapses the row again.
    expect(screen.queryByTestId("sheet")).toBeNull();
    await fireEvent.press(screen.getByLabelText("Fewer actions for ayah 1"));
    expect(screen.queryByTestId("ayah-inline-actions")).toBeNull();
  });

  it("keeps only one ayah's actions expanded at a time", async () => {
    await renderWithTheme(<SurahReaderScreen />);
    await fireEvent.press(await screen.findByLabelText("More actions for ayah 1"));
    await fireEvent.press(screen.getByLabelText("More actions for ayah 2"));
    expect(screen.getAllByTestId("ayah-inline-actions")).toHaveLength(1);
    expect(
      within(screen.getByTestId("ayah-row-2")).getByTestId("ayah-inline-actions"),
    ).toBeTruthy();
    expect(screen.getByLabelText("More actions for ayah 1")).toBeTruthy();
  });

  it("opens practise for the ayah from the inline row", async () => {
    await renderWithTheme(<SurahReaderScreen />);
    await fireEvent.press(await screen.findByLabelText("More actions for ayah 1"));
    await fireEvent.press(screen.getByLabelText("Practice ayah 1"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/practice/session",
      params: { surah: "1", from: "1", to: "1", source: "reader" },
    });
  });

  it("ends the surah with next-surah navigation (G-02)", async () => {
    await renderWithTheme(<SurahReaderScreen />);
    const footer = await screen.findByTestId("surah-nav-footer");
    // Al-Fatihah has no previous surah: the footer offers only "Next".
    const buttons = within(footer).getAllByRole("button");
    expect(buttons).toHaveLength(1);
    await fireEvent.press(buttons[0]);
    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2" },
    });
  });

  it("shows the note hint marker and its peek for a noted ayah", async () => {
    await act(async () => {
      await quranNotesStore.getState().save({ surah: 1, ayah: 2, body: "Praise", tags: [] });
    });
    await renderWithTheme(<SurahReaderScreen />);
    const marker = await screen.findByLabelText("My note on 1:2: Praise");
    await fireEvent.press(marker);
    expect(screen.getByTestId("note-peek-sheet")).toBeTruthy();
    expect(screen.getByText("Open note")).toBeTruthy();
  });
});

describe("Surah reader (wide list–detail)", () => {
  beforeEach(() => {
    mockListDetail = true;
  });

  it("keeps the same four inline actions in the same order, with More expanding inline", async () => {
    await renderWithTheme(<SurahReaderScreen />);
    const row = await screen.findByTestId("ayah-row-1");
    const labels = within(within(row).getByTestId("ayah-row-actions"))
      .getAllByRole("button")
      .map((node) => node.props.accessibilityLabel);
    expect(labels).toEqual(["Play ayah 1", "Save ayah", "Share verse", "More actions for ayah 1"]);
    await fireEvent.press(screen.getByLabelText("More actions for ayah 1"));
    expect(screen.getByText("Practice")).toBeTruthy();
    // The side pane carries the full navigation card, so there is no list footer.
    expect(screen.queryByTestId("surah-nav-footer")).toBeNull();
  });
});
