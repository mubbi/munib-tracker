import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BACKUP_KEYS, DB_KEYS, RESET_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

import {
  DEFAULT_DEVICE_PREFERENCES,
  devicePreferencesStore,
  migrateDevicePreferences,
  overlayDeviceOnQuranPrefs,
  overlayDeviceOnUserPrefs,
  resetDevicePreferencesStore,
  resolveDevicePreferences,
  type StoredDevicePreferences,
  splitDeviceUserPatch,
  stripDevicePreferenceFields,
} from "./device-preferences-store";

const NOW = "2026-11-23T10:00:00.000Z";

beforeEach(async () => {
  await AsyncStorage.clear();
  resetDevicePreferencesStore();
});

describe("device preferences key", () => {
  it("is device-local (never backed up, wiped on reset)", () => {
    expect(BACKUP_KEYS).not.toContain(DB_KEYS.devicePreferences);
    expect(RESET_KEYS).toContain(DB_KEYS.devicePreferences);
  });
});

describe("migrateDevicePreferences", () => {
  it("copies each legacy value the device hasn't set", () => {
    const migrated = migrateDevicePreferences(
      null,
      {
        hapticsEnabled: false,
        cacheAudioLocally: false,
        cacheQuranEditionsLocally: true,
        cacheHadithLocally: false,
        audioVolume: 0.3,
        liveActivityEnabled: true,
        avatarUri: "file:///avatar.jpg",
        notificationPrefs: { preciseAdhan: true },
      },
      { ttsVoiceByLang: { en: "voice-1" } },
      NOW,
    );
    expect(migrated).toEqual({
      hapticsEnabled: false,
      cacheAudioLocally: false,
      cacheQuranEditionsLocally: true,
      cacheHadithLocally: false,
      audioVolume: 0.3,
      liveActivityEnabled: true,
      avatarUri: "file:///avatar.jpg",
      preciseAdhan: true,
      ttsVoiceByLang: { en: "voice-1" },
      migratedAt: NOW,
    });
  });

  it("keeps device values over legacy ones and fills required defaults", () => {
    const migrated = migrateDevicePreferences(
      { hapticsEnabled: true },
      { hapticsEnabled: false },
      null,
      NOW,
    );
    expect(migrated).toEqual({ ...DEFAULT_DEVICE_PREFERENCES, migratedAt: NOW });
  });

  it("is idempotent once stamped (a later legacy change never leaks in)", () => {
    const stored: StoredDevicePreferences = { hapticsEnabled: true, migratedAt: NOW };
    expect(migrateDevicePreferences(stored, { hapticsEnabled: false }, null)).toEqual(stored);
  });
});

describe("resolveDevicePreferences", () => {
  it("prefers the device value, then the legacy synced one, then the default", () => {
    const resolved = resolveDevicePreferences(
      { audioVolume: 0.5 },
      { audioVolume: 0.9, hapticsEnabled: false, notificationPrefs: { preciseAdhan: true } },
      { ttsVoiceByLang: { ur: "v" } },
    );
    expect(resolved).toMatchObject({
      audioVolume: 0.5,
      hapticsEnabled: false,
      preciseAdhan: true,
      cacheAudioLocally: true,
      ttsVoiceByLang: { ur: "v" },
    });
  });
});

describe("patch split / overlay / strip", () => {
  it("splits device fields (incl. notificationPrefs.preciseAdhan) from the synced rest", () => {
    const { device, rest } = splitDeviceUserPatch({
      timeFormat: "12",
      hapticsEnabled: false,
      notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, preciseAdhan: true },
    });
    expect(device).toEqual({ hapticsEnabled: false, preciseAdhan: true });
    expect(rest.timeFormat).toBe("12");
    expect(rest).not.toHaveProperty("hapticsEnabled");
    expect(rest.notificationPrefs).not.toHaveProperty("preciseAdhan");
  });

  it("overlays only the values the device has set and keeps the reference otherwise", () => {
    const prefs = DEFAULT_USER_PREFERENCES;
    expect(overlayDeviceOnUserPrefs(prefs, {})).toBe(prefs);
    const next = overlayDeviceOnUserPrefs(prefs, { hapticsEnabled: false, preciseAdhan: true });
    expect(next.hapticsEnabled).toBe(false);
    expect(next.notificationPrefs.preciseAdhan).toBe(true);
    expect(prefs.hapticsEnabled).toBe(true);
  });

  it("overlays the TTS voices on the Qur'an prefs", () => {
    const quran = { ttsVoiceByLang: { en: "old" } };
    expect(overlayDeviceOnQuranPrefs(quran, {})).toBe(quran);
    expect(
      overlayDeviceOnQuranPrefs(quran, { ttsVoiceByLang: { en: "new" } }).ttsVoiceByLang,
    ).toEqual({ en: "new" });
  });

  it("strips every device field from a pushed preferences payload", () => {
    const stripped = stripDevicePreferenceFields({
      ...DEFAULT_USER_PREFERENCES,
      avatarUri: "file:///a.jpg",
      liveActivityEnabled: true,
      notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, preciseAdhan: true },
    });
    for (const key of [
      "hapticsEnabled",
      "cacheAudioLocally",
      "cacheQuranEditionsLocally",
      "cacheHadithLocally",
      "audioVolume",
      "liveActivityEnabled",
      "avatarUri",
    ]) {
      expect(stripped).not.toHaveProperty(key);
    }
    expect(stripped.notificationPrefs).not.toHaveProperty("preciseAdhan");
    expect(stripped.locale).toBe("en");
  });
});

describe("devicePreferencesStore", () => {
  it("runs the legacy migration on first load and persists it", async () => {
    await AsyncStorage.setItem(
      DB_KEYS.userPreferences,
      JSON.stringify({ hapticsEnabled: false, audioVolume: 0.2 }),
    );
    await AsyncStorage.setItem(
      DB_KEYS.quranPrefs,
      JSON.stringify({ ttsVoiceByLang: { fr: "amelie" } }),
    );
    await devicePreferencesStore.getState().load();
    expect(devicePreferencesStore.getState().prefs).toMatchObject({
      hapticsEnabled: false,
      audioVolume: 0.2,
      ttsVoiceByLang: { fr: "amelie" },
    });
    const stored = await readJSON<StoredDevicePreferences | null>(DB_KEYS.devicePreferences, null);
    expect(stored?.migratedAt).toEqual(expect.any(String));
    expect(devicePreferencesStore.getState().prefs).not.toHaveProperty("migratedAt");
  });

  it("does not migrate again once stamped", async () => {
    await AsyncStorage.setItem(
      DB_KEYS.devicePreferences,
      JSON.stringify({ hapticsEnabled: true, migratedAt: NOW }),
    );
    await AsyncStorage.setItem(DB_KEYS.userPreferences, JSON.stringify({ hapticsEnabled: false }));
    await devicePreferencesStore.getState().load();
    expect(devicePreferencesStore.getState().prefs).toEqual({ hapticsEnabled: true });
  });

  it("persists updates", async () => {
    await devicePreferencesStore.getState().load();
    await devicePreferencesStore.getState().update({ cacheHadithLocally: false });
    resetDevicePreferencesStore();
    await devicePreferencesStore.getState().load();
    expect(devicePreferencesStore.getState().prefs.cacheHadithLocally).toBe(false);
  });
});
