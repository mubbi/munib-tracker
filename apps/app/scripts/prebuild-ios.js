#!/usr/bin/env node
/**
 * iOS prebuild with Munib Tracker version sync from apps/app/.env.
 *
 * 1. Load .env and set EXPO_PREBUILD_PLATFORM=ios (app.config.js picks EXPO_IOS_APP_VERSION)
 * 2. expo prebuild --platform ios
 * 3. pod install when --clean regenerated ios/ (macOS only)
 * 4. Sync marketing version + build number into the Xcode project
 */
const path = require("node:path");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
} = require("./lib/release-app-env.cjs");
const { preparePlatformRelease } = require("./lib/platform-versions.cjs");
const { syncIosBuildNumber, syncIosMarketingVersion } = require("./ios-native");
const { DEFAULT_APP_ROOT, runStep } = require("./lib/native-script-utils.cjs");

const appRoot = DEFAULT_APP_ROOT;
const iosDir = path.join(appRoot, "ios");

loadAppEnv(appRoot);
assertVersionEnv();

const prebuildArgs = process.argv.slice(2);
const isClean = prebuildArgs.includes("--clean");
const expoArgs = ["exec", "expo", "prebuild", "--platform", "ios", ...prebuildArgs];
const prebuildEnv = {
  ...process.env,
  EXPO_PREBUILD_PLATFORM: "ios",
};

runStep("Expo prebuild (iOS)", "pnpm", expoArgs, { env: prebuildEnv });

if (isClean && process.platform === "darwin") {
  runStep("pod install (post-clean prebuild)", "pod", ["install"], {
    cwd: iosDir,
    shell: false,
  });
}

const { marketingVersion, buildNumber } = preparePlatformRelease("ios", appRoot);
syncIosMarketingVersion(marketingVersion, { strict: false });
syncIosBuildNumber(buildNumber, { strict: false });
logReleaseVersionSummary(appRoot, { activePlatform: "ios" });

console.log("\nDone. iOS native project uses semver from EXPO_IOS_APP_VERSION.");
