import AsyncStorage from "@react-native-async-storage/async-storage";

import { readJSON } from "@/db/store";

import { createFavoritesStore } from "./create-favorites-store";

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
