import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import {
  type SadaqahGoal,
  type SadaqahLogEntry,
  sadaqahStore,
  sumSadaqahInPeriod,
  useEnsureSadaqahLoaded,
  useSadaqahActions,
  useSadaqahGoal,
  useSadaqahLog,
  useSadaqahReady,
} from "./sadaqah-store";

const GOAL: SadaqahGoal = {
  period: "weekly",
  amount: 50,
  currencyCode: "GBP",
  startDate: "2026-07-01",
};

const entry = (overrides: Partial<SadaqahLogEntry> = {}): SadaqahLogEntry => ({
  id: "e1",
  amount: 5,
  at: "2026-07-03T09:00:00.000Z",
  ...overrides,
});

beforeEach(async () => {
  await AsyncStorage.clear();
  sadaqahStore.setState({ goal: null, log: [], isReady: false });
});

const state = () => sadaqahStore.getState();
const stored = () =>
  readJSON<{ goal: unknown; log: SadaqahLogEntry[] }>(DB_KEYS.sadaqahGoals, {
    goal: null,
    log: [],
  });

describe("restoreEntry", () => {
  it("re-inserts the exact entry at its original position and persists it", async () => {
    const newest = entry({ id: "c", at: "2026-07-05T09:00:00.000Z" });
    const older = entry({ id: "b", at: "2026-07-03T09:00:00.000Z", note: "mosque" });
    const oldest = entry({ id: "a", at: "2026-07-01T09:00:00.000Z" });
    sadaqahStore.setState({ log: [newest, older, oldest], isReady: true });
    await state().removeEntry("b");
    expect(state().log.map((e) => e.id)).toEqual(["c", "a"]);
    await state().restoreEntry(older);
    expect(state().log).toEqual([newest, older, oldest]);
    expect((await stored()).log).toEqual([newest, older, oldest]);
  });

  it("is idempotent for an id that is already present", async () => {
    const a = entry();
    sadaqahStore.setState({ log: [a], isReady: true });
    await state().restoreEntry(a);
    expect(state().log).toHaveLength(1);
  });
});

describe("load", () => {
  it("keeps a valid goal and well-formed log entries", async () => {
    await writeJSON(DB_KEYS.sadaqahGoals, {
      goal: GOAL,
      log: [entry({ note: "masjid" }), entry({ id: "e2", note: 7 as unknown as string })],
    });
    await state().load();
    expect(state()).toMatchObject({
      goal: GOAL,
      log: [entry({ note: "masjid" }), entry({ id: "e2", note: undefined })],
      isReady: true,
    });
  });

  it.each([
    ["null", null],
    ["a non-object", "daily"],
    ["an unknown period", { ...GOAL, period: "monthly" }],
    ["a string amount", { ...GOAL, amount: "5" }],
  ])("drops %s goal", async (_label, goal) => {
    await writeJSON(DB_KEYS.sadaqahGoals, { goal, log: [] });
    await state().load();
    expect(state().goal).toBeNull();
  });

  it("drops malformed log entries and non-array logs", async () => {
    await writeJSON(DB_KEYS.sadaqahGoals, {
      goal: null,
      log: [null, 3, { id: 1, amount: 2, at: "x" }, { id: "a", amount: "2", at: "x" }],
    });
    await state().load();
    expect(state().log).toEqual([]);

    await writeJSON(DB_KEYS.sadaqahGoals, { goal: null, log: "nope" });
    await state().load();
    expect(state().log).toEqual([]);
  });

  it("caps the log at 200 entries", async () => {
    const log = Array.from({ length: 205 }, (_, i) => entry({ id: `e${i}` }));
    await writeJSON(DB_KEYS.sadaqahGoals, { goal: null, log });
    await state().load();
    expect(state().log).toHaveLength(200);
  });
});

describe("goal", () => {
  it("setGoal persists the goal with the log", async () => {
    sadaqahStore.setState({ log: [entry()] });
    await state().setGoal(GOAL);
    expect(await stored()).toEqual({ goal: GOAL, log: [entry()] });
  });

  it("clearGoal removes the goal", async () => {
    await state().setGoal(GOAL);
    await state().clearGoal();
    expect((await stored()).goal).toBeNull();
  });
});

describe("log", () => {
  it("addEntry prepends a clamped, trimmed entry", async () => {
    await state().addEntry(10);
    await state().addEntry(-3, "  orphans ");
    const [latest, first] = state().log;
    expect(latest).toMatchObject({ amount: 0, note: "orphans" });
    expect(first).toMatchObject({ amount: 10, note: undefined });
    expect((await stored()).log).toHaveLength(2);
  });

  it("removeEntry deletes by id", async () => {
    sadaqahStore.setState({ log: [entry(), entry({ id: "e2" })] });
    await state().removeEntry("e1");
    expect((await stored()).log.map((e) => e.id)).toEqual(["e2"]);
  });

  it("clearLog empties the log but keeps the goal", async () => {
    sadaqahStore.setState({ goal: GOAL, log: [entry()] });
    await state().clearLog();
    expect(await stored()).toEqual({ goal: GOAL, log: [] });
  });
});

describe("sumSadaqahInPeriod", () => {
  // Wednesday 8 July 2026, local noon.
  const now = new Date(2026, 6, 8, 12);
  const at = (day: number, hour = 10) => new Date(2026, 6, day, hour).toISOString();
  const log = [
    entry({ id: "today", amount: 3, at: at(8) }),
    entry({ id: "monday", amount: 5, at: at(6, 1) }),
    entry({ id: "lastSunday", amount: 7, at: at(5) }),
  ];

  it("daily sums only today's entries", () => {
    expect(sumSadaqahInPeriod(log, "daily", now)).toBe(3);
  });

  it("weekly sums entries since Monday", () => {
    expect(sumSadaqahInPeriod(log, "weekly", now)).toBe(8);
  });

  it("weekly on a Sunday reaches back to the previous Monday", () => {
    const sunday = new Date(2026, 6, 12, 12);
    expect(sumSadaqahInPeriod(log, "weekly", sunday)).toBe(8);
  });

  it("defaults to the current time", () => {
    expect(sumSadaqahInPeriod([entry({ at: new Date().toISOString() })], "daily")).toBe(5);
  });
});

describe("hooks", () => {
  function setup() {
    return renderHook(() => {
      useEnsureSadaqahLoaded();
      return {
        ready: useSadaqahReady(),
        goal: useSadaqahGoal(),
        log: useSadaqahLog(),
        actions: useSadaqahActions(),
      };
    });
  }

  it("load on mount", async () => {
    await writeJSON(DB_KEYS.sadaqahGoals, { goal: GOAL, log: [] });
    const { result } = await setup();
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.goal).toEqual(GOAL);
  });

  it("route actions to the store", async () => {
    sadaqahStore.setState({ isReady: true });
    const { result } = await setup();
    await act(async () => {
      await result.current.actions.setGoal(GOAL);
      await result.current.actions.addEntry(4);
    });
    expect(result.current.log).toHaveLength(1);

    await act(async () => {
      await result.current.actions.removeEntry(result.current.log[0]?.id ?? "");
      await result.current.actions.addEntry(1);
      await result.current.actions.clearLog();
      await result.current.actions.clearGoal();
    });
    expect(result.current).toMatchObject({ goal: null, log: [] });
  });
});
