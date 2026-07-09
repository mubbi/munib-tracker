import i18n from "@/i18n";

/** Max schedule rows stored in snapshot (large widgets show all; compact shows fewer). */
export const WIDGET_MAX_SCHEDULE_ROWS = 5;

/** Schedule rows on small/medium Android and lock-screen surfaces. */
export const WIDGET_COMPACT_SCHEDULE_ROWS = 3;

/** Native widget names — keep in sync with plugins/homeScreenSurfaces.cjs. */
export const APP_WIDGET_NAMES = [
  "NextPrayerWidget",
  "PrayerScheduleWidget",
  "PrayerProgressWidget",
] as const;

export type AppWidgetName = (typeof APP_WIDGET_NAMES)[number];

/** Fallback dp size when AppWidgetManager reports 0 before first layout (avoids blank bitmap). */
export const ANDROID_WIDGET_DEFAULT_DP: Record<AppWidgetName, { width: number; height: number }> = {
  NextPrayerWidget: { width: 250, height: 110 },
  PrayerScheduleWidget: { width: 250, height: 250 },
  PrayerProgressWidget: { width: 110, height: 110 },
};

export function isAppWidgetName(value: string): value is AppWidgetName {
  return (APP_WIDGET_NAMES as readonly string[]).includes(value);
}

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
