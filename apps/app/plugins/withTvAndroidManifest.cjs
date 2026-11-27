const { AndroidConfig, withAndroidManifest } = require("@expo/config-plugins");

/**
 * Leanback manifest hardening for Android TV / Fire TV (`EXPO_TV=1` only).
 *
 * 1. `configChanges` on MainActivity gains `navigation` (Expo's template already
 *    has `keyboard|keyboardHidden`). Bluetooth remotes and gamepads sleep and
 *    reconnect; without these the activity is destroyed and recreated mid-use,
 *    dropping navigation state ("Handle TV controllers" — Android TV docs).
 * 2. Hardware TVs commonly lack is declared `required="false"` so Google Play and
 *    the Amazon Appstore never filter the Leanback build out ("Declare hardware
 *    requirements for TV"; Fire TV device filtering). `@react-native-tvos/config-tv`
 *    already handles touchscreen / faketouch, and `withAndroidOptionalHardware`
 *    handles wifi / camera / microphone / location.
 */
const TV_CONFIG_CHANGES = ["keyboard", "keyboardHidden", "navigation"];

const TV_OPTIONAL_FEATURES = [
  "android.hardware.telephony",
  "android.hardware.bluetooth",
  "android.hardware.bluetooth_le",
  "android.hardware.nfc",
  "android.hardware.sensor.accelerometer",
  "android.hardware.sensor.compass",
  "android.hardware.sensor.gyroscope",
  "android.hardware.screen.portrait",
];

function mergeConfigChanges(current) {
  const parts = String(current ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  for (const change of TV_CONFIG_CHANGES) {
    if (!parts.includes(change)) parts.push(change);
  }
  return parts.join("|");
}

function applyTvManifest(manifest) {
  const activity = AndroidConfig.Manifest.getMainActivity(manifest);
  if (activity) {
    activity.$["android:configChanges"] = mergeConfigChanges(activity.$["android:configChanges"]);
  }

  const features = Array.isArray(manifest.manifest["uses-feature"])
    ? manifest.manifest["uses-feature"]
    : [];
  for (const name of TV_OPTIONAL_FEATURES) {
    const existing = features.find((f) => f.$?.["android:name"] === name);
    if (existing) existing.$["android:required"] = "false";
    else features.push({ $: { "android:name": name, "android:required": "false" } });
  }
  manifest.manifest["uses-feature"] = features;
  return manifest;
}

function withTvAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = applyTvManifest(config.modResults);
    return config;
  });
}

module.exports = withTvAndroidManifest;
module.exports.applyTvManifest = applyTvManifest;
module.exports.mergeConfigChanges = mergeConfigChanges;
module.exports.TV_OPTIONAL_FEATURES = TV_OPTIONAL_FEATURES;
