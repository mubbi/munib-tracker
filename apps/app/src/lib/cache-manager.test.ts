import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { clearCacheKeys, formatBytes, getCacheSummary } from "@/lib/cache-manager";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("cache manager", () => {
  it("formats byte sizes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
  });

  it("summarizes cache sizes and clears them without touching other keys", async () => {
    await AsyncStorage.setItem(DB_KEYS.quranEditionCache, "x".repeat(100));
    await AsyncStorage.setItem(DB_KEYS.prayerLogs, "user-data");

    const summary = await getCacheSummary();
    const quran = summary.find((g) => g.id === "quran");
    expect(quran?.bytes).toBe(100);

    await clearCacheKeys([DB_KEYS.quranEditionCache]);
    expect(await AsyncStorage.getItem(DB_KEYS.quranEditionCache)).toBeNull();
    // User data is untouched.
    expect(await AsyncStorage.getItem(DB_KEYS.prayerLogs)).toBe("user-data");
  });

  it("includes per-surah shards in the Qur'an group size and removes them on clear", async () => {
    const shard = `${DB_KEYS.quranEditionCache}/${encodeURIComponent("en-saheeh:1")}`;
    await AsyncStorage.setItem(shard, "y".repeat(40));
    await AsyncStorage.setItem(DB_KEYS.prayerLogs, "user-data");

    const summary = await getCacheSummary();
    const quran = summary.find((g) => g.id === "quran");
    expect(quran?.bytes).toBe(40);

    await clearCacheKeys([DB_KEYS.quranEditionCache]);
    expect(await AsyncStorage.getItem(shard)).toBeNull();
    expect(await AsyncStorage.getItem(DB_KEYS.prayerLogs)).toBe("user-data");
  });
});
