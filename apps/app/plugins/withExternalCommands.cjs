const { withAndroidManifest, withDangerousMod, AndroidConfig } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const RECEIVER_CLASS = "expo.modules.munibexternalcommands.ExternalCommandReceiver";
const SERVICE_CLASS = "expo.modules.munibexternalcommands.ExternalCommandHeadlessService";
const ACTION_MARK_CURRENT = "app.munibtracker.action.MARK_CURRENT";
const ACTION_MARK_PRAYER = "app.munibtracker.action.MARK_PRAYER";

/**
 * Android external commands: App Actions (Assistant), broadcast receiver, launcher shortcut.
 *
 * App Actions uses only the built-in OPEN_APP_FEATURE intent (no custom intents),
 * so Play does not require queryPatterns. Mark-salah is an inventory entity.
 *
 * Play Console (required once for App Actions uploads — not fixable in the AAB):
 * 1. Store listing → Privacy policy → https://munibtracker.app/privacy
 * 2. Setup → Advanced settings → App Actions → accept Terms of Service
 */
function withExternalCommandsAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(manifest);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      app,
      "com.google.android.actions",
      "@xml/actions",
      "resource",
    );

    if (!mainActivity["meta-data"]) mainActivity["meta-data"] = [];
    const hasShortcutsMeta = mainActivity["meta-data"].some(
      (item) => item.$?.["android:name"] === "android.app.shortcuts",
    );
    if (!hasShortcutsMeta) {
      mainActivity["meta-data"].push({
        $: {
          "android:name": "android.app.shortcuts",
          "android:resource": "@xml/shortcuts",
        },
      });
    }

    if (!app.receiver) app.receiver = [];
    const hasReceiver = app.receiver.some((r) => r.$?.["android:name"] === RECEIVER_CLASS);
    if (!hasReceiver) {
      app.receiver.push({
        $: {
          "android:name": RECEIVER_CLASS,
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              { $: { "android:name": ACTION_MARK_CURRENT } },
              { $: { "android:name": ACTION_MARK_PRAYER } },
            ],
          },
        ],
      });
    } else {
      // Keep action names in sync when regenerating prebuild.
      const receiver = app.receiver.find((r) => r.$?.["android:name"] === RECEIVER_CLASS);
      if (receiver) {
        receiver["intent-filter"] = [
          {
            action: [
              { $: { "android:name": ACTION_MARK_CURRENT } },
              { $: { "android:name": ACTION_MARK_PRAYER } },
            ],
          },
        ];
      }
    }

    if (!app.service) app.service = [];
    const hasService = app.service.some((s) => s.$?.["android:name"] === SERVICE_CLASS);
    if (!hasService) {
      app.service.push({
        $: {
          "android:name": SERVICE_CLASS,
          "android:exported": "false",
        },
      });
    }

    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const platformRoot = config.modRequest.platformProjectRoot;
      const resXml = path.join(platformRoot, "app/src/main/res/xml");
      const resValues = path.join(platformRoot, "app/src/main/res/values");
      fs.mkdirSync(resXml, { recursive: true });
      fs.mkdirSync(resValues, { recursive: true });

      fs.writeFileSync(
        path.join(resValues, "app_actions_strings.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="shortcut_mark_salah_short" translatable="false">Mark Salah</string>
  <string name="shortcut_mark_salah_long" translatable="false">Mark current Salah</string>
  <string-array name="mark_current_synonyms" translatable="false">
    <item>mark my Salah</item>
    <item>mark current Salah</item>
    <item>mark Salah</item>
  </string-array>
  <string-array name="tracker_synonyms" translatable="false">
    <item>checklist</item>
    <item>prayer tracker</item>
    <item>Salah tracker</item>
  </string-array>
  <string-array name="qibla_synonyms" translatable="false">
    <item>Qibla</item>
    <item>Qibla direction</item>
  </string-array>
  <string-array name="tasbeeh_synonyms" translatable="false">
    <item>Tasbeeh</item>
    <item>counter</item>
  </string-array>
</resources>
`,
      );

      // Built-in OPEN_APP_FEATURE only — no custom.actions.* (avoids queryPatterns).
      fs.writeFileSync(
        path.join(resXml, "actions.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<actions>
  <action intentName="actions.intent.OPEN_APP_FEATURE">
    <parameter name="feature">
      <entity-set-reference entitySetId="MunibFeatureEntitySet"/>
    </parameter>
    <fulfillment urlTemplate="{@url}">
      <parameter-mapping intentParameter="feature" urlParameter="url"/>
    </fulfillment>
    <fulfillment urlTemplate="munib-tracker://tracker"/>
  </action>
  <entity-set entitySetId="MunibFeatureEntitySet">
    <entity
      name="tracker"
      url="munib-tracker://tracker"
      alternateName="@array/tracker_synonyms"/>
    <entity
      name="qibla"
      url="munib-tracker://qibla"
      alternateName="@array/qibla_synonyms"/>
    <entity
      name="tasbeeh"
      url="munib-tracker://tasbeeh/free"
      alternateName="@array/tasbeeh_synonyms"/>
    <entity
      name="mark-current"
      url="munib-tracker://mark-current"
      alternateName="@array/mark_current_synonyms"/>
  </entity-set>
</actions>
`,
      );

      // Static launcher shortcut opens the App Actions deep link (Activity, not broadcast).
      fs.writeFileSync(
        path.join(resXml, "shortcuts.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
  <shortcut
    android:shortcutId="mark_current"
    android:enabled="true"
    android:icon="@mipmap/ic_launcher"
    android:shortcutShortLabel="@string/shortcut_mark_salah_short"
    android:shortcutLongLabel="@string/shortcut_mark_salah_long">
    <intent
      android:action="android.intent.action.VIEW"
      android:data="munib-tracker://mark-current"
      android:targetPackage="app.munibtracker"
      android:targetClass="app.munibtracker.MainActivity"/>
  </shortcut>
</shortcuts>
`,
      );

      const buildGradle = path.join(platformRoot, "app/build.gradle");
      if (fs.existsSync(buildGradle)) {
        let contents = fs.readFileSync(buildGradle, "utf8");
        if (!contents.includes("play-services-wearable")) {
          contents = contents.replace(
            /dependencies\s*\{/,
            `dependencies {
    implementation "com.google.android.gms:play-services-wearable:18.2.0"`,
          );
          fs.writeFileSync(buildGradle, contents);
        }
      }

      return config;
    },
  ]);

  return config;
}

module.exports = withExternalCommandsAndroid;
