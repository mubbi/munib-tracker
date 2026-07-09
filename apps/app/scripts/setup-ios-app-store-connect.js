#!/usr/bin/env node
/**
 * Prepare ios-keys/app-store-connect.env for App Store Connect IPA uploads.
 *
 * Usage:
 *   node scripts/setup-ios-app-store-connect.js
 */
const fs = require("node:fs");
const {
  keysDir,
  appStoreConnectEnvPath,
  appStoreConnectEnvExamplePath,
} = require("./ios-native");

function main() {
  fs.mkdirSync(keysDir, { recursive: true });

  if (!fs.existsSync(appStoreConnectEnvExamplePath)) {
    console.error(`Missing template: ${appStoreConnectEnvExamplePath}`);
    process.exit(1);
  }

  if (fs.existsSync(appStoreConnectEnvPath)) {
    console.log(`Already exists: ${appStoreConnectEnvPath}\n`);
    console.log(
      "Edit issuer ID and ensure munib_build_api_AuthKey_<KEY_ID>.p8 is in ios-keys/.\n",
    );
    console.log("Upload after building IPA:\n  pnpm release:app:ios:upload\n");
    return;
  }

  fs.copyFileSync(appStoreConnectEnvExamplePath, appStoreConnectEnvPath);
  console.log(`Created ${appStoreConnectEnvPath}\n`);
  console.log("Next:");
  console.log("  1. App Store Connect → Users and Access → Integrations → App Store Connect API");
  console.log("  2. Create a key with App Manager (or Admin) access; download the .p8 once");
  console.log("  3. Save as ios-keys/munib_build_api_AuthKey_<KEY_ID>.p8");
  console.log("  4. Fill APP_STORE_CONNECT_API_ISSUER_ID in app-store-connect.env");
  console.log("  5. pnpm release:app:ios          # build IPA");
  console.log("  6. pnpm release:app:ios:upload    # upload to App Store Connect\n");
}

main();
