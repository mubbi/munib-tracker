#!/usr/bin/env node
/**
 * Upload a signed Apple TV IPA to App Store Connect (altool --type appletvos).
 *
 * Requires credentials in ios-keys/app-store-connect.env.
 * Default IPA: ios/app-store-export-tvos/<Scheme>.ipa from pnpm release:app:tvos.
 *
 * Usage:
 *   pnpm ios:upload:release:tv
 *   node scripts/ios-tv-upload.js --ipa path/to.ipa
 *   node scripts/ios-tv-upload.js --validate-only
 */
const fs = require("node:fs");
const path = require("node:path");
const {
  iosDir,
  SCHEME,
  loadProjectEnv,
  loadAppStoreConnectEnv,
  buildAltoolAuthArgs,
  printAppStoreConnectAuthHelp,
  ensureXcodeCli,
  run,
} = require("./ios-native");

const exportDir = path.join(iosDir, "app-store-export-tvos");
const defaultIpaPath = path.join(exportDir, `${SCHEME}.ipa`);

function parseIpaArg() {
  const idx = process.argv.indexOf("--ipa");
  if (idx >= 0 && process.argv[idx + 1]) {
    return process.argv[idx + 1].trim();
  }
  return null;
}

function resolveTvIpaPath(explicitPath) {
  if (explicitPath) {
    const resolved = path.isAbsolute(explicitPath)
      ? explicitPath
      : path.resolve(path.join(__dirname, ".."), explicitPath);
    if (!fs.existsSync(resolved)) {
      console.error(`\nIPA not found: ${resolved}\n`);
      process.exit(1);
    }
    return resolved;
  }

  if (fs.existsSync(defaultIpaPath)) {
    return defaultIpaPath;
  }
  if (fs.existsSync(exportDir)) {
    const alt = fs.readdirSync(exportDir).find((name) => name.endsWith(".ipa"));
    if (alt) return path.join(exportDir, alt);
  }

  console.error(
    `\nNo Apple TV IPA found.\n` +
      `  Run: pnpm release:app:tvos\n` +
      `  Expected: ${defaultIpaPath}\n` +
      `  Or pass: --ipa /path/to/${SCHEME}.ipa\n`,
  );
  process.exit(1);
}

function main() {
  ensureXcodeCli();
  loadProjectEnv();
  loadAppStoreConnectEnv();

  const validateOnly = process.argv.includes("--validate-only");
  const ipaPath = resolveTvIpaPath(parseIpaArg());
  const auth = buildAltoolAuthArgs();
  if (!auth) {
    printAppStoreConnectAuthHelp();
    process.exit(1);
  }

  // Critical: appletvos — default "ios" rejects / mis-routes tvOS packages.
  const baseArgs = ["-t", "appletvos", "--show-progress", ...auth.args];

  if (auth.method === "api-key" && !auth.p8Path) {
    console.log(
      "Using API key auth (altool will search private_keys/ for AuthKey_<id>.p8).\n" +
        "  Tip: place munib_build_api_AuthKey_<KEY_ID>.p8 in apps/app/ios-keys/\n" +
        "  or set APP_STORE_CONNECT_API_KEY_PATH.\n",
    );
  }

  if (validateOnly) {
    console.log(`\nValidating Apple TV IPA for App Store Connect:\n  ${ipaPath}\n`);
    run("xcrun", ["altool", "--validate-app", ipaPath, ...baseArgs]);
    console.log("\nValidation succeeded. Upload with: pnpm release:app:tvos:upload\n");
    return;
  }

  console.log(`\nUploading Apple TV IPA to App Store Connect:\n  ${ipaPath}\n`);
  run("xcrun", ["altool", "--upload-package", ipaPath, ...baseArgs]);
  console.log(
    "\nUpload submitted (appletvos). Processing in App Store Connect can take several minutes.\n" +
      "  Check the Apple TV app record → TestFlight / Activity (not the iPhone app alone).\n",
  );
}

main();
