import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import {
  countHifzBySurah,
  hifzStore,
  listHifzEntries,
  nextHifzStatus,
  useEnsureHifzLoaded,
  useHifzActions,
  useHifzMap,
  useHifzStatus,
} from "@/stores/hifz-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  await hifzStore.getState().load();
});

describe("hifz store", () => {
  it("cycles an ayah none → review → memorized → none and persists", async () => {
    await hifzStore.getState().cycle(2, 255);
    expect(hifzStore.getState().statuses["2:255"]).toBe("review");
    await hifzStore.getState().cycle(2, 255);
    expect(hifzStore.getState().statuses["2:255"]).toBe("memorized");
    await hifzStore.getState().cycle(2, 255);
    expect(hifzStore.getState().statuses["2:255"]).toBeUndefined();
  });

  it("counts memorized and review ayahs per surah", () => {
    const counts = countHifzBySurah({ "1:1": "memorized", "1:2": "review", "2:5": "memorized" });
    expect(counts[1]).toEqual({ memorized: 1, review: 1 });
    expect(counts[2]).toEqual({ memorized: 1, review: 0 });
  });

  it("lists marked ayahs sorted by surah then ayah", () => {
    const entries = listHifzEntries({ "2:5": "memorized", "1:2": "review", "1:1": "memorized" });
    expect(entries.map((e) => e.key)).toEqual(["1:1", "1:2", "2:5"]);
    expect(entries[1]?.status).toBe("review");
  });
});

describe("hifz store extras", () => {
  it.each([
    [undefined, "review"],
    ["review", "memorized"],
    ["memorized", null],
  ] as const)("nextHifzStatus(%p) is %p", (current, expected) => {
    expect(nextHifzStatus(current)).toBe(expected);
  });

  it("setStatus sets an exact status and persists it", async () => {
    await hifzStore.getState().setStatus(1, 1, "memorized");
    expect(await readJSON(DB_KEYS.hifz, {})).toEqual({ "1:1": "memorized" });
  });

  it("setStatus(null) clears a status", async () => {
    await hifzStore.getState().setStatus(1, 1, "review");
    await hifzStore.getState().setStatus(1, 1, null);
    expect(hifzStore.getState().statuses).toEqual({});
  });

  it("countHifzBySurah skips malformed keys", () => {
    expect(countHifzBySurah({ "x:1": "memorized" })).toEqual({});
  });

  it.each(["11", "a:1", "1:b"])("listHifzEntries drops malformed key %p", (key) => {
    expect(listHifzEntries({ [key]: "review" })).toEqual([]);
  });
});

describe("hifz hooks", () => {
  function setup() {
    return renderHook(() => {
      useEnsureHifzLoaded();
      return { map: useHifzMap(), status: useHifzStatus(2, 255), actions: useHifzActions() };
    });
  }

  it("load on mount when not ready", async () => {
    hifzStore.setState({ statuses: {}, isReady: false });
    await writeJSON(DB_KEYS.hifz, { "2:255": "review" });
    const { result } = await setup();
    await waitFor(() => expect(result.current.status).toBe("review"));
  });

  it("route actions to the store", async () => {
    const { result } = await setup();
    await act(async () => {
      await result.current.actions.cycle(2, 255);
      await result.current.actions.setStatus(1, 1, "memorized");
      await result.current.actions.load();
    });
    expect(result.current.map).toEqual({ "2:255": "review", "1:1": "memorized" });
  });
});
