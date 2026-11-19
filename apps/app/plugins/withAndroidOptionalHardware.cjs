const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Permissions in the merged manifest imply `<uses-feature required="true">` for
 * hardware the app can live without, and Play then hides the app from devices
 * lacking it (e.g. `ACCESS_WIFI_STATE` → `android.hardware.wifi`, which blocks
 * some phones, tablets, ChromeOS and Android XR). Every feature here is
 * gated at runtime, so declare each one explicitly optional.
 *
 * https://developer.android.com/guide/topics/manifest/uses-feature-element#permissions
 */
const OPTIONAL_FEATURES = [
  // ACCESS_WIFI_STATE (added by a library dependency) — connectivity checks only.
  "android.hardware.wifi",
  // CAMERA — optional image picking.
  "android.hardware.camera",
  "android.hardware.camera.autofocus",
  // RECORD_AUDIO — Qur'an practice only.
  "android.hardware.microphone",
  // ACCESS_*_LOCATION — manual location fallback exists.
  "android.hardware.location",
  "android.hardware.location.gps",
  "android.hardware.location.network",
];

function withAndroidOptionalHardware(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const features = Array.isArray(manifest["uses-feature"]) ? manifest["uses-feature"] : [];

    for (const name of OPTIONAL_FEATURES) {
      const existing = features.find((f) => f.$?.["android:name"] === name);
      if (existing) {
        existing.$["android:required"] = "false";
      } else {
        features.push({ $: { "android:name": name, "android:required": "false" } });
      }
    }

    manifest["uses-feature"] = features;
    return config;
  });
}

module.exports = withAndroidOptionalHardware;
module.exports.OPTIONAL_FEATURES = OPTIONAL_FEATURES;
