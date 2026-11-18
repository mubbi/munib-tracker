import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import {
  type FridayCheckRow,
  fridayCheckKey,
  fridayChecklistStore,
  useEnsureFridayChecklistLoaded,
  useFridayChecklist,
  useFridayChecklistActions,
  useFridayChecklistForDate,
} from "./friday-checklist-store";

const FRIDAY = "2026-07-03";
const NEXT_FRIDAY = "2026-07-10";

beforeEach(async () => {
  await AsyncStorage.clear();
  fridayChecklistStore.setState({ done: {}, isReady: false });
});

describe("fridayCheckKey", () => {
  it("joins item id and date", () => {
    expect(fridayCheckKey("ghusl", FRIDAY)).toBe(`ghusl::${FRIDAY}`);
  });
});

describe("fridayChecklistStore", () => {
  it("load builds composite keys from persisted rows", async () => {
    await writeJSON<Record<string, FridayCheckRow>>(DB_KEYS.fridayChecklist, {
      [fridayCheckKey("ghusl", FRIDAY)]: {
        id: "ghusl",
        date: FRIDAY,
        completedAt: "2026-07-03T06:00:00.000Z",
      },
    });

    await fridayChecklistStore.getState().load();

    expect(fridayChecklistStore.getState()).toMatchObject({
      done: { [`ghusl::${FRIDAY}`]: true },
      isReady: true,
    });
  });

  it("toggle persists a dated row and removes it on the second tap", async () => {
    const { toggle } = fridayChecklistStore.getState();

    await toggle("kahf", FRIDAY);
    expect(fridayChecklistStore.getState().done).toEqual({ [`kahf::${FRIDAY}`]: true });
    const stored = await readJSON<Record<string, FridayCheckRow>>(DB_KEYS.fridayChecklist, {});
    expect(stored[`kahf::${FRIDAY}`]).toMatchObject({ id: "kahf", date: FRIDAY });

    await toggle("kahf", FRIDAY);
    expect(fridayChecklistStore.getState().done).toEqual({});
    expect(await readJSON(DB_KEYS.fridayChecklist, {})).toEqual({});
  });

  it("resetDate only clears rows for that Friday", async () => {
    const { toggle, resetDate } = fridayChecklistStore.getState();
    await toggle("kahf", FRIDAY);
    await toggle("ghusl", FRIDAY);
    await toggle("kahf", NEXT_FRIDAY);

    await resetDate(FRIDAY);

    expect(fridayChecklistStore.getState().done).toEqual({ [`kahf::${NEXT_FRIDAY}`]: true });
    expect(Object.keys(await readJSON(DB_KEYS.fridayChecklist, {}))).toEqual([
      `kahf::${NEXT_FRIDAY}`,
    ]);
  });
});

describe("friday checklist hooks", () => {
  it("loads on mount and filters done items per date", async () => {
    await writeJSON<Record<string, FridayCheckRow>>(DB_KEYS.fridayChecklist, {
      [`kahf::${FRIDAY}`]: { id: "kahf", date: FRIDAY, completedAt: "x" },
      [`ghusl::${NEXT_FRIDAY}`]: { id: "ghusl", date: NEXT_FRIDAY, completedAt: "x" },
    });

    const { result } = await renderHook(() => {
      useEnsureFridayChecklistLoaded();
      return {
        all: useFridayChecklist(),
        forDate: useFridayChecklistForDate(FRIDAY),
        actions: useFridayChecklistActions(),
      };
    });

    await waitFor(() => expect(Object.keys(result.current.all)).toHaveLength(2));
    expect(result.current.forDate).toEqual({ kahf: true });

    await act(async () => {
      await result.current.actions.toggle("ghusl", FRIDAY);
    });
    expect(result.current.forDate).toEqual({ kahf: true, ghusl: true });

    await act(async () => {
      await result.current.actions.resetDate(FRIDAY);
    });
    expect(result.current.forDate).toEqual({});

    await act(async () => {
      await result.current.actions.load();
    });
    expect(result.current.all).toEqual({ [`ghusl::${NEXT_FRIDAY}`]: true });
  });

  it("ignores falsy entries and skips loading when already ready", async () => {
    fridayChecklistStore.setState({
      isReady: true,
      done: { [`kahf::${FRIDAY}`]: false, [`ghusl::${FRIDAY}`]: true },
    });

    const { result } = await renderHook(() => {
      useEnsureFridayChecklistLoaded();
      return useFridayChecklistForDate(FRIDAY);
    });

    expect(result.current).toEqual({ ghusl: true });
  });
});
