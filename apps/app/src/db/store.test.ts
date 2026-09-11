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

const CURSOR_WINDOW = new Error("Row too big to fit into CursorWindow requiredPos=0, totalRows=1");

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("isOversizedRowError", () => {
  it("matches Android CursorWindow failures", () => {
    expect(isOversizedRowError(CURSOR_WINDOW)).toBe(true);
    expect(isOversizedRowError(new Error("disk full"))).toBe(false);
  });
});

describe("readJSON", () => {
  it("drops an oversized row so later reads do not keep failing", async () => {
    await AsyncStorage.setItem("poison", "legacy-blob");
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(CURSOR_WINDOW);

    expect(await readJSON("poison", { empty: true })).toEqual({ empty: true });
    expect(await AsyncStorage.getItem("poison")).toBeNull();
  });

  it("quarantines corrupt JSON instead of treating it as empty", async () => {
    await AsyncStorage.setItem("corrupt", "{not-json");

    expect(await readJSON("corrupt", { empty: true })).toEqual({ empty: true });
    expect(await AsyncStorage.getItem("corrupt")).toBeNull();
    expect(await AsyncStorage.getItem("corrupt__corrupt")).toBe("{not-json");
  });

  it("overwrites an oversized row when removeItem itself fails", async () => {
    await AsyncStorage.setItem("poison-overwrite", "legacy-blob");
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(CURSOR_WINDOW);
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error("cannot delete"));

    expect(await readJSON("poison-overwrite", { empty: true })).toEqual({ empty: true });
    expect(await AsyncStorage.getItem("poison-overwrite")).toBe("null");
  });

  it("skips later reads when an oversized row cannot be deleted or overwritten", async () => {
    const getItem = AsyncStorage.getItem as jest.Mock;
    getItem.mockRejectedValueOnce(CURSOR_WINDOW);
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error("cannot delete"));
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("cannot write"));

    expect(await readJSON("poison-stuck", { empty: true })).toEqual({ empty: true });
    getItem.mockClear();

    expect(await readJSON("poison-stuck", { empty: true })).toEqual({ empty: true });
    expect(getItem).not.toHaveBeenCalled();
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
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(CURSOR_WINDOW);

    await migrateMonolithToShards(base);

    expect(await AsyncStorage.getItem(base)).toBeNull();
  });

  it("drops a monolith that is not a JSON object", async () => {
    await AsyncStorage.setItem(base, "[1,2]");
    await migrateMonolithToShards(base);
    expect(await AsyncStorage.getItem(base)).toBeNull();
  });

  it("drops a monolith whose JSON cannot be parsed", async () => {
    await AsyncStorage.setItem(base, "{not-json");
    await migrateMonolithToShards(base);
    expect(await AsyncStorage.getItem(base)).toBeNull();
  });

  it("drops a monolith that was already quarantined as unreadable", async () => {
    const getItem = AsyncStorage.getItem as jest.Mock;
    getItem.mockRejectedValueOnce(CURSOR_WINDOW);
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error("cannot delete"));
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("cannot write"));

    await readJSON(base, null);
    getItem.mockClear();

    await migrateMonolithToShards(base);

    expect(getItem).not.toHaveBeenCalled();
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

  it("drops an oversized shard while summing the rest of the tree", async () => {
    await AsyncStorage.setItem(storageShardKey(base, "a"), "xxxx");
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(CURSOR_WINDOW);

    expect(await byteSizeOfKeyTree(base)).toBe(0);
    expect(await AsyncStorage.getItem(storageShardKey(base, "a"))).toBeNull();
  });

  it("refuses to write values that would overflow CursorWindow", async () => {
    const oversized = "x".repeat(MAX_SAFE_ASYNC_STORAGE_VALUE_BYTES);
    expect(await writeJSONIfSafe("big", oversized)).toBe(false);
    expect(await AsyncStorage.getItem("big")).toBeNull();
    expect(await writeJSONIfSafe("ok", { n: 1 })).toBe(true);
    expect(await readJSON("ok", null)).toEqual({ n: 1 });
  });

  it("falls back to string length when TextEncoder is unavailable", async () => {
    const Original = globalThis.TextEncoder;
    // @ts-expect-error — simulate a runtime without TextEncoder
    delete globalThis.TextEncoder;
    try {
      expect(await writeJSONIfSafe("no-encoder", { n: 1 })).toBe(true);
      expect(await readJSON("no-encoder", null)).toEqual({ n: 1 });
    } finally {
      globalThis.TextEncoder = Original;
    }
  });
});
