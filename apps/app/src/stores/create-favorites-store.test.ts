import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, waitFor } from "@testing-library/react-native";

import { readJSON, writeJSON } from "@/db/store";

import {
  createFavoritesStore,
  useEnsureFavoritesLoaded,
  useFavoritesOrder,
  useIsInFavorites,
} from "./create-favorites-store";

const STORAGE_KEY = "@test/fav_order";
const UPDATED_AT_KEY = "@test/fav_updated_at";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("createFavoritesStore", () => {
  it("toggles a favorite, persists the order, and stamps updatedAt", async () => {
    const api = createFavoritesStore(STORAGE_KEY, UPDATED_AT_KEY);
    await api.store.getState().load();
    await api.store.getState().toggle("a");
    await api.store.getState().toggle("b");

    expect(api.store.getState().order).toEqual(["a", "b"]);
    expect(await readJSON<string[]>(STORAGE_KEY, [])).toEqual(["a", "b"]);
    expect(await readJSON<string | undefined>(UPDATED_AT_KEY, undefined)).toBeDefined();

    // Toggling again removes it.
    await api.store.getState().toggle("a");
    expect(api.store.getState().order).toEqual(["b"]);
  });

  it("union-merges remote favorites and keeps the newer watermark", async () => {
    const api = createFavoritesStore(STORAGE_KEY, UPDATED_AT_KEY);

    await api.applyRemote(["x"], "2026-07-04T10:00:00.000Z");
    expect(await readJSON<string[]>(STORAGE_KEY, [])).toEqual(["x"]);

    // Older remote still appends missing ids (union merge); watermark stays local.
    await api.applyRemote(["old"], "2026-07-04T05:00:00.000Z");
    expect(await readJSON<string[]>(STORAGE_KEY, [])).toEqual(["x", "old"]);
    expect(await readJSON<string | undefined>(UPDATED_AT_KEY, undefined)).toBe(
      "2026-07-04T10:00:00.000Z",
    );

    // Newer remote appends missing ids and advances the watermark.
    await api.applyRemote(["y", "z"], "2026-07-04T12:00:00.000Z");
    expect(await readJSON<string[]>(STORAGE_KEY, [])).toEqual(["x", "old", "y", "z"]);
    expect(await readJSON<string | undefined>(UPDATED_AT_KEY, undefined)).toBe(
      "2026-07-04T12:00:00.000Z",
    );
  });
});

describe("createFavoritesStore extras", () => {
  function setup() {
    return createFavoritesStore(STORAGE_KEY, UPDATED_AT_KEY);
  }

  it("setOrder replaces the order and stamps updatedAt", async () => {
    const api = setup();
    await api.store.getState().setOrder(["c", "a"]);
    expect(await api.readBlob()).toEqual({ order: ["c", "a"], updatedAt: expect.any(String) });
  });

  it("applyRemote de-duplicates the local list", async () => {
    const api = setup();
    await writeJSON(STORAGE_KEY, ["a", "a", "b"]);
    await api.applyRemote(["b", "c"]);
    expect(await readJSON<string[]>(STORAGE_KEY, [])).toEqual(["a", "b", "c"]);
  });

  it("applyRemote without any watermark leaves updatedAt unset", async () => {
    const api = setup();
    await api.applyRemote(["a"]);
    expect(await readJSON(UPDATED_AT_KEY, null)).toBeNull();
  });

  it("applyRemote keeps the local watermark when the remote has none", async () => {
    const api = setup();
    await writeJSON(UPDATED_AT_KEY, "2026-01-01T00:00:00.000Z");
    await api.applyRemote(["a"]);
    expect(await readJSON(UPDATED_AT_KEY, null)).toBe("2026-01-01T00:00:00.000Z");
  });

  it("applyRemote updates a loaded store in memory", async () => {
    const api = setup();
    await api.store.getState().load();
    await api.applyRemote(["r"], "2026-07-04T00:00:00.000Z");
    expect(api.store.getState()).toMatchObject({
      order: ["r"],
      updatedAt: "2026-07-04T00:00:00.000Z",
    });
  });

  it("applyRemote leaves an unloaded store untouched", async () => {
    const api = setup();
    await api.applyRemote(["r"], "2026-07-04T00:00:00.000Z");
    expect(api.store.getState().order).toEqual([]);
  });

  it("actions route to the store", async () => {
    const api = setup();
    await api.actions.load();
    await api.actions.toggle("a");
    await api.actions.setOrder(["b"]);
    expect(api.store.getState().order).toEqual(["b"]);
  });

  it("hooks expose order and membership after loading once", async () => {
    const api = setup();
    await writeJSON(STORAGE_KEY, ["a"]);
    const { result } = await renderHook(() => {
      useEnsureFavoritesLoaded(api);
      return { order: useFavoritesOrder(api), hasA: useIsInFavorites(api, "a") };
    });
    await waitFor(() => expect(result.current.order).toEqual(["a"]));
    expect(result.current.hasA).toBe(true);
  });

  it("useEnsureFavoritesLoaded skips a ready store", async () => {
    const api = setup();
    api.store.setState({ isReady: true });
    await writeJSON(STORAGE_KEY, ["a"]);
    await renderHook(() => useEnsureFavoritesLoaded(api));
    expect(api.store.getState().order).toEqual([]);
  });
});
