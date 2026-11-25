import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import type { UsePracticeSessionResult } from "@/hooks/use-practice-session";
import i18n from "@/i18n";
import { dailyTargetForPlan } from "@/lib/khatm";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { createAyahState, createSessionState } from "@/lib/quran-companion/reduce-session";
import { hifzStore } from "@/stores/hifz-store";
import { khatmStore } from "@/stores/khatm-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranStore } from "@/stores/quran-store";
import { buildKhatmPlan } from "@/test-support/fixtures/khatm";
import { seedKhatm } from "@/test-support/khatm-store";
import { lastCallArgs } from "@/test-support/mock-calls";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/hooks/use-practice-session", () => ({
  ...jest.requireActual("@/hooks/use-practice-session"),
  usePracticeSession: () => mockSession,
}));
jest.mock("@/hooks/use-quran", () => ({ useSurahTajweed: () => ({ data: undefined }) }));
jest.mock("@/lib/quran-companion/open-app-settings", () => ({
  canOpenAppSettings: () => true,
  openAppSettings: mockOpenAppSettings,
}));

const mockOpenAppSettings = jest.fn(async () => true);
let mockSession: UsePracticeSessionResult;

const t = (key: string, vars?: Record<string, unknown>) => i18n.t(key, vars);

/** The undo action of the latest `toast.show(title, { action })` call. */
function lastUndo(): () => void {
  const [, options] = lastCallArgs(mockToast.show) as [
    string,
    { action?: { onPress: () => void } },
  ];
  const onPress = options.action?.onPress;
  if (!onPress) throw new Error("toast had no Undo action");
  return onPress;
}

beforeEach(() => {
  resetExpoRouterMock();
  resetToastMock();
});

describe("Khatm — logging and reset (G-06)", () => {
  const plan = buildKhatmPlan();
  const target = dailyTargetForPlan(plan);

  beforeEach(async () => {
    await seedKhatm({ plan, ayahsRead: 0 });
  });
  afterEach(async () => {
    await seedKhatm({ plan: null });
  });

  async function renderKhatm() {
    const { default: KhatmScreen } = await import("@/app/quran/khatm");
    await renderWithTheme(<KhatmScreen />);
  }

  it("logs today's reading at once — no dialog — and offers Undo", async () => {
    await renderKhatm();
    await fireEvent.press(screen.getByText(t("khatm.logAdd", { count: target })));

    await waitFor(() => expect(khatmStore.getState().ayahsRead).toBe(target));
    expect(screen.queryByText(t("khatm.logConfirmTitle"))).toBeNull();
    expect(mockToast.show).toHaveBeenCalledWith(
      t("quran.study.khatmLogged"),
      expect.objectContaining({ action: expect.objectContaining({ label: t("uiFeedback.undo") }) }),
    );

    await act(async () => lastUndo()());
    await waitFor(() => expect(khatmStore.getState().ayahsRead).toBe(0));
  });

  it("still confirms a reset before clearing the plan", async () => {
    await renderKhatm();
    await fireEvent.press(screen.getByLabelText(t("khatm.reset")));

    expect(screen.getByText(t("khatm.resetConfirmTitle"))).toBeTruthy();
    expect(khatmStore.getState().plan).not.toBeNull();
  });

  it("labels quick amounts by what they set, as a radio group", async () => {
    await renderKhatm();
    expect(screen.queryByText("+10")).toBeNull();
    // Daily goal, 10, 25, 50 — one radio group.
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    await fireEvent.press(screen.getByText("10"));
    expect(screen.getAllByRole("radio")[1]).toBeChecked();
  });

  it("shows an announced field error for an out-of-range amount", async () => {
    await renderKhatm();
    await fireEvent.changeText(screen.getByLabelText(t("khatm.logAmountA11y")), "99999");
    expect(
      await screen.findByText(t("khatm.logInvalid", { max: (6236).toLocaleString() })),
    ).toBeTruthy();
  });
});

describe("Qur'an bookmarks (G-14 / G-16)", () => {
  const toggleBookmark = jest.fn(async () => false);
  const removeBookmark = jest.fn(async () => undefined);
  const restoreBookmark = jest.fn(async () => true);

  beforeEach(async () => {
    toggleBookmark.mockClear();
    removeBookmark.mockClear();
    restoreBookmark.mockClear();
    await act(async () => {
      quranStore.setState({
        isReady: true,
        toggleBookmark,
        removeBookmark,
        restoreBookmark,
        bookmarks: [{ id: "b1", surah: 1, ayah: 2, createdAt: "2026-11-01T00:00:00.000Z" }],
      });
    });
  });

  async function renderBookmarks() {
    const { default: QuranBookmarksScreen } = await import("@/app/quran/bookmarks");
    await renderWithTheme(<QuranBookmarksScreen />);
  }

  it("is one accessible element per bookmark, with the translation in its name", async () => {
    await renderBookmarks();
    const name = t("quran.study.bookmarkA11y", { surah: "Al-Fatihah", ref: "1:2", page: 1 });
    const cards = screen.getAllByRole("button", { name: new RegExp(`^${name}`) });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.props.accessibilityLabel.length).toBeGreaterThan(name.length);
  });

  it("removes at once and offers Undo", async () => {
    await renderBookmarks();
    await fireEvent.press(
      screen.getByLabelText(t("quran.study.bookmarkRemoveA11y", { ref: "1:2" })),
    );
    await waitFor(() => expect(removeBookmark).toHaveBeenCalledWith(1, 2));
    expect(mockToast.show).toHaveBeenCalledWith(
      t("quran.study.bookmarkRemoved"),
      expect.objectContaining({ action: expect.anything() }),
    );

    await act(async () => lastUndo()());
    // Undo restores the exact record (same id + createdAt), never a fresh toggle.
    expect(restoreBookmark).toHaveBeenCalledWith({
      id: "b1",
      surah: 1,
      ayah: 2,
      createdAt: "2026-11-01T00:00:00.000Z",
    });
    expect(toggleBookmark).not.toHaveBeenCalled();
  });

  it("offers Try again instead of a skeleton forever when the load fails (B-26)", async () => {
    const load = jest
      .fn<Promise<void>, []>()
      .mockRejectedValueOnce(new Error("db"))
      .mockImplementationOnce(async () => {
        quranStore.setState({ isReady: true });
      });
    const originalLoad = quranStore.getState().load;
    await act(async () => {
      quranStore.setState({ isReady: false, load });
    });
    try {
      await renderBookmarks();
      const retry = await screen.findByText(t("common.tryAgain"));
      await fireEvent.press(retry);
      await waitFor(() => expect(load).toHaveBeenCalledTimes(2));
      expect(screen.queryByText(t("common.tryAgain"))).toBeNull();
    } finally {
      quranStore.setState({ load: originalLoad });
    }
  });
});

describe("Hifz list (G-23)", () => {
  beforeEach(async () => {
    await act(async () => {
      hifzStore.setState({ statuses: { "1:2": "memorized" }, isReady: true });
    });
  });

  it("changes status from the row and removes with Undo", async () => {
    const { default: HifzScreen } = await import("@/app/quran/hifz");
    await renderWithTheme(<HifzScreen />);
    await fireEvent.press(screen.getByLabelText(t("quran.study.hifzStatusA11y", { ref: "1:2" })));
    await fireEvent.press(screen.getByRole("radio", { name: t("hifz.markReview") }));
    await waitFor(() => expect(hifzStore.getState().statuses["1:2"]).toBe("review"));

    await fireEvent.press(screen.getByLabelText(t("quran.study.hifzStatusA11y", { ref: "1:2" })));
    await fireEvent.press(screen.getByText(t("hifz.clear")));
    await waitFor(() => expect(hifzStore.getState().statuses["1:2"]).toBeUndefined());
    await act(async () => lastUndo()());
    await waitFor(() => expect(hifzStore.getState().statuses["1:2"]).toBe("review"));
  });
});

describe("Practice session — mic denied (G-05)", () => {
  const WORDS = ["قُلْ", "هُوَ", "ٱللَّهُ", "أَحَدٌ"];

  beforeEach(async () => {
    setMockSearchParams({ surah: "112", from: "1", to: "1", mode: "follow" });
    await act(async () => {
      quranCompanionPrefsStore.setState({ prefs: { ...DEFAULT_COMPANION_PREFS }, isReady: true });
    });
    const row = {
      ayah: 1,
      arabic: WORDS.join(" "),
      translation: "",
      transliteration: "",
      words: WORDS,
      wordAudio: [],
      fallbackWords: false,
    };
    mockSession = {
      passage: { surah: 112, ayahStart: 1, ayahEnd: 1 },
      displayMode: "follow",
      ayahs: [1],
      index: 0,
      ayah: 1,
      row,
      rows: { 1: row },
      surahWordCounts: null,
      hiddenOf: () => new Set(),
      wordsLoading: false,
      session: {
        ...createSessionState(),
        ayahs: { 1: createAyahState(1, WORDS, { engineToStudy: [], studyToEngine: [] }) },
      },
      engineStatus: "ready",
      engineError: null,
      confirmsMismatches: true,
      mic: "idle",
      micPermission: "denied",
      settledAyahs: new Set(),
      hidden: new Set(),
      hearWordIndex: null,
      isHearing: false,
      tryAgain: [],
      toggleMic: jest.fn(async () => {}),
      hear: jest.fn(async () => {}),
      hearWord: jest.fn(async () => {}),
      revealNext: jest.fn(),
      revealAll: jest.fn(),
      retry: jest.fn(),
      next: jest.fn(),
      previous: jest.fn(),
      goTo: jest.fn(),
      finish: jest.fn(),
    } as UsePracticeSessionResult;
  });

  it("renders a warning callout with an Open Settings action", async () => {
    const { default: PracticeSessionRoute } = await import("@/app/quran/practice/session");
    await renderWithTheme(<PracticeSessionRoute />);

    expect(await screen.findByText(t("quranCompanion.session.micOff"))).toBeTruthy();
    await fireEvent.press(screen.getByText(t("quranCompanion.session.openSettings")));
    expect(mockOpenAppSettings).toHaveBeenCalled();
  });
});
