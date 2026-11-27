/**
 * Config plugin for NF-3.25 "Nearby join" (D41) — phone builds only: app.config.js
 * omits it on TV, where the module is excluded from autolinking (web and TV keep
 * QR / code only).
 *
 * iOS: `NSBluetoothAlwaysUsageDescription` (the one Bluetooth key iOS 13+ reads;
 *   the deployment target is 15.1). No `UIBackgroundModes` — advertising and
 *   scanning run only while the invite screen / Join nearby sheet is open.
 *
 * Android (Bluetooth permissions guide, "Declare Bluetooth permissions"):
 *   - Android 12+: `BLUETOOTH_SCAN` with `neverForLocation` (we never derive
 *     location from scan results) + `BLUETOOTH_ADVERTISE`. No `BLUETOOTH_CONNECT`:
 *     there is no GATT connection.
 *   - Android ≤ 11: legacy `BLUETOOTH` / `BLUETOOTH_ADMIN` capped at
 *     `maxSdkVersion=30`. Scanning there also needs `ACCESS_FINE_LOCATION`, which
 *     expo-location already declares app-wide — this plugin deliberately never
 *     touches the location permissions (adding a `maxSdkVersion` to them would
 *     break location on Android 12+).
 *   - `<uses-feature android.hardware.bluetooth_le required="false">` so Play
 *     doesn't hide the app from devices without BLE (the UI falls back to QR).
 */
const { createRunOncePlugin, withAndroidManifest } = require("@expo/config-plugins");

const DEFAULT_BLUETOOTH_USAGE =
  "Munib Tracker uses Bluetooth only while you invite someone or join a circle nearby, so phones next to each other can find each other. It is never used to find your location.";

/** `[name, attributes]` in manifest order. */
const ANDROID_PERMISSIONS = [
  ["android.permission.BLUETOOTH", { "android:maxSdkVersion": "30" }],
  ["android.permission.BLUETOOTH_ADMIN", { "android:maxSdkVersion": "30" }],
  [
    "android.permission.BLUETOOTH_SCAN",
    { "android:usesPermissionFlags": "neverForLocation", "tools:targetApi": "s" },
  ],
  ["android.permission.BLUETOOTH_ADVERTISE", {}],
];

const BLE_FEATURE = "android.hardware.bluetooth_le";

/** Pure: the Expo config's `ios` block with the Bluetooth usage string (an existing one wins). */
function applyNearbyIos(ios = {}, usage = DEFAULT_BLUETOOTH_USAGE) {
  const infoPlist = { ...(ios.infoPlist ?? {}) };
  infoPlist.NSBluetoothAlwaysUsageDescription =
    infoPlist.NSBluetoothAlwaysUsageDescription ?? usage;
  return { ...ios, infoPlist };
}

/** Pure + idempotent: Bluetooth permissions and the optional BLE feature on a parsed AndroidManifest. */
function applyNearbyAndroidManifest(androidManifest) {
  const manifest = androidManifest.manifest;
  manifest.$ = manifest.$ ?? {};
  manifest.$["xmlns:tools"] = manifest.$["xmlns:tools"] ?? "http://schemas.android.com/tools";

  const perms = manifest["uses-permission"] ?? [];
  for (const [name, attrs] of ANDROID_PERMISSIONS) {
    // Another library already declared it — keep theirs (the merger would conflict otherwise).
    if (perms.some((p) => p.$?.["android:name"] === name)) continue;
    perms.push({ $: { "android:name": name, ...attrs } });
  }
  manifest["uses-permission"] = perms;

  const features = manifest["uses-feature"] ?? [];
  if (!features.some((f) => f.$?.["android:name"] === BLE_FEATURE)) {
    features.push({ $: { "android:name": BLE_FEATURE, "android:required": "false" } });
  }
  manifest["uses-feature"] = features;
  return androidManifest;
}

function withMunibNearby(config, props) {
  config.ios = applyNearbyIos(config.ios, props?.bluetoothUsage);
  return withAndroidManifest(config, (cfg) => {
    cfg.modResults = applyNearbyAndroidManifest(cfg.modResults);
    return cfg;
  });
}

module.exports = createRunOncePlugin(withMunibNearby, "munib-nearby", "1.0.0");
module.exports.applyNearbyIos = applyNearbyIos;
module.exports.applyNearbyAndroidManifest = applyNearbyAndroidManifest;
module.exports.DEFAULT_BLUETOOTH_USAGE = DEFAULT_BLUETOOTH_USAGE;
