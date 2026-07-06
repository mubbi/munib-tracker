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

export const WIDGET_DISPLAY_NAMES: Record<AppWidgetName, { label: string; description: string }> = {
  NextPrayerWidget: {
    label: "Munib Tracker · Next prayer",
    description: "Next prayer name, time, and countdown on home or lock screen",
  },
  PrayerScheduleWidget: {
    label: "Munib Tracker · Schedule",
    description: "Today's obligatory prayer times at a glance",
  },
  PrayerProgressWidget: {
    label: "Munib Tracker · Progress",
    description: "Today's obligatory prayer progress",
  },
};
