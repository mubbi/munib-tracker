import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import {
  hajjChecklistStore,
  migrateLegacyMixedChecklist,
  useEnsureHajjChecklistLoaded,
  useHajjChecklist,
  useHajjChecklistActions,
} from "./hajj-checklist-store";
import { umrahChecklistStore } from "./umrah-checklist-store";

const LEGACY_FLAG = `${DB_KEYS.hajjChecklist}::migrated_v4`;

beforeEach(async () => {
  await AsyncStorage.clear();
  hajjChecklistStore.setState({ done: {}, isReady: false });
  umrahChecklistStore.setState({ done: {}, isReady: false });
});

describe("migrateLegacyMixedChecklist", () => {
  it("moves umrah-* rows out of the hajj blob and drops non-rite keys", async () => {
    await writeJSON(DB_KEYS.hajjChecklist, {
      "hajj-arafah-stand": {
        id: "hajj-arafah-stand",
        completedAt: "2026-01-01T00:00:00.000Z",
      },
      "umrah-tawaf": { id: "umrah-tawaf", completedAt: "2026-01-02T00:00:00.000Z" },
      "prep-pack-list": { id: "prep-pack-list", completedAt: "2026-01-03T00:00:00.000Z" },
    });

    await migrateLegacyMixedChecklist();

    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({
      "hajj-arafah-stand": {
        id: "hajj-arafah-stand",
        completedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(await readJSON(DB_KEYS.umrahChecklist, {})).toEqual({
      "umrah-tawaf": { id: "umrah-tawaf", completedAt: "2026-01-02T00:00:00.000Z" },
    });
  });

  it("still re-partitions after a leftover sticky migration flag (restore/sync)", async () => {
    await writeJSON(LEGACY_FLAG, true);
    await writeJSON(DB_KEYS.hajjChecklist, {
      "umrah-sai": { id: "umrah-sai", completedAt: "2026-02-01T00:00:00.000Z" },
    });

    await migrateLegacyMixedChecklist();

    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({});
    expect(await readJSON(DB_KEYS.umrahChecklist, {})).toEqual({
      "umrah-sai": { id: "umrah-sai", completedAt: "2026-02-01T00:00:00.000Z" },
    });
    expect(await AsyncStorage.getItem(LEGACY_FLAG)).toBeNull();
  });
});

describe("hajjChecklistStore", () => {
  it("load migrates legacy rows and only marks valid hajj rites as done", async () => {
    await writeJSON(DB_KEYS.hajjChecklist, {
      "hajj-ihram": { id: "hajj-ihram", completedAt: "2026-01-01T00:00:00.000Z" },
      "umrah-tawaf": { id: "umrah-tawaf", completedAt: "2026-01-02T00:00:00.000Z" },
    });

    await hajjChecklistStore.getState().load();

    expect(hajjChecklistStore.getState()).toMatchObject({
      done: { "hajj-ihram": true },
      isReady: true,
    });
  });

  it("toggle ignores unknown ids and flips valid rites on and off", async () => {
    const { toggle } = hajjChecklistStore.getState();

    await toggle("not-a-rite");
    expect(hajjChecklistStore.getState().done).toEqual({});
    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({});

    await toggle("hajj-ihram");
    expect(hajjChecklistStore.getState().done).toEqual({ "hajj-ihram": true });
    const stored = await readJSON<Record<string, { id: string }>>(DB_KEYS.hajjChecklist, {});
    expect(stored["hajj-ihram"]?.id).toBe("hajj-ihram");

    await toggle("hajj-ihram");
    expect(hajjChecklistStore.getState().done).toEqual({});
    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({});
  });

  it("reset clears every completed hajj rite", async () => {
    const { toggle, reset } = hajjChecklistStore.getState();
    await toggle("hajj-ihram");
    await toggle("hajj-mina-day");

    await reset();

    expect(hajjChecklistStore.getState().done).toEqual({});
    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({});
  });

  it("reset leaves rows that are not hajj rites untouched", async () => {
    await writeJSON(DB_KEYS.hajjChecklist, {
      "hajj-ihram": { id: "hajj-ihram", completedAt: "2026-01-01T00:00:00.000Z" },
      stray: { id: "stray", completedAt: "2026-01-01T00:00:00.000Z" },
    });

    await hajjChecklistStore.getState().reset();

    expect(Object.keys(await readJSON(DB_KEYS.hajjChecklist, {}))).toEqual(["stray"]);
  });

  it("hooks load on mount and expose done state plus stable actions", async () => {
    await writeJSON(DB_KEYS.hajjChecklist, {
      "hajj-ihram": { id: "hajj-ihram", completedAt: "2026-01-01T00:00:00.000Z" },
    });

    const { result } = await renderHook(() => {
      useEnsureHajjChecklistLoaded();
      return { done: useHajjChecklist(), actions: useHajjChecklistActions() };
    });

    await waitFor(() => expect(result.current.done).toEqual({ "hajj-ihram": true }));

    await act(async () => {
      await result.current.actions.toggle("hajj-mina-day");
    });
    expect(result.current.done).toEqual({ "hajj-ihram": true, "hajj-mina-day": true });

    await act(async () => {
      await result.current.actions.reset();
    });
    expect(result.current.done).toEqual({});

    await act(async () => {
      await result.current.actions.load();
    });
    expect(hajjChecklistStore.getState().isReady).toBe(true);
  });

  it("does not reload when the store is already ready", async () => {
    hajjChecklistStore.setState({ isReady: true, done: { "hajj-ihram": true } });
    await renderHook(() => useEnsureHajjChecklistLoaded());
    expect(hajjChecklistStore.getState().done).toEqual({ "hajj-ihram": true });
  });
});
