import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import {
  appendInAppNotification,
  loadInAppNotifications,
} from "@/lib/in-app-notifications/storage";
import { loadRecentSearches, pushRecentSearch } from "@/lib/search-history";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import { quranListenerStore } from "@/stores/quran-listener-store";
import { wipePronunciationModels } from "@/stores/quran-pronunciation-store";

jest.mock("@/lib/cache-manager", () => ({
  clearDownloadedAudio: jest.fn(async () => undefined),
  clearDownloadedQcfFonts: jest.fn(async () => undefined),
}));

jest.mock("@/lib/appSurfaces/widgets/snapshotStorage", () => ({
  emptyWidgetSnapshot: () => ({ version: 1 }),
  writeWidgetSnapshot: jest.fn(async () => undefined),
}));

jest.mock("@/stores/quran-listener-store", () => {
  const remove = jest.fn(async () => undefined);
  return { quranListenerStore: { getState: () => ({ remove }) } };
});

jest.mock("@/stores/quran-pronunciation-store", () => ({
  wipePronunciationModels: jest.fn(async () => undefined),
}));

jest.mock("@/stores/reload-all-stores", () => ({
  reloadAllStores: jest.fn(async () => undefined),
}));

jest.mock("@/lib/storage/safe-secure-store", () => ({
  deleteSecureItem: jest.fn(async () => undefined),
  setSecureItem: jest.fn(async () => undefined),
}));

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("wipeLocalDeviceData", () => {
  it("clears DB reset keys plus search history and in-app inbox", async () => {
    await AsyncStorage.setItem(DB_KEYS.version, "3");
    await writeJSON(DB_KEYS.prayerLogs, { a: 1 });
    await writeJSON(DB_KEYS.zakatCalculator, { currency: "USD" });
    await writeJSON(DB_KEYS.weatherCache, { temp: 1 });
    await pushRecentSearch("fatiha");
    await appendInAppNotification({
      kind: "system",
      title: "t",
      body: "b",
    });

    await wipeLocalDeviceData();

    expect(await AsyncStorage.getItem(DB_KEYS.version)).toBe("3");
    expect(await readJSON(DB_KEYS.prayerLogs, null)).toBeNull();
    expect(await readJSON(DB_KEYS.zakatCalculator, null)).toBeNull();
    expect(await readJSON(DB_KEYS.weatherCache, null)).toBeNull();
    expect(await loadRecentSearches()).toEqual([]);
    expect(await loadInAppNotifications()).toEqual([]);
  });

  it("removes the Qur'an practice listener files and manifest, not only AsyncStorage keys", async () => {
    await writeJSON(DB_KEYS.quranRecitationModel, { engine: "tilawa-zipformer" });
    await writeJSON(DB_KEYS.quranMemorization, { schemaVersion: 1, records: {} });

    await wipeLocalDeviceData();

    expect(quranListenerStore.getState().remove).toHaveBeenCalledTimes(1);
    expect(wipePronunciationModels).toHaveBeenCalledTimes(1);
    expect(await readJSON(DB_KEYS.quranRecitationModel, null)).toBeNull();
    expect(await readJSON(DB_KEYS.quranMemorization, null)).toBeNull();
  });
});
