import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import SurahReaderScreen from "@/app/quran/[surah]";
import { quranNotesStore } from "@/stores/quran-notes-store";
import { resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
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
jest.mock("@/hooks/use-large-screen-layout", () => ({
  useLargeScreenLayout: () => ({ isListDetail: false, width: 390, sideRailWidth: 0 }),
}));

beforeEach(async () => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  resetAudioPlayerMock();
  await AsyncStorage.clear();
  await act(async () => {
    await quranNotesStore.getState().load();
  });
  setMockSearchParams({ surah: "1" });
});

describe("Surah reader (phone)", () => {
  it("keeps a compact action row and moves the rest into the More sheet", async () => {
    await renderWithTheme(<SurahReaderScreen />);
    const more = await screen.findByLabelText("More actions for ayah 1");
    // Inline: play, bookmark, note, tafsir, More — practise / check / highlight / share live in More.
    expect(screen.queryAllByText("Practise")).toHaveLength(0);
    expect(screen.queryAllByText("Highlight")).toHaveLength(0);
    await fireEvent.press(more);
    expect(screen.getByText("Highlight")).toBeTruthy();
    expect(screen.getByText("Practise")).toBeTruthy();
    expect(screen.getByLabelText("Highlight ayah 1:1")).toBeTruthy();
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
