import { act } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { PHONE_ANDROID, PHONE_IOS, resetSettingsStores, TV, WEB } from "@/test-support/settings";

import { availableGroups, groupSummary, isGroupAvailable, SETTINGS_GROUPS } from "./groups";
import {
  getSetting,
  isAtDefault,
  isSettingAvailable,
  isSettingEnabled,
  isSettingResettable,
  resolveDefault,
  SETTINGS_REGISTRY,
  sectionsForGroup,
} from "./registry";
import { resetSection, resetSettings } from "./reset";
import { groupOfSettingId, SETTINGS_GROUP_IDS, settingHref } from "./routes";
import { getSettingsSnapshot } from "./snapshot";

jest.mock(
  "@/notifications/scheduler",
  () => require("@/test-support/mocks/notifications-scheduler").notificationsSchedulerMock,
);

function hasKey(key: string): boolean {
  return (
    key.split(".").reduce<unknown>((node, part) => {
      if (node && typeof node === "object" && part in (node as object)) {
        return (node as Record<string, unknown>)[part];
      }
      return undefined;
    }, en) !== undefined
  );
}

const t = ((key: string, opts?: Record<string, unknown>) =>
  opts && "count" in opts ? `${key}:${opts.count}` : key) as never;

describe("settings registry shape", () => {
  it("has unique ids prefixed with their group (deep links build from the id)", () => {
    const ids = SETTINGS_REGISTRY.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const def of SETTINGS_REGISTRY) {
      expect(groupOfSettingId(def.id)).toBe(def.group);
      expect(settingHref(def.id)).toBe(
        `/settings/${def.group}?focus=${encodeURIComponent(def.id)}`,
      );
    }
  });

  it("every title, subtitle, section and keywords key exists in en.json", () => {
    const missing: string[] = [];
    for (const def of SETTINGS_REGISTRY) {
      for (const key of [def.titleKey, def.subtitleKey, def.section, def.keywordsKey]) {
        if (key && !hasKey(key)) missing.push(`${def.id}: ${key}`);
      }
      if (def.control.kind === "choice") {
        for (const o of def.control.options) {
          if (o.labelKey && !hasKey(o.labelKey)) missing.push(`${def.id}: ${o.labelKey}`);
          if (o.descriptionKey && !hasKey(o.descriptionKey)) {
            missing.push(`${def.id}: ${o.descriptionKey}`);
          }
        }
      }
    }
    for (const group of SETTINGS_GROUPS) {
      for (const key of [group.titleKey, group.subtitleKey]) {
        if (!hasKey(key)) missing.push(`group ${group.id}: ${key}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("every group has metadata and at least one available row on phones", () => {
    expect(SETTINGS_GROUPS.map((g) => g.id).sort()).toEqual([...SETTINGS_GROUP_IDS].sort());
    for (const group of SETTINGS_GROUPS) {
      expect(isGroupAvailable(group, PHONE_IOS)).toBe(true);
    }
  });
});

describe("available per platform", () => {
  it("TV shows only the TV-relevant groups, each with rows (no empty states)", () => {
    expect(availableGroups(TV).map((g) => g.id)).toEqual([
      "prayer-times",
      "quran",
      "content",
      "fonts",
      "appearance",
      "language",
      "data",
      "devices",
      "about",
    ]);
    for (const group of availableGroups(TV)) {
      expect(sectionsForGroup(group.id, TV).length).toBeGreaterThan(0);
    }
  });

  it("hides native-only rows on web and phone-only rows on TV", () => {
    const haptics = getSetting("accessibility.haptics");
    const precise = getSetting("notifications.salah.preciseAdhan");
    const getApp = getSetting("devices.getApp");
    const backup = getSetting("data.backup");
    if (!haptics || !precise || !getApp || !backup) throw new Error("missing defs");
    expect(isSettingAvailable(haptics, PHONE_IOS)).toBe(true);
    expect(isSettingAvailable(haptics, WEB)).toBe(false);
    expect(isSettingAvailable(precise, PHONE_ANDROID)).toBe(true);
    expect(isSettingAvailable(precise, PHONE_IOS)).toBe(false);
    expect(isSettingAvailable(getApp, WEB)).toBe(true);
    expect(isSettingAvailable(getApp, PHONE_IOS)).toBe(false);
    expect(isSettingAvailable(backup, TV)).toBe(false);
  });

  it("every group available on web has rows", () => {
    for (const group of availableGroups(WEB)) {
      expect(sectionsForGroup(group.id, WEB).length).toBeGreaterThan(0);
    }
  });
});

describe("read / write round-trip through the real stores", () => {
  beforeEach(resetSettingsStores);

  it("starts at the default for every resettable setting", () => {
    const snapshot = getSettingsSnapshot();
    const notDefault = SETTINGS_REGISTRY.filter(
      (def) => isSettingResettable(def) && !isAtDefault(def, snapshot),
    ).map((d) => d.id);
    expect(notDefault).toEqual([]);
  });

  it.each([
    ["language.timeFormat", "12"],
    ["language.defaultCalendar", "gregorian"],
    ["language.temperatureUnit", "fahrenheit"],
    ["appearance.theme", "light"],
    ["appearance.weatherEffects", false],
    ["notifications.zikr.bedtime", "23:15"],
    ["notifications.salah.offset.fajr", -10],
    ["notifications.content.friday", true],
    ["notifications.salah.alert.maghrib", false],
    ["prayer-times.method", "Karachi"],
    ["prayer-times.asr", "hanafi"],
    ["prayer-times.offset.sunrise", 3],
    ["quran.reader.layout", "mushaf"],
    ["quran.recitation.reciter", "Husary_128kbps"],
    ["quran.practice.rangePreset", "surah"],
    ["content.hadith.showIsnad", false],
    ["fonts.reading.showTranslation", false],
    ["fonts.reading.showTransliteration", false],
    ["fonts.arabicSize", "l"],
    ["audio.speed", 1.5],
    ["audio.volume", 40],
    ["data.offline.cacheAudio", false],
  ])("%s writes and reads back %p", async (id, value) => {
    const def = getSetting(id);
    if (!def) throw new Error(id);
    await act(async () => {
      await def.write(value);
    });
    expect(def.read(getSettingsSnapshot())).toEqual(value);
  });

  it("reset writes defaults back and runs side effects once", async () => {
    const { rescheduleAll } = jest.requireMock("@/notifications/scheduler") as {
      rescheduleAll: jest.Mock;
    };
    const ids = ["language.timeFormat", "notifications.content.friday", "prayer-times.asr"];
    const defs = ids.map((id) => getSetting(id)).filter((d) => d != null);
    await act(async () => {
      await defs[0].write("12");
      await defs[1].write(true);
      await defs[2].write("hanafi");
    });
    rescheduleAll.mockClear();
    let changed: unknown[] = [];
    await act(async () => {
      changed = await resetSettings(defs);
    });
    expect(changed).toHaveLength(3);
    const snapshot = getSettingsSnapshot();
    for (const def of defs) expect(isAtDefault(def, snapshot)).toBe(true);
    expect(rescheduleAll).toHaveBeenCalledTimes(1);
  });

  it("section reset only touches that section", async () => {
    await act(async () => {
      await getSetting("language.timeFormat")?.write("12");
      await getSetting("language.translation")?.write("ur");
    });
    await act(async () => {
      await resetSection("language", "settingsPanel.section.region", PHONE_IOS);
    });
    const s = getSettingsSnapshot();
    expect(s.prefs.timeFormat).toBe("24");
    expect(s.prefs.translationLocale).toBe("ur");
  });

  it("B3: the Sunrise masjid offset is a registered stepper", () => {
    const def = getSetting("prayer-times.offset.sunrise");
    expect(def?.control.kind).toBe("stepper");
    expect(def?.group).toBe("prayer-times");
  });
});

describe("enabledWhen and summary", () => {
  beforeEach(resetSettingsStores);

  it("adhan toggles need the master switch and Salah reminders on", async () => {
    const playAdhan = getSetting("notifications.salah.playAdhan");
    if (!playAdhan) throw new Error("missing");
    expect(isSettingEnabled(playAdhan, getSettingsSnapshot())).toBe(false);
    await act(async () => {
      const { preferencesStore } = await import("@/stores/preferences-store");
      await preferencesStore.getState().setNotificationPrefs({ masterEnabled: true });
    });
    expect(isSettingEnabled(playAdhan, getSettingsSnapshot())).toBe(true);
  });

  it("summaries describe the current value", () => {
    const snapshot = getSettingsSnapshot();
    const timeFormat = getSetting("language.timeFormat");
    const offset = getSetting("notifications.salah.offset.isha");
    expect(timeFormat?.summary?.(timeFormat.read(snapshot), t)).toBe("timeFormat.option24");
    expect(offset?.summary?.(-15, t)).toBe("reminderOffsets.before:15");
    expect(offset?.summary?.(0, t)).toBe("reminderOffsets.atTime");
  });

  it("group summaries join their key settings", () => {
    const prayerTimes = SETTINGS_GROUPS.find((g) => g.id === "prayer-times");
    if (!prayerTimes) throw new Error("missing");
    const text = groupSummary(prayerTimes, getSettingsSnapshot(), t, PHONE_IOS);
    expect(text).toContain("location.methods.MuslimWorldLeague");
    expect(text).toContain(" · ");
  });

  it("derived defaults resolve against the snapshot", () => {
    const def = getSetting("language.translation");
    if (!def) throw new Error("missing");
    expect(resolveDefault(def, getSettingsSnapshot())).toBe("en");
  });
});
