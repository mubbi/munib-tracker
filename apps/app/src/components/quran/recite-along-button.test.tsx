import { fireEvent, screen } from "@testing-library/react-native";

import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { FatihahCheckCard } from "@/components/quran/recite-along-fatihah-card";
import i18n from "@/i18n";
import { quranListenerStore } from "@/stores/quran-listener-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);
const session = (surah: number, from: number, to: number, mode: string) => ({
  pathname: "/quran/practice/session",
  params: {
    surah: String(surah),
    from: String(from),
    to: String(to),
    mode,
    source: "recite-along",
  },
});

describe("ReciteAlongButton", () => {
  let restorePlatform: (() => void) | null = null;
  beforeEach(resetExpoRouterMock);
  afterEach(() => {
    restorePlatform?.();
    restorePlatform = null;
  });

  it("opens a short passage straight in Follow mode", async () => {
    await renderWithTheme(
      <ReciteAlongButton passage={{ surah: 2, ayahStart: 255, ayahEnd: 255 }} />,
    );
    await fireEvent.press(screen.getByText(t("reciteAlong.button")));
    expect(mockRouter.push).toHaveBeenCalledWith(session(2, 255, 255, "follow"));
  });

  it("asks first for a long passage: the whole surah in Follow, or a 10-ayah section", async () => {
    await renderWithTheme(
      <ReciteAlongButton passage={{ surah: 18, ayahStart: 1, ayahEnd: 110 }} mode="check" />,
    );
    await fireEvent.press(screen.getByText(t("reciteAlong.checkButton")));
    expect(mockRouter.push).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByText(t("reciteAlong.sheet.followWhole")));
    expect(mockRouter.push).toHaveBeenLastCalledWith(session(18, 1, 110, "follow"));

    await fireEvent.press(screen.getByText(t("reciteAlong.checkButton")));
    await fireEvent.press(screen.getByText(t("reciteAlong.sheet.section", { from: 11, to: 20 })));
    expect(mockRouter.push).toHaveBeenLastCalledWith(session(18, 11, 20, "check"));
  });

  it("labels a short check take 'Check my recitation' and opens it in Check mode", async () => {
    await renderWithTheme(
      <ReciteAlongButton passage={{ surah: 1, ayahStart: 1, ayahEnd: 1 }} mode="check" />,
    );
    await fireEvent.press(screen.getByText(t("reciteAlong.checkButton")));
    expect(mockRouter.push).toHaveBeenCalledWith(session(1, 1, 1, "check"));
  });

  it("draws a compact mic + 'Recite' action with appearance='icon'", async () => {
    await renderWithTheme(
      <ReciteAlongButton passage={{ surah: 112, ayahStart: 1, ayahEnd: 4 }} appearance="icon" />,
    );
    await fireEvent.press(screen.getByText(t("reciteAlong.iconLabel")));
    expect(mockRouter.push).toHaveBeenCalledWith(session(112, 1, 4, "follow"));
  });

  it("is hidden once the listener reports this runtime unsupported", async () => {
    const previous = quranListenerStore.getState().listener;
    quranListenerStore.setState({ listener: { ...previous, status: "unsupported" } });
    try {
      await renderWithTheme(<ReciteAlongButton passage={{ surah: 1, ayahStart: 1, ayahEnd: 7 }} />);
      expect(screen.queryByText(t("reciteAlong.button"))).toBeNull();
    } finally {
      quranListenerStore.setState({ listener: previous });
    }
  });

  it("is hidden on TV (no microphone path)", async () => {
    restorePlatform = setPlatform({ isTV: true });
    await renderWithTheme(<ReciteAlongButton passage={{ surah: 1, ayahStart: 1, ayahEnd: 7 }} />);
    expect(screen.queryByText(t("reciteAlong.button"))).toBeNull();
  });
});

describe("ReciteAlongCard", () => {
  beforeEach(resetExpoRouterMock);

  it("labels each passage by reference when there are several", async () => {
    await renderWithTheme(
      <ReciteAlongCard
        passages={[
          { surah: 112, ayahStart: 1, ayahEnd: 4 },
          { surah: 113, ayahStart: 1, ayahEnd: 5 },
        ]}
      />,
    );
    expect(screen.getByText(t("reciteAlong.cardTitle"))).toBeTruthy();
    await fireEvent.press(
      screen.getByText(t("quranCompanion.passage.range", { surah: "Al-Falaq", from: 1, to: 5 })),
    );
    expect(mockRouter.push).toHaveBeenCalledWith(session(113, 1, 5, "follow"));
  });

  it("renders nothing without a passage", async () => {
    await renderWithTheme(<ReciteAlongCard passages={[]} />);
    expect(screen.queryByText(t("reciteAlong.cardTitle"))).toBeNull();
  });
});

describe("FatihahCheckCard", () => {
  let restorePlatform: (() => void) | null = null;
  beforeEach(resetExpoRouterMock);
  afterEach(() => {
    restorePlatform?.();
    restorePlatform = null;
  });

  it("starts the al-Fatihah check on 1:1–7 and says it is a practice aid", async () => {
    await renderWithTheme(<FatihahCheckCard />);
    expect(screen.getByText(t("reciteAlong.fatihah.note"))).toBeTruthy();
    await fireEvent.press(screen.getByText(t("reciteAlong.fatihah.cta")));
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/quran/practice/session",
        params: expect.objectContaining({ surah: "1", from: "1", to: "7" }),
      }),
    );
  });

  it("is hidden on TV", async () => {
    restorePlatform = setPlatform({ isTV: true });
    await renderWithTheme(<FatihahCheckCard />);
    expect(screen.queryByText(t("reciteAlong.fatihah.cta"))).toBeNull();
  });
});
