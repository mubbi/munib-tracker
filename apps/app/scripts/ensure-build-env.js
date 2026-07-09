#!/usr/bin/env node

const path = require("node:path");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
} = require("./lib/release-app-env.cjs");
const { applyIosCredentialsEnv, requireIosKey, logIosKeysSummary } = require("./lib/ios-keys.cjs");

const appRoot = path.join(__dirname, "..");
const iosEas = process.argv.includes("--ios-eas");

loadAppEnv(appRoot);
assertVersionEnv();

try {
  applyIosCredentialsEnv(appRoot, {
    buildApi: iosEas,
    signIn: iosEas,
    apn: iosEas,
  });
} catch (err) {
  console.error(err instanceof Error ? `\n${err.message}\n` : err);
  process.exit(1);
}

if (iosEas) {
  requireIosKey(appRoot, "buildApi");
  requireIosKey(appRoot, "signIn");
  requireIosKey(appRoot, "apn");

  const issuer =
    process.env.EXPO_ASC_API_KEY_ISSUER_ID?.trim() || process.env.EXPO_ASC_ISSUER_ID?.trim();
  if (!issuer) {
    console.error(
      "\nMissing App Store Connect Issuer ID for EAS builds.\n" +
        "  Copy apps/app/ios-keys/keys.env.example → apps/app/ios-keys/keys.env\n" +
        "  and set EXPO_ASC_API_KEY_ISSUER_ID.\n",
    );
    process.exit(1);
  }
}

logReleaseVersionSummary(appRoot);
logIosKeysSummary(appRoot);
