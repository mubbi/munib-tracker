import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, fireEvent, screen } from "@testing-library/react-native";

import QuranHomeScreen from "@/app/quran/index";
import i18n from "@/i18n";
import { getPageForAyah, getSurahByNumber } from "@/lib/quran-meta";
import { quranStore } from "@/stores/quran-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-large-screen-layout", () => ({
  useLargeScreenLayout: () => ({ isListDetail: false, width: 390, sideRailWidth: 0 }),
}));
jest.mock("@/lib/quran-companion/availability", () => ({ isPracticeAvailable: () => true }));
jest.mock("@/lib/recite-to-find/availability", () => ({ isReciteToFindAvailable: () => true }));

const t = (key: string, vars?: Record<string, unknown>) => i18n.t(key, vars);
const initialPrefs = quranStore.getState().prefs;

beforeEach(() => {
  resetExpoRouterMock();
  quranStore.setState({ prefs: initialPrefs, lastRead: null });
});

function surahRowLabel(n: number): RegExp {
  const surah = getSurahByNumber(n);
  if (!surah) throw new Error(`no surah ${n}`);
  return new RegExp(
    `^${t("quran.surahNumber", { number: n })}, ${surah.nameTransliteration}, .*${t(
      "quran.ayahCount",
      { count: surah.ayahCount },
    )}`,
  );
}

describe("Qur'an hub (P5-27)", () => {
  it("speaks a surah row's number, name and ayah count", async () => {
    await renderWithTheme(<QuranHomeScreen />);
    expect(screen.getByLabelText(surahRowLabel(1))).toBeTruthy();
  });

  it("opens the page reader from the list when the saved layout is mushaf (G-03)", async () => {
    await act(async () => {
      quranStore.setState({ prefs: { ...initialPrefs, readerLayout: "mushaf" } });
    });
    await renderWithTheme(<QuranHomeScreen />);
    await fireEvent.press(screen.getByLabelText(surahRowLabel(2)));
    expect(mockRouter.push).toHaveBeenCalledWith(
      `/quran/page/${getPageForAyah(2, 1)}?surah=2&ayah=1`,
    );
  });

  it("opens the ayah reader from the list when the saved layout is ayah", async () => {
    await act(async () => {
      quranStore.setState({ prefs: { ...initialPrefs, readerLayout: "ayah" } });
    });
    await renderWithTheme(<QuranHomeScreen />);
    await fireEvent.press(screen.getByLabelText(surahRowLabel(2)));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2" },
    });
  });

  it("shows the hub tools (no sideways shortcut row) and hides them while filtering", async () => {
    await renderWithTheme(<QuranHomeScreen />);
    expect(screen.getByText(t("quran.hub.studyTools"))).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText(t("quran.searchSurah")), "baqarah");
    expect(screen.queryByText(t("quran.hub.studyTools"))).toBeNull();
  });

  it("never tints hub decoration with status colours (C-09)", () => {
    const root = join(__dirname, "..", "..", "..");
    for (const file of ["app/quran/index.tsx", "components/quran/hub/quran-hub-tools.tsx"]) {
      const source = readFileSync(join(root, file), "utf8");
      expect(source).not.toMatch(/tokens\.status\./);
    }
  });
});
