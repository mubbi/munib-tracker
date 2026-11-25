import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { EMPTY_HISTORY } from "@/lib/quran-companion/merge";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { buildDueItem, buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import { khatmStore } from "./khatm-store";
import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";

import {
  quranPracticeStore,
  useEnsurePracticeLoaded,
  useLastPracticeSummary,
  usePracticeHistory,
  useRevisionSitting,
} from "./quran-practice-store";
import { quranReadingLogStore } from "./quran-reading-log-store";

const SUMMARY = buildPracticeSummary();
const item = (ayah: number) => buildDueItem({ ayah });

beforeEach(async () => {
  await AsyncStorage.clear();
  quranPracticeStore.setState({
    history: EMPTY_HISTORY,
    isReady: false,
    lastSummary: null,
    sitting: null,
  });
});

describe("quranPracticeStore", () => {
  it("addSummary sets the last summary and prepends it to persisted history", async () => {
    await quranPracticeStore.getState().addSummary(SUMMARY);
    const state = quranPracticeStore.getState();
    expect(state.lastSummary).toBe(SUMMARY);
    expect(state.history.items[0]).toMatchObject({ id: "s1" });
    expect(
      await readJSON<{ items: unknown[] }>(DB_KEYS.quranPracticeSessions, { items: [] }),
    ).toMatchObject({ items: [{ id: "s1" }] });
  });

  it("clearHistory empties items and records clearedAt", async () => {
    await quranPracticeStore.getState().addSummary(SUMMARY);
    await quranPracticeStore.getState().clearHistory();
    expect(quranPracticeStore.getState().history.items).toEqual([]);
    expect(quranPracticeStore.getState().history.clearedAt).toEqual(expect.any(String));
  });

  it("setLastSummary replaces the in-memory summary", () => {
    quranPracticeStore.getState().setLastSummary(SUMMARY);
    expect(quranPracticeStore.getState().lastSummary).toBe(SUMMARY);
    quranPracticeStore.getState().setLastSummary(null);
    expect(quranPracticeStore.getState().lastSummary).toBeNull();
  });

  it("advanceSitting walks the queue and returns null past the end", () => {
    expect(quranPracticeStore.getState().advanceSitting()).toBeNull();

    quranPracticeStore
      .getState()
      .startSitting({ items: [item(1), item(2)], index: 0, remaining: 3 });
    expect(quranPracticeStore.getState().advanceSitting()).toEqual(item(2));
    expect(quranPracticeStore.getState().sitting?.index).toBe(1);

    expect(quranPracticeStore.getState().advanceSitting()).toBeNull();
    expect(quranPracticeStore.getState().sitting).toMatchObject({ index: 2, remaining: 3 });
  });
});

describe("practice hooks", () => {
  it("load on mount and expose history, summary and sitting", async () => {
    await quranPracticeStore.getState().addSummary(SUMMARY);
    quranPracticeStore.setState({ history: EMPTY_HISTORY, isReady: false });

    const { result } = await renderHook(() => {
      useEnsurePracticeLoaded();
      return {
        history: usePracticeHistory(),
        summary: useLastPracticeSummary(),
        sitting: useRevisionSitting(),
      };
    });

    await waitFor(() => expect(result.current.history.items).toHaveLength(1));
    expect(result.current.summary).toBe(SUMMARY);
    expect(result.current.sitting).toBeNull();

    await act(async () => {
      quranPracticeStore.getState().startSitting({ items: [item(1)], index: 0, remaining: 0 });
    });
    expect(result.current.sitting?.items).toHaveLength(1);
  });

  it("does not reload when ready", async () => {
    quranPracticeStore.setState({ isReady: true });
    await quranPracticeStore.getState().addSummary(SUMMARY);
    quranPracticeStore.setState({ history: EMPTY_HISTORY });
    await renderHook(() => useEnsurePracticeLoaded());
    expect(quranPracticeStore.getState().history).toBe(EMPTY_HISTORY);
  });
});

describe("reading credit (D68)", () => {
  const TODAY = getLocalDateString();
  let n = 0;
  const fresh = (overrides: Parameters<typeof buildPracticeSummary>[0] = {}) =>
    buildPracticeSummary({
      id: `credit-${++n}`,
      endedAt: new Date().toISOString(),
      durationMs: 60_000,
      heardAyahs: [1, 2, 3, 4, 5],
      ...overrides,
    });

  beforeEach(() => {
    quranReadingLogStore.setState({ log: {}, isReady: false });
    quranCompanionPrefsStore.setState({ prefs: { ...DEFAULT_COMPANION_PREFS }, isReady: true });
    khatmStore.setState({
      plan: null,
      ayahsRead: 0,
      unit: "ayah",
      practiceCredited: undefined,
      isReady: true,
    });
  });

  it("adds heard ayahs to today's reading log once per session id", async () => {
    const summary = fresh();
    await quranPracticeStore.getState().addSummary(summary);
    await quranPracticeStore.getState().addSummary(summary);
    expect(quranReadingLogStore.getState().log[TODAY]).toEqual({
      seconds: 60,
      ayahs: 5,
      pages: 0,
    });
    expect(quranPracticeStore.getState().history.items[0]).toMatchObject({
      id: summary.id,
      loggedAyahs: [1, 2, 3, 4, 5],
    });
  });

  it("exposes the credit for the summary screen", async () => {
    const summary = fresh();
    await quranPracticeStore.getState().addSummary(summary);
    expect(quranPracticeStore.getState().lastCredit).toEqual({
      sessionId: summary.id,
      ayahs: 5,
      khatm: null,
    });
  });

  it("does not count an ayah twice in one day", async () => {
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [1, 2, 3] }));
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [2, 3, 4] }));
    expect(quranReadingLogStore.getState().log[TODAY]?.ayahs).toBe(4);
    expect(quranPracticeStore.getState().lastCredit?.ayahs).toBe(1);
  });

  it("moves an active personal khatm forward", async () => {
    khatmStore.setState({
      plan: { days: 30, startDate: TODAY, unit: "ayah" },
      ayahsRead: 10,
      unit: "ayah",
      isReady: true,
    });
    await quranPracticeStore.getState().addSummary(fresh());
    expect(khatmStore.getState().ayahsRead).toBe(15);
    expect(quranPracticeStore.getState().lastCredit?.khatm).toEqual({
      added: 5,
      unit: "ayah",
      percent: 0,
    });
  });

  it("counts an ayah toward khatm once per cycle; the reading log still counts it daily (D72)", async () => {
    khatmStore.setState({
      plan: { days: 30, startDate: TODAY, unit: "ayah" },
      ayahsRead: 0,
      unit: "ayah",
      isReady: true,
    });
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [1, 2, 3] }));
    expect(khatmStore.getState().ayahsRead).toBe(3);
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [2, 3, 4] }));
    expect(khatmStore.getState().ayahsRead).toBe(4);
    expect(quranPracticeStore.getState().lastCredit?.khatm).toEqual({
      added: 1,
      unit: "ayah",
      percent: 0,
    });
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [1, 2] }));
    expect(khatmStore.getState().ayahsRead).toBe(4);
    expect(quranPracticeStore.getState().lastCredit?.khatm).toEqual({
      added: 0,
      unit: "ayah",
      percent: 0,
      alreadyCounted: true,
    });
    expect(await readJSON(DB_KEYS.khatm, null)).toMatchObject({
      ayahsRead: 4,
      practiceCredited: { cycle: `${TODAY}|30|ayah`, ayahs: "1-4" },
    });
  });

  it("credits khatm for ayahs already in today's log when the cycle hasn't counted them", async () => {
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [1, 2, 3] }));
    khatmStore.setState({
      plan: { days: 30, startDate: TODAY, unit: "ayah" },
      ayahsRead: 0,
      unit: "ayah",
      isReady: true,
    });
    await quranPracticeStore.getState().addSummary(fresh({ heardAyahs: [1, 2, 3] }));
    expect(quranReadingLogStore.getState().log[TODAY]?.ayahs).toBe(3);
    expect(khatmStore.getState().ayahsRead).toBe(3);
  });

  it("does nothing when the setting is off", async () => {
    quranCompanionPrefsStore.setState({
      prefs: { ...DEFAULT_COMPANION_PREFS, logToReadingLog: false },
      isReady: true,
    });
    khatmStore.setState({
      plan: { days: 30, startDate: TODAY, unit: "ayah" },
      ayahsRead: 0,
      unit: "ayah",
      isReady: true,
    });
    await quranPracticeStore.getState().addSummary(fresh());
    expect(quranReadingLogStore.getState().log[TODAY]).toBeUndefined();
    expect(khatmStore.getState().ayahsRead).toBe(0);
    expect(quranPracticeStore.getState().lastCredit).toBeNull();
    expect(quranPracticeStore.getState().history.items[0]?.loggedAyahs).toBeUndefined();
  });
});
