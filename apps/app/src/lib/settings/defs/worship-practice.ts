import { RAWATIB_EXTRA_PRAYERS } from "@munib-tracker/shared/constants";
import {
  DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS,
  DEFAULT_VOLUNTARY_FASTING_PREFS,
  type RawatibExtraPrayer,
  type RawatibPreset,
  type VoluntaryFastingNotificationPrefs,
  type VoluntaryFastingPrefs,
  type VoluntaryFastKind,
} from "@munib-tracker/shared/types";
import {
  COACH_DEFAULT_WEEKDAY,
  getLocalDateString,
  isWitrQazaEnabled,
  normalizeCoachWeekday,
  resolveRawatibConfig,
  sanitizeRawatibPreferences,
  witrQazaDefault,
} from "@munib-tracker/shared/utils";
import type { TFunction } from "i18next";

import { setWitrQazaPreference, startRawatib, updateRawatibPreferences } from "@/lib/rawatib";
import { isPilgrimThisSeason, pilgrimPrefsPatch } from "@/lib/voluntary-fasting/pilgrim";
import {
  type FastingIntentTime,
  intentTimeChoice,
  resolveFastingNotificationPrefs,
  resolveVoluntaryFastingPrefs,
} from "@/lib/voluntary-fasting/prefs";
import { preferencesStore } from "@/stores/preferences-store";

import { editor } from "../editors";
import { notOnTv } from "../platform";
import {
  type AnySettingDef,
  defineSetting,
  type SettingDef,
  type SettingsSnapshot,
} from "../types";
import { notificationToggle, onOff, setNotificationPrefs, updatePrefs } from "./helpers";

/**
 * Wave-2 worship settings registered by the integration pass (NF-3.1 rawatib +
 * Witr qaza retrofit, NF-3.2 voluntary fasting, NF-3.3 / 3.5 / 3.8 / 3.9
 * reminders, NF-3.6 / 3.7 personal reminders). Every write wraps the feature's own action so the in-screen
 * controls (rawatib hub, fasting hub) and these rows share one path.
 */

const FastingKindsEditor = editor("FastingKindsEditor");
const FastingIntentTimeEditor = editor("FastingIntentTimeEditor");

const RAWATIB = "settingsIntegration.section.rawatib";
const FASTING = "settingsIntegration.section.fasting";
const REMINDERS_FASTING = "settingsIntegration.section.remindersFasting";
const SUNNAH = "settingsIntegration.section.sunnah";
const SEASONAL = "settingsIntegration.section.seasonal";
const PERSONAL = "settingsIntegration.section.personal";

const masterOn = (s: SettingsSnapshot) => s.prefs.notificationPrefs.masterEnabled;
const sunnahOn = (s: SettingsSnapshot) => masterOn(s) && s.prefs.notificationPrefs.sunnahPrayer;

// ── Rawatib ────────────────────────────────────────────────────────────────

const rawatibConfig = (s: SettingsSnapshot) => resolveRawatibConfig(s.prefs);
const currentRawatibConfig = () => resolveRawatibConfig(preferencesStore.getState().prefs);
const rawatibOn = (s: SettingsSnapshot) => rawatibConfig(s).enabled;

/** "Follow my madhhab" or an explicit daily set. */
export type RawatibPresetChoice = "school" | RawatibPreset;

function rawatibExtra(id: RawatibExtraPrayer): SettingDef<boolean> {
  return {
    id: `fiqh.rawatib.extra.${id}`,
    group: "fiqh",
    section: RAWATIB,
    titleKey: `prayers.${id}`,
    subtitleKey: "settingsIntegration.rawatib.extraSub",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => rawatibConfig(s).extras.includes(id),
    write: (on) => updateRawatibPreferences(currentRawatibConfig(), { extra: id, on }),
    defaultValue: false,
    enabledWhen: rawatibOn,
    summary: onOff,
    shortcuts: ["/rawatib"],
    fields: ["prefs.rawatib"],
  };
}

/** Fiqh & madhhab › Rawatib (§4.5.8): tracking, daily set, extras, Witr qaza. */
export const RAWATIB_FIQH_SETTINGS: AnySettingDef[] = [
  defineSetting<boolean>({
    id: "fiqh.rawatib.enabled",
    group: "fiqh",
    section: RAWATIB,
    titleKey: "rawatib.hub.enabled",
    subtitleKey: "settingsIntegration.rawatib.enabledSub",
    icon: { ios: "sun.horizon.fill", android: "wb_twilight", web: "wb_twilight" },
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => rawatibConfig(s).enabled,
    write: async (v) => {
      const config = currentRawatibConfig();
      // Same as the hub: the first "on" with nothing stored starts with the preset.
      if (v && config.needsChoice) await startRawatib(config.preset);
      else await updateRawatibPreferences(config, { enabled: v });
    },
    defaultValue: (s) => resolveRawatibConfig({ ...s.prefs, rawatib: undefined }).enabled,
    summary: onOff,
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/rawatib", "/(tabs)/tracker"],
    fields: ["prefs.rawatib"],
  }),
  defineSetting<RawatibPresetChoice>({
    id: "fiqh.rawatib.preset",
    group: "fiqh",
    section: RAWATIB,
    titleKey: "rawatib.hub.presetTitle",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "school", labelKey: "settingsStep4.fiqh.followMine" },
        { value: 12, labelKey: "settingsIntegration.rawatib.preset12" },
        { value: 10, labelKey: "settingsIntegration.rawatib.preset10" },
      ],
    },
    read: (s) => sanitizeRawatibPreferences(s.prefs.rawatib)?.preset ?? "school",
    write: (v) =>
      updateRawatibPreferences(currentRawatibConfig(), { preset: v === "school" ? null : v }),
    defaultValue: "school",
    enabledWhen: rawatibOn,
    summary: (v, t) =>
      v === "school"
        ? t("settingsStep4.fiqh.followMine")
        : t(`settingsIntegration.rawatib.preset${v}`),
    shortcuts: ["/rawatib"],
    fields: ["prefs.rawatib"],
  }),
  ...RAWATIB_EXTRA_PRAYERS.map(rawatibExtra),
  defineSetting<boolean>({
    id: "fiqh.witr.qaza",
    group: "fiqh",
    section: RAWATIB,
    titleKey: "rawatib.witr.qazaToggle",
    subtitleKey: "settingsIntegration.witrQazaSub",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => isWitrQazaEnabled(s.prefs),
    write: (v) => {
      const schoolDefault = witrQazaDefault(preferencesStore.getState().prefs);
      // Matching the school default clears the explicit choice (follows the madhhab again).
      return setWitrQazaPreference(v === schoolDefault ? null : v);
    },
    defaultValue: (s) => witrQazaDefault(s.prefs),
    summary: onOff,
    shortcuts: ["/(tabs)/tracker"],
    fields: ["prefs.witrQaza"],
  }),
];

// ── Voluntary fasting ──────────────────────────────────────────────────────

const fastingPrefs = (s: SettingsSnapshot) =>
  resolveVoluntaryFastingPrefs(s.prefs.voluntaryFasting);

function writeFastingPrefs(patch: Partial<VoluntaryFastingPrefs>): Promise<void> {
  const current = resolveVoluntaryFastingPrefs(preferencesStore.getState().prefs.voluntaryFasting);
  return updatePrefs({ voluntaryFasting: { ...current, ...patch } });
}

function writeFastingAlerts(patch: Partial<VoluntaryFastingNotificationPrefs>): Promise<void> {
  const current = resolveFastingNotificationPrefs(
    preferencesStore.getState().prefs.notificationPrefs,
  );
  return setNotificationPrefs({ voluntaryFasting: { ...current, ...patch } });
}

function fastingToggle(
  def: Pick<SettingDef<boolean>, "id" | "group" | "section" | "titleKey" | "subtitleKey"> & {
    read: (s: SettingsSnapshot) => boolean;
    write: (v: boolean) => Promise<void>;
    defaultValue: boolean;
    reminder?: boolean;
    fields: string[];
  },
): SettingDef<boolean> {
  const { reminder, ...rest } = def;
  return {
    ...rest,
    scope: "account",
    control: { kind: "toggle" },
    enabledWhen: reminder ? masterOn : undefined,
    summary: onOff,
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/fasting"],
  };
}

/** Fiqh & madhhab › Voluntary fasting (which fasts I follow, Dawud, pilgrim). */
export const FASTING_FIQH_SETTINGS: AnySettingDef[] = [
  defineSetting<VoluntaryFastKind[]>({
    id: "fiqh.fasting.kinds",
    group: "fiqh",
    section: FASTING,
    titleKey: "voluntaryFasting.settings.title",
    subtitleKey: "voluntaryFasting.settings.kindsHint",
    scope: "account",
    control: { kind: "custom", Component: FastingKindsEditor },
    read: (s) => fastingPrefs(s).enabledKinds,
    write: (v) => writeFastingPrefs({ enabledKinds: v }),
    defaultValue: [...DEFAULT_VOLUNTARY_FASTING_PREFS.enabledKinds],
    summary: (v, t) => t("settingsIntegration.fasting.kindsCount", { count: v.length }),
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/fasting"],
    fields: ["prefs.voluntaryFasting"],
  }),
  fastingToggle({
    id: "fiqh.fasting.dawud",
    group: "fiqh",
    section: FASTING,
    titleKey: "voluntaryFasting.settings.dawud",
    subtitleKey: "voluntaryFasting.settings.dawudHint",
    read: (s) => fastingPrefs(s).dawudMode != null,
    write: (on) =>
      writeFastingPrefs({ dawudMode: on ? { startDate: getLocalDateString() } : null }),
    defaultValue: DEFAULT_VOLUNTARY_FASTING_PREFS.dawudMode != null,
    fields: ["prefs.voluntaryFasting"],
  }),
  fastingToggle({
    id: "fiqh.fasting.pilgrim",
    group: "fiqh",
    section: FASTING,
    titleKey: "voluntaryFasting.settings.pilgrim",
    subtitleKey: "voluntaryFasting.settings.pilgrimSeasonHint",
    // Scoped to one Hijri year: reads off again after that Dhul-Hijjah's 13th.
    read: (s) => isPilgrimThisSeason(s.prefs.voluntaryFasting),
    write: (on) => writeFastingPrefs(pilgrimPrefsPatch(on)),
    defaultValue: DEFAULT_VOLUNTARY_FASTING_PREFS.isPilgrimThisYear === true,
    fields: ["prefs.voluntaryFasting"],
  }),
];

function intentSummary(v: FastingIntentTime, t: TFunction): string {
  return v === "isha+30" ? t("voluntaryFasting.settings.afterIsha") : v;
}

/** Reminders & notifications › Fasting. */
const FASTING_REMINDER_SETTINGS: AnySettingDef[] = [
  fastingToggle({
    id: "notifications.fasting.seasonal",
    group: "notifications",
    section: REMINDERS_FASTING,
    titleKey: "voluntaryFasting.settings.seasonal",
    subtitleKey: "voluntaryFasting.settings.seasonalHint",
    read: (s) => resolveFastingNotificationPrefs(s.prefs.notificationPrefs).seasonal,
    write: (on) => writeFastingAlerts({ seasonal: on }),
    defaultValue: DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS.seasonal,
    reminder: true,
    fields: ["prefs.notificationPrefs.voluntaryFasting"],
  }),
  fastingToggle({
    id: "notifications.fasting.weekly",
    group: "notifications",
    section: REMINDERS_FASTING,
    titleKey: "voluntaryFasting.settings.weekly",
    subtitleKey: "voluntaryFasting.settings.weeklyHint",
    read: (s) => resolveFastingNotificationPrefs(s.prefs.notificationPrefs).weekly,
    write: (on) => writeFastingAlerts({ weekly: on }),
    defaultValue: DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS.weekly,
    reminder: true,
    fields: ["prefs.notificationPrefs.voluntaryFasting"],
  }),
  fastingToggle({
    id: "notifications.fasting.suhoor",
    group: "notifications",
    section: REMINDERS_FASTING,
    titleKey: "voluntaryFasting.settings.suhoor",
    subtitleKey: "voluntaryFasting.settings.suhoorHint",
    read: (s) => fastingPrefs(s).suhoorAlarm,
    write: (on) => writeFastingPrefs({ suhoorAlarm: on }),
    defaultValue: DEFAULT_VOLUNTARY_FASTING_PREFS.suhoorAlarm,
    reminder: true,
    fields: ["prefs.voluntaryFasting"],
  }),
  defineSetting<FastingIntentTime>({
    id: "notifications.fasting.intentTime",
    group: "notifications",
    section: REMINDERS_FASTING,
    titleKey: "voluntaryFasting.settings.intentTime",
    scope: "account",
    control: { kind: "custom", Component: FastingIntentTimeEditor },
    read: (s) => intentTimeChoice(fastingPrefs(s).intentReminderTime),
    write: (v) => writeFastingPrefs({ intentReminderTime: v }),
    defaultValue: intentTimeChoice(DEFAULT_VOLUNTARY_FASTING_PREFS.intentReminderTime),
    enabledWhen: masterOn,
    summary: intentSummary,
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/fasting"],
    fields: ["prefs.voluntaryFasting"],
  }),
];

/** Reminders & notifications › Sunnah / Seasonal / Personal (+ Fasting above). */
export const WORSHIP_REMINDER_SETTINGS: AnySettingDef[] = [
  ...FASTING_REMINDER_SETTINGS,
  notificationToggle({
    id: "notifications.sunnah.rawatibNudge",
    section: SUNNAH,
    titleKey: "rawatib.hub.nudge",
    subtitleKey: "rawatib.hub.nudgeHint",
    key: "rawatibNudge",
    fallback: false,
    enabledWhen: (s) => sunnahOn(s) && rawatibOn(s),
    shortcuts: ["/rawatib"],
  }),
  notificationToggle({
    id: "notifications.sunnah.habits",
    section: SUNNAH,
    titleKey: "sunnahHabits.reminderToggle",
    subtitleKey: "sunnahHabits.reminderToggleHint",
    key: "habits",
    fallback: false,
    shortcuts: ["/habits"],
  }),
  notificationToggle({
    id: "notifications.seasonal.dhulHijjah",
    section: SEASONAL,
    titleKey: "dhulHijjah.reminders.seasonal",
    subtitleKey: "dhulHijjah.reminders.seasonalHint",
    key: "dhulHijjah",
    fallback: true,
    shortcuts: ["/dhul-hijjah"],
  }),
  notificationToggle({
    id: "notifications.seasonal.takbirTashriq",
    section: SEASONAL,
    titleKey: "dhulHijjah.reminders.takbir",
    subtitleKey: "dhulHijjah.reminders.takbirHint",
    key: "takbirTashriq",
    fallback: false,
    shortcuts: ["/dhul-hijjah"],
  }),
  notificationToggle({
    id: "notifications.personal.debts",
    section: PERSONAL,
    titleKey: "settingsIntegration.debts",
    subtitleKey: "settingsIntegration.debtsSub",
    key: "debts",
    fallback: true,
    shortcuts: ["/debts"],
  }),
  notificationToggle({
    id: "notifications.personal.wasiyyahReview",
    section: PERSONAL,
    titleKey: "settingsIntegration.wasiyyahReview",
    subtitleKey: "settingsIntegration.wasiyyahReviewSub",
    key: "wasiyyahReview",
    fallback: true,
    shortcuts: ["/wasiyyah"],
  }),
  notificationToggle({
    id: "notifications.personal.muhasabah",
    section: PERSONAL,
    titleKey: "muhasabah.notif.title",
    subtitleKey: "muhasabah.settings.reminderToggle",
    key: "muhasabah",
    fallback: false,
    shortcuts: ["/muhasabah/settings"],
  }),
  notificationToggle({
    id: "notifications.personal.familyTies",
    section: PERSONAL,
    titleKey: "familyTies.notif.digestTitle",
    subtitleKey: "familyTies.digestToggle",
    // Unset ⇒ on; the digest only fires once at least one relative is added.
    key: "familyTies",
    fallback: true,
    shortcuts: ["/family-ties"],
  }),
  notificationToggle({
    id: "notifications.personal.coach",
    section: PERSONAL,
    titleKey: "coach.settings.notifToggle",
    subtitleKey: "coach.settings.notifHint",
    keywordsKey: "coach.searchKeywords",
    // Unset ⇒ on; paused while excused and skipped when nothing was tracked recently.
    key: "coach",
    fallback: true,
    shortcuts: ["/coach"],
  }),
  defineSetting<number>({
    id: "notifications.personal.coachWeekday",
    group: "notifications",
    section: PERSONAL,
    titleKey: "coach.settings.day",
    subtitleKey: "coach.settings.dayHint",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "sheet",
      options: [0, 1, 2, 3, 4, 5, 6].map((value) => ({
        value,
        labelKey: `coach.weekday.${value}`,
      })),
    },
    read: (s) => normalizeCoachWeekday(s.prefs.coachWeekday),
    write: (v) => updatePrefs({ coachWeekday: normalizeCoachWeekday(v) }),
    defaultValue: COACH_DEFAULT_WEEKDAY,
    summary: (v, t) => t(`coach.weekday.${normalizeCoachWeekday(v)}`),
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/coach"],
    fields: ["prefs.coachWeekday"],
  }),
].map((def) => ({ available: notOnTv, ...def }));
