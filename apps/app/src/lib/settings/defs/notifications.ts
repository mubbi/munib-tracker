import {
  clampPrayerReminderOffset,
  OBLIGATORY_PRAYERS,
  PRAYER_REMINDER_OFFSET_MAX,
  PRAYER_REMINDER_OFFSET_MIN,
  WITR_PRAYER,
} from "@munib-tracker/shared/constants";
import { rulesFor } from "@munib-tracker/shared/fiqh/core";
import type { PrayerId } from "@munib-tracker/shared/types";

import { DEFAULT_ADHAN_STYLE } from "@/lib/adhan-audio";
import { requestExactAlarmPermission } from "@/lib/notifications/exact-alarm";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { setDevicePreferences } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";

import { editor } from "../editors";
import { nativeOnly, notOnTv } from "../platform";
import {
  type AnySettingDef,
  defineSetting,
  type SettingDef,
  type SettingsSnapshot,
} from "../types";
import { NO_VALUE, notificationToggle, onOff, updatePrefs } from "./helpers";
import { WORSHIP_REMINDER_SETTINGS } from "./worship-practice";

const AdhanStyleControl = editor("AdhanStyleControl");
const AdhanPreviewRow = editor("AdhanPreviewRow");
const NotificationsMasterControl = editor("NotificationsMasterControl");
const UpcomingRemindersPreview = editor("UpcomingRemindersPreview");

const G = "notifications" as const;
const masterOn = (s: SettingsSnapshot) => s.prefs.notificationPrefs.masterEnabled;
const obligatoryOn = (s: SettingsSnapshot) => masterOn(s) && s.prefs.notificationPrefs.prayer;
const sunnahOn = (s: SettingsSnapshot) => masterOn(s) && s.prefs.notificationPrefs.sunnahPrayer;

const BELL = { ios: "bell.fill", android: "notifications", web: "notifications" } as const;

function prayerAlert(
  prayerId: PrayerId,
  section: string,
  enabledWhen: (s: SettingsSnapshot) => boolean,
): SettingDef<boolean> {
  return {
    id: `notifications.salah.alert.${prayerId}`,
    group: G,
    section,
    titleKey: `prayers.${prayerId}`,
    subtitleKey: `notif.prayerAlertItems.${prayerId}.subtitle`,
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => isPrayerAlertEnabled(s.prefs, prayerId),
    write: (v) => preferencesStore.getState().setPrayerAlert(prayerId, v),
    // Default = no per-prayer override → follows the category toggle.
    defaultValue: (s) => isPrayerAlertEnabled({ ...s.prefs, prayerAlerts: {} }, prayerId),
    enabledWhen,
    summary: onOff,
    sideEffects: ["reschedule-reminders"],
    fields: ["prefs.prayerAlerts"],
  };
}

function reminderOffset(prayerId: PrayerId): SettingDef<number> {
  return {
    id: `notifications.salah.offset.${prayerId}`,
    group: G,
    section: "reminderOffsets.title",
    titleKey: `prayers.${prayerId}`,
    keywordsKey: "settingsPanel.kw.reminderTiming",
    scope: "account",
    control: {
      kind: "stepper",
      min: PRAYER_REMINDER_OFFSET_MIN,
      max: PRAYER_REMINDER_OFFSET_MAX,
      step: 5,
      format: (v, t) =>
        v === 0
          ? t("reminderOffsets.atTime")
          : v < 0
            ? t("reminderOffsets.before", { count: Math.abs(v) })
            : t("reminderOffsets.after", { count: v }),
    },
    read: (s) => s.prefs.prayerReminderOffsets?.[prayerId] ?? 0,
    write: async (v) => {
      const clamped = clampPrayerReminderOffset(v);
      const offsets = { ...preferencesStore.getState().prefs.prayerReminderOffsets };
      if (clamped === 0) delete offsets[prayerId];
      else offsets[prayerId] = clamped;
      await updatePrefs({ prayerReminderOffsets: offsets });
    },
    defaultValue: 0,
    enabledWhen: obligatoryOn,
    summary: (v, t) =>
      v === 0
        ? t("reminderOffsets.atTime")
        : v < 0
          ? t("reminderOffsets.before", { count: Math.abs(v) })
          : t("reminderOffsets.after", { count: v }),
    sideEffects: ["reschedule-reminders"],
    shortcuts: [],
    fields: ["prefs.prayerReminderOffsets"],
  };
}

export const NOTIFICATION_SETTINGS: AnySettingDef[] = [
  // ── Master ────────────────────────────────────────────────────────────────
  defineSetting<boolean>({
    id: "notifications.master",
    group: G,
    section: "settingsPanel.section.permission",
    titleKey: "notif.master",
    subtitleKey: "notif.masterSub",
    keywordsKey: "settingsPanel.kw.notifications",
    icon: BELL,
    scope: "account",
    control: { kind: "custom", Component: NotificationsMasterControl },
    read: masterOn,
    write: async (v) => {
      const { disableNotifications, enableNotifications } = await import("../actions");
      if (v) await enableNotifications();
      else await disableNotifications();
    },
    defaultValue: false,
    // "Reset settings" must never silently switch every reminder off.
    resettable: false,
    summary: onOff,
    shortcuts: ["/notifications", "/(onboarding)/intro-location"],
    fields: ["prefs.notificationPrefs.masterEnabled"],
  }),

  // ── Salah & adhan ─────────────────────────────────────────────────────────
  notificationToggle({
    id: "notifications.salah.prayer",
    section: "settingsPanel.section.salahAdhan",
    titleKey: "notif.items.prayer.title",
    subtitleKey: "notif.items.prayer.subtitle",
    key: "prayer",
    fallback: true,
  }),
  defineSetting<string>({
    id: "notifications.salah.adhanStyle",
    group: G,
    section: "settingsPanel.section.salahAdhan",
    titleKey: "settingsPanel.adhanStyle",
    keywordsKey: "settingsPanel.kw.adhan",
    scope: "account",
    control: { kind: "custom", Component: AdhanStyleControl },
    read: (s) => s.prefs.adhanStyleId ?? DEFAULT_ADHAN_STYLE,
    write: (v) => updatePrefs({ adhanStyleId: v }),
    defaultValue: DEFAULT_ADHAN_STYLE,
    summary: (v, t) => t(`settings.adhanStyles.${v}.name`),
    sideEffects: ["reschedule-reminders"],
    fields: ["prefs.adhanStyleId"],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "notifications.salah.adhanPreview",
    group: G,
    section: "settingsPanel.section.salahAdhan",
    titleKey: "notif.adhanTitle",
    subtitleKey: "notif.adhanSub",
    keywordsKey: "settingsPanel.kw.adhan",
    scope: "account",
    control: { kind: "custom", Component: AdhanPreviewRow },
  }),
  notificationToggle({
    id: "notifications.salah.playAdhan",
    section: "settingsPanel.section.salahAdhan",
    titleKey: "notif.playAdhan",
    subtitleKey: "notif.playAdhanHint",
    keywordsKey: "settingsPanel.kw.adhan",
    key: "playAdhanOnPrayer",
    fallback: false,
    enabledWhen: obligatoryOn,
  }),
  defineSetting<boolean>({
    id: "notifications.salah.preciseAdhan",
    group: G,
    section: "settingsPanel.section.salahAdhan",
    titleKey: "notif.preciseAdhan",
    subtitleKey: "notif.preciseAdhanHint",
    keywordsKey: "settingsPanel.kw.adhan",
    scope: "device",
    control: { kind: "toggle" },
    // B4: mirrors this device's exact-alarm permission (device preference).
    read: (s) => (s.device.preciseAdhan ?? s.prefs.notificationPrefs.preciseAdhan) === true,
    write: async (v) => {
      if (v && !(await requestExactAlarmPermission())) return;
      await setDevicePreferences({ preciseAdhan: v });
    },
    defaultValue: false,
    available: (ctx) => ctx.os === "android" && !ctx.tv,
    enabledWhen: obligatoryOn,
    summary: onOff,
    sideEffects: ["reschedule-reminders"],
    fields: ["device.preciseAdhan", "prefs.notificationPrefs.preciseAdhan"],
  }),
  notificationToggle({
    id: "notifications.salah.afterAzan",
    section: "settingsPanel.section.salahAdhan",
    titleKey: "notif.items.afterAzan.title",
    subtitleKey: "notif.items.afterAzan.subtitle",
    key: "afterAzan",
    fallback: false,
  }),
  // NF-3.13: the native "Tap to confirm your Salah" alert from the focus-lock shield.
  // Posted by the native module, so it never reschedules JS reminders (§11).
  notificationToggle({
    id: "notifications.salah.focusLockConfirm",
    section: "settingsPanel.section.salahAdhan",
    titleKey: "focusLock.setup.confirmAlert",
    subtitleKey: "focusLock.setup.confirmAlertHint",
    keywordsKey: "focusLock.searchKeywords",
    key: "focusLock",
    fallback: true,
    sideEffects: [],
    available: nativeOnly,
    enabledWhen: (s) =>
      s.prefs.notificationPrefs.masterEnabled && s.prefs.focusLock?.enabled === true,
    shortcuts: ["/focus-lock/setup"],
  }),
  // NF-3.11: "leave now" at iqamah − walk minutes for the home masjid (§11 tier 2).
  // Only fires when iqamah times exist (your times, or a licence-cleared source).
  notificationToggle({
    id: "notifications.salah.iqamah",
    section: "settingsPanel.section.salahAdhan",
    titleKey: "masjids.reminder.settingTitle",
    subtitleKey: "masjids.settings.iqamahSub",
    keywordsKey: "settingsPanel.kw.masjidFinder",
    key: "iqamah",
    fallback: false,
    enabledWhen: (s) => s.prefs.notificationPrefs.masterEnabled && !!s.prefs.homeMasjid,
    shortcuts: ["/masjids/times"],
  }),
  // D40: one reminder when the chosen school's preferred time begins (§11 tier 2).
  // School-specific, so the row is hidden in all-views mode / before a school is chosen.
  notificationToggle({
    id: "notifications.salah.preferredTime",
    section: "settingsPanel.section.salahAdhan",
    titleKey: "preferredTimeReminder.settingTitle",
    subtitleKey: "preferredTimeReminder.settingSub",
    keywordsKey: "preferredTimeReminder.keywords",
    key: "preferredTime",
    fallback: false,
    enabledWhen: obligatoryOn,
    visibleWhen: (s) => rulesFor(s.prefs, "salah") != null,
  }),
  defineSetting<boolean>({
    id: "notifications.salah.liveActivity",
    group: G,
    section: "settingsPanel.section.salahAdhan",
    titleKey: "notif.liveActivity",
    subtitleKey: "settingsPanel.liveActivitySub",
    keywordsKey: "settingsPanel.kw.liveActivity",
    scope: "device",
    control: { kind: "toggle" },
    read: (s) => (s.device.liveActivityEnabled ?? s.prefs.liveActivityEnabled) === true,
    write: (v) => setDevicePreferences({ liveActivityEnabled: v }),
    defaultValue: false,
    available: (ctx) => ctx.native && (ctx.os === "android" || ctx.liveActivitySupported),
    summary: onOff,
    fields: ["device.liveActivityEnabled", "prefs.liveActivityEnabled"],
  }),

  // ── Per-prayer alerts ─────────────────────────────────────────────────────
  ...OBLIGATORY_PRAYERS.map((p) => prayerAlert(p, "notif.prayerAlertsObligatory", obligatoryOn)),
  notificationToggle({
    id: "notifications.salah.sunnahPrayer",
    section: "notif.prayerAlertsSunnah",
    titleKey: "notif.items.sunnahPrayer.title",
    subtitleKey: "notif.items.sunnahPrayer.subtitle",
    key: "sunnahPrayer",
    fallback: true,
  }),
  ...[WITR_PRAYER, ...SUNNAH_ALERTABLE_PRAYERS].map((p) =>
    prayerAlert(p as PrayerId, "notif.prayerAlertsSunnah", sunnahOn),
  ),

  // ── Reminder timing (promoted from inside the Adhan card) ─────────────────
  ...OBLIGATORY_PRAYERS.map(reminderOffset),

  // ── Zikr ──────────────────────────────────────────────────────────────────
  notificationToggle({
    id: "notifications.zikr.morning",
    section: "notif.groupZikr",
    titleKey: "notif.items.morningZikr.title",
    subtitleKey: "notif.items.morningZikr.subtitle",
    key: "morningZikr",
    fallback: true,
  }),
  notificationToggle({
    id: "notifications.zikr.evening",
    section: "notif.groupZikr",
    titleKey: "notif.items.eveningZikr.title",
    subtitleKey: "notif.items.eveningZikr.subtitle",
    key: "eveningZikr",
    fallback: true,
  }),
  notificationToggle({
    id: "notifications.zikr.beforeSleep",
    section: "notif.groupZikr",
    titleKey: "notif.items.beforeSleep.title",
    subtitleKey: "notif.items.beforeSleep.subtitle",
    key: "beforeSleep",
    fallback: true,
  }),
  defineSetting<string>({
    id: "notifications.zikr.bedtime",
    group: G,
    section: "notif.groupZikr",
    titleKey: "settings.bedtime",
    subtitleKey: "settings.bedtimeSub",
    keywordsKey: "settingsPanel.kw.bedtime",
    icon: { ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" },
    scope: "account",
    control: { kind: "time" },
    read: (s) => s.prefs.bedtime ?? "22:30",
    write: (v) => updatePrefs({ bedtime: v }),
    defaultValue: "22:30",
    enabledWhen: (s) => masterOn(s) && s.prefs.notificationPrefs.beforeSleep,
    summary: (v) => v,
    sideEffects: ["reschedule-reminders"],
    fields: ["prefs.bedtime"],
  }),
  notificationToggle({
    id: "notifications.zikr.beforePrayer",
    section: "notif.groupZikr",
    titleKey: "notif.items.beforePrayer.title",
    subtitleKey: "notif.items.beforePrayer.subtitle",
    key: "beforePrayer",
    fallback: false,
  }),
  notificationToggle({
    id: "notifications.zikr.afterPrayer",
    section: "notif.groupZikr",
    titleKey: "notif.items.afterPrayer.title",
    subtitleKey: "notif.items.afterPrayer.subtitle",
    key: "afterPrayer",
    fallback: false,
  }),

  // ── Qur'an (same field as Qur'an practice) ────────────────────────────────
  defineSetting<boolean>({
    id: "notifications.quran.revisionReminder",
    group: G,
    section: "settingsPanel.section.quran",
    titleKey: "quranCompanion.settings.reminder",
    subtitleKey: "quranCompanion.settings.reminderSub",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.companion.revisionReminder,
    write: (v) => quranCompanionPrefsStore.getState().update({ revisionReminder: v }),
    defaultValue: false,
    enabledWhen: masterOn,
    summary: onOff,
    sideEffects: ["reschedule-reminders"],
    shortcuts: ["/settings/quran-practice"],
    fields: ["companion.revisionReminder"],
  }),

  // ── Qaza ──────────────────────────────────────────────────────────────────
  notificationToggle({
    id: "notifications.qaza.reminders",
    section: "settingsPanel.section.qaza",
    titleKey: "notif.items.qaza.title",
    subtitleKey: "notif.items.qaza.subtitle",
    key: "qaza",
    fallback: true,
  }),

  // ── Content ───────────────────────────────────────────────────────────────
  notificationToggle({
    id: "notifications.content.daily",
    section: "notif.groupContent",
    titleKey: "notif.items.dailyContent.title",
    subtitleKey: "notif.items.dailyContent.subtitle",
    key: "dailyContent",
    fallback: false,
  }),
  notificationToggle({
    id: "notifications.content.friday",
    section: "notif.groupContent",
    titleKey: "notif.items.friday.title",
    subtitleKey: "notif.items.friday.subtitle",
    key: "friday",
    fallback: false,
  }),
  notificationToggle({
    id: "notifications.content.whiteDays",
    section: "notif.groupContent",
    titleKey: "notif.items.whiteDays.title",
    subtitleKey: "notif.items.whiteDays.subtitle",
    key: "whiteDays",
    fallback: false,
  }),
  notificationToggle({
    id: "notifications.content.achievements",
    section: "notif.groupContent",
    titleKey: "notif.items.achievements.title",
    subtitleKey: "notif.items.achievements.subtitle",
    key: "achievements",
    fallback: true,
  }),

  // ── Fasting / Sunnah / Seasonal / Personal (NF-3.1–3.9) ──────────────────
  ...WORSHIP_REMINDER_SETTINGS,

  // ── App feedback ──────────────────────────────────────────────────────────
  notificationToggle({
    id: "notifications.feedback.reviewReminders",
    section: "settingsPanel.section.feedback",
    titleKey: "settings.reviewReactivationEnabled",
    subtitleKey: "settings.reviewReactivationEnabledDesc",
    key: "reviewReactivationEnabled",
    fallback: true,
    sideEffects: [],
  }),

  // ── Upcoming preview ──────────────────────────────────────────────────────
  defineSetting<null>({
    ...NO_VALUE,
    id: "notifications.upcoming",
    group: G,
    section: "notif.upcomingTitle",
    titleKey: "notif.upcomingTitle",
    subtitleKey: "notif.upcomingHint",
    scope: "account",
    control: { kind: "custom", Component: UpcomingRemindersPreview },
    enabledWhen: masterOn,
  }),
].map((def) => ({ available: notOnTv, ...def }));
