/**
 * Localizes Android widget picker labels/descriptions (Phase 1: en/ar/ur),
 * adds scalable previewLayout, and patches receivers to use @string resources.
 *
 * Runs after `react-native-android-widget` so it can rewrite generated XML.
 */
const {
  withDangerousMod,
  createRunOncePlugin,
  withAndroidManifest,
} = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

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
};

const PHASE1_LOCALES = ["en", "ar", "ur"];

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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

function widgetStringName(widgetName, kind) {
  return `widget_${widgetName.toLowerCase()}_${kind}`;
}

function writeLocaleStrings(resDir, locale, gallery) {
  const dir = locale === "en" ? path.join(resDir, "values") : path.join(resDir, `values-${locale}`);
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
    // Locale folders override that same resource name for ar/ur.
    if (locale !== "en") {
      lines.push(
        `  <string name="${widgetStringName(widget.name, "description")}">${escapeXml(description)}</string>`,
      );
    }
  }
  lines.push("</resources>", "");
  fs.writeFileSync(path.join(dir, "widget_gallery_strings.xml"), lines.join("\n"));
}

function writePreviewLayout(layoutDir) {
  fs.mkdirSync(layoutDir, { recursive: true });
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- Scalable widget picker preview (Android 12+ previewLayout). -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@android:id/background"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="12dp"
    android:background="#FFFCF7">
    <TextView
        android:id="@+id/widget_preview_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textColor="#059669"
        android:textSize="12sp"
        android:textStyle="bold"
        android:maxLines="1"
        android:text="Next Salah" />
    <TextView
        android:id="@+id/widget_preview_hero"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:textColor="#152921"
        android:textSize="22sp"
        android:textStyle="bold"
        android:maxLines="1"
        android:text="Asr · 4:18 PM" />
    <TextView
        android:id="@+id/widget_preview_caption"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="2dp"
        android:textColor="#4A5F56"
        android:textSize="12sp"
        android:maxLines="2"
        android:text="in 42 min" />
</LinearLayout>
`;
  fs.writeFileSync(path.join(layoutDir, "widget_preview_glance.xml"), xml);
}

function patchProviderXml(xmlDir) {
  if (!fs.existsSync(xmlDir)) return;
  for (const file of fs.readdirSync(xmlDir)) {
    if (!file.startsWith("widgetprovider_") || !file.endsWith(".xml")) continue;
    const filePath = path.join(xmlDir, file);
    let contents = fs.readFileSync(filePath, "utf8");
    if (!contents.includes("android:previewLayout")) {
      contents = contents.replace(
        'android:initialLayout="@layout/rn_widget"',
        'android:initialLayout="@layout/rn_widget"\n    android:previewLayout="@layout/widget_preview_glance"',
      );
    }
    if (!contents.includes("@android:id/background")) {
      // Continuity id lives on the preview/layout root; note in comment only for RN root.
    }
    fs.writeFileSync(filePath, contents);
  }
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

  return withDangerousMod(config, [
    "android",
    async (config) => {
      const resRoot = path.join(config.modRequest.platformProjectRoot, "app/src/main/res");
      for (const locale of PHASE1_LOCALES) {
        writeLocaleStrings(resRoot, locale, loadGallery(locale));
      }
      writePreviewLayout(path.join(resRoot, "layout"));
      patchProviderXml(path.join(resRoot, "xml"));
      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(withAndroidWidgetGallery, "withAndroidWidgetGallery", "1.0.0");
