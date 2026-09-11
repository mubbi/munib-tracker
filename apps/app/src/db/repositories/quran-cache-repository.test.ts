import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "../keys";
import { storageShardKey } from "../store";
import { QuranCacheRepository } from "./quran-cache-repository";

beforeEach(async () => {
  await QuranCacheRepository.clear();
  await AsyncStorage.clear();
});

describe("QuranCacheRepository", () => {
  it("persists each edition/surah as its own shard, not one blob", async () => {
    await QuranCacheRepository.set("en-saheeh", 1, { "1": "In the name of Allah" });
    await QuranCacheRepository.set("en-saheeh", 2, { "1": "Alif Lam Meem" });

    expect(await AsyncStorage.getItem(DB_KEYS.quranEditionCache)).toBeNull();
    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranEditionCache, "en-saheeh:1")),
    ).toContain("In the name of Allah");

    expect(await QuranCacheRepository.get("en-saheeh", 1)).toEqual({
      "1": "In the name of Allah",
    });
    expect(await QuranCacheRepository.get("en-saheeh", 2)).toEqual({ "1": "Alif Lam Meem" });
  });

  it("keeps a session-only copy when persist is false", async () => {
    await QuranCacheRepository.set("en-saheeh", 1, { "1": "In the name of Allah" }, false);

    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranEditionCache, "en-saheeh:1")),
    ).toBeNull();
    expect(await QuranCacheRepository.get("en-saheeh", 1)).toEqual({
      "1": "In the name of Allah",
    });
  });

  it("migrates a legacy monolith blob into shards on first read", async () => {
    await QuranCacheRepository.clear();
    await AsyncStorage.setItem(
      DB_KEYS.quranEditionCache,
      JSON.stringify({
        "en-saheeh:1": { "1": "In the name of Allah" },
      }),
    );

    expect(await QuranCacheRepository.get("en-saheeh", 1)).toEqual({
      "1": "In the name of Allah",
    });
    expect(await AsyncStorage.getItem(DB_KEYS.quranEditionCache)).toBeNull();
    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranEditionCache, "en-saheeh:1")),
    ).not.toBeNull();
  });

  it("clears shards so a reset does not leave orphan edition rows", async () => {
    await QuranCacheRepository.set("en-saheeh", 1, { "1": "In the name of Allah" });
    await QuranCacheRepository.clear();

    expect(
      await AsyncStorage.getItem(storageShardKey(DB_KEYS.quranEditionCache, "en-saheeh:1")),
    ).toBeNull();
    expect(await QuranCacheRepository.get("en-saheeh", 1)).toBeNull();
  });
});
