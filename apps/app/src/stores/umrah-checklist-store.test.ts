import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { hajjChecklistStore } from "./hajj-checklist-store";
import {
  umrahChecklistStore,
  useEnsureUmrahChecklistLoaded,
  useUmrahChecklist,
  useUmrahChecklistActions,
} from "./umrah-checklist-store";

// load() resolves the Hajj store via dynamic import(), which Jest cannot evaluate
// without --experimental-vm-modules; hook tests swap in a stub loader.
const originalLoad = umrahChecklistStore.getState().load;

beforeEach(async () => {
  await AsyncStorage.clear();
  hajjChecklistStore.setState({ done: {}, isReady: false });
  umrahChecklistStore.setState({ done: {}, isReady: false, load: originalLoad });
});

describe("umrahChecklistStore", () => {
  it("toggle ignores ids that are not umrah rites", async () => {
    await umrahChecklistStore.getState().toggle("hajj-ihram");
    expect(umrahChecklistStore.getState().done).toEqual({});
    expect(await readJSON(DB_KEYS.umrahChecklist, {})).toEqual({});
  });

  it("toggle marks a rite complete with a timestamp, then clears it", async () => {
    const { toggle } = umrahChecklistStore.getState();

    await toggle("umrah-tawaf");
    expect(umrahChecklistStore.getState().done).toEqual({ "umrah-tawaf": true });
    const stored = await readJSON<Record<string, { id: string; completedAt: string }>>(
      DB_KEYS.umrahChecklist,
      {},
    );
    expect(stored["umrah-tawaf"]?.id).toBe("umrah-tawaf");
    expect(Number.isNaN(Date.parse(stored["umrah-tawaf"]?.completedAt ?? ""))).toBe(false);

    await toggle("umrah-tawaf");
    expect(umrahChecklistStore.getState().done).toEqual({});
    expect(await readJSON(DB_KEYS.umrahChecklist, {})).toEqual({});
  });

  it("reset removes valid rites but leaves unrelated rows alone", async () => {
    await writeJSON(DB_KEYS.umrahChecklist, {
      "umrah-ihram": { id: "umrah-ihram", completedAt: "2026-01-01T00:00:00.000Z" },
      stray: { id: "stray", completedAt: "2026-01-01T00:00:00.000Z" },
    });
    umrahChecklistStore.setState({ done: { "umrah-ihram": true } });

    await umrahChecklistStore.getState().reset();

    expect(umrahChecklistStore.getState().done).toEqual({});
    expect(Object.keys(await readJSON(DB_KEYS.umrahChecklist, {}))).toEqual(["stray"]);
  });
});

describe("umrah checklist hooks", () => {
  it("loads on mount when not ready and routes actions to the store", async () => {
    const load = jest.fn(async () => {
      umrahChecklistStore.setState({ done: { "umrah-ihram": true }, isReady: true });
    });
    umrahChecklistStore.setState({ load });

    const { result } = await renderHook(() => {
      useEnsureUmrahChecklistLoaded();
      return { done: useUmrahChecklist(), actions: useUmrahChecklistActions() };
    });

    expect(load).toHaveBeenCalledTimes(1);
    expect(result.current.done).toEqual({ "umrah-ihram": true });

    await act(async () => {
      await result.current.actions.toggle("umrah-tawaf");
    });
    expect(result.current.done).toEqual({ "umrah-ihram": true, "umrah-tawaf": true });

    await act(async () => {
      await result.current.actions.reset();
    });
    expect(result.current.done).toEqual({});

    await act(async () => {
      await result.current.actions.load();
    });
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("skips loading when the store is already ready", async () => {
    const load = jest.fn(async () => {});
    umrahChecklistStore.setState({ isReady: true, load });
    await renderHook(() => useEnsureUmrahChecklistLoaded());
    expect(load).not.toHaveBeenCalled();
  });
});
