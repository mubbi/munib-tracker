#!/usr/bin/env node
/**
 * Print iOS code signing settings (parity with Gradle signingReport).
 */
const {
  ensureIosProject,
  ensurePodsInstalled,
  workspacePath,
  SCHEME,
  runCapture,
  loadProjectEnv,
  readTeamId,
} = require("./ios-native");

function main() {
  ensureIosProject();
  loadProjectEnv();
  ensurePodsInstalled();

  console.log("\n--- Code signing identities ---\n");
  const identities = runCapture("security", ["find-identity", "-v", "-p", "codesigning"]);
  console.log(identities.stdout || identities.stderr || "(none)");

  console.log("\n--- Xcode build settings (Release) ---\n");
  const settings = runCapture("xcodebuild", [
    "-workspace",
    workspacePath(),
    "-scheme",
    SCHEME,
    "-configuration",
    "Release",
    "-showBuildSettings",
  ]);

  if (settings.status !== 0) {
    console.error(settings.stderr || settings.stdout);
    process.exit(settings.status ?? 1);
  }

  const keys = [
    "DEVELOPMENT_TEAM",
    "CODE_SIGN_IDENTITY",
    "CODE_SIGN_STYLE",
    "PROVISIONING_PROFILE_SPECIFIER",
    "PRODUCT_BUNDLE_IDENTIFIER",
    "MARKETING_VERSION",
    "CURRENT_PROJECT_VERSION",
  ];

  for (const line of (settings.stdout || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    for (const key of keys) {
      if (trimmed.startsWith(`${key} =`)) {
        console.log(trimmed);
      }
    }
  }

  const teamFromEnv = readTeamId();
  if (teamFromEnv) {
    console.log(`\nEXPO_APPLE_TEAM_ID / ios-keys = ${teamFromEnv}`);
  } else {
    console.log(
      "\nNo EXPO_APPLE_TEAM_ID in .env or ios-keys/team.env — set EXPO_APPLE_TEAM_ID in apps/app/.env",
    );
  }
  console.log("");
}

main();
