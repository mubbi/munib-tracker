import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import * as audioCache from "@/lib/audio-cache";
import {
  clearCacheKeys,
  clearDownloadedAudio,
  clearDownloadedQcfFonts,
  formatBytes,
  getCacheSummary,
  getRecitationListenerBytes,
} from "@/lib/cache-manager";
import * as qcfFontCache from "@/lib/qcf-font-cache";
import * as modelStore from "@/lib/quran-companion/model/model-store";

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

  it("includes ayah-study shards in the Qur'an group size and removes them on clear", async () => {
    const shard = `${DB_KEYS.quranStudyCache}/${encodeURIComponent("tajweed:1:1")}`;
    await AsyncStorage.setItem(shard, "z".repeat(24));

    const summary = await getCacheSummary();
    const quran = summary.find((g) => g.id === "quran");
    expect(quran?.bytes).toBe(24);

    await clearCacheKeys([DB_KEYS.quranStudyCache]);
    expect(await AsyncStorage.getItem(shard)).toBeNull();
  });
});

describe("downloaded files", () => {
  afterEach(() => jest.restoreAllMocks());

  it("adds downloaded audio and mushaf font files to their groups", async () => {
    jest.spyOn(audioCache, "getAudioCacheInfo").mockResolvedValue({ bytes: 300, count: 2 });
    jest.spyOn(qcfFontCache, "getQcfFontCacheInfo").mockResolvedValue({ bytes: 700, count: 1 });
    const summary = await getCacheSummary();
    expect(summary.find((g) => g.id === "audio")).toMatchObject({ bytes: 300, count: 2 });
    expect(summary.find((g) => g.id === "mushafFonts")).toMatchObject({ bytes: 700, count: 1 });
  });

  it.each([
    ["audio", clearDownloadedAudio, () => jest.spyOn(audioCache, "clearAudioCache")],
    ["mushaf fonts", clearDownloadedQcfFonts, () => jest.spyOn(qcfFontCache, "clearQcfFontCache")],
  ])("clears downloaded %s", async (_label, clear, spy) => {
    const clearSpy = spy().mockResolvedValue(undefined);
    await clear();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it("reports the on-device recitation model size", async () => {
    jest.spyOn(modelStore, "recitationModelBytesOnDisk").mockResolvedValue(4096);
    await expect(getRecitationListenerBytes()).resolves.toBe(4096);
  });

  it("reports zero when the model size cannot be read", async () => {
    jest.spyOn(modelStore, "recitationModelBytesOnDisk").mockRejectedValue(new Error("io"));
    await expect(getRecitationListenerBytes()).resolves.toBe(0);
  });
});
