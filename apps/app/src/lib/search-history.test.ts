import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearRecentSearches, loadRecentSearches, pushRecentSearch } from "@/lib/search-history";

const KEY = "search:recent:v1";
const storage = jest.mocked(AsyncStorage);

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("loadRecentSearches", () => {
  it.each([
    ["nothing stored", null, []],
    ["corrupt JSON", "{", []],
    ["a non-array", '{"a":1}', []],
    ["mixed entries", JSON.stringify(["a", 1, "b"]), ["a", "b"]],
  ])("returns %p for %s", async (_label, raw, expected) => {
    if (raw != null) await AsyncStorage.setItem(KEY, raw);
    await expect(loadRecentSearches()).resolves.toEqual(expected);
  });

  it("caps the list at eight entries", async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify(Array.from({ length: 12 }, (_, i) => `q${i}`)));
    await expect(loadRecentSearches()).resolves.toHaveLength(8);
  });
});

describe("pushRecentSearch", () => {
  it("adds the trimmed query to the front, de-duplicating case-insensitively", async () => {
    await pushRecentSearch("Patience");
    await pushRecentSearch("mercy");
    await expect(pushRecentSearch("  PATIENCE ")).resolves.toEqual(["PATIENCE", "mercy"]);
    await expect(loadRecentSearches()).resolves.toEqual(["PATIENCE", "mercy"]);
  });

  it("ignores a blank query", async () => {
    await pushRecentSearch("mercy");
    await expect(pushRecentSearch("   ")).resolves.toEqual(["mercy"]);
  });

  it("returns the new list even when saving fails", async () => {
    storage.setItem.mockRejectedValueOnce(new Error("quota"));
    await expect(pushRecentSearch("dua")).resolves.toEqual(["dua"]);
  });
});

describe("clearRecentSearches", () => {
  it("removes the saved list", async () => {
    await pushRecentSearch("dua");
    await clearRecentSearches();
    await expect(loadRecentSearches()).resolves.toEqual([]);
  });

  it("swallows storage failures", async () => {
    storage.removeItem.mockRejectedValueOnce(new Error("io"));
    await expect(clearRecentSearches()).resolves.toBeUndefined();
  });
});
