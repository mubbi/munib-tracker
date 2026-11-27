/**
 * Config plugin for NF-3.13 Salah focus lock (phone builds only — app.config.js
 * omits it on TV, where the module is excluded from autolinking).
 *
 * iOS (when the hard block is on — the default; `EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0` turns it off, D17):
 *   - `com.apple.developer.family-controls` on the app (the three extensions in
 *     `targets/munib-tracker-focus-*` declare it in their expo-target.config.js);
 *   - the shared App Group (plan + selection live there);
 *   - `BGTaskSchedulerPermittedIdentifiers` + `fetch` for the re-arm BGAppRefreshTask.
 *   Without the flag nothing is added and iOS ships the soft in-app prompt.
 *
 * Android: usage access, overlay, `specialUse` foreground service, boot and
 * notification permissions, plus a `<queries>` launcher intent so the picker
 * can list apps without QUERY_ALL_PACKAGES. The service / receivers themselves
 * are declared in the module's own AndroidManifest.xml (merged at build time).
 * The Accessibility API is deliberately not used (Play policy).
 */
const { createRunOncePlugin, withAndroidManifest } = require("@expo/config-plugins");

const FAMILY_CONTROLS = "com.apple.developer.family-controls";
const APP_GROUPS = "com.apple.security.application-groups";
const DEFAULT_APP_GROUP = "group.app.munibtracker.widgets";
const BG_TASK_ID = "app.munibtracker.focuslock.refresh";

const ANDROID_PERMISSIONS = [
  "android.permission.PACKAGE_USAGE_STATS",
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_SPECIAL_USE",
  "android.permission.RECEIVE_BOOT_COMPLETED",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.SCHEDULE_EXACT_ALARM",
];

/**
 * True when the iOS hard block is enabled for this build. Apple granted the Family Controls
 * (Distribution) entitlement on 2026-11-24, so it is ON by default; set
 * `EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0` to build the D17 soft-prompt fallback instead.
 */
function isHardIosEnabled(props) {
  if (props && typeof props.hardIos === "boolean") return props.hardIos;
  const v = process.env.EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS?.trim().toLowerCase();
  return v !== "0" && v !== "false";
}

function uniq(list) {
  return [...new Set(list)];
}

/** Pure: the Expo config's `ios` block with the focus-lock entitlements / plist keys. */
function applyFocusLockIos(ios = {}, hardIos = false) {
  if (!hardIos) return ios;
  const entitlements = { ...(ios.entitlements ?? {}) };
  entitlements[FAMILY_CONTROLS] = true;
  entitlements[APP_GROUPS] = uniq([...(entitlements[APP_GROUPS] ?? []), DEFAULT_APP_GROUP]);
  const infoPlist = { ...(ios.infoPlist ?? {}) };
  infoPlist.BGTaskSchedulerPermittedIdentifiers = uniq([
    ...(infoPlist.BGTaskSchedulerPermittedIdentifiers ?? []),
    BG_TASK_ID,
  ]);
  infoPlist.UIBackgroundModes = uniq([...(infoPlist.UIBackgroundModes ?? []), "fetch"]);
  return { ...ios, entitlements, infoPlist };
}

/** Pure: adds permissions and the launcher `<queries>` intent to a parsed AndroidManifest. */
function applyFocusLockAndroidManifest(androidManifest) {
  const manifest = androidManifest.manifest;
  manifest.$ = manifest.$ ?? {};
  manifest.$["xmlns:tools"] = manifest.$["xmlns:tools"] ?? "http://schemas.android.com/tools";

  const perms = manifest["uses-permission"] ?? [];
  for (const name of ANDROID_PERMISSIONS) {
    if (perms.some((p) => p.$?.["android:name"] === name)) continue;
    const entry = { $: { "android:name": name } };
    // Granted by the user in Settings › Usage access, not at install time.
    if (name.endsWith("PACKAGE_USAGE_STATS")) entry.$["tools:ignore"] = "ProtectedPermissions";
    perms.push(entry);
  }
  manifest["uses-permission"] = perms;

  const queries = manifest.queries ?? [{}];
  const query = queries[0];
  query.intent = query.intent ?? [];
  const hasLauncher = query.intent.some(
    (intent) =>
      intent.action?.some((a) => a.$?.["android:name"] === "android.intent.action.MAIN") &&
      intent.category?.some((c) => c.$?.["android:name"] === "android.intent.category.LAUNCHER"),
  );
  if (!hasLauncher) {
    query.intent.push({
      action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
      category: [{ $: { "android:name": "android.intent.category.LAUNCHER" } }],
    });
  }
  manifest.queries = queries;
  return androidManifest;
}

function withMunibFocusLock(config, props) {
  config.ios = applyFocusLockIos(config.ios, isHardIosEnabled(props));
  return withAndroidManifest(config, (cfg) => {
    cfg.modResults = applyFocusLockAndroidManifest(cfg.modResults);
    return cfg;
  });
}

module.exports = createRunOncePlugin(withMunibFocusLock, "munib-focus-lock", "1.0.0");
module.exports.applyFocusLockIos = applyFocusLockIos;
module.exports.applyFocusLockAndroidManifest = applyFocusLockAndroidManifest;
module.exports.isHardIosEnabled = isHardIosEnabled;
module.exports.FOCUS_LOCK_TARGET_GLOB = "munib-tracker-focus-*";
module.exports.BG_TASK_ID = BG_TASK_ID;
