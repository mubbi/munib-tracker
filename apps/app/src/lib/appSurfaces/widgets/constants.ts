import i18n from "@/i18n";

/** Max schedule rows stored in snapshot (large widgets show all; compact shows fewer). */
export const WIDGET_MAX_SCHEDULE_ROWS = 5;

/** Schedule rows on small Android and lock-screen surfaces. */
export const WIDGET_COMPACT_SCHEDULE_ROWS = 3;

/** Native widget names — keep in sync with plugins/homeScreenSurfaces.cjs. */
export const APP_WIDGET_NAMES = [
  "NextPrayerWidget",
  "PrayerScheduleWidget",
  "PrayerProgressWidget",
  "SalahStreakWidget",
  "QazaDebtWidget",
  "RamadanWidget",
  "KhatmProgressWidget",
  "DailyHadithWidget",
  "HijriDateWidget",
  "QiblaBearingWidget",
  "TasbeehGlanceWidget",
  "JumuahWidget",
] as const;

export type AppWidgetName = (typeof APP_WIDGET_NAMES)[number];

/** Fallback dp size when AppWidgetManager reports 0 before first layout (avoids blank bitmap). */
export const ANDROID_WIDGET_DEFAULT_DP: Record<AppWidgetName, { width: number; height: number }> = {
  NextPrayerWidget: { width: 250, height: 110 },
  PrayerScheduleWidget: { width: 250, height: 250 },
  PrayerProgressWidget: { width: 110, height: 110 },
  SalahStreakWidget: { width: 110, height: 110 },
  QazaDebtWidget: { width: 250, height: 110 },
  RamadanWidget: { width: 250, height: 110 },
  KhatmProgressWidget: { width: 250, height: 110 },
  DailyHadithWidget: { width: 250, height: 110 },
  HijriDateWidget: { width: 110, height: 110 },
  QiblaBearingWidget: { width: 110, height: 110 },
  TasbeehGlanceWidget: { width: 110, height: 110 },
  JumuahWidget: { width: 250, height: 110 },
};

export function isAppWidgetName(value: string): value is AppWidgetName {
  return (APP_WIDGET_NAMES as readonly string[]).includes(value);
}

/**
 * Custom `clickAction` values for the Mark control on the Next Salah / Prayer
 * Schedule widgets. Anything other than the library's own `"OPEN_APP"` /
 * `"OPEN_URI"` is routed by react-native-android-widget to a headless JS
 * click task (no Activity/app UI is opened) — handled in `androidTaskHandler.ts`.
 */
export const WIDGET_MARK_CLICK_ACTIONS = {
  markCurrent: "MARK_CURRENT",
  markPrayer: "MARK_PRAYER",
} as const;

export type WidgetMarkClickAction =
  (typeof WIDGET_MARK_CLICK_ACTIONS)[keyof typeof WIDGET_MARK_CLICK_ACTIONS];

const WIDGET_DISPLAY_NAME_KEYS: Record<
  AppWidgetName,
  { labelKey: string; descriptionKey: string }
> = {
  NextPrayerWidget: {
    labelKey: "widgets.gallery.nextPrayer.label",
    descriptionKey: "widgets.gallery.nextPrayer.description",
  },
  PrayerScheduleWidget: {
    labelKey: "widgets.gallery.schedule.label",
    descriptionKey: "widgets.gallery.schedule.description",
  },
  PrayerProgressWidget: {
    labelKey: "widgets.gallery.progress.label",
    descriptionKey: "widgets.gallery.progress.description",
  },
  SalahStreakWidget: {
    labelKey: "widgets.gallery.streak.label",
    descriptionKey: "widgets.gallery.streak.description",
  },
  QazaDebtWidget: {
    labelKey: "widgets.gallery.qaza.label",
    descriptionKey: "widgets.gallery.qaza.description",
  },
  RamadanWidget: {
    labelKey: "widgets.gallery.ramadan.label",
    descriptionKey: "widgets.gallery.ramadan.description",
  },
  KhatmProgressWidget: {
    labelKey: "widgets.gallery.khatm.label",
    descriptionKey: "widgets.gallery.khatm.description",
  },
  DailyHadithWidget: {
    labelKey: "widgets.gallery.dailyHadith.label",
    descriptionKey: "widgets.gallery.dailyHadith.description",
  },
  HijriDateWidget: {
    labelKey: "widgets.gallery.hijriDate.label",
    descriptionKey: "widgets.gallery.hijriDate.description",
  },
  QiblaBearingWidget: {
    labelKey: "widgets.gallery.qibla.label",
    descriptionKey: "widgets.gallery.qibla.description",
  },
  TasbeehGlanceWidget: {
    labelKey: "widgets.gallery.tasbeeh.label",
    descriptionKey: "widgets.gallery.tasbeeh.description",
  },
  JumuahWidget: {
    labelKey: "widgets.gallery.friday.label",
    descriptionKey: "widgets.gallery.friday.description",
  },
};

/**
 * Resolves a widget's gallery label/description in the active app locale.
 * A function (not a module-scope constant) because it must call `i18n.t()`
 * at invocation time, after i18n has initialized.
 */
export function widgetDisplayName(id: AppWidgetName): { label: string; description: string } {
  const { labelKey, descriptionKey } = WIDGET_DISPLAY_NAME_KEYS[id];
  return {
    label: i18n.t(labelKey),
    description: i18n.t(descriptionKey),
  };
}
