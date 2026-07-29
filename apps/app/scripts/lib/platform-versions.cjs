/**
 * Per-platform versions from apps/app/.env.
 *
 * Marketing semver (Release Please owns committed defaults in package.json, app.json,
 * and .env.example — one product version across platforms; see docs/RELEASES.md):
 *   EXPO_IOS_APP_VERSION            – iPhone CFBundleShortVersionString / MARKETING_VERSION
 *   EXPO_ANDROID_APP_VERSION        – phone Android versionName
 *   EXPO_TVOS_APP_VERSION           – Apple TV CFBundleShortVersionString / MARKETING_VERSION
 *   EXPO_ANDROID_TV_APP_VERSION     – Android TV / Fire TV versionName
 *   EXPO_PUBLIC_APP_VERSION         – Web + JS bundle X-App-Version (native release/prebuild set per platform)
 *
 * Build integers (NOT managed by Release Please — bump manually or via EAS autoIncrement):
 *   EXPO_IOS_APP_BUILD_NUMBER       – iPhone CFBundleVersion (integer string)
 *   EXPO_ANDROID_VERSION_CODE       – phone Android versionCode (integer)
 *   EXPO_TVOS_APP_BUILD_NUMBER      – Apple TV CFBundleVersion (integer string)
 *   EXPO_ANDROID_TV_VERSION_CODE    – Android TV versionCode (integer)
 *
 * Marketing semver falls back to app.json expo.version when a platform env key is unset.
 *
 * Note: phone + Android TV share package app.munibtracker on Play — versionCodes must stay
 * unique and monotonically increasing across both form factors.
 */
const path = require("node:path");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");
const DEFAULT_FALLBACK_VERSION = "1.0.0";

const SEMVER_RE = /^\d{1,5}\.\d{1,5}\.\d{1,5}$/;

/** @typedef {"ios" | "android" | "web" | "tvos" | "android-tv"} VersionPlatform */

const PLATFORM_ENV_KEYS = {
  ios: "EXPO_IOS_APP_VERSION",
  android: "EXPO_ANDROID_APP_VERSION",
  web: "EXPO_PUBLIC_APP_VERSION",
  tvos: "EXPO_TVOS_APP_VERSION",
  "android-tv": "EXPO_ANDROID_TV_APP_VERSION",
};

const IOS_BUILD_NUMBER_ENV_KEYS = {
  ios: "EXPO_IOS_APP_BUILD_NUMBER",
  tvos: "EXPO_TVOS_APP_BUILD_NUMBER",
};

const ANDROID_VERSION_CODE_ENV_KEYS = {
  android: "EXPO_ANDROID_VERSION_CODE",
  "android-tv": "EXPO_ANDROID_TV_VERSION_CODE",
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

/**
 * Map phone prebuild platform + EXPO_TV to the version platform key.
 * @param {"ios" | "android" | "web"} platform
 * @param {{ tv?: boolean }} [opts]
 * @returns {VersionPlatform}
 */
function resolveVersionPlatform(platform, { tv = false } = {}) {
  if (tv && platform === "ios") return "tvos";
  if (tv && platform === "android") return "android-tv";
  return platform;
}

/**
 * @param {VersionPlatform} platform
 * @param {string} [appRoot]
 */
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
 * Used by iOS/Android/TV prebuild and release scripts.
 *
 * @param {"ios" | "android" | "tvos" | "android-tv"} platform
 * @param {string} [appRoot]
 */
function preparePlatformRelease(platform, appRoot = DEFAULT_APP_ROOT) {
  const allowed = new Set(["ios", "android", "tvos", "android-tv"]);
  if (!allowed.has(platform)) {
    console.error(
      `preparePlatformRelease supports ios/android/tvos/android-tv only, got: ${platform}`,
    );
    process.exit(1);
  }
  const marketingVersion = resolvePlatformVersion(platform, appRoot);
  process.env.EXPO_PUBLIC_APP_VERSION = marketingVersion;
  if (platform === "ios" || platform === "tvos") {
    return {
      marketingVersion,
      buildNumber: resolveIosBuildNumber(platform),
      versionEnvKey: PLATFORM_ENV_KEYS[platform],
      buildEnvKey: IOS_BUILD_NUMBER_ENV_KEYS[platform],
    };
  }
  return {
    marketingVersion,
    versionCode: resolveAndroidVersionCode(platform),
    versionEnvKey: PLATFORM_ENV_KEYS[platform],
    buildEnvKey: ANDROID_VERSION_CODE_ENV_KEYS[platform],
  };
}

/**
 * @param {"ios" | "tvos"} [platform]
 */
function resolveIosBuildNumber(platform = "ios") {
  const envKey = IOS_BUILD_NUMBER_ENV_KEYS[platform] || IOS_BUILD_NUMBER_ENV_KEYS.ios;
  const raw = process.env[envKey]?.trim() || "1";
  if (!/^\d+$/.test(raw)) {
    console.error(`Invalid ${envKey}: ${raw}`);
    process.exit(1);
  }
  return raw;
}

/**
 * @param {"android" | "android-tv"} [platform]
 */
function resolveAndroidVersionCode(platform = "android") {
  const envKey = ANDROID_VERSION_CODE_ENV_KEYS[platform] || ANDROID_VERSION_CODE_ENV_KEYS.android;
  const raw = process.env[envKey]?.trim() || "1";
  const code = Number.parseInt(raw, 10);
  if (!Number.isFinite(code) || code < 1) {
    console.error(`Invalid ${envKey}: ${raw}`);
    process.exit(1);
  }
  return code;
}

function readEnvOrFallback(envKey, fallback) {
  return process.env[envKey]?.trim() || `${fallback} (app.json fallback)`;
}

function formatVersionCodeSummary(envKey) {
  const raw = process.env[envKey]?.trim() || "1";
  const code = Number.parseInt(raw, 10);
  return Number.isFinite(code) && code >= 1 ? String(code) : `${raw} (invalid)`;
}

/** Resolved values for release/prebuild logging (does not mutate process.env). */
function getVersionEnvSummary(appRoot = DEFAULT_APP_ROOT, { activePlatform } = {}) {
  const fallback = readAppJsonVersion(appRoot);
  const webFromDotEnv =
    webVersionFromDotEnv || readEnvOrFallback("EXPO_PUBLIC_APP_VERSION", fallback);
  const bundleVersion = process.env.EXPO_PUBLIC_APP_VERSION?.trim() || null;
  return {
    iosMarketing: readEnvOrFallback("EXPO_IOS_APP_VERSION", fallback),
    androidMarketing: readEnvOrFallback("EXPO_ANDROID_APP_VERSION", fallback),
    tvosMarketing: readEnvOrFallback("EXPO_TVOS_APP_VERSION", fallback),
    androidTvMarketing: readEnvOrFallback("EXPO_ANDROID_TV_APP_VERSION", fallback),
    webMarketing: webFromDotEnv,
    iosBuildNumber: process.env.EXPO_IOS_APP_BUILD_NUMBER?.trim() || "1",
    androidVersionCode: formatVersionCodeSummary("EXPO_ANDROID_VERSION_CODE"),
    tvosBuildNumber: process.env.EXPO_TVOS_APP_BUILD_NUMBER?.trim() || "1",
    androidTvVersionCode: formatVersionCodeSummary("EXPO_ANDROID_TV_VERSION_CODE"),
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
  IOS_BUILD_NUMBER_ENV_KEYS,
  ANDROID_VERSION_CODE_ENV_KEYS,
  captureWebVersionFromDotEnv,
  readAppJsonVersion,
  resolveVersionPlatform,
  resolvePlatformVersion,
  preparePlatformRelease,
  resolveIosBuildNumber,
  resolveAndroidVersionCode,
  getVersionEnvSummary,
};
