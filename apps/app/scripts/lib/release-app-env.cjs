/**
 * Load apps/app/.env into process.env (without overwriting existing shell vars).
 */
const fs = require("node:fs");
const path = require("node:path");

const ENV_FILE_NAME = ".env";

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return { loaded: false, path: filePath };
  }
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return { loaded: true, path: filePath };
}

function loadAppEnv(projectRoot) {
  const envPath = path.join(projectRoot, ENV_FILE_NAME);
  const result = loadDotEnv(envPath);
  if (result.loaded) {
    const { captureWebVersionFromDotEnv } = require("./platform-versions.cjs");
    captureWebVersionFromDotEnv();
  }
  return result;
}

function assertVersionEnv() {
  const required = ["EXPO_IOS_APP_BUILD_NUMBER", "EXPO_ANDROID_VERSION_CODE"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error(
      `\nMissing required version environment variables: ${missing.join(", ")}\n` +
        "  Copy apps/app/.env.example → apps/app/.env and set values.\n",
    );
    process.exit(1);
  }

  const androidVersionCode = Number.parseInt(process.env.EXPO_ANDROID_VERSION_CODE, 10);
  if (!Number.isFinite(androidVersionCode) || androidVersionCode < 1) {
    console.error("EXPO_ANDROID_VERSION_CODE must be a positive integer.");
    process.exit(1);
  }

  if (!/^\d+$/.test(process.env.EXPO_IOS_APP_BUILD_NUMBER)) {
    console.error("EXPO_IOS_APP_BUILD_NUMBER must be a positive integer string.");
    process.exit(1);
  }
}

function logReleaseVersionSummary(projectRoot, { activePlatform } = {}) {
  const { getVersionEnvSummary } = require("./platform-versions.cjs");
  const v = getVersionEnvSummary(projectRoot, { activePlatform });
  console.log("\n--- Release versions ---");
  console.log(`  EXPO_IOS_APP_VERSION       → ${v.iosMarketing}`);
  console.log(`  EXPO_IOS_APP_BUILD_NUMBER  → ${v.iosBuildNumber}`);
  console.log(`  EXPO_ANDROID_APP_VERSION   → ${v.androidMarketing}`);
  console.log(`  EXPO_ANDROID_VERSION_CODE  → ${v.androidVersionCode}`);
  console.log(`  EXPO_PUBLIC_APP_VERSION    → ${v.webMarketing} (web .env)`);
  if (v.bundleVersion) {
    const bakeNote = v.bundleOverridden
      ? `baked for ${v.activePlatform} prebuild/release — uses platform marketing semver, not web .env`
      : "used for Metro / X-App-Version";
    console.log(`  JS bundle X-App-Version    → ${v.bundleVersion} (${bakeNote})`);
  } else {
    console.log("  JS bundle X-App-Version    → (not set)");
  }
  console.log("");
}

function resolveSentryReleaseUploadEnv() {
  const hasAuthToken = Boolean(process.env.SENTRY_AUTH_TOKEN?.trim());
  const explicitDisable = process.env.SENTRY_DISABLE_AUTO_UPLOAD === "true";
  const explicitEnable = process.env.SENTRY_DISABLE_AUTO_UPLOAD === "false";

  if (explicitDisable || (!hasAuthToken && !explicitEnable)) {
    return {
      env: { SENTRY_DISABLE_AUTO_UPLOAD: "true" },
      skipReason: explicitDisable
        ? "SENTRY_DISABLE_AUTO_UPLOAD=true"
        : "SENTRY_AUTH_TOKEN is not set",
    };
  }

  return { env: {}, skipReason: null };
}

function buildNativeReleaseProcessEnv() {
  const { env: sentryEnv, skipReason } = resolveSentryReleaseUploadEnv();
  if (skipReason) {
    console.log(
      `Sentry source-map upload disabled for this build (${skipReason}).\n` +
        "  Set SENTRY_AUTH_TOKEN in apps/app/.env to upload maps, or SENTRY_DISABLE_AUTO_UPLOAD=false to force upload.\n",
    );
  }

  return {
    ...process.env,
    ...sentryEnv,
    NODE_ENV: "production",
    EXPO_PUBLIC_APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION,
  };
}

module.exports = {
  ENV_FILE_NAME,
  loadDotEnv,
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
  buildNativeReleaseProcessEnv,
};
