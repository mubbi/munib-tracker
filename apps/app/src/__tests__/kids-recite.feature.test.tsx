import { fireEvent, screen } from "@testing-library/react-native";

import KidsReciteScreen from "@/app/kids/recite";
import i18n from "@/i18n";
import { isKidsAllowedPath, KIDS_SURAHS } from "@/lib/circles/kids-content";
import { getSurahByNumber } from "@/lib/quran-meta";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
// The session itself is covered by kids-recite-session.test.tsx.
jest.mock("@/components/kids/kids-recite-session", () => {
  const { Text } = require("react-native");
  return {
    KidsReciteSession: ({ passage }: { passage: { surah: number; ayahEnd: number } }) => (
      <Text>{`session ${passage.surah}:${passage.ayahEnd}`}</Text>
    ),
  };
});

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);
const nameOf = (n: number) => getSurahByNumber(n)?.nameTransliteration ?? String(n);

describe("/kids/recite", () => {
  let restorePlatform: (() => void) | null = null;
  beforeEach(resetExpoRouterMock);
  afterEach(() => {
    restorePlatform?.();
    restorePlatform = null;
  });

  it("stays inside kids mode on a linked child device", () => {
    expect(isKidsAllowedPath("/kids/recite?surah=112")).toBe(true);
  });

  it("offers only the curated short surahs and opens the one picked", async () => {
    await renderWithTheme(<KidsReciteScreen />);
    for (const n of KIDS_SURAHS) {
      expect(screen.getByLabelText(t("kids.recite.pickA11y", { surah: nameOf(n) }))).toBeTruthy();
    }
    await fireEvent.press(screen.getByLabelText(t("kids.recite.pickA11y", { surah: nameOf(112) })));
    expect(mockRouter.setParams).toHaveBeenCalledWith({ surah: "112" });
  });

  it("recites the whole curated surah from the route param", async () => {
    setMockSearchParams({ surah: "112" });
    await renderWithTheme(<KidsReciteScreen />);
    expect(await screen.findByText("session 112:4")).toBeTruthy();
  });

  it("never opens a surah outside the curated set", async () => {
    setMockSearchParams({ surah: "2" });
    await renderWithTheme(<KidsReciteScreen />);
    expect(screen.queryByText(/session/)).toBeNull();
    expect(screen.getByText(t("kids.recite.intro"))).toBeTruthy();
  });

  it("is unavailable on TV", async () => {
    restorePlatform = setPlatform({ isTV: true });
    await renderWithTheme(<KidsReciteScreen />);
    expect(screen.getByText(t("kids.tvUnavailable"))).toBeTruthy();
  });
});
