import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";

import { PreferencesRepository } from "@/db";
import * as i18n from "@/i18n";
import * as rtl from "@/lib/i18n/rtl";
import * as cloudSync from "@/lib/sync/preferences-cloud-sync";
import * as pushPrefs from "@/lib/sync/push-preferences";

import {
  type PreferencesState,
  preferencesStore,
  useFavoriteZikrIds,
  useIsFavoriteZikr,
  usePreferences,
  usePreferencesActions,
  usePreferencesReady,
} from "./preferences-store";

// jest.setup.ts loads this store (through `@/i18n`) before any suite mock can
// apply, so collaborators are spied on in place rather than jest.mock()ed.
const bootstrapAppLocale = jest.spyOn(i18n, "bootstrapAppLocale");
const changeAppLocale = jest.spyOn(i18n, "changeAppLocale");
const mockWillReload = jest.spyOn(rtl, "willRequireNativeReloadForLocale");
const markPreferencesDirty = jest.spyOn(cloudSync, "markPreferencesDirty");
const clearPreferencesDirty = jest.spyOn(cloudSync, "clearPreferencesDirty");
const cancelScheduledPreferencesCloudSync = jest.spyOn(
  pushPrefs,
  "cancelScheduledPreferencesCloudSync",
);
const mockPush = jest.spyOn(pushPrefs, "pushPreferencesNow");
const schedulePreferencesCloudSync = jest.spyOn(pushPrefs, "schedulePreferencesCloudSync");
const mockChangeLocale = changeAppLocale;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  bootstrapAppLocale.mockResolvedValue(undefined);
  changeAppLocale.mockResolvedValue(false);
  mockWillReload.mockReturnValue(false);
  markPreferencesDirty.mockImplementation(() => {});
  clearPreferencesDirty.mockImplementation(() => {});
  cancelScheduledPreferencesCloudSync.mockImplementation(() => {});
  mockPush.mockResolvedValue(true);
  schedulePreferencesCloudSync.mockImplementation(() => {});
  preferencesStore.setState({ prefs: DEFAULT_USER_PREFERENCES, isReady: false });
});

afterAll(() => {
  jest.restoreAllMocks();
});

/**
 * Loads a fresh copy of the store whose device locales are `tags`. The shared
 * copy captured jest.setup's `expo-localization` mock at import time.
 */
async function loadWithDeviceLocales(tags: string[], onboarded = false) {
  // resetModules (not isolateModules) so the setup-time expo-localization mock
  // instance is dropped too; this file's static imports keep their instances.
  jest.resetModules();
  jest.doMock("expo-localization", () => ({
    getLocales: () => tags.map((languageTag) => ({ languageTag })),
  }));
  jest.doMock("@/i18n", () => ({ bootstrapAppLocale: jest.fn(async () => {}) }));
  const store: { getState: () => PreferencesState } =
    require("./preferences-store").preferencesStore;
  const repo: typeof PreferencesRepository = require("@/db").PreferencesRepository;
  if (onboarded) await repo.update({ hasCompletedOnboarding: true });
  await store.getState().load();
  return store.getState().prefs;
}

const state = () => preferencesStore.getState();

/** Makes the next repository write fail so the optimistic value must roll back. */
function failNextWrite() {
  return jest.spyOn(PreferencesRepository, "update").mockRejectedValueOnce(new Error("disk"));
}

describe("load", () => {
  it("adopts a supported device language before onboarding", async () => {
    const prefs = await loadWithDeviceLocales(["ur-PK"]);
    expect(prefs).toMatchObject({ locale: "ur", translationLocale: "ur" });
  });

  it.each([[["xx-YY"]], [["en-GB"]]])("keeps English for device languages %j", async (tags) => {
    expect((await loadWithDeviceLocales(tags)).locale).toBe("en");
  });

  it("never overrides the language after onboarding", async () => {
    expect((await loadWithDeviceLocales(["ar"], true)).locale).toBe("en");
  });

  it("bootstraps the stored language and marks ready", async () => {
    await state().load();
    expect(bootstrapAppLocale).toHaveBeenCalledWith("en");
    expect(state().isReady).toBe(true);
  });

  it("is a no-op once ready", async () => {
    preferencesStore.setState({ isReady: true });
    await state().load();
    expect(bootstrapAppLocale).not.toHaveBeenCalled();
  });

  it("still marks ready when hydration throws", async () => {
    bootstrapAppLocale.mockRejectedValueOnce(new Error("reload failed"));
    await expect(state().load()).rejects.toThrow("reload failed");
    expect(state().isReady).toBe(true);
  });
});

describe("update", () => {
  it("persists, marks dirty and schedules a cloud sync", async () => {
    await state().update({ hapticsEnabled: false });
    expect((await PreferencesRepository.get()).hapticsEnabled).toBe(false);
    expect(markPreferencesDirty).toHaveBeenCalled();
    expect(schedulePreferencesCloudSync).toHaveBeenCalledWith(
      expect.objectContaining({ hapticsEnabled: false }),
    );
  });

  it("deep-merges font prefs optimistically", async () => {
    const pending = state().update({
      fontPrefs: { arabic: { size: 30 } } as never,
    });
    expect(state().prefs.fontPrefs.arabic).toMatchObject({
      ...DEFAULT_USER_PREFERENCES.fontPrefs.arabic,
      size: 30,
    });
    expect(state().prefs.fontPrefs.translation).toEqual(
      DEFAULT_USER_PREFERENCES.fontPrefs.translation,
    );
    await pending;
  });

  it("rolls back when the write fails", async () => {
    failNextWrite();
    await state().update({ hapticsEnabled: false });
    expect(state().prefs).toBe(DEFAULT_USER_PREFERENCES);
  });

  it("refreshFromDb reloads stored prefs", async () => {
    await PreferencesRepository.update({ hapticsEnabled: false });
    await state().refreshFromDb();
    expect(state().prefs.hapticsEnabled).toBe(false);
  });
});

describe("setLocale", () => {
  it("applies the language and schedules a sync when no reload is needed", async () => {
    await state().setLocale("fr");
    expect(cancelScheduledPreferencesCloudSync).toHaveBeenCalled();
    expect(changeAppLocale).toHaveBeenCalledWith("fr");
    expect(schedulePreferencesCloudSync).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "fr" }),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("pushes immediately before an RTL reload", async () => {
    mockWillReload.mockReturnValue(true);
    await state().setLocale("ar");
    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({ locale: "ar" }));
    expect(clearPreferencesDirty).toHaveBeenCalled();
    expect(schedulePreferencesCloudSync).not.toHaveBeenCalled();
  });

  it("keeps the dirty flag when the immediate push is skipped", async () => {
    mockWillReload.mockReturnValue(true);
    mockPush.mockResolvedValueOnce(false);
    await state().setLocale("ar");
    expect(clearPreferencesDirty).not.toHaveBeenCalled();
  });

  it("tolerates an offline push", async () => {
    mockWillReload.mockReturnValue(true);
    mockPush.mockRejectedValueOnce(new Error("offline"));
    await state().setLocale("ur");
    expect(state().prefs.locale).toBe("ur");
  });

  it("does not schedule a sync when the app reloaded", async () => {
    mockWillReload.mockReturnValue(false);
    mockChangeLocale.mockResolvedValueOnce(true);
    await state().setLocale("tr");
    expect(schedulePreferencesCloudSync).not.toHaveBeenCalled();
  });

  it("rolls back when the write fails", async () => {
    failNextWrite();
    await state().setLocale("fr");
    expect(state().prefs.locale).toBe("en");
  });
});

describe("nested setters", () => {
  it("setNotificationPrefs merges the patch", async () => {
    await state().setNotificationPrefs({ masterEnabled: false });
    expect((await PreferencesRepository.get()).notificationPrefs).toMatchObject({
      masterEnabled: false,
    });
  });

  it("setWeatherPrefs merges the patch", async () => {
    await state().setWeatherPrefs({ effectsEnabled: false });
    expect((await PreferencesRepository.get()).weatherPrefs.effectsEnabled).toBe(false);
  });

  it("setPrayerAlert toggles one salah", async () => {
    await state().setPrayerAlert("fajr", false);
    expect((await PreferencesRepository.get()).prayerAlerts.fajr).toBe(false);
  });

  it.each([
    ["setNotificationPrefs", () => state().setNotificationPrefs({ masterEnabled: false })],
    ["setWeatherPrefs", () => state().setWeatherPrefs({ effectsEnabled: false })],
    ["setPrayerAlert", () => state().setPrayerAlert("fajr", false)],
  ])("%s rolls back when the write fails", async (_label, act) => {
    failNextWrite();
    await act();
    expect(state().prefs).toBe(DEFAULT_USER_PREFERENCES);
  });
});

describe("hooks", () => {
  function setup() {
    return renderHook(() => ({
      prefs: usePreferences(),
      ready: usePreferencesReady(),
      favorites: useFavoriteZikrIds(),
      isFavorite: useIsFavoriteZikr("z1"),
      actions: usePreferencesActions(),
    }));
  }

  it("route favorites and every action to the store", async () => {
    const { result } = await setup();
    const { actions } = result.current;
    await act(async () => {
      await actions.load();
      await actions.toggleFavorite("z1");
      await actions.toggleFavorite("z2");
      await actions.setFavoriteOrder(["z2", "z1"]);
      await actions.update({ hapticsEnabled: false });
      await actions.setNotificationPrefs({});
      await actions.setWeatherPrefs({});
      await actions.setPrayerAlert("isha", false);
      await actions.setLocale("en");
      await actions.refreshFromDb();
    });
    expect(result.current).toMatchObject({
      ready: true,
      favorites: ["z2", "z1"],
      isFavorite: true,
      prefs: { hapticsEnabled: false, prayerAlerts: { isha: false } },
    });
  });
});
