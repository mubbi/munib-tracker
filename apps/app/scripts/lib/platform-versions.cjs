/**
 * Per-platform marketing semver from apps/app/.env.
 *
 *   EXPO_IOS_APP_VERSION       – iOS CFBundleShortVersionString / MARKETING_VERSION
 *   EXPO_ANDROID_APP_VERSION   – Android versionName
 *   EXPO_PUBLIC_APP_VERSION    – Web + JS bundle X-App-Version (native release/prebuild set per platform)
 *   EXPO_IOS_APP_BUILD_NUMBER  – iOS CFBundleVersion (integer string)
 *   EXPO_ANDROID_VERSION_CODE  – Android versionCode (integer)
 *
 * Marketing semver falls back to app.json expo.version when a platform env key is unset.
 */
const path = require("node:path");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");
const DEFAULT_FALLBACK_VERSION = "1.0.0";

const SEMVER_RE = /^\d{1,5}\.\d{1,5}\.\d{1,5}$/;

const PLATFORM_ENV_KEYS = {
  ios: "EXPO_IOS_APP_VERSION",
  android: "EXPO_ANDROID_APP_VERSION",
  web: "EXPO_PUBLIC_APP_VERSION",
};

/** EXPO_PUBLIC_APP_VERSION as loaded from .env (before native prebuild/release overwrites it). */
let webVersionFromDotEnv = null;

function captureWebVersionFromDotEnv() {
  webVersionFromDotEnv = process.env.EXPO_PUBLIC_APP_VERSION?.trim() || null;
}

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

function resolvePlatformVersion(platform, appRoot = DEFAULT_APP_ROOT) {
  const envKey = PLATFORM_ENV_KEYS[platform];
  if (!envKey) {
    console.error(`Unknown platform for version resolve: ${platform}`);
    process.exit(1);
  }
  const version = process.env[envKey]?.trim() || readAppJsonVersion(appRoot);
  assertSemver(version, envKey);
  return version;
}

/**
 * Resolve marketing semver, bake EXPO_PUBLIC_APP_VERSION for Metro, return native metadata.
 * Used by iOS/Android prebuild and release scripts.
 */
function preparePlatformRelease(platform, appRoot = DEFAULT_APP_ROOT) {
  if (platform !== "ios" && platform !== "android") {
    console.error(`preparePlatformRelease supports ios/android only, got: ${platform}`);
    process.exit(1);
  }
  const marketingVersion = resolvePlatformVersion(platform, appRoot);
  process.env.EXPO_PUBLIC_APP_VERSION = marketingVersion;
  if (platform === "ios") {
    return { marketingVersion, buildNumber: resolveIosBuildNumber() };
  }
  return { marketingVersion, versionCode: resolveAndroidVersionCode() };
}

function resolveIosBuildNumber() {
  const raw = process.env.EXPO_IOS_APP_BUILD_NUMBER?.trim() || "1";
  if (!/^\d+$/.test(raw)) {
    console.error(`Invalid EXPO_IOS_APP_BUILD_NUMBER: ${raw}`);
    process.exit(1);
  }
  return raw;
}

function resolveAndroidVersionCode() {
  const raw = process.env.EXPO_ANDROID_VERSION_CODE?.trim() || "1";
  const code = Number.parseInt(raw, 10);
  if (!Number.isFinite(code) || code < 1) {
    console.error(`Invalid EXPO_ANDROID_VERSION_CODE: ${raw}`);
    process.exit(1);
  }
  return code;
}

function readEnvOrFallback(envKey, fallback) {
  return process.env[envKey]?.trim() || `${fallback} (app.json fallback)`;
}

/** Resolved values for release/prebuild logging (does not mutate process.env). */
function getVersionEnvSummary(appRoot = DEFAULT_APP_ROOT, { activePlatform } = {}) {
  const fallback = readAppJsonVersion(appRoot);
  const androidRaw = process.env.EXPO_ANDROID_VERSION_CODE?.trim() || "1";
  const androidCode = Number.parseInt(androidRaw, 10);
  const webFromDotEnv =
    webVersionFromDotEnv || readEnvOrFallback("EXPO_PUBLIC_APP_VERSION", fallback);
  const bundleVersion = process.env.EXPO_PUBLIC_APP_VERSION?.trim() || null;
  return {
    iosMarketing: readEnvOrFallback("EXPO_IOS_APP_VERSION", fallback),
    androidMarketing: readEnvOrFallback("EXPO_ANDROID_APP_VERSION", fallback),
    webMarketing: webFromDotEnv,
    iosBuildNumber: process.env.EXPO_IOS_APP_BUILD_NUMBER?.trim() || "1",
    androidVersionCode:
      Number.isFinite(androidCode) && androidCode >= 1
        ? String(androidCode)
        : `${androidRaw} (invalid)`,
    bundleVersion,
    activePlatform: activePlatform || null,
    bundleOverridden: Boolean(
      activePlatform &&
        bundleVersion &&
        webVersionFromDotEnv &&
        bundleVersion !== webVersionFromDotEnv,
    ),
  };
}

module.exports = {
  DEFAULT_APP_ROOT,
  DEFAULT_FALLBACK_VERSION,
  SEMVER_RE,
  PLATFORM_ENV_KEYS,
  captureWebVersionFromDotEnv,
  readAppJsonVersion,
  resolvePlatformVersion,
  preparePlatformRelease,
  resolveIosBuildNumber,
  resolveAndroidVersionCode,
  getVersionEnvSummary,
};
