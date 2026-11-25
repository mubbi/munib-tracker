/**
 * Localizes Android widget picker labels/descriptions (every app locale), adds a
 * per-widget scalable previewLayout (Android 12+ picker), and patches receivers
 * to use @string resources.
 *
 * Runs after `react-native-android-widget` so it can rewrite generated XML.
 */
const {
  withDangerousMod,
  withFinalizedMod,
  createRunOncePlugin,
  withAndroidManifest,
} = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const tokens = require("./generated/native-tokens.json");
const { ANDROID_HOME_SCREEN_WIDGETS } = require("./homeScreenSurfaces.cjs");

/** Short picker labels — Android already shows the app name beside the widget. */
const GALLERY_KEYS = {
  NextPrayerWidget: "nextPrayer",
  PrayerScheduleWidget: "schedule",
  PrayerProgressWidget: "progress",
  SalahStreakWidget: "streak",
  QazaDebtWidget: "qaza",
  RamadanWidget: "ramadan",
  KhatmProgressWidget: "khatm",
  DailyHadithWidget: "dailyHadith",
  HijriDateWidget: "hijriDate",
  QiblaBearingWidget: "qibla",
  TasbeehGlanceWidget: "tasbeeh",
  JumuahWidget: "friday",
  AdhkarWidget: "adhkar",
  IslamicEventsWidget: "events",
};

/**
 * Sample hero line per widget for the picker's previewLayout (Android 12+ shows
 * it instead of `previewImage`). Numbers/times only, so it reads in any locale;
 * the label and description lines come from the localized @string resources.
 */
const PREVIEW_HERO = {
  NextPrayerWidget: "4:18 · 0:42",
  PrayerScheduleWidget: "● ● ● ○ ○",
  PrayerProgressWidget: "3/5",
  SalahStreakWidget: "12",
  QazaDebtWidget: "15",
  RamadanWidget: "5:12 · 19:01",
  KhatmProgressWidget: "34%",
  DailyHadithWidget: "40",
  HijriDateWidget: "1448",
  QiblaBearingWidget: "292°",
  TasbeehGlanceWidget: "20 / 100",
  JumuahWidget: "3/6",
  AdhkarWidget: "4/12",
  IslamicEventsWidget: "1 · 9 · 10",
};

/**
 * App locale -> Android resource qualifier. Kurdish in this app is Sorani
 * (`ckb`); Indonesian ships under both the legacy `in` and the modern `id`.
 */
const LOCALE_QUALIFIERS = {
  en: [""],
  ar: ["ar"],
  az: ["az"],
  bn: ["bn"],
  bs: ["bs"],
  fa: ["fa"],
  fr: ["fr"],
  ha: ["ha"],
  hi: ["hi"],
  id: ["in", "id"],
  kk: ["kk"],
  ku: ["b+ckb"],
  ky: ["ky"],
  ms: ["ms"],
  ps: ["ps"],
  ru: ["ru"],
  so: ["so"],
  sq: ["sq"],
  sw: ["sw"],
  tg: ["tg"],
  tk: ["tk"],
  tr: ["tr"],
  ur: ["ur"],
  uz: ["uz"],
};

function loadGallery(locale) {
  const file = path.join(__dirname, `../src/i18n/${locale}.json`);
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  return json.widgets?.gallery ?? {};
}

/** Strip "Munib Tracker · " / localized brand prefix for Android picker brevity. */
function shortLabel(label) {
  if (typeof label !== "string") return label;
  const stripped = label.replace(/^[^·]+·\s*/, "").trim();
  return stripped || label;
}

function escapeXml(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

function widgetStringName(widgetName, kind) {
  return `widget_${widgetName.toLowerCase()}_${kind}`;
}

function writeLocaleStrings(resDir, locale, gallery, qualifier) {
  const dir = qualifier ? path.join(resDir, `values-${qualifier}`) : path.join(resDir, "values");
  fs.mkdirSync(dir, { recursive: true });

  const lines = ['<?xml version="1.0" encoding="utf-8"?>', "<resources>"];
  for (const widget of ANDROID_HOME_SCREEN_WIDGETS) {
    const key = GALLERY_KEYS[widget.name];
    const entry = gallery[key];
    if (!entry) continue;
    const label = shortLabel(entry.label ?? widget.label);
    const description = entry.description ?? widget.description ?? "";
    lines.push(
      `  <string name="${widgetStringName(widget.name, "label")}">${escapeXml(label)}</string>`,
    );
    // en: react-native-android-widget already writes description into values/strings.xml.
    // Locale folders override that same resource name.
    if (locale !== "en") {
      lines.push(
        `  <string name="${widgetStringName(widget.name, "description")}">${escapeXml(description)}</string>`,
      );
    }
  }
  lines.push("</resources>", "");
  fs.writeFileSync(path.join(dir, "widget_gallery_strings.xml"), lines.join("\n"));
}

function previewLayoutName(widgetName) {
  return `widget_preview_${widgetName.toLowerCase()}`;
}

/**
 * One scalable preview per widget (Android 12+ picker): its own localized label,
 * a sample hero and its description, on a card with the system widget corner
 * radius (quality tier WS-2). A shared "Next Salah" preview made every widget
 * in the picker look the same.
 */
function writePreviewLayouts(resRoot) {
  const layoutDir = path.join(resRoot, "layout");
  fs.mkdirSync(layoutDir, { recursive: true });
  const legacy = path.join(layoutDir, "widget_preview_glance.xml");

  for (const [dir, radius] of [
    ["drawable", "16dp"],
    ["drawable-v31", "@android:dimen/system_app_widget_background_radius"],
  ]) {
    fs.mkdirSync(path.join(resRoot, dir), { recursive: true });
    fs.writeFileSync(
      path.join(resRoot, dir, "widget_preview_background.xml"),
      `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="${tokens.light.card}" />
    <corners android:radius="${radius}" />
</shape>
`,
    );
  }

  for (const widget of ANDROID_HOME_SCREEN_WIDGETS) {
    const hero = escapeXml(PREVIEW_HERO[widget.name] ?? "");
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- Scalable widget picker preview for ${widget.name} (Android 12+ previewLayout). -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@android:id/background"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="12dp"
    android:background="@drawable/widget_preview_background">
    <TextView
        android:id="@+id/widget_preview_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textColor="${tokens.light.accentText}"
        android:textSize="12sp"
        android:textStyle="bold"
        android:maxLines="1"
        android:text="@string/${widgetStringName(widget.name, "label")}" />
    <TextView
        android:id="@+id/widget_preview_hero"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:textColor="${tokens.light.text}"
        android:textSize="22sp"
        android:textStyle="bold"
        android:maxLines="1"
        android:text="${hero}" />
    <TextView
        android:id="@+id/widget_preview_caption"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="2dp"
        android:textColor="${tokens.light.textSecondary}"
        android:textSize="12sp"
        android:maxLines="2"
        android:ellipsize="end"
        android:text="@string/${widgetStringName(widget.name, "description")}" />
</LinearLayout>
`;
    fs.writeFileSync(path.join(layoutDir, `${previewLayoutName(widget.name)}.xml`), xml);
  }

  // Android 15 generated previews (AndroidWidgetPreviewPublisher) still inflate
  // this generic layout and fill its three text views at runtime.
  fs.writeFileSync(
    legacy,
    fs
      .readFileSync(
        path.join(layoutDir, `${previewLayoutName(ANDROID_HOME_SCREEN_WIDGETS[0].name)}.xml`),
        "utf8",
      )
      .replace(/android:text="[^"]*"/g, 'android:text=""'),
  );
}

function patchProviderXml(xmlDir) {
  let found = 0;
  if (!fs.existsSync(xmlDir)) return found;
  for (const file of fs.readdirSync(xmlDir)) {
    if (!file.startsWith("widgetprovider_") || !file.endsWith(".xml")) continue;
    const filePath = path.join(xmlDir, file);
    let contents = fs.readFileSync(filePath, "utf8");
    found += 1;
    const widget = ANDROID_HOME_SCREEN_WIDGETS.find(
      (w) => file === `widgetprovider_${w.name.toLowerCase()}.xml`,
    );
    const layout = widget ? previewLayoutName(widget.name) : "widget_preview_glance";
    contents = contents.replace(/\s*android:previewLayout="[^"]*"/, "");
    contents = contents.replace(
      'android:initialLayout="@layout/rn_widget"',
      `android:initialLayout="@layout/rn_widget"\n    android:previewLayout="@layout/${layout}"`,
    );
    fs.writeFileSync(filePath, contents);
  }
  return found;
}

function withAndroidWidgetGallery(config) {
  config = withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0];
    if (!app?.receiver) return config;
    for (const receiver of app.receiver) {
      const name = receiver.$?.["android:name"] ?? "";
      const widget = ANDROID_HOME_SCREEN_WIDGETS.find((w) => name.endsWith(`.${w.name}`));
      if (!widget) continue;
      receiver.$["android:label"] = `@string/${widgetStringName(widget.name, "label")}`;
    }
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const resRoot = path.join(config.modRequest.platformProjectRoot, "app/src/main/res");
      for (const [locale, qualifiers] of Object.entries(LOCALE_QUALIFIERS)) {
        const gallery = loadGallery(locale);
        for (const qualifier of qualifiers) writeLocaleStrings(resRoot, locale, gallery, qualifier);
      }
      writePreviewLayouts(resRoot);
      return config;
    },
  ]);

  // Finalized: runs after every other mod, so react-native-android-widget has
  // already written its provider XML (from v0.26 it does so after this plugin's
  // dangerous mod, which silently left previews unpatched).
  return withFinalizedMod(config, [
    "android",
    async (config) => {
      const xmlDir = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
      if (patchProviderXml(xmlDir) === 0) {
        console.warn("[withAndroidWidgetGallery] no widgetprovider_*.xml found to patch");
      }
      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(withAndroidWidgetGallery, "withAndroidWidgetGallery", "1.1.0");
module.exports.GALLERY_KEYS = GALLERY_KEYS;
module.exports.PREVIEW_HERO = PREVIEW_HERO;
module.exports.LOCALE_QUALIFIERS = LOCALE_QUALIFIERS;
