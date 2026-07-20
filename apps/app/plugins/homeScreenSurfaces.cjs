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
  minResizeWidth: "110dp",
  minResizeHeight: "110dp",
  resizeMode: "horizontal|vertical",
  updatePeriodMillis: 1_800_000,
};

const WIDGET_CELL_LARGE = {
  minWidth: "250dp",
  minHeight: "250dp",
  targetCellWidth: 4,
  targetCellHeight: 4,
  minResizeWidth: "250dp",
  minResizeHeight: "110dp",
  resizeMode: "horizontal|vertical",
  updatePeriodMillis: 1_800_000,
};

const WIDGET_CELL_SMALL = {
  minWidth: "110dp",
  minHeight: "110dp",
  targetCellWidth: 2,
  targetCellHeight: 2,
  minResizeWidth: "110dp",
  minResizeHeight: "110dp",
  resizeMode: "none",
  updatePeriodMillis: 1_800_000,
};

const WIDGET_APP_GROUP = "group.app.munibtracker.widgets";

/** Short labels — Android widget picker already shows the app name. */
const WIDGET_META = {
  NextPrayerWidget: {
    label: "Next Salah",
    description: "Next Salah name, time, and countdown on home or lock screen",
    previewImage: `${WIDGET_PREVIEW_DIR}/nextprayerwidget_preview.png`,
  },
  PrayerScheduleWidget: {
    label: "Schedule",
    description: "Today's obligatory Salah times at a glance",
    previewImage: `${WIDGET_PREVIEW_DIR}/prayerschedulewidget_preview.png`,
  },
  PrayerProgressWidget: {
    label: "Progress",
    description: "Today's obligatory Salah progress",
    previewImage: `${WIDGET_PREVIEW_DIR}/prayerprogresswidget_preview.png`,
  },
  SalahStreakWidget: {
    label: "Streak",
    description: "Current obligatory Salah streak",
    previewImage: `${WIDGET_PREVIEW_DIR}/salahstreakwidget_preview.png`,
  },
  QazaDebtWidget: {
    label: "Qaza",
    description: "Remaining qaza and today's make-up progress",
    previewImage: `${WIDGET_PREVIEW_DIR}/qazadebtwidget_preview.png`,
  },
  RamadanWidget: {
    label: "Ramadan",
    description: "Suhoor and iftar times with countdown",
    previewImage: `${WIDGET_PREVIEW_DIR}/ramadanwidget_preview.png`,
  },
  KhatmProgressWidget: {
    label: "Khatm",
    description: "Qur'an Khatm plan progress",
    previewImage: `${WIDGET_PREVIEW_DIR}/khatmprogresswidget_preview.png`,
  },
  DailyHadithWidget: {
    label: "Daily hadith",
    description: "Today's hadith from Imam al-Nawawi's Forty",
    previewImage: `${WIDGET_PREVIEW_DIR}/dailyhadithwidget_preview.png`,
  },
  HijriDateWidget: {
    label: "Islamic date",
    description: "Hijri and Gregorian date",
    previewImage: `${WIDGET_PREVIEW_DIR}/hijridatewidget_preview.png`,
  },
  QiblaBearingWidget: {
    label: "Qibla",
    description: "Compass bearing toward the Kaaba",
    previewImage: `${WIDGET_PREVIEW_DIR}/qiblabearingwidget_preview.png`,
  },
  TasbeehGlanceWidget: {
    label: "Tasbeeh",
    description: "Today's tasbeeh count and target at a glance",
    previewImage: `${WIDGET_PREVIEW_DIR}/tasbeehglancewidget_preview.png`,
  },
  JumuahWidget: {
    label: "Jumu'ah",
    description: "Friday checklist progress or a countdown to Jumu'ah",
    previewImage: `${WIDGET_PREVIEW_DIR}/jumuahwidget_preview.png`,
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
  widgetEntry("SalahStreakWidget", WIDGET_CELL_SMALL),
  widgetEntry("QazaDebtWidget"),
  widgetEntry("RamadanWidget"),
  widgetEntry("KhatmProgressWidget"),
  widgetEntry("DailyHadithWidget"),
  widgetEntry("HijriDateWidget", WIDGET_CELL_SMALL),
  widgetEntry("QiblaBearingWidget", WIDGET_CELL_SMALL),
  widgetEntry("TasbeehGlanceWidget", WIDGET_CELL_SMALL),
  widgetEntry("JumuahWidget"),
];

const QUICK_ACTION_ANDROID_ICONS = {
  quick_mark: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_mark.png`,
    backgroundColor: "#059669",
  },
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
  quick_ramadan: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_ramadan.png`,
    backgroundColor: "#4338CA",
  },
};

module.exports = {
  WIDGET_APP_GROUP,
  ANDROID_HOME_SCREEN_WIDGETS,
  QUICK_ACTION_ANDROID_ICONS,
};
