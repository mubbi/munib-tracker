import { differencesForDomain, FIQH_CUSTOM_BOUNDS, FIQH_DOMAINS } from "@munib-tracker/shared/fiqh";
import { act } from "@testing-library/react-native";

import { PreferencesRepository } from "@/db";
import { shouldCacheAudio, shouldCacheHadith } from "@/lib/cache-prefs";
import { LIBRARY_SECTIONS, orderLibrarySections } from "@/lib/library-menu";
import {
  defaultCurrencyCode,
  defaultNumberFormat,
  resolveDefaultCurrency,
} from "@/lib/money-defaults";
import { rescheduleAll } from "@/notifications/scheduler";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";
import {
  resetMockDeviceLocales,
  setMockDeviceLocales,
} from "@/test-support/mocks/expo-localization";
import { PHONE_ANDROID, PHONE_IOS, resetSettingsStores, TV, WEB } from "@/test-support/settings";

import {
  advancedCount,
  initialCustomValue,
  overrideChoiceOf,
  schoolDefaultFor,
  usedInRoute,
  whereThisApplies,
  withCustomValue,
  withOverride,
} from "./fiqh-settings";
import {
  INTERNAL_FIELDS,
  PENDING_REGISTRATION,
  PENDING_REGISTRATION_PREFIXES,
} from "./internal-fields";
import { getSetting, isSettingAvailable, isSettingEnabled, SETTINGS_REGISTRY } from "./registry";
import { resetSection } from "./reset";
import { markSetupReviewed, openSetupItem, pendingSetupItems } from "./setup-checklist";
import { getSettingsSnapshot } from "./snapshot";
import { writeSetting } from "./use-setting";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

const t = ((key: string, opts?: Record<string, unknown>) =>
  opts ? `${key}:${JSON.stringify(opts)}` : key) as never;

function def(id: string) {
  const found = getSetting(id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
}

const read = (id: string) => def(id).read(getSettingsSnapshot());

async function write(id: string, value: unknown) {
  await act(async () => {
    await writeSetting(def(id), value);
  });
}

beforeEach(async () => {
  await resetSettingsStores();
  jest.mocked(rescheduleAll).mockClear();
});

afterEach(resetMockDeviceLocales);

describe("wave-1 registration (coverage)", () => {
  const registered = new Set(SETTINGS_REGISTRY.flatMap((d) => d.fields ?? []));

  it.each([
    "prefs.madhhab",
    "prefs.madhhabOverrides",
    "prefs.fiqhCustom",
    "prefs.hijriAdjustment",
    "prefs.tasbeehAppearance",
    "prefs.libraryMenuOrder",
    "prefs.defaultCurrency",
    "prefs.defaultNumberFormat",
  ])("%s is registered and no longer pending", (field) => {
    expect(registered.has(field)).toBe(true);
    expect(PENDING_REGISTRATION).not.toContain(field);
    expect(field in INTERNAL_FIELDS).toBe(false);
  });

  it("has no pending families left (vault, tasbeeh)", () => {
    expect(PENDING_REGISTRATION_PREFIXES).toEqual([]);
  });

  it("device preferences are owned by device-scoped settings", () => {
    for (const field of [
      "device.hapticsEnabled",
      "device.cacheAudioLocally",
      "device.cacheQuranEditionsLocally",
      "device.cacheHadithLocally",
      "device.audioVolume",
      "device.preciseAdhan",
      "device.liveActivityEnabled",
      "device.ttsVoiceByLang",
    ]) {
      const owner = SETTINGS_REGISTRY.find((d) => d.fields?.includes(field));
      expect(owner?.scope).toBe("device");
    }
  });

  it("removed the B5 dead fields from the internal list", () => {
    for (const field of [
      "prefs.fontPrefs.global",
      "prefs.fontPrefs.titles",
      "prefs.fontPrefs.transliteration",
      "prefs.fontPrefs.color",
      "quran.script",
    ]) {
      expect(field in INTERNAL_FIELDS).toBe(false);
    }
  });
});

describe("device preferences settings (B4)", () => {
  it("haptics writes the device store, never the synced blob", async () => {
    await write("accessibility.haptics", false);
    expect(read("accessibility.haptics")).toBe(false);
    expect(devicePreferencesStore.getState().prefs.hapticsEnabled).toBe(false);
    expect((await PreferencesRepository.get()).hapticsEnabled).toBe(true);
    // Readers of the preferences store see the device value.
    expect(preferencesStore.getState().prefs.hapticsEnabled).toBe(false);
  });

  it("cache toggles are read by cache-prefs from the device store", async () => {
    await write("data.offline.cacheAudio", false);
    await write("data.offline.cacheHadith", false);
    expect(shouldCacheAudio()).toBe(false);
    expect(shouldCacheHadith()).toBe(false);
    expect((await PreferencesRepository.get()).cacheAudioLocally).toBe(true);
  });

  it("volume round-trips as a percentage on the device", async () => {
    await write("audio.volume", 40);
    expect(read("audio.volume")).toBe(40);
    expect(devicePreferencesStore.getState().prefs.audioVolume).toBe(0.4);
  });

  it("device voices reset to the system voice", async () => {
    await act(async () => {
      await devicePreferencesStore.getState().update({ ttsVoiceByLang: { en: "v1", ur: "v2" } });
    });
    expect(read("audio.deviceVoice")).toBe(2);
    await write("audio.deviceVoice", 0);
    expect(devicePreferencesStore.getState().prefs.ttsVoiceByLang).toEqual({});
  });

  it("live activity is a device value", async () => {
    await write("notifications.salah.liveActivity", true);
    expect(devicePreferencesStore.getState().prefs.liveActivityEnabled).toBe(true);
    expect(read("notifications.salah.liveActivity")).toBe(true);
  });
});

describe("Fiqh & madhhab", () => {
  it("My madhhab writes through the shared action and reschedules", async () => {
    expect(read("fiqh.madhhab")).toBeUndefined();
    await write("fiqh.madhhab", "hanafi");
    expect(preferencesStore.getState().prefs.madhhab).toBe("hanafi");
    expect(rescheduleAll).toHaveBeenCalled();
    expect(def("fiqh.madhhab").summary?.("hanafi", t)).toBe("fiqh.school.hanafi");
    expect(def("fiqh.madhhab").summary?.(null, t)).toBe("fiqh.allViews");
    // A school is never wiped by "Reset settings".
    expect(def("fiqh.madhhab").resettable).toBe(false);
  });

  it("advanced overrides + custom values round-trip and reset", async () => {
    await write("fiqh.advanced", {
      overrides: { zakat: "hanafi" },
      custom: { qasrDistanceKm: 80 },
    });
    expect(read("fiqh.advanced")).toEqual({
      overrides: { zakat: "hanafi" },
      custom: { qasrDistanceKm: 80 },
    });
    expect(def("fiqh.advanced").summary?.(read("fiqh.advanced"), t)).toContain("count");
    await act(async () => {
      await resetSection("fiqh", "settingsStep4.fiqh.advanced", PHONE_IOS);
    });
    expect(read("fiqh.advanced")).toEqual({ overrides: {}, custom: {} });
  });

  it("override choices: inherit removes the key, all views stores null", () => {
    expect(withOverride({ zakat: "hanafi" }, "zakat", "inherit")).toEqual({});
    expect(withOverride(undefined, "travel", "all")).toEqual({ travel: null });
    expect(overrideChoiceOf({ madhhabOverrides: { travel: null } }, "travel")).toBe("all");
    expect(overrideChoiceOf({ madhhabOverrides: { travel: "maliki" } }, "travel")).toBe("maliki");
    expect(overrideChoiceOf({}, "travel")).toBe("inherit");
  });

  it("custom values are bounded by FIQH_CUSTOM_BOUNDS (out of range is dropped, never clamped)", () => {
    expect(withCustomValue({}, "residencyDays", 15)).toEqual({ residencyDays: 15 });
    expect(withCustomValue({}, "residencyDays", FIQH_CUSTOM_BOUNDS.residencyDays.max + 1)).toEqual(
      {},
    );
    expect(withCustomValue({ haydMaxDays: 10 }, "haydMaxDays", undefined)).toEqual({});
    expect(withCustomValue({}, "nisabBasis", "silver")).toEqual({ nisabBasis: "silver" });
  });

  it("school default is null in all-views (never silently picks a school)", () => {
    expect(schoolDefaultFor({ madhhab: "hanafi" }, "qasrDistanceKm", "travel")).toBe(77);
    expect(schoolDefaultFor({ madhhab: null }, "qasrDistanceKm", "travel")).toBeNull();
    // A custom value doesn't change the shown school default.
    expect(
      schoolDefaultFor(
        { madhhab: "hanafi", fiqhCustom: { haydMaxDays: 12 } },
        "haydMaxDays",
        "taharah",
      ),
    ).toBe(10);
    const start = initialCustomValue({ madhhab: null }, "residencyDays", "travel");
    expect(start).toBeGreaterThanOrEqual(FIQH_CUSTOM_BOUNDS.residencyDays.min);
    expect(
      advancedCount({ madhhabOverrides: { zakat: null }, fiqhCustom: { residencyDays: 4 } }),
    ).toBe(2);
  });

  it("'Where this applies' lists every catalogued difference with a pushable route", () => {
    const groups = whereThisApplies();
    const listed = groups.flatMap((g) => g.items.map((i) => i.id));
    const expected = FIQH_DOMAINS.flatMap((d) => differencesForDomain(d)).map((d) => d.id);
    expect(listed.sort()).toEqual(expected.sort());
    for (const item of groups.flatMap((g) => g.items)) {
      expect(item.route.startsWith("/")).toBe(true);
      expect(item.route).not.toContain("#");
      expect(item.route).not.toContain("(tabs)");
    }
    expect(usedInRoute("/(tabs)/index#hero")).toBe("/");
    expect(usedInRoute("/(tabs)/tracker#witr")).toBe("/tracker");
    expect(usedInRoute("/travel#qasr")).toBe("/travel");
  });
});

describe("Language & region", () => {
  it("Hijri date adjustment round-trips and summarises", async () => {
    await write("language.hijriAdjustment", { offsetDays: 1, updatedAt: "2026-11-23T00:00:00Z" });
    expect(preferencesStore.getState().prefs.hijriAdjustment?.offsetDays).toBe(1);
    // The hijri actions reschedule themselves — no second declared reschedule.
    expect(def("language.hijriAdjustment").sideEffects).toBeUndefined();
    expect(rescheduleAll).toHaveBeenCalledTimes(1);
    const summary = def("language.hijriAdjustment").summary;
    expect(summary?.(undefined, t)).toBe("settingsStep4.hijri.none");
    expect(summary?.({ offsetDays: -1, updatedAt: "" }, t)).toContain('"value":"-1"');
  });

  it("default currency falls back to the device region, then USD", async () => {
    setMockDeviceLocales([{ languageCode: "en", currencyCode: "GBP" }]);
    expect(read("language.defaultCurrency")).toBe("GBP");
    expect(defaultCurrencyCode()).toBe("GBP");
    await write("language.defaultCurrency", "pkr");
    expect(read("language.defaultCurrency")).toBe("PKR");
    expect(defaultCurrencyCode()).toBe("PKR");
    expect(resolveDefaultCurrency("NOPE", "USD")).toBe("USD");
  });

  it("default number format seeds new drafts", async () => {
    expect(defaultNumberFormat()).toBe("comma_dot");
    await write("language.defaultNumberFormat", "dot_comma");
    expect(read("language.defaultNumberFormat")).toBe("dot_comma");
    expect(defaultNumberFormat()).toBe("dot_comma");
  });
});

describe("Appearance › Library order (D13)", () => {
  it("round-trips and resets to the default order", async () => {
    await write("appearance.libraryOrder", ["learn", "read"]);
    expect(read("appearance.libraryOrder")).toEqual(["learn", "read"]);
    await act(async () => {
      await resetSection("appearance", "settingsPanel.section.home", PHONE_IOS);
    });
    expect(read("appearance.libraryOrder")).toBeUndefined();
  });

  it("drops unknown ids and appends sections the saved order doesn't know", () => {
    const ids = orderLibrarySections(LIBRARY_SECTIONS, ["learn", "gone", "read", "learn"]).map(
      (s) => s.id,
    );
    expect(ids.slice(0, 2)).toEqual(["learn", "read"]);
    expect(ids).toHaveLength(LIBRARY_SECTIONS.length);
    expect(new Set(ids).size).toBe(LIBRARY_SECTIONS.length);
    expect(orderLibrarySections(LIBRARY_SECTIONS, undefined)).toEqual(LIBRARY_SECTIONS);
  });
});

describe("Tasbeeh counter", () => {
  it("design round-trips through updateTasbeehAppearance", async () => {
    expect(read("content.tasbeeh.design")).toBe("ring");
    await write("content.tasbeeh.design", "misbaha");
    expect(read("content.tasbeeh.design")).toBe("misbaha");
    expect(isSettingEnabled(def("content.tasbeeh.misbaha.shape"), getSettingsSnapshot())).toBe(
      true,
    );
    expect(isSettingEnabled(def("content.tasbeeh.clicker.backlight"), getSettingsSnapshot())).toBe(
      false,
    );
    await write("content.tasbeeh.misbaha.shape", "olive");
    expect(read("content.tasbeeh.misbaha.shape")).toBe("olive");
  });

  it("a preset keeps the strand; the tassel colour only applies to a silk tassel", async () => {
    await write("content.tasbeeh.design", "misbaha");
    await write("content.tasbeeh.misbaha.strand", 99);
    await write("content.tasbeeh.misbaha.preset", "turquoise");
    expect(read("content.tasbeeh.misbaha.strand")).toBe(99);
    expect(read("content.tasbeeh.misbaha.material")).toBe("turquoise");
    const tasselColor = def("content.tasbeeh.misbaha.tasselColor");
    expect(isSettingEnabled(tasselColor, getSettingsSnapshot())).toBe(true);
    await write("content.tasbeeh.misbaha.tassel", "chain");
    expect(isSettingEnabled(tasselColor, getSettingsSnapshot())).toBe(false);
  });

  it("changing the pack or volume keeps sound.enabled unset (D16)", async () => {
    await write("content.tasbeeh.sound.pack", "stone");
    await write("content.tasbeeh.sound.volume", 30);
    const sound = preferencesStore.getState().prefs.tasbeehAppearance?.sound;
    expect(sound).toMatchObject({ pack: "stone", volume: 0.3 });
    expect(sound).not.toHaveProperty("enabled");
    await write("content.tasbeeh.sound.enabled", true);
    expect(preferencesStore.getState().prefs.tasbeehAppearance?.sound.enabled).toBe(true);
  });

  it("section reset clears the whole appearance back to Ring", async () => {
    await write("content.tasbeeh.design", "clicker");
    await act(async () => {
      await resetSection("content", "settingsStep4.tasbeeh.section", PHONE_IOS);
    });
    expect(preferencesStore.getState().prefs.tasbeehAppearance).toBeUndefined();
  });

  it("respects availability (haptics native-only, layout never on TV)", () => {
    expect(isSettingAvailable(def("content.tasbeeh.haptics"), PHONE_ANDROID)).toBe(true);
    expect(isSettingAvailable(def("content.tasbeeh.haptics"), WEB)).toBe(false);
    expect(isSettingAvailable(def("content.tasbeeh.haptics"), TV)).toBe(false);
    expect(isSettingAvailable(def("content.tasbeeh.misbaha.layout"), TV)).toBe(false);
    expect(def("content.tasbeeh.design").listed).toBe(false);
    expect(def("content.tasbeeh.appearance").control.kind).toBe("custom");
  });
});

describe("Privacy › Private journals + biometric unlock", () => {
  it("vault rows are hidden on TV, biometric unlock is phone/tablet only", () => {
    for (const id of [
      "privacy.vault.lockJournals",
      "privacy.vault.sync",
      "privacy.vault.credentials",
    ]) {
      expect(isSettingAvailable(def(id), TV)).toBe(false);
      expect(isSettingAvailable(def(id), PHONE_IOS)).toBe(true);
      expect(def(id).section).toBe("vault.settings.sectionTitle");
    }
    expect(isSettingAvailable(def("privacy.biometricUnlock"), PHONE_ANDROID)).toBe(true);
    expect(isSettingAvailable(def("privacy.biometricUnlock"), WEB)).toBe(false);
    expect(def("privacy.vault.lockJournals").scope).toBe("device");
  });
});

describe("Help › Run setup again", () => {
  it("re-opens the setup wizard without resetting anything", () => {
    const control = def("about.runSetup").control;
    expect(control).toEqual({ kind: "link", href: "/setup" });
    expect(def("about.runSetup").resettable).toBe(false);
  });
});

describe("Finish setting up", () => {
  it("lists madhhab, language and method until decided / reviewed", async () => {
    const ids = () => pendingSetupItems(getSettingsSnapshot(), PHONE_IOS).map((i) => i.id);
    expect(ids()).toEqual(expect.arrayContaining(["madhhab", "language", "method"]));
    await write("fiqh.madhhab", null);
    await act(async () => {
      await markSetupReviewed("language");
      await openSetupItem("method");
    });
    expect(ids()).not.toEqual(expect.arrayContaining(["madhhab"]));
    expect(ids()).not.toContain("language");
    expect(ids()).not.toContain("method");
  });

  it("changing the calculation method marks it reviewed", async () => {
    await write("prayer-times.method", "Karachi");
    expect(devicePreferencesStore.getState().prefs.methodReviewedAt).toEqual(expect.any(String));
  });
});
