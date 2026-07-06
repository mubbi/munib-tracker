/**
 * Load apps/app/.env into process.env (without overwriting existing shell vars).
 */
const fs = require("fs");
const path = require("path");

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
  return loadDotEnv(envPath);
}

function assertVersionEnv() {
  const required = ["APP_VERSION", "ANDROID_VERSION_CODE", "IOS_BUILD_NUMBER"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error(
      `\nMissing required version environment variables: ${missing.join(", ")}\n` +
        "  Copy apps/app/.env.example → apps/app/.env and set values.\n",
    );
    process.exit(1);
  }

  const androidVersionCode = Number.parseInt(process.env.ANDROID_VERSION_CODE, 10);
  if (!Number.isFinite(androidVersionCode) || androidVersionCode < 1) {
    console.error("ANDROID_VERSION_CODE must be a positive integer.");
    process.exit(1);
  }

  if (!/^\d+$/.test(process.env.IOS_BUILD_NUMBER)) {
    console.error("IOS_BUILD_NUMBER must be a positive integer string.");
    process.exit(1);
  }
}

function logReleaseVersionSummary(projectRoot, { activePlatform } = {}) {
  const { getVersionEnvSummary } = require("./platform-versions.cjs");
  const summary = getVersionEnvSummary(projectRoot, { activePlatform });
  console.log("\n--- Release versions ---");
  console.log(`  APP_VERSION           = ${summary.marketingVersion}`);
  console.log(`  ANDROID_VERSION_CODE  = ${summary.androidVersionCode}`);
  console.log(`  IOS_BUILD_NUMBER      = ${summary.iosBuildNumber}`);
  if (summary.activePlatform) {
    console.log(`  active platform       = ${summary.activePlatform}`);
  }
  console.log("");
}

function buildNativeReleaseProcessEnv() {
  return {
    ...process.env,
    NODE_ENV: "production",
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
