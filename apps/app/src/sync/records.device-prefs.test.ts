import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { buildSyncRecords } from "./records";

/**
 * B4 (§4.5.10): device preferences never sync — even when a legacy synced copy
 * still sits in the stored preferences blob, the pushed record leaves it out.
 */
describe("buildSyncRecords › device preferences", () => {
  const preferences: UserPreferences = {
    ...DEFAULT_USER_PREFERENCES,
    hapticsEnabled: false,
    cacheAudioLocally: false,
    cacheQuranEditionsLocally: false,
    cacheHadithLocally: false,
    audioVolume: 0.4,
    liveActivityEnabled: true,
    avatarUri: "file:///gallery/me.jpg",
    notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, preciseAdhan: true },
    timeFormat: "12",
    updatedAt: "2026-11-23T10:00:00.000Z",
  };

  const records = buildSyncRecords({
    nowIso: "2026-11-23T12:00:00.000Z",
    prayerLogs: [],
    zikrProgress: [],
    qazaCounters: [],
    roza: { remaining: 0, completed: 0 },
    preferences,
    tombstones: [],
    duaFavorites: { order: [] },
    duroodFavorites: { order: [] },
    nameFavorites: { order: [] },
    quranBookmarks: [],
    quranLastRead: null,
    hadithBookmarks: [],
    customTasbeeh: { items: [] },
  });

  it("pushes the synced preferences without any device field", () => {
    const record = records.find((r) => r.entity === "preferences");
    expect(record?.data).toMatchObject({ timeFormat: "12" });
    const data = record?.data as Record<string, unknown>;
    for (const key of [
      "hapticsEnabled",
      "cacheAudioLocally",
      "cacheQuranEditionsLocally",
      "cacheHadithLocally",
      "audioVolume",
      "liveActivityEnabled",
      "avatarUri",
    ]) {
      expect(data).not.toHaveProperty(key);
    }
    expect(data.notificationPrefs).not.toHaveProperty("preciseAdhan");
  });

  it("never emits a device-preferences entity", () => {
    expect(JSON.stringify(records)).not.toContain("gallery/me.jpg");
    expect(records.map((r) => r.entity)).not.toContain("device_preferences");
  });
});
