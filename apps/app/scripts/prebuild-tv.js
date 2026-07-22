#!/usr/bin/env node
/**
 * TV prebuild (Apple TV / Android TV) with Munib Tracker version sync.
 *
 * Sets EXPO_TV=1 so @react-native-tvos/config-tv rewrites native projects for
 * tvOS + Leanback, and so app.config.js omits phone-only plugins (widgets,
 * Watch, Wear, App Intents, quick actions).
 *
 * Switching TV ↔ phone always needs --clean. Usage:
 *   node scripts/prebuild-tv.js [--clean] [--platform android|ios]
 *   (default: both platforms)
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
const { syncIosBuildNumber, syncIosMarketingVersion } = require("./ios-native");
const {
  DEFAULT_APP_ROOT,
  runStep,
  stopGradleDaemon,
  prepareWindowsAndroidBuild,
} = require("./lib/native-script-utils.cjs");

const appRoot = DEFAULT_APP_ROOT;
const androidDir = path.join(appRoot, "android");
const iosDir = path.join(appRoot, "ios");

loadAppEnv(appRoot);
assertVersionEnv();

const rawArgs = process.argv.slice(2);
const isClean = rawArgs.includes("--clean");
const platformIdx = rawArgs.indexOf("--platform");
const platformArg = platformIdx >= 0 && rawArgs[platformIdx + 1] ? rawArgs[platformIdx + 1] : null;
const platforms =
  platformArg === "android" || platformArg === "ios" ? [platformArg] : ["android", "ios"];

const passthrough = rawArgs.filter((arg, i) => {
  if (arg === "--platform") return false;
  if (platformIdx >= 0 && i === platformIdx + 1) return false;
  return true;
});

const tvEnv = {
  ...process.env,
  EXPO_TV: "1",
};

for (const platform of platforms) {
  if (platform === "android") stopGradleDaemon(appRoot);

  const expoArgs = ["exec", "expo", "prebuild", "--platform", platform, ...passthrough];
  const prebuildEnv = {
    ...tvEnv,
    EXPO_PREBUILD_PLATFORM: platform,
  };

  runStep(`Expo prebuild (TV / ${platform})`, "pnpm", expoArgs, { env: prebuildEnv });

  if (platform === "android") {
    const { marketingVersion } = preparePlatformRelease("android", appRoot);
    syncAndroidVersionName(androidDir, marketingVersion, { strict: false });
    syncAndroidVersionCode(androidDir, { strict: false });
    prepareWindowsAndroidBuild(appRoot);
  }

  if (platform === "ios") {
    if (isClean && process.platform === "darwin") {
      runStep("pod install (post-clean TV prebuild)", "pod", ["install"], {
        cwd: iosDir,
        shell: false,
      });
    }
    const { marketingVersion, buildNumber } = preparePlatformRelease("ios", appRoot);
    syncIosMarketingVersion(marketingVersion, { strict: false });
    syncIosBuildNumber(buildNumber, { strict: false });
  }
}

logReleaseVersionSummary(appRoot, {
  activePlatform: platforms.length === 1 ? platforms[0] : "web",
});

console.log(
  "\nDone. TV native project generated with EXPO_TV=1." +
    "\nRevert to phone: unset EXPO_TV and run pnpm cleanbuild:app:android / cleanbuild:app:ios.",
);
