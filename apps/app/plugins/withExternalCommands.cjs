const { withAndroidManifest, withDangerousMod, AndroidConfig } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const RECEIVER_CLASS = "expo.modules.munibexternalcommands.ExternalCommandReceiver";
const SERVICE_CLASS = "expo.modules.munibexternalcommands.ExternalCommandHeadlessService";

function withExternalCommandsAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      app,
      "com.google.android.actions",
      "@xml/actions",
      "resource",
    );

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
              { $: { "android:name": "com.munibtracker.app.action.MARK_CURRENT" } },
              { $: { "android:name": "com.munibtracker.app.action.MARK_PRAYER" } },
            ],
          },
        ],
      });
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
      const resXml = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
      fs.mkdirSync(resXml, { recursive: true });

      fs.writeFileSync(
        path.join(resXml, "actions.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<actions>
  <action intentName="actions.intent.OPEN_APP_FEATURE">
    <parameter name="feature">
      <entity-set-reference entitySetId="MunibFeatureEntitySet"/>
    </parameter>
    <fulfillment urlTemplate="munib-tracker://{feature}"/>
  </action>
  <action intentName="custom.mark_salah">
    <fulfillment>
      <intent
        action="com.munibtracker.app.action.MARK_CURRENT"
        package="com.munibtracker.app"/>
    </fulfillment>
  </action>
</actions>
`,
      );

      fs.writeFileSync(
        path.join(resXml, "shortcuts.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
  <shortcut
    android:shortcutId="mark_current"
    android:enabled="true"
    android:icon="@mipmap/ic_launcher"
    android:shortcutShortLabel="@string/app_name">
    <intent
      android:action="com.munibtracker.app.action.MARK_CURRENT"
      android:targetPackage="com.munibtracker.app"/>
  </shortcut>
</shortcuts>
`,
      );

      const buildGradle = path.join(config.modRequest.platformProjectRoot, "app/build.gradle");
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
