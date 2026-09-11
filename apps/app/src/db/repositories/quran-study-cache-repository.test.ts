import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "../keys";
import { storageShardKey } from "../store";
import { QuranStudyCacheRepository } from "./quran-study-cache-repository";

beforeEach(async () => {
  jest.restoreAllMocks();
  await QuranStudyCacheRepository.clear();
  await AsyncStorage.clear();
});

describe("QuranStudyCacheRepository", () => {
  it("persists each study payload as its own shard, not one blob", async () => {
    await QuranStudyCacheRepository.set("tajweed:1:1", { words: ["بِسْمِ"] });
    await QuranStudyCacheRepository.set("wbw:1:1", { words: ["In"] });

    expect(await AsyncStorage.getItem(DB_KEYS.quranStudyCache)).toBeNull();
    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranStudyCache, "tajweed:1:1")),
    ).toContain("بِسْمِ");

    expect(await QuranStudyCacheRepository.get("tajweed:1:1")).toEqual({ words: ["بِسْمِ"] });
    expect(await QuranStudyCacheRepository.get("wbw:1:1")).toEqual({ words: ["In"] });
  });

  it("keeps a session-only copy when persist is false", async () => {
    await QuranStudyCacheRepository.set("tajweed:1:1", { words: ["بِسْمِ"] }, false);

    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranStudyCache, "tajweed:1:1")),
    ).toBeNull();
    expect(await QuranStudyCacheRepository.get("tajweed:1:1")).toEqual({ words: ["بِسْمِ"] });
  });

  it("migrates a legacy monolith blob into shards on first read", async () => {
    await QuranStudyCacheRepository.clear();
    await AsyncStorage.setItem(
      DB_KEYS.quranStudyCache,
      JSON.stringify({ "tajweed:1:1": { words: ["بِسْمِ"] } }),
    );

    expect(await QuranStudyCacheRepository.get("tajweed:1:1")).toEqual({ words: ["بِسْمِ"] });
    expect(await AsyncStorage.getItem(DB_KEYS.quranStudyCache)).toBeNull();
    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranStudyCache, "tajweed:1:1")),
    ).not.toBeNull();
  });

  it("keeps the session cache when disk writes fail", async () => {
    jest.spyOn(AsyncStorage, "setItem").mockRejectedValueOnce(new Error("quota exceeded"));

    await expect(
      QuranStudyCacheRepository.set("tajweed:1:1", { words: ["بِسْمِ"] }),
    ).resolves.toBeUndefined();
    expect(await QuranStudyCacheRepository.get("tajweed:1:1")).toEqual({ words: ["بِسْمِ"] });
  });

  it("clears shards so a reset does not leave orphan study rows", async () => {
    await QuranStudyCacheRepository.set("tajweed:1:1", { words: ["بِسْمِ"] });
    await QuranStudyCacheRepository.clear();

    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranStudyCache, "tajweed:1:1")),
    ).toBeNull();
    expect(await QuranStudyCacheRepository.get("tajweed:1:1")).toBeNull();
  });
});
