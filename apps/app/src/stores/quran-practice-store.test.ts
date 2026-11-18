import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { EMPTY_HISTORY } from "@/lib/quran-companion/merge";
import { buildDueItem, buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import {
  quranPracticeStore,
  useEnsurePracticeLoaded,
  useLastPracticeSummary,
  usePracticeHistory,
  useRevisionSitting,
} from "./quran-practice-store";

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
