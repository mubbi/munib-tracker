import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { KidsReciteSession } from "@/components/kids/kids-recite-session";
import type { UsePracticeSessionResult } from "@/hooks/use-practice-session";
import i18n from "@/i18n";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { createAyahState, createSessionState } from "@/lib/quran-companion/reduce-session";
import type { WordState } from "@/lib/quran-companion/types";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranPracticeStore } from "@/stores/quran-practice-store";
import { quranReadingLogStore } from "@/stores/quran-reading-log-store";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => true }));
jest.mock("@/hooks/use-practice-session", () => ({
  usePracticeSession: () => mockSession,
}));

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);
const WORDS = ["قُلْ", "هُوَ", "ٱللَّهُ", "أَحَدٌ"];
const PASSAGE = { surah: 112, ayahStart: 1, ayahEnd: 2 };

let mockSession: UsePracticeSessionResult;

function sessionWith({
  index = 0,
  states,
  settled = false,
  mic = "idle",
  engineStatus = "ready",
}: {
  index?: number;
  states?: WordState[];
  settled?: boolean;
  mic?: UsePracticeSessionResult["mic"];
  engineStatus?: UsePracticeSessionResult["engineStatus"];
}): UsePracticeSessionResult {
  const ayahs = [1, 2];
  const ayah = ayahs[index] ?? 1;
  const base = createAyahState(ayah, WORDS, { engineToStudy: [], studyToEngine: [] });
  const ayahState = states ? { ...base, states, takes: 1, reached: true } : base;
  const row = {
    ayah,
    arabic: WORDS.join(" "),
    translation: "",
    transliteration: "",
    words: WORDS,
    wordAudio: [],
    fallbackWords: false,
  };
  return {
    passage: PASSAGE,
    displayMode: "follow",
    ayahs,
    index,
    ayah,
    row,
    rows: { [ayah]: row },
    surahWordCounts: null,
    hiddenOf: () => new Set(),
    wordsLoading: false,
    session: { ...createSessionState(), ayahs: { [ayah]: ayahState } },
    engineStatus,
    engineError: null,
    confirmsMismatches: true,
    mic,
    micPermission: "granted",
    settledAyahs: settled ? new Set([ayah]) : new Set(),
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
  };
}

const renderSession = () =>
  renderWithTheme(
    <KidsReciteSession passage={PASSAGE} onAgain={jest.fn()} onAnother={jest.fn()} />,
  );

describe("KidsReciteSession", () => {
  it("starts listening from the big button", async () => {
    mockSession = sessionWith({});
    await renderSession();
    await fireEvent.press(screen.getByLabelText(t("kids.recite.start")));
    expect(mockSession.toggleMic).toHaveBeenCalled();
  });

  it("gently asks to try skipped words again, with Listen and Try again — no score", async () => {
    mockSession = sessionWith({
      settled: true,
      states: ["matched", "confirmedMismatch", "matched", "upcoming"],
    });
    await renderSession();
    expect(screen.getByText(t("kids.recite.tryWordsTitle"))).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(t("kids.recite.hearWordA11y", { word: WORDS[1] })));
    expect(mockSession.hearWord).toHaveBeenCalledWith(1);
    await fireEvent.press(screen.getByText(t("kids.recite.tryAgain")));
    expect(mockSession.retry).toHaveBeenCalled();
    expect(mockSession.toggleMic).toHaveBeenCalled();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("cheers a clean ayah and moves on", async () => {
    mockSession = sessionWith({
      settled: true,
      states: ["matched", "matched", "matched", "matched"],
    });
    await renderSession();
    expect(screen.getByText(t("kids.recite.wellDone"))).toBeTruthy();
    await fireEvent.press(screen.getByText(t("kids.recite.nextAyah")));
    expect(mockSession.next).toHaveBeenCalled();
  });

  it("celebrates once the last ayah is recited", async () => {
    mockSession = sessionWith({
      index: 1,
      settled: true,
      states: ["matched", "corrected", "matched", "matched"],
    });
    await renderSession();
    expect(screen.getByText(t("kids.recite.doneTitle"))).toBeTruthy();
    expect(screen.getByText(t("kids.recite.another"))).toBeTruthy();
  });

  it("falls back to listen-and-read when the listener is not available", async () => {
    mockSession = sessionWith({ engineStatus: "listen-only" });
    await renderSession();
    expect(screen.getByText(t("kids.recite.listenOnly"))).toBeTruthy();
    expect(screen.queryByLabelText(t("kids.recite.start"))).toBeNull();
    await fireEvent.press(screen.getByText(t("kids.recite.listen")));
    expect(mockSession.hear).toHaveBeenCalled();
  });

  describe("daily reading log (D73)", () => {
    const today = () => quranReadingLogStore.getState().log[getLocalDateString()];

    beforeEach(() => {
      quranReadingLogStore.setState({ log: {}, isReady: true });
      quranCompanionPrefsStore.setState({ prefs: { ...DEFAULT_COMPANION_PREFS }, isReady: true });
    });

    it("adds a heard ayah once per kids session — never khatm or practice history", async () => {
      const historyBefore = quranPracticeStore.getState().history;
      mockSession = sessionWith({
        settled: true,
        states: ["matched", "matched", "corrected", "upcoming"], // 3/4 heard
      });
      const view = await renderSession();
      await waitFor(() => expect(today()).toEqual({ seconds: 0, ayahs: 1, pages: 0 }));
      // A re-render with a fresh session object doesn't log it again.
      mockSession = { ...mockSession, session: { ...mockSession.session } };
      await view.rerender(
        <KidsReciteSession passage={PASSAGE} onAgain={jest.fn()} onAnother={jest.fn()} />,
      );
      expect(today()?.ayahs).toBe(1);
      expect(quranPracticeStore.getState().history).toBe(historyBefore);
    });

    it("skips an ayah under two thirds heard", async () => {
      mockSession = sessionWith({
        settled: true,
        states: ["matched", "confirmedMismatch", "upcoming", "upcoming"],
      });
      await renderSession();
      expect(today()).toBeUndefined();
    });

    it("logs nothing while listen-only or with the setting off", async () => {
      mockSession = {
        ...sessionWith({ settled: true, states: ["matched", "matched", "matched", "matched"] }),
        engineStatus: "listen-only",
      };
      await renderSession();
      expect(today()).toBeUndefined();

      quranCompanionPrefsStore.setState({
        prefs: { ...DEFAULT_COMPANION_PREFS, logToReadingLog: false },
        isReady: true,
      });
      mockSession = sessionWith({
        settled: true,
        states: ["matched", "matched", "matched", "matched"],
      });
      await renderSession();
      expect(today()).toBeUndefined();
    });
  });
});
