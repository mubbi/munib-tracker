import type { QuranWord } from "@munib-tracker/shared/types";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { RootDataGate } from "@/components/quran/roots/root-data-gate";
import { RootSearchPanel } from "@/components/quran/roots/root-search-panel";
import { QuranWordStudyProviders, WordByWord } from "@/components/quran/word-by-word";
import i18n from "@/i18n";
import { buckwalterToArabic, rootToArabic } from "@/lib/quran-morphology/buckwalter";
import type { RootIndex } from "@/lib/quran-morphology/build-index";
import { quranRootsStore } from "@/stores/quran-roots-store";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { buildFixtureIndex, seedRootIndex } from "@/test-support/quran-morphology";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/hooks/use-quran", () => ({ useSurahWords: () => ({ data: undefined }) }));
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(async () => ({ type: "CELLULAR" })),
  NetworkStateType: { WIFI: "WIFI", ETHERNET: "ETHERNET", CELLULAR: "CELLULAR" },
}));

const t = (key: string, vars?: Record<string, unknown>) => i18n.t(key, vars);
let index: RootIndex;

beforeAll(async () => {
  index = await buildFixtureIndex();
});

beforeEach(() => {
  resetExpoRouterMock();
  seedRootIndex(index);
});

describe("Root search panel", () => {
  it("finds a root typed as spaced Arabic letters and opens its page", async () => {
    await renderWithTheme(<RootSearchPanel onSearchText={jest.fn()} />);
    fireEvent.changeText(
      screen.getByLabelText(t("quranRoots.search.placeholder")),
      rootToArabic("rHm"),
    );
    const row = await screen.findByLabelText(
      t("quranRoots.search.resultA11y", { root: rootToArabic("rHm"), total: 4 }),
    );
    fireEvent.press(row);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/roots/[root]",
      params: { root: "rHm" },
    });
  });

  it("says when a dataset word has no root", async () => {
    await renderWithTheme(<RootSearchPanel onSearchText={jest.fn()} />);
    fireEvent.changeText(
      screen.getByLabelText(t("quranRoots.search.placeholder")),
      buckwalterToArabic("humu"),
    );
    expect(await screen.findByText(t("quranRoots.search.rootless"))).toBeTruthy();
  });

  it("offers text search when nothing matches", async () => {
    const onSearchText = jest.fn();
    await renderWithTheme(<RootSearchPanel onSearchText={onSearchText} />);
    fireEvent.changeText(screen.getByLabelText(t("quranRoots.search.placeholder")), "zzq");
    fireEvent.press(await screen.findByText(t("quranRoots.search.searchText")));
    expect(onSearchText).toHaveBeenCalledWith("zzq");
  });
});

describe("First-use download sheet", () => {
  it("offers the one-time download with its size and waits for Wi-Fi confirmation", async () => {
    seedRootIndex(null);
    const download = jest.spyOn(quranRootsStore.getState(), "download");
    await renderWithTheme(<RootDataGate></RootDataGate>);
    const button = await screen.findByText(t("quranRoots.data.download", { size: 6 }));
    fireEvent.press(button);
    await waitFor(() =>
      expect(download).toHaveBeenCalledWith({ wifiOnly: true, allowCellular: false }),
    );
    expect(await screen.findByText(t("quranRoots.data.cellularTitle"))).toBeTruthy();
    download.mockRestore();
  });

  it("shows the typed error with a retry", async () => {
    quranRootsStore.setState({ status: "failed", index: null, error: "morphology-hash" });
    await renderWithTheme(<RootDataGate></RootDataGate>);
    expect(await screen.findByText(t("quranRoots.data.error.morphology-hash"))).toBeTruthy();
    expect(screen.getByText(t("quranRoots.data.retry"))).toBeTruthy();
  });
});

describe("Root page", () => {
  it("lists lemmas with counts and deep-links an occurrence to the word in the reader", async () => {
    setMockSearchParams({ root: "rHm" });
    const { default: QuranRootScreen } = await import("@/app/quran/roots/[root]");
    await renderWithTheme(<QuranRootScreen />);
    expect(await screen.findByText(t("quranRoots.occurrences", { count: 4 }))).toBeTruthy();
    const rows = await screen.findAllByLabelText(
      t("quranRoots.page.openAyah", {
        surah: "Al-Fatihah",
        ref: t("quran.ayahRef", { surah: 1, ayah: 1 }),
      }),
    );
    fireEvent.press(rows[0]);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "1", ayah: "1", word: "4" },
    });
  });
});

describe("Word-by-word root chip", () => {
  const words: QuranWord[] = ["bisomi", "{ll~ahi", "{lr~aHoma`ni", "{lr~aHiymi"].map((bw) => ({
    arabic: buckwalterToArabic(bw),
    translit: "",
    gloss: "",
  }));

  it("shows the dataset root on each word and opens the root page", async () => {
    await renderWithTheme(
      <QuranWordStudyProviders
        surah={1}
        wordAudioEnabled={false}
        playingAyah={null}
        activeWordIndex={null}
        wordsByAyah={{ "1": words }}
      >
        <WordByWord ayahNumber={1} arabicSize={24} translitSize={14} glossSize={14} />
      </QuranWordStudyProviders>,
    );
    const chips = await screen.findAllByLabelText(
      t("quranRoots.chip", { root: rootToArabic("rHm") }),
    );
    expect(chips).toHaveLength(2);
    fireEvent.press(chips[0]);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/roots/[root]",
      params: { root: "rHm" },
    });
  });
});

describe("Qur'an search Text | Root toggle", () => {
  it("opens on the Root tab from ?mode=root", async () => {
    setMockSearchParams({ mode: "root" });
    const { default: QuranSearchScreen } = await import("@/app/quran/search");
    await renderWithTheme(<QuranSearchScreen />);
    expect(await screen.findByLabelText(t("quranRoots.search.placeholder"))).toBeTruthy();
    expect(screen.getByText(t("quranRoots.guardrail"))).toBeTruthy();
  });
});
