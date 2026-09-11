import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  byteSizeOfKeyTree,
  isOversizedRowError,
  MAX_SAFE_ASYNC_STORAGE_VALUE_BYTES,
  migrateMonolithToShards,
  readJSON,
  removeKeyTree,
  storageShardKey,
  writeJSONIfSafe,
} from "./store";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe("isOversizedRowError", () => {
  it("matches Android CursorWindow failures", () => {
    expect(
      isOversizedRowError(
        new Error("Row too big to fit into CursorWindow requiredPos=0, totalRows=1"),
      ),
    ).toBe(true);
    expect(isOversizedRowError(new Error("disk full"))).toBe(false);
  });
});

describe("readJSON", () => {
  it("drops an oversized row so later reads do not keep failing", async () => {
    await AsyncStorage.setItem("poison", "legacy-blob");
    const getItem = jest.spyOn(AsyncStorage, "getItem");
    getItem.mockRejectedValueOnce(
      new Error("Row too big to fit into CursorWindow requiredPos=0, totalRows=1"),
    );

    expect(await readJSON("poison", { empty: true })).toEqual({ empty: true });
    expect(await AsyncStorage.getItem("poison")).toBeNull();
  });
});

describe("sharded cache storage", () => {
  const base = "@test/edition_cache";

  beforeEach(async () => {
    await removeKeyTree(base);
  });

  it("splits a legacy monolith into per-id shards and removes the blob", async () => {
    await AsyncStorage.setItem(
      base,
      JSON.stringify({
        "en-saheeh:1": { "1": "In the name of Allah" },
        "en-saheeh:2": { "1": "Alif Lam Meem" },
      }),
    );

    await migrateMonolithToShards(base);

    expect(await AsyncStorage.getItem(base)).toBeNull();
    expect(await readJSON(storageShardKey(base, "en-saheeh:1"), null)).toEqual({
      "1": "In the name of Allah",
    });
    expect(await readJSON(storageShardKey(base, "en-saheeh:2"), null)).toEqual({
      "1": "Alif Lam Meem",
    });
  });

  it("is a no-op when the monolith is already gone", async () => {
    await migrateMonolithToShards(base);
    await migrateMonolithToShards(base);
    expect(await AsyncStorage.getItem(base)).toBeNull();
  });

  it("copies readable monolith entries even when they exceed the new-write size cap", async () => {
    const oversized = "x".repeat(MAX_SAFE_ASYNC_STORAGE_VALUE_BYTES + 64);
    await AsyncStorage.setItem(base, JSON.stringify({ huge: oversized, tiny: { n: 1 } }));

    await migrateMonolithToShards(base);

    expect(await AsyncStorage.getItem(base)).toBeNull();
    expect(await readJSON(storageShardKey(base, "huge"), null)).toBe(oversized);
    expect(await readJSON(storageShardKey(base, "tiny"), null)).toEqual({ n: 1 });
  });

  it("drops an unreadable monolith instead of leaving it in place", async () => {
    await AsyncStorage.setItem(base, "too-big");
    const getItem = jest.spyOn(AsyncStorage, "getItem");
    getItem.mockRejectedValueOnce(
      new Error("Row too big to fit into CursorWindow requiredPos=0, totalRows=1"),
    );

    await migrateMonolithToShards(base);

    expect(await AsyncStorage.getItem(base)).toBeNull();
  });

  it("sums and clears the key plus its shards", async () => {
    await AsyncStorage.setItem(storageShardKey(base, "a"), "xxxx");
    await AsyncStorage.setItem(storageShardKey(base, "b"), "yy");
    await AsyncStorage.setItem(`${base}-unrelated`, "nope");

    expect(await byteSizeOfKeyTree(base)).toBe(6);

    await removeKeyTree(base);

    expect(await AsyncStorage.getItem(storageShardKey(base, "a"))).toBeNull();
    expect(await AsyncStorage.getItem(storageShardKey(base, "b"))).toBeNull();
    expect(await AsyncStorage.getItem(`${base}-unrelated`)).toBe("nope");
  });

  it("refuses to write values that would overflow CursorWindow", async () => {
    const oversized = "x".repeat(MAX_SAFE_ASYNC_STORAGE_VALUE_BYTES);
    expect(await writeJSONIfSafe("big", oversized)).toBe(false);
    expect(await AsyncStorage.getItem("big")).toBeNull();
    expect(await writeJSONIfSafe("ok", { n: 1 })).toBe(true);
    expect(await readJSON("ok", null)).toEqual({ n: 1 });
  });
});
