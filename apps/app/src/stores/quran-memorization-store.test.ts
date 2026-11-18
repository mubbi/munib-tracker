import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { QuranMemorizationRepository } from "@/db/repositories/quran-memorization-repository";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { captureAppStateListener } from "@/test-support/app-state";
import { buildMemorizationRecord as record } from "@/test-support/fixtures/quran-companion";

import { hifzStore } from "./hifz-store";
import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";
import {
  canOfferMarkMemorized,
  quranMemorizationStore,
  useDueQueue,
  useEnsureMemorizationLoaded,
  useMemorizationActions,
  useMemorizationRecord,
  useMemorizationRecords,
} from "./quran-memorization-store";

const appState = captureAppStateListener();

// The day-rollover timer is armed on first load; capture it instead of leaking it.
const midnightTimers: (() => void)[] = [];
const realSetTimeout = global.setTimeout;
beforeAll(() => {
  jest.spyOn(global, "setTimeout").mockImplementation(((fn: () => void, ms?: number) => {
    if (typeof ms === "number" && ms > 60_000) {
      midnightTimers.push(fn);
      return 0 as unknown as NodeJS.Timeout;
    }
    return realSetTimeout(fn, ms);
  }) as typeof setTimeout);
});
afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(async () => {
  await AsyncStorage.clear();
  quranMemorizationStore.setState({ records: {}, isReady: false, day: getLocalDateString() });
  hifzStore.setState({ statuses: {} });
  quranCompanionPrefsStore.setState({ prefs: { ...DEFAULT_COMPANION_PREFS } });
});

describe("quranMemorizationStore", () => {
  it("load reads every record and arms the day rollover once", async () => {
    await QuranMemorizationRepository.upsert({ "1:1": record() });
    await quranMemorizationStore.getState().load();
    await quranMemorizationStore.getState().load();

    expect(quranMemorizationStore.getState().isReady).toBe(true);
    expect(quranMemorizationStore.getState().records["1:1"]).toMatchObject({
      status: "practising",
      nextReviewAt: "2020-01-01",
    });
    expect(midnightTimers).toHaveLength(1);
    expect(appState.isArmed()).toBe(true);
  });

  it("refreshDay updates on midnight and foreground only when the day changed", () => {
    quranMemorizationStore.setState({ day: "2000-01-01" });
    const before = quranMemorizationStore.getState();
    appState.emit("background");
    expect(quranMemorizationStore.getState()).toBe(before);

    appState.emit("active");
    expect(quranMemorizationStore.getState().day).toBe(getLocalDateString());

    const unchanged = quranMemorizationStore.getState();
    quranMemorizationStore.getState().refreshDay();
    expect(quranMemorizationStore.getState()).toBe(unchanged);

    quranMemorizationStore.setState({ day: "2000-01-02" });
    const fire = midnightTimers.shift();
    fire?.();
    expect(quranMemorizationStore.getState().day).toBe(getLocalDateString());
    // The midnight timer re-arms itself.
    expect(midnightTimers).toHaveLength(1);
  });

  it("applyOutcomes ignores an empty batch", async () => {
    const before = quranMemorizationStore.getState();
    await quranMemorizationStore.getState().applyOutcomes([]);
    expect(quranMemorizationStore.getState()).toBe(before);
    expect(await QuranMemorizationRepository.getAll()).toEqual({});
  });

  it("applyOutcomes creates/updates each ayah and persists the changes", async () => {
    await quranMemorizationStore.getState().applyOutcomes([
      { surah: 1, ayah: 1, outcome: "success" },
      { surah: 1, ayah: 2, outcome: "lapse" },
    ]);
    const { records } = quranMemorizationStore.getState();
    expect(Object.keys(records).sort()).toEqual(["1:1", "1:2"]);
    const stored = await QuranMemorizationRepository.getAll();
    expect(stored["1:1"]?.status).toBe(records["1:1"]?.status);
    expect(stored["1:2"]?.lapses).toBe(records["1:2"]?.lapses);
  });

  it("setStatus and snooze rewrite a single record", async () => {
    await quranMemorizationStore.getState().setStatus(2, 255, "needs_revision");
    expect(quranMemorizationStore.getState().records["2:255"]?.status).toBe("needs_revision");

    await quranMemorizationStore.getState().snooze(2, 255);
    const snoozed = quranMemorizationStore.getState().records["2:255"];
    expect(snoozed?.nextReviewAt > getLocalDateString()).toBe(true);
    expect((await QuranMemorizationRepository.getAll())["2:255"]?.nextReviewAt).toBe(
      snoozed?.nextReviewAt,
    );
  });

  it("canOfferMarkMemorized is false for missing and fresh records", () => {
    expect(canOfferMarkMemorized(undefined)).toBe(false);
    expect(canOfferMarkMemorized(record({ successStreak: 0 }))).toBe(false);
  });
});

describe("memorization hooks", () => {
  it("load on mount and build the due queue from records and hifz review marks", async () => {
    await QuranMemorizationRepository.upsert({
      "1:1": record(),
      "1:2": record({ nextReviewAt: "2999-01-01" }),
    });
    hifzStore.setState({ statuses: { "1:3": "review" } });

    const { result } = await renderHook(() => {
      useEnsureMemorizationLoaded();
      return {
        records: useMemorizationRecords(),
        one: useMemorizationRecord(1, 1),
        due: useDueQueue(),
        actions: useMemorizationActions(),
      };
    });

    await waitFor(() => expect(Object.keys(result.current.records)).toHaveLength(2));
    expect(result.current.one?.status).toBe("practising");
    expect(result.current.due.map((d) => d.key)).toEqual(["1:1", "1:3"]);

    await act(async () => {
      quranCompanionPrefsStore.setState({
        prefs: { ...DEFAULT_COMPANION_PREFS, includeHifzReview: false },
      });
    });
    expect(result.current.due.map((d) => d.key)).toEqual(["1:1"]);

    await act(async () => {
      await result.current.actions.snooze(1, 1);
    });
    expect(result.current.due).toEqual([]);

    await act(async () => {
      await result.current.actions.setStatus(1, 4, "learning");
      await result.current.actions.applyOutcomes([{ surah: 1, ayah: 5, outcome: "neutral" }]);
    });
    expect(Object.keys(result.current.records).sort()).toEqual(["1:1", "1:2", "1:4", "1:5"]);
  });

  it("does not reload when already ready", async () => {
    quranMemorizationStore.setState({ isReady: true });
    await QuranMemorizationRepository.upsert({ "1:1": record() });
    await renderHook(() => useEnsureMemorizationLoaded());
    expect(quranMemorizationStore.getState().records).toEqual({});
  });
});
