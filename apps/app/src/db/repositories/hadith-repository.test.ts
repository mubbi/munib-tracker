import type { HadithCollectionData } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "../keys";
import { storageShardKey } from "../store";
import { HadithRepository } from "./hadith-repository";

const collection: HadithCollectionData = {
  sections: [{ id: "1", name: "Revelation", count: 1 }],
  items: [
    {
      id: "bukhari:1",
      collection: "bukhari",
      number: "1",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      english: "Actions are by intentions",
      reference: "Sahih al-Bukhari 1",
    },
  ],
};

beforeEach(async () => {
  jest.restoreAllMocks();
  await HadithRepository.clear();
  await AsyncStorage.clear();
});

describe("HadithRepository book cache", () => {
  it("persists each collection as its own shard, not one blob", async () => {
    await HadithRepository.setCachedBook("bukhari", collection);

    expect(await AsyncStorage.getItem(DB_KEYS.hadithBookCache)).toBeNull();
    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.hadithBookCache, "bukhari")),
    ).toContain("Actions are by intentions");
    expect(await HadithRepository.getCachedBook("bukhari")).toEqual(collection);
  });

  it("keeps a session-only copy when persist is false", async () => {
    await HadithRepository.setCachedBook("bukhari", collection, false);

    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.hadithBookCache, "bukhari")),
    ).toBeNull();
    expect(await HadithRepository.getCachedBook("bukhari")).toEqual(collection);
  });

  it("migrates a legacy monolith blob into shards on first read", async () => {
    await HadithRepository.clear();
    await AsyncStorage.setItem(DB_KEYS.hadithBookCache, JSON.stringify({ bukhari: collection }));

    expect(await HadithRepository.getCachedBook("bukhari")).toEqual(collection);
    expect(await AsyncStorage.getItem(DB_KEYS.hadithBookCache)).toBeNull();
    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.hadithBookCache, "bukhari")),
    ).not.toBeNull();
  });

  it("keeps the session cache when disk writes fail", async () => {
    jest.spyOn(AsyncStorage, "setItem").mockRejectedValueOnce(new Error("quota exceeded"));

    await expect(HadithRepository.setCachedBook("bukhari", collection)).resolves.toBeUndefined();
    expect(await HadithRepository.getCachedBook("bukhari")).toEqual(collection);
  });

  it("clears shards so a reset does not leave orphan collection rows", async () => {
    await HadithRepository.setCachedBook("bukhari", collection);
    await HadithRepository.clearBookCache();

    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.hadithBookCache, "bukhari")),
    ).toBeNull();
    expect(await HadithRepository.getCachedBook("bukhari")).toBeNull();
  });
});

describe("HadithRepository prefs and bookmarks", () => {
  it("merges stored prefs over the defaults", async () => {
    expect(await HadithRepository.updatePrefs({ showIsnad: false })).toMatchObject({
      showIsnad: false,
      showArabic: true,
    });
    expect((await HadithRepository.getPrefs()).showIsnad).toBe(false);
  });

  it("toggles a bookmark on and off and stamps the watermark", async () => {
    const item = collection.items[0] as (typeof collection.items)[number];
    await expect(HadithRepository.toggleBookmark(item)).resolves.toBe(true);
    await expect(HadithRepository.isBookmarked(item.id)).resolves.toBe(true);
    await expect(HadithRepository.getBookmarksUpdatedAt()).resolves.toEqual(expect.any(String));

    await expect(HadithRepository.toggleBookmark(item)).resolves.toBe(false);
    await expect(HadithRepository.isBookmarked(item.id)).resolves.toBe(false);
  });

  it("resolves bookmarks from cached remote books and drops unavailable ones", async () => {
    await HadithRepository.setCachedBook("bukhari", collection);
    await HadithRepository.toggleBookmark({ id: "bukhari:1", collection: "bukhari", number: "1" });
    await HadithRepository.toggleBookmark({
      id: "bukhari:99",
      collection: "bukhari",
      number: "99",
    });
    await HadithRepository.toggleBookmark({ id: "muslim:1", collection: "muslim", number: "1" });

    const resolved = await HadithRepository.getBookmarkedHadiths();

    expect(resolved.map((r) => r.item.id)).toEqual(["bukhari:1"]);
    expect(resolved[0]?.bookmark.hadithId).toBe("bukhari:1");
  });
});
