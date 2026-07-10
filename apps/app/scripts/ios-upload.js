#!/usr/bin/env node
/**
 * Upload a signed App Store IPA to App Store Connect (altool / Transporter backend).
 *
 * Requires credentials in ios-keys/app-store-connect.env (see setup-ios-app-store-connect.js).
 * API key file: ios-keys/munib_build_api_AuthKey_<KEY_ID>.p8
 * Default IPA: ios/app-store-export/<Scheme>.ipa from pnpm release:app:ios.
 *
 * Usage:
 *   pnpm ios:upload:release
 *   node scripts/ios-upload.js --ipa path/to.ipa
 *   node scripts/ios-upload.js --validate-only
 */
const {
  loadProjectEnv,
  loadAppStoreConnectEnv,
  resolveReleaseIpaPath,
  buildAltoolAuthArgs,
  printAppStoreConnectAuthHelp,
  ensureXcodeCli,
  run,
} = require("./ios-native");

function parseIpaArg() {
  const idx = process.argv.indexOf("--ipa");
  if (idx >= 0 && process.argv[idx + 1]) {
    return process.argv[idx + 1].trim();
  }
  return null;
}

function main() {
  ensureXcodeCli();
  loadProjectEnv();
  loadAppStoreConnectEnv();

  const validateOnly = process.argv.includes("--validate-only");
  const ipaPath = resolveReleaseIpaPath(parseIpaArg());
  const auth = buildAltoolAuthArgs();
  if (!auth) {
    printAppStoreConnectAuthHelp();
    process.exit(1);
  }

  const baseArgs = ["-t", "ios", "--show-progress", ...auth.args];

  if (auth.method === "api-key" && !auth.p8Path) {
    console.log(
      "Using API key auth (altool will search private_keys/ for AuthKey_<id>.p8).\n" +
        "  Tip: place munib_build_api_AuthKey_<KEY_ID>.p8 in apps/app/ios-keys/\n" +
        "  or set APP_STORE_CONNECT_API_KEY_PATH.\n",
    );
  }

  if (validateOnly) {
    console.log(`\nValidating IPA for App Store Connect:\n  ${ipaPath}\n`);
    run("xcrun", ["altool", "--validate-app", ipaPath, ...baseArgs]);
    console.log("\nValidation succeeded. Upload with: pnpm release:app:ios:upload\n");
    return;
  }

  console.log(`\nUploading IPA to App Store Connect:\n  ${ipaPath}\n`);
  run("xcrun", ["altool", "--upload-package", ipaPath, ...baseArgs]);
  console.log(
    "\nUpload submitted. Processing in App Store Connect can take several minutes.\n" +
      "  Check TestFlight / App Store Connect → your app → TestFlight or Activity.\n" +
      "  You will receive email when processing completes.\n",
  );
}

main();
