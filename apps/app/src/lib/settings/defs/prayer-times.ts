import {
  clampWalkMinutes,
  MASJID_WALK_MINUTES_MAX,
  MASJID_WALK_MINUTES_MIN,
} from "@munib-tracker/shared/masjid";
import type { Href } from "expo-router";
import type { TFunction } from "i18next";

import { DEFAULT_LOCATION } from "@/lib/location";
import {
  CALCULATION_METHOD_KEYS,
  type CalculationMethodKey,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_HIGH_LATITUDE_RULE,
  DEFAULT_MADHAB,
  HIGH_LATITUDE_RULE_KEYS,
  type HighLatitudeRuleKey,
  type MadhabKey,
  type PrayerSlotId,
} from "@/lib/prayer-times";
import { locationStore } from "@/stores/location-store";

import { editor } from "../editors";
import { markSetupReviewed } from "../setup-checklist";
import { type AnySettingDef, defineSetting, type SettingDef } from "../types";
import { NO_VALUE, updatePrefs } from "./helpers";

const LocationPicker = editor("LocationPicker");
const AsrMismatchHint = editor("AsrMismatchHint");
const MethodSuggestionHint = editor("MethodSuggestionHint");

const G = "prayer-times" as const;
const HOME_MASJID = "settingsPanel.section.homeMasjid";
const OFFSET_SLOTS: PrayerSlotId[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

const formatOffset = (v: number, t: TFunction): string =>
  v === 0
    ? t("prayerTuning.onTime")
    : v < 0
      ? t("prayerTuning.earlierMin", { count: Math.abs(v) })
      : t("prayerTuning.laterMin", { count: v });

function masjidOffset(slot: PrayerSlotId): SettingDef<number> {
  return {
    id: `prayer-times.offset.${slot}`,
    group: G,
    section: "prayerTuning.offsetTitle",
    titleKey: `prayers.${slot}`,
    keywordsKey: "settingsPanel.kw.masjidOffset",
    // Location (and so its offsets) is device-specific and never synced.
    scope: "device",
    control: {
      kind: "stepper",
      min: -20,
      max: 20,
      step: 1,
      format: (v, t) => formatOffset(v, t),
    },
    read: (s) => s.location.prayerAdjustments?.[slot] ?? 0,
    write: (v) =>
      locationStore.getState().setPrayerAdjustment(slot, Math.max(-20, Math.min(20, v))),
    defaultValue: 0,
    summary: (v, t) => formatOffset(v, t),
    sideEffects: ["refresh-prayer-times", "reschedule-reminders"],
    fields: ["location.prayerAdjustments"],
  };
}

export const PRAYER_TIMES_SETTINGS: AnySettingDef[] = [
  defineSetting<string>({
    id: "prayer-times.location",
    group: G,
    section: "settingsPanel.section.location",
    titleKey: "location.currentTitle",
    keywordsKey: "settingsPanel.kw.location",
    scope: "device",
    control: { kind: "custom", Component: LocationPicker },
    read: (s) => s.location.label,
    write: async () => {},
    defaultValue: DEFAULT_LOCATION.label,
    // Never "reset" someone back to Makkah.
    resettable: false,
    summary: (v) => v,
    shortcuts: ["/", "/qibla", "/(onboarding)/setup"],
    fields: [
      "location.latitude",
      "location.longitude",
      "location.label",
      "location.city",
      "location.country",
      "location.source",
      "location.timeZone",
      "location.countryCode",
    ],
  }),
  defineSetting<CalculationMethodKey>({
    id: "prayer-times.method",
    group: G,
    section: "location.calculationTitle",
    titleKey: "location.method",
    subtitleKey: "location.methodHint",
    keywordsKey: "settingsPanel.kw.calculation",
    scope: "device",
    control: {
      kind: "choice",
      presentation: "sheet",
      options: CALCULATION_METHOD_KEYS.map((key) => ({
        value: key,
        labelKey: `location.methods.${key}`,
        descriptionKey: `location.methodHints.${key}`,
      })),
    },
    read: (s) => s.location.method,
    write: async (v) => {
      await locationStore.getState().setMethod(v);
      await markSetupReviewed("method");
    },
    defaultValue: DEFAULT_CALCULATION_METHOD,
    summary: (v, t) => t(`location.methods.${v}`),
    sideEffects: ["refresh-prayer-times", "reschedule-reminders"],
    fields: ["location.method"],
  }),
  // One-tap suggestion of the usual method for the user's country, shown only
  // while it differs from the current method (never applied automatically).
  defineSetting<null>({
    ...NO_VALUE,
    id: "prayer-times.methodSuggestion",
    group: G,
    section: "location.calculationTitle",
    titleKey: "prayerMethodSuggestion.searchTitle",
    keywordsKey: "settingsPanel.kw.calculation",
    scope: "device",
    control: { kind: "custom", Component: MethodSuggestionHint },
    shortcuts: ["/(onboarding)/setup"],
  }),
  defineSetting<MadhabKey>({
    id: "prayer-times.asr",
    group: G,
    section: "location.calculationTitle",
    titleKey: "location.madhab",
    subtitleKey: "location.madhabHint",
    keywordsKey: "settingsPanel.kw.asr",
    scope: "device",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "shafi", labelKey: "location.madhabShafi" },
        { value: "hanafi", labelKey: "location.madhabHanafi" },
      ],
    },
    read: (s) => s.location.madhab,
    write: (v) => locationStore.getState().setMadhab(v),
    defaultValue: DEFAULT_MADHAB,
    summary: (v, t) => t(v === "hanafi" ? "location.madhabHanafi" : "location.madhabShafi"),
    sideEffects: ["refresh-prayer-times", "reschedule-reminders"],
    fields: ["location.madhab"],
  }),
  // NF-3.0a §4.1.1: neutral hint right under the Asr selector when "My madhhab"
  // defaults to the other Asr calculation (renders nothing otherwise).
  defineSetting<null>({
    ...NO_VALUE,
    id: "prayer-times.asrMadhhabHint",
    group: G,
    section: "location.calculationTitle",
    titleKey: "settingsIntegration.asrHintTitle",
    scope: "device",
    control: { kind: "custom", Component: AsrMismatchHint },
  }),
  defineSetting<HighLatitudeRuleKey>({
    id: "prayer-times.highLatitudeRule",
    group: G,
    section: "location.calculationTitle",
    titleKey: "prayerTuning.highLatTitle",
    subtitleKey: "prayerTuning.highLatHint",
    keywordsKey: "settingsPanel.kw.highLatitude",
    scope: "device",
    // Rarely changed, long descriptions: a row with the current rule opens the list.
    control: {
      kind: "choice",
      presentation: "sheet",
      options: HIGH_LATITUDE_RULE_KEYS.map((rule) => ({
        value: rule,
        labelKey: `prayerTuning.rule.${rule}`,
        descriptionKey: `prayerTuning.ruleDesc.${rule}`,
      })),
    },
    read: (s) => s.location.highLatitudeRule ?? DEFAULT_HIGH_LATITUDE_RULE,
    write: (v) => locationStore.getState().setHighLatitudeRule(v),
    defaultValue: DEFAULT_HIGH_LATITUDE_RULE,
    summary: (v, t) => t(`prayerTuning.rule.${v}`),
    sideEffects: ["refresh-prayer-times", "reschedule-reminders"],
    fields: ["location.highLatitudeRule"],
  }),
  // B3: Sunrise is now tunable too (it ends Fajr and drives Ishraq / Duha).
  ...OFFSET_SLOTS.map(masjidOffset),
  // NF-3.11 Home masjid (finder, your private iqamah times, walk minutes).
  // NF-3.12 adds its timetable-import row to this section.
  defineSetting<string | null>({
    id: "prayer-times.homeMasjid",
    group: G,
    section: HOME_MASJID,
    titleKey: "masjids.homeTitle",
    subtitleKey: "masjids.settings.homeSub",
    keywordsKey: "settingsPanel.kw.masjidFinder",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
    // The selection syncs with the preferences blob.
    scope: "account",
    control: { kind: "link", href: "/masjids" as Href },
    read: (s) => s.prefs.homeMasjid?.name ?? (s.prefs.homeMasjid ? "" : null),
    // Chosen on the finder screen (`setHomeMasjid`), never from a settings row.
    write: async () => {},
    defaultValue: null,
    resettable: false,
    summary: (v, t) => (v == null ? t("masjids.settings.none") : v || t("masjids.unnamed")),
    shortcuts: ["/masjids", "/masjids/[osmType]/[osmId]"],
    fields: ["prefs.homeMasjid"],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "prayer-times.homeMasjidTimes",
    group: G,
    section: HOME_MASJID,
    titleKey: "masjids.yourTimes",
    subtitleKey: "masjids.settings.yourTimesSub",
    keywordsKey: "settingsPanel.kw.masjidFinder",
    scope: "account",
    control: { kind: "link", href: "/masjids/times" as Href },
    enabledWhen: (s) => !!s.prefs.homeMasjid,
  }),
  defineSetting<number>({
    id: "prayer-times.masjidWalkMinutes",
    group: G,
    section: HOME_MASJID,
    titleKey: "masjids.reminder.walkLabel",
    subtitleKey: "masjids.settings.walkSub",
    keywordsKey: "settingsPanel.kw.masjidFinder",
    scope: "account",
    control: {
      kind: "stepper",
      min: MASJID_WALK_MINUTES_MIN,
      max: MASJID_WALK_MINUTES_MAX,
      step: 5,
      format: (v, t) => t("masjids.settings.minutes", { minutes: v }),
    },
    read: (s) => clampWalkMinutes(s.prefs.masjidWalkMinutes),
    write: (v) => updatePrefs({ masjidWalkMinutes: clampWalkMinutes(v) }),
    defaultValue: clampWalkMinutes(undefined),
    enabledWhen: (s) => !!s.prefs.homeMasjid,
    summary: (v, t) => t("masjids.settings.minutes", { minutes: v }),
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/masjids/times"],
    fields: ["prefs.masjidWalkMinutes"],
  }),
];
