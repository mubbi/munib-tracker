#!/usr/bin/env node
/**
 * Archive and export a signed App Store IPA via xcodebuild.
 *
 * Loads apps/app/.env for EXPO_PUBLIC_* and version metadata.
 * Team ID: EXPO_APPLE_TEAM_ID in .env or ios-keys/team.env.
 *
 * Usage:
 *   pnpm ios:archive:release
 *   node scripts/ios-release.js --archive-only
 */
const fs = require("node:fs");
const path = require("node:path");
const {
  iosDir,
  exportOptionsPath,
  exportDir,
  SCHEME,
  WORKSPACE_NAME,
  ARCHIVE_NAME,
  loadProjectEnv,
  run,
  ensureIosProject,
  readTeamId,
  syncDevelopmentTeam,
  syncIosBuildNumber,
  syncIosMarketingVersion,
  ensureExportOptionsPlist,
  ensureXcodeCli,
  ensurePodsInstalled,
  ensureJsBundleDeps,
  ensureIosReactCodegen,
  cleanXcodeArchiveCaches,
} = require("./ios-native");
const { preparePlatformRelease } = require("./lib/platform-versions.cjs");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
  buildNativeReleaseProcessEnv,
} = require("./lib/release-app-env.cjs");

const archiveOnly = process.argv.includes("--archive-only");
const appRoot = path.join(__dirname, "..");
const buildDir = path.join(iosDir, "build");
const archivePath = path.join(buildDir, ARCHIVE_NAME);

function ensureTeamConfigured() {
  const teamId = readTeamId();
  if (!teamId) {
    console.error(
      "\nMissing Apple Team ID.\n" +
        "  Set EXPO_APPLE_TEAM_ID in apps/app/.env\n" +
        "  or create apps/app/ios-keys/team.env with IOS_DEVELOPMENT_TEAM=XXXXXXXXXX\n",
    );
    process.exit(1);
  }
  syncDevelopmentTeam(teamId);
  ensureExportOptionsPlist(teamId);
  if (!fs.existsSync(exportOptionsPath)) {
    console.error(`Missing ${exportOptionsPath}`);
    process.exit(1);
  }
  return teamId;
}

function resolveExportIpaPath() {
  if (!fs.existsSync(exportDir)) {
    return null;
  }
  const alt = fs.readdirSync(exportDir).find((name) => name.endsWith(".ipa"));
  return alt ? path.join(exportDir, alt) : null;
}

function main() {
  ensureXcodeCli();
  ensureIosProject();

  const envLoad = loadAppEnv(appRoot);
  if (!envLoad.loaded) {
    console.error(
      "\nMissing apps/app/.env — release builds cannot bake EXPO_PUBLIC_* into the JS bundle.\n" +
        "  Copy apps/app/.env.example → apps/app/.env\n",
    );
    process.exit(1);
  }
  assertVersionEnv();

  ensureJsBundleDeps();
  ensurePodsInstalled();
  loadProjectEnv();

  const { marketingVersion, buildNumber } = preparePlatformRelease("ios", appRoot);
  logReleaseVersionSummary(appRoot, { activePlatform: "ios" });
  syncIosMarketingVersion(marketingVersion);
  syncIosBuildNumber(buildNumber);
  ensureTeamConfigured();
  cleanXcodeArchiveCaches();
  ensureIosReactCodegen();

  const env = buildNativeReleaseProcessEnv();

  fs.mkdirSync(buildDir, { recursive: true });

  console.log(`\nxcodebuild archive (scheme ${SCHEME}, Release)…\n`);

  run(
    "xcodebuild",
    [
      "-workspace",
      WORKSPACE_NAME,
      "-scheme",
      SCHEME,
      "-configuration",
      "Release",
      "-destination",
      "generic/platform=iOS",
      "-archivePath",
      archivePath,
      "archive",
      "-allowProvisioningUpdates",
    ],
    { cwd: iosDir, env },
  );

  if (archiveOnly) {
    console.log(`\nArchive:\n  ${archivePath}\n`);
    return;
  }

  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  fs.mkdirSync(exportDir, { recursive: true });

  console.log(`\nxcodebuild -exportArchive → ${exportDir} …\n`);

  run(
    "xcodebuild",
    [
      "-exportArchive",
      "-archivePath",
      archivePath,
      "-exportPath",
      exportDir,
      "-exportOptionsPlist",
      exportOptionsPath,
      "-allowProvisioningUpdates",
    ],
    { cwd: iosDir, env },
  );

  const ipaPath = resolveExportIpaPath();
  if (!ipaPath) {
    console.error(`\nMissing IPA under ${exportDir}\n`);
    process.exit(1);
  }

  console.log(`\nIPA ready:\n  ${ipaPath}\n`);
}

main();
