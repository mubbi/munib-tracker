/**
 * App version metadata from apps/app/.env (see .env.example).
 *
 *   APP_VERSION            – marketing semver (iOS + Android versionName)
 *   ANDROID_VERSION_CODE   – Android versionCode (integer)
 *   IOS_BUILD_NUMBER       – iOS CFBundleVersion (integer string)
 */
const path = require("node:path");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");
const DEFAULT_FALLBACK_VERSION = "1.0.0";
const SEMVER_RE = /^\d{1,5}\.\d{1,5}\.\d{1,5}$/;

function readAppJsonVersion(appRoot = DEFAULT_APP_ROOT) {
  const appJsonPath = path.join(appRoot, "app.json");
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const appJson = require(appJsonPath);
  return appJson.expo?.version?.trim() || DEFAULT_FALLBACK_VERSION;
}

function assertSemver(version, label) {
  if (!SEMVER_RE.test(version)) {
    console.error(`Invalid ${label}: ${version} (expected MAJOR.MINOR.PATCH)`);
    process.exit(1);
  }
}

function resolveMarketingVersion(appRoot = DEFAULT_APP_ROOT) {
  const version = process.env.APP_VERSION?.trim() || readAppJsonVersion(appRoot);
  assertSemver(version, "APP_VERSION");
  return version;
}

function resolveIosBuildNumber() {
  const raw = process.env.IOS_BUILD_NUMBER?.trim() || "1";
  if (!/^\d+$/.test(raw)) {
    console.error(`Invalid IOS_BUILD_NUMBER: ${raw}`);
    process.exit(1);
  }
  return raw;
}

function resolveAndroidVersionCode() {
  const raw = process.env.ANDROID_VERSION_CODE?.trim() || "1";
  const code = Number.parseInt(raw, 10);
  if (!Number.isFinite(code) || code < 1) {
    console.error(`Invalid ANDROID_VERSION_CODE: ${raw}`);
    process.exit(1);
  }
  return code;
}

/**
 * Resolve version metadata and bake APP_VERSION into EXPO_PUBLIC_APP_VERSION for Metro.
 */
function preparePlatformRelease(platform, appRoot = DEFAULT_APP_ROOT) {
  if (platform !== "ios" && platform !== "android") {
    console.error(`preparePlatformRelease supports ios/android only, got: ${platform}`);
    process.exit(1);
  }

  const marketingVersion = resolveMarketingVersion(appRoot);
  process.env.EXPO_PUBLIC_APP_VERSION = marketingVersion;

  if (platform === "ios") {
    return { marketingVersion, buildNumber: resolveIosBuildNumber() };
  }
  return { marketingVersion, versionCode: resolveAndroidVersionCode() };
}

function getVersionEnvSummary(appRoot = DEFAULT_APP_ROOT, { activePlatform } = {}) {
  const fallback = readAppJsonVersion(appRoot);
  const androidRaw = process.env.ANDROID_VERSION_CODE?.trim() || "1";
  const androidCode = Number.parseInt(androidRaw, 10);

  return {
    marketingVersion: process.env.APP_VERSION?.trim() || `${fallback} (app.json fallback)`,
    iosBuildNumber: process.env.IOS_BUILD_NUMBER?.trim() || "1",
    androidVersionCode:
      Number.isFinite(androidCode) && androidCode >= 1
        ? String(androidCode)
        : `${androidRaw} (invalid)`,
    activePlatform: activePlatform || null,
  };
}

module.exports = {
  DEFAULT_APP_ROOT,
  DEFAULT_FALLBACK_VERSION,
  SEMVER_RE,
  readAppJsonVersion,
  resolveMarketingVersion,
  resolveIosBuildNumber,
  resolveAndroidVersionCode,
  preparePlatformRelease,
  getVersionEnvSummary,
};
