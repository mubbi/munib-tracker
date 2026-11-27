import AsyncStorage from "@react-native-async-storage/async-storage";

import { BACKUP_KEYS, DB_KEYS } from "@/db/keys";

import {
  clearDuaRecents,
  DUA_RECENTS_LIMIT,
  duaRecentsStore,
  recordDuaRecent,
} from "./dua-recents-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  duaRecentsStore.setState({ order: [], updatedAt: undefined, isReady: false });
});

describe("dua recents", () => {
  it("moves the latest dua to the front without duplicates", async () => {
    await recordDuaRecent("a");
    await recordDuaRecent("b");
    await recordDuaRecent("a");
    expect(duaRecentsStore.getState().order).toEqual(["a", "b"]);
    expect(JSON.parse((await AsyncStorage.getItem(DB_KEYS.duaRecents)) ?? "[]")).toEqual([
      "a",
      "b",
    ]);
  });

  it("caps the list", async () => {
    for (let i = 0; i < DUA_RECENTS_LIMIT + 3; i += 1) await recordDuaRecent(`d${i}`);
    const order = duaRecentsStore.getState().order;
    expect(order).toHaveLength(DUA_RECENTS_LIMIT);
    expect(order[0]).toBe(`d${DUA_RECENTS_LIMIT + 2}`);
  });

  it("loads persisted history before recording", async () => {
    await AsyncStorage.setItem(DB_KEYS.duaRecents, JSON.stringify(["old"]));
    await recordDuaRecent("new");
    expect(duaRecentsStore.getState().order).toEqual(["new", "old"]);
  });

  it("clears", async () => {
    await recordDuaRecent("a");
    await clearDuaRecents();
    expect(duaRecentsStore.getState().order).toEqual([]);
  });

  it("is device history — never part of a backup", () => {
    expect(BACKUP_KEYS).not.toContain(DB_KEYS.duaRecents);
    expect(BACKUP_KEYS).not.toContain(DB_KEYS.duaRecentsUpdatedAt);
  });
});
