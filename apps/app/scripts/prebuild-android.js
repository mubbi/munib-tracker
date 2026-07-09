#!/usr/bin/env node
/**
 * Android prebuild with Munib Tracker version sync from apps/app/.env.
 *
 * 1. Load .env and set EXPO_PREBUILD_PLATFORM=android (app.config.js picks EXPO_ANDROID_APP_VERSION)
 * 2. expo prebuild --platform android
 * 3. Sync marketing version + versionCode into android/app/build.gradle
 */
const path = require("node:path");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
} = require("./lib/release-app-env.cjs");
const { preparePlatformRelease } = require("./lib/platform-versions.cjs");
const {
  syncAndroidVersionName,
  syncAndroidVersionCode,
} = require("./lib/sync-android-versions.cjs");
const {
  DEFAULT_APP_ROOT,
  runStep,
  stopGradleDaemon,
  prepareWindowsAndroidBuild,
} = require("./lib/native-script-utils.cjs");

const appRoot = DEFAULT_APP_ROOT;
const androidDir = path.join(appRoot, "android");

loadAppEnv(appRoot);
assertVersionEnv();
stopGradleDaemon(appRoot);

const prebuildArgs = process.argv.slice(2);
const expoArgs = ["exec", "expo", "prebuild", "--platform", "android", ...prebuildArgs];
const prebuildEnv = {
  ...process.env,
  EXPO_PREBUILD_PLATFORM: "android",
};

runStep("Expo prebuild (Android)", "pnpm", expoArgs, { env: prebuildEnv });

const { marketingVersion } = preparePlatformRelease("android", appRoot);
syncAndroidVersionName(androidDir, marketingVersion, { strict: false });
syncAndroidVersionCode(androidDir, { strict: false });
logReleaseVersionSummary(appRoot, { activePlatform: "android" });
prepareWindowsAndroidBuild(appRoot);

console.log("\nDone. Android native project uses semver from EXPO_ANDROID_APP_VERSION.");
