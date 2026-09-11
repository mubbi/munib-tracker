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
