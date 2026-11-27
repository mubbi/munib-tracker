import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, screen, within } from "@testing-library/react-native";

import QuranPageScreen from "@/app/quran/page/[page]";
import { prefetchQcfFont } from "@/lib/qcf-font-cache";
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
// The pager is a plain column here: every mounted page renders in place.
jest.mock("@/components/quran/pager-view", () => {
  const { createElement, forwardRef: mockForwardRef } = require("react");
  const { View: MockView } = require("react-native");
  const Pager = mockForwardRef(({ children }: { children: unknown }, _ref: unknown) =>
    createElement(MockView, { testID: "pager" }, children),
  );
  return { __esModule: true, default: Pager };
});
// The mushaf page font never finishes loading in this file: the shield stays up.
jest.mock("@/lib/qcf-font-cache", () => ({
  ensureMushafPageFonts: jest.fn(() => new Promise(() => undefined)),
  isMushafPageFontReady: () => false,
  prefetchQcfFont: jest.fn(),
  warmQcfFontsAround: jest.fn(),
}));
jest.mock("@/hooks/use-qcf-page-font", () => ({
  useQcfPageFont: () => ({ ready: false, failed: false, retry: jest.fn() }),
}));
jest.mock("@/hooks/use-share-content-card", () => ({
  ...jest.requireActual("@/hooks/use-share-content-card"),
  useShareContentCard: () => ({ share: jest.fn(), SnapshotHost: null }),
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
jest.mock("@/stores/quran-store", () => {
  const actual = jest.requireActual("@/stores/quran-store");
  const { DEFAULT_QURAN_PREFS } = jest.requireActual("@/db/repositories/quran-repository");
  return {
    ...actual,
    useQuranPrefs: () => ({ ...DEFAULT_QURAN_PREFS, readerLayout: "mushaf" }),
  };
});

beforeEach(async () => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  resetAudioPlayerMock();
  await AsyncStorage.clear();
  setMockSearchParams({ page: "3" });
});

describe("Mushaf page reader while the page font loads (G-27)", () => {
  it("shields only the page text — the footer's page turns stay pressable", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await renderWithTheme(
      <QueryClientProvider client={client}>
        <QuranPageScreen />
      </QueryClientProvider>,
    );
    // Page-shaped skeleton inside the pager area, announced once as "Loading…".
    const shield = (await screen.findAllByLabelText("Loading…"))[0];
    expect(shield).toBeTruthy();

    const next = screen.getByLabelText("Next page");
    expect(next.props.accessibilityState).toMatchObject({ disabled: false });
    const pager = screen.getByTestId("pager");
    // The footer is not inside the shielded pager area.
    const pagerArea = pager.parent;
    expect(pagerArea).toBeTruthy();
    expect(within(pagerArea ?? pager).queryByLabelText("Next page")).toBeNull();
    expect(within(pagerArea ?? pager).getAllByLabelText("Loading…").length).toBeGreaterThan(0);

    await act(async () => {
      await fireEvent.press(next);
    });
    // The press reached the reader: it starts turning to page 4 (font prefetch first).
    expect(prefetchQcfFont).toHaveBeenCalledWith(4);
  });
});
