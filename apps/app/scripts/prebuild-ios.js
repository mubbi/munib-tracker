#!/usr/bin/env node
/**
 * iOS prebuild with Munib Tracker version sync from apps/app/.env.
 *
 * 1. Load .env and set EXPO_PREBUILD_PLATFORM=ios (app.config.js picks EXPO_IOS_APP_VERSION)
 * 2. expo prebuild --platform ios
 * 3. Restore trailing newlines on apple-targets xcassets JSON (Biome)
 * 4. pod install when --clean regenerated ios/ (macOS only)
 * 5. Sync marketing version + build number into the Xcode project
 */
const fs = require("node:fs");
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
ensureTargetXcassetsTrailingNewlines(appRoot);

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

/**
 * `@bacons/apple-targets` rewrites widget/watch `Contents.json` without a trailing
 * newline, which fails Biome and the pre-push hook. Re-add it after prebuild.
 *
 * @param {string} appRoot
 */
function ensureTargetXcassetsTrailingNewlines(appRoot) {
  const targetsDir = path.join(appRoot, "targets");
  if (!fs.existsSync(targetsDir)) {
    return;
  }

  /** @param {string} dir */
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (
        entry.name !== "Contents.json" ||
        !full.includes(`${path.sep}Assets.xcassets${path.sep}`)
      ) {
        continue;
      }
      const text = fs.readFileSync(full, "utf8");
      if (text.length > 0 && !text.endsWith("\n")) {
        fs.writeFileSync(full, `${text}\n`);
      }
    }
  }

  walk(targetsDir);
}
