import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import * as dbStore from "@/db/store";
import { readJSON, writeJSON } from "@/db/store";

import {
  countFastsInRange,
  fastingStore,
  useEnsureFastingLoaded,
  useFastingActions,
  useFastingDays,
  useFastStatus,
} from "./fasting-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  fastingStore.setState({ days: {}, isReady: false, loadError: null });
});

describe("fastingStore", () => {
  it("setStatus records a day and persists the map", async () => {
    await fastingStore.getState().setStatus("2026-03-01", "fasted");
    expect(fastingStore.getState().days).toEqual({ "2026-03-01": "fasted" });
    expect(await readJSON(DB_KEYS.fasting, {})).toEqual({ "2026-03-01": "fasted" });
  });

  it("setStatus(null) clears a day", async () => {
    await fastingStore.getState().setStatus("2026-03-01", "missed");
    await fastingStore.getState().setStatus("2026-03-01", null);
    expect(await readJSON(DB_KEYS.fasting, null)).toEqual({});
  });
});

describe("fastingStore load failure", () => {
  it("exposes loadError, stays not ready, and clears on a successful retry", async () => {
    const spy = jest.spyOn(dbStore, "readJSON").mockRejectedValueOnce(new Error("boom"));
    await fastingStore.getState().load();
    expect(fastingStore.getState().isReady).toBe(false);
    expect(fastingStore.getState().loadError).toBeTruthy();
    spy.mockRestore();
    await fastingStore.getState().load();
    expect(fastingStore.getState().isReady).toBe(true);
    expect(fastingStore.getState().loadError).toBeNull();
  });
});

describe("countFastsInRange", () => {
  const days = {
    "2026-02-28": "fasted",
    "2026-03-01": "fasted",
    "2026-03-02": "missed",
    "2026-03-30": "fasted",
    "2026-04-01": "fasted",
  } as const;

  it.each([
    ["fasted", 2],
    ["missed", 1],
    ["exempt", 0],
  ] as const)("counts %s days inside the inclusive range", (status, expected) => {
    expect(countFastsInRange(days, "2026-03-01", "2026-03-30", status)).toBe(expected);
  });
});

describe("hooks", () => {
  it("load on mount and expose a day's status", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "exempt" });
    const { result } = await renderHook(() => {
      useEnsureFastingLoaded();
      return {
        days: useFastingDays(),
        status: useFastStatus("2026-03-01"),
        actions: useFastingActions(),
      };
    });

    await waitFor(() => expect(result.current.status).toBe("exempt"));

    await act(async () => {
      await result.current.actions.setStatus("2026-03-02", "fasted");
      await result.current.actions.load();
    });
    expect(result.current.days).toEqual({ "2026-03-01": "exempt", "2026-03-02": "fasted" });
  });

  it("skip loading when already ready", async () => {
    fastingStore.setState({ isReady: true });
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "exempt" });
    await renderHook(() => useEnsureFastingLoaded());
    expect(fastingStore.getState().days).toEqual({});
  });
});
