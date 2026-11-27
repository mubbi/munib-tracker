/**
 * Native home-screen and lock-screen surface config (Android widgets + quick-action icons).
 * Keep widget `name` values in sync with APP_WIDGET_REGISTRY in
 * src/lib/appSurfaces/widgets/registry.ts.
 */
// Brand fill for the quick-action icons that use the app accent (generated tokens).
const NATIVE_ACCENT = require("./generated/native-tokens.json").defaultAccent.light;
const QUICK_ACTION_ICON_DIR = "./assets/images/quick-actions";
const WIDGET_PREVIEW_DIR = "./assets/images/widget-previews";
/*
 * Sizing follows Android's widget quality guidelines: targetCellWidth/Height
 * (API 31+) plus min/max resize bounds so every widget can shrink to a 2x1 strip
 * (renders the compact lock-screen layout) and grow without stretching.
 * Cell math: width = 73n - 16 dp, height = 118m - 16 dp (portrait).
 * `updatePeriodMillis` is only the 30-minute fallback: exact redraws at each
 * Adhan / adhkar window / midnight come from `scheduleWidgetRefresh` alarms.
 */
const WIDGET_CELL = {
  minWidth: "250dp",
  minHeight: "110dp",
  targetCellWidth: 4,
  targetCellHeight: 2,
  minResizeWidth: "110dp",
  minResizeHeight: "50dp",
  maxResizeWidth: "530dp",
  maxResizeHeight: "450dp",
  resizeMode: "horizontal|vertical",
  updatePeriodMillis: 1_800_000,
};

const WIDGET_CELL_LARGE = {
  minWidth: "250dp",
  minHeight: "250dp",
  targetCellWidth: 4,
  targetCellHeight: 4,
  minResizeWidth: "180dp",
  minResizeHeight: "110dp",
  maxResizeWidth: "530dp",
  maxResizeHeight: "570dp",
  resizeMode: "horizontal|vertical",
  updatePeriodMillis: 1_800_000,
};

/** 2x2 glance widgets: resizable down to 2x1 and up to a 4x2 card (quality tier WL-2). */
const WIDGET_CELL_SMALL = {
  minWidth: "110dp",
  minHeight: "110dp",
  targetCellWidth: 2,
  targetCellHeight: 2,
  minResizeWidth: "110dp",
  minResizeHeight: "50dp",
  maxResizeWidth: "276dp",
  maxResizeHeight: "220dp",
  resizeMode: "horizontal|vertical",
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
  AdhkarWidget: {
    label: "Adhkar",
    description: "The adhkar due now (morning, after Salah, evening) with progress",
    previewImage: `${WIDGET_PREVIEW_DIR}/adhkarwidget_preview.png`,
  },
  IslamicEventsWidget: {
    label: "Islamic events",
    description: "Countdown to the next Islamic dates: Ramadan, Eid, Arafah, Ashura",
    previewImage: `${WIDGET_PREVIEW_DIR}/islamiceventswidget_preview.png`,
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
  widgetEntry("AdhkarWidget"),
  widgetEntry("IslamicEventsWidget"),
];

const QUICK_ACTION_ANDROID_ICONS = {
  quick_mark: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_mark.png`,
    backgroundColor: NATIVE_ACCENT,
  },
  quick_checklist: {
    foregroundImage: `${QUICK_ACTION_ICON_DIR}/quick_checklist.png`,
    backgroundColor: NATIVE_ACCENT,
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
