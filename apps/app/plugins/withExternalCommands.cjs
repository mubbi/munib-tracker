const { withAndroidManifest, withDangerousMod, AndroidConfig } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const RECEIVER_CLASS = "expo.modules.munibexternalcommands.ExternalCommandReceiver";
/** Removed no-op service (startService from a background receiver throws on Android 8+). */
const LEGACY_SERVICE_CLASS = "expo.modules.munibexternalcommands.ExternalCommandHeadlessService";
const ONGOING_BOUNDARY_RECEIVER_CLASS =
  "expo.modules.munibexternalcommands.OngoingSalahBoundaryReceiver";
const ONGOING_ACTION_RECEIVER_CLASS =
  "expo.modules.munibexternalcommands.OngoingSalahActionReceiver";
const ACTION_MARK_CURRENT = "app.munibtracker.action.MARK_CURRENT";
const ACTION_MARK_PRAYER = "app.munibtracker.action.MARK_PRAYER";
const ACTION_STOP_ONGOING = "expo.modules.munibexternalcommands.STOP_ONGOING";
const ACTION_DELETE_ONGOING = "expo.modules.munibexternalcommands.DELETE_ONGOING";
const ACTION_BOUNDARY = "expo.modules.munibexternalcommands.BOUNDARY";

/**
 * Pure + idempotent: App Actions / shortcuts meta-data, the mark receiver (not exported),
 * the ongoing-notification receivers, and removal of the legacy no-op service.
 */
function applyExternalCommandsManifest(manifest) {
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
  // Mark broadcasts come only from this app (Wear listener, widget click task);
  // App Actions use deep links. Not exported, so other apps can't mark a Salah.
  const markReceiver = {
    $: {
      "android:name": RECEIVER_CLASS,
      "android:exported": "false",
    },
    "intent-filter": [
      {
        action: [
          { $: { "android:name": ACTION_MARK_CURRENT } },
          { $: { "android:name": ACTION_MARK_PRAYER } },
        ],
      },
    ],
  };
  const receiverIndex = app.receiver.findIndex((r) => r.$?.["android:name"] === RECEIVER_CLASS);
  if (receiverIndex === -1) app.receiver.push(markReceiver);
  // Keep attributes + action names in sync when regenerating prebuild.
  else app.receiver[receiverIndex] = markReceiver;

  if (app.service) {
    app.service = app.service.filter((s) => s.$?.["android:name"] !== LEGACY_SERVICE_CLASS);
  }

  // Phase 4: one-shot alarm receiver that flips the ongoing "next Salah"
  // notification at phase boundaries — never exported to third parties.
  const hasBoundaryReceiver = app.receiver.some(
    (r) => r.$?.["android:name"] === ONGOING_BOUNDARY_RECEIVER_CLASS,
  );
  if (!hasBoundaryReceiver) {
    app.receiver.push({
      $: {
        "android:name": ONGOING_BOUNDARY_RECEIVER_CLASS,
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [{ $: { "android:name": ACTION_BOUNDARY } }],
        },
      ],
    });
  }

  const hasActionReceiver = app.receiver.some(
    (r) => r.$?.["android:name"] === ONGOING_ACTION_RECEIVER_CLASS,
  );
  if (!hasActionReceiver) {
    app.receiver.push({
      $: {
        "android:name": ONGOING_ACTION_RECEIVER_CLASS,
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [
            { $: { "android:name": ACTION_STOP_ONGOING } },
            { $: { "android:name": ACTION_DELETE_ONGOING } },
          ],
        },
      ],
    });
  }

  return manifest;
}

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
  // Non-runtime permission for the Android 16 "Live Update" promoted ongoing
  // notification (setRequestPromotedOngoing) — ignored on older OS versions,
  // required (but never prompted) on the ones that support it.
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.POST_PROMOTED_NOTIFICATIONS",
  ]);

  config = withAndroidManifest(config, (config) => {
    config.modResults = applyExternalCommandsManifest(config.modResults);
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
  <string-array name="ramadan_synonyms" translatable="false">
    <item>Ramadan</item>
    <item>fasting</item>
    <item>suhoor and iftar</item>
  </string-array>
  <string-array name="khatm_synonyms" translatable="false">
    <item>Khatm plan</item>
    <item>Quran khatm</item>
    <item>Quran completion plan</item>
  </string-array>
  <string-array name="qaza_synonyms" translatable="false">
    <item>Qaza</item>
    <item>missed prayers</item>
    <item>make-up prayers</item>
  </string-array>
  <string-array name="quran_synonyms" translatable="false">
    <item>Quran</item>
    <item>Qur\\'an</item>
    <item>read Quran</item>
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
    <entity
      name="ramadan"
      url="munib-tracker://ramadan"
      alternateName="@array/ramadan_synonyms"/>
    <entity
      name="khatm"
      url="munib-tracker://quran/khatm"
      alternateName="@array/khatm_synonyms"/>
    <entity
      name="qaza"
      url="munib-tracker://qaza"
      alternateName="@array/qaza_synonyms"/>
    <entity
      name="quran"
      url="munib-tracker://quran"
      alternateName="@array/quran_synonyms"/>
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

      // play-services-wearable comes from modules/munib-external-commands and
      // modules/munib-wear (their own Gradle dependencies); :app needs no direct copy.
      return config;
    },
  ]);

  return config;
}

module.exports = withExternalCommandsAndroid;
module.exports.applyExternalCommandsManifest = applyExternalCommandsManifest;
