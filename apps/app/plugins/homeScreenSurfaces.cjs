/**
 * Native home-screen and lock-screen surface config (Android widgets + quick-action icons).
 * Keep widget `name` values in sync with APP_WIDGET_REGISTRY in
 * src/lib/appSurfaces/widgets/registry.ts.
 */
const QUICK_ACTION_ICON_DIR = "./assets/images/quick-actions";
const WIDGET_PREVIEW_DIR = "./assets/images/widget-previews";
const WIDGET_CELL = {
  minWidth: "250dp",
  minHeight: "110dp",
  targetCellWidth: 4,
  targetCellHeight: 2,
  updatePeriodMillis: 1_800_000,
};

const WIDGET_CELL_LARGE = {
  minWidth: "250dp",
  minHeight: "250dp",
  targetCellWidth: 4,
  targetCellHeight: 4,
  updatePeriodMillis: 1_800_000,
};

const WIDGET_CELL_SMALL = {
  minWidth: "110dp",
  minHeight: "110dp",
  targetCellWidth: 2,
  targetCellHeight: 2,
  updatePeriodMillis: 1_800_000,
};

const WIDGET_APP_GROUP = "group.com.munibtracker.widgets";

/** Short labels — Android widget picker already shows the app name. */
const WIDGET_META = {
  NextPrayerWidget: {
    label: "Next prayer",
    description: "Next prayer name, time, and countdown on home or lock screen",
    previewImage: `${WIDGET_PREVIEW_DIR}/nextprayerwidget_preview.png`,
  },
  PrayerScheduleWidget: {
    label: "Schedule",
    description: "Today's obligatory prayer times at a glance",
    previewImage: `${WIDGET_PREVIEW_DIR}/prayerschedulewidget_preview.png`,
  },
  PrayerProgressWidget: {
    label: "Progress",
    description: "Today's obligatory prayer progress",
    previewImage: `${WIDGET_PREVIEW_DIR}/prayerprogresswidget_preview.png`,
  },
};

function widgetEntry(name, cellOverrides = {}) {
  const meta = WIDGET_META[name];
  return {
    name,
    label: meta.label,
    description: meta.description,
    previewImage: meta.previewImage,
    ...WIDGET_CELL,
    ...cellOverrides,
  };
}

const ANDROID_HOME_SCREEN_WIDGETS = [
  widgetEntry("NextPrayerWidget"),
  widgetEntry("PrayerScheduleWidget", WIDGET_CELL_LARGE),
  widgetEntry("PrayerProgressWidget", WIDGET_CELL_SMALL),
];

const QUICK_ACTION_ANDROID_ICONS = {
  quick_checklist: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_checklist.png`,
    backgroundColor: "#059669",
  },
  quick_qibla: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_qibla.png`,
    backgroundColor: "#0D9488",
  },
  quick_tasbeeh: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_tasbeeh.png`,
    backgroundColor: "#7C3AED",
  },
  quick_qaza: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_qaza.png`,
    backgroundColor: "#D97706",
  },
  quick_quran: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_quran.png`,
    backgroundColor: "#2563EB",
  },
};

module.exports = {
  WIDGET_APP_GROUP,
  ANDROID_HOME_SCREEN_WIDGETS,
  QUICK_ACTION_ANDROID_ICONS,
};
