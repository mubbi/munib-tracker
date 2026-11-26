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
const { spawnSync } = require("node:child_process");
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
  resolveExportIpaPath,
} = require("./ios-native");
const { preparePlatformRelease } = require("./lib/platform-versions.cjs");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
  buildNativeReleaseProcessEnv,
} = require("./lib/release-app-env.cjs");
const {
  applyIosCredentialsEnv,
  buildXcodeAscAuthArgs,
  logIosKeysSummary,
} = require("./lib/ios-keys.cjs");
const { assertIosProjectMode } = require("./lib/tv-native-project.cjs");

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

/**
 * Export the archive to a fresh {@link exportDir}.
 *
 * @param {string[]} authArgs ASC API key args, or `[]` for Xcode's signed-in Apple ID
 * @param {NodeJS.ProcessEnv} env
 * @returns {boolean} whether xcodebuild exited 0
 */
function exportArchive(authArgs, env) {
  fs.rmSync(exportDir, { recursive: true, force: true });
  fs.mkdirSync(exportDir, { recursive: true });
  const result = spawnSync(
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
      ...authArgs,
    ],
    { cwd: iosDir, env, stdio: "inherit", shell: false },
  );
  return result.status === 0;
}

function main() {
  ensureXcodeCli();
  ensureIosProject();
  assertIosProjectMode(appRoot, { expectTv: false });

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

  const { marketingVersion, buildNumber } = preparePlatformRelease("ios", appRoot, {
    requireVersionCodes: true,
  });
  logReleaseVersionSummary(appRoot, { activePlatform: "ios" });
  syncIosMarketingVersion(marketingVersion);
  syncIosBuildNumber(buildNumber);
  try {
    applyIosCredentialsEnv(appRoot, { buildApi: true, signIn: true, apn: true });
  } catch (err) {
    console.error(err instanceof Error ? `\n${err.message}\n` : err);
    process.exit(1);
  }
  logIosKeysSummary(appRoot);
  ensureTeamConfigured();
  cleanXcodeArchiveCaches();
  ensureIosReactCodegen();

  const env = buildNativeReleaseProcessEnv();
  // ASC API key auth (same as ios-tv-release.js): lets -allowProvisioningUpdates refresh the
  // App Store profiles (e.g. after a new capability such as Family Controls is approved)
  // without depending on an Xcode-signed-in Apple ID session.
  const ascAuthArgs = buildXcodeAscAuthArgs(appRoot);

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
      ...ascAuthArgs,
    ],
    { cwd: iosDir, env },
  );

  if (archiveOnly) {
    console.log(`\nArchive:\n  ${archivePath}\n`);
    return;
  }

  console.log(`\nxcodebuild -exportArchive → ${exportDir} …\n`);

  if (!exportArchive(ascAuthArgs, env)) {
    // An API key without "Access to Cloud Managed Distribution Certificate" cannot regenerate
    // the Xcode-managed App Store profile (Apple invalidates it whenever an App ID capability
    // changes): export fails with "Cloud signing permission error" / "No profiles for …".
    // Xcode's signed-in Apple ID account can, so retry the export once without the key.
    console.warn(
      "\nExport with the App Store Connect API key failed — retrying with the Apple ID " +
        "signed in to Xcode (Settings › Accounts)…\n",
    );
    if (!exportArchive([], env)) {
      console.error(
        "\nExport failed with both the API key and the Xcode Apple ID session.\n" +
          "  Sign in to Xcode (Settings › Accounts) as an Admin / Account Holder, or give the\n" +
          "  API key cloud-managed distribution certificate access in App Store Connect\n" +
          "  (Users and Access › Integrations), then re-run.\n",
      );
      process.exit(1);
    }
  }

  const ipaPath = resolveExportIpaPath();
  if (!ipaPath) {
    console.error(`\nMissing IPA under ${exportDir}\n`);
    process.exit(1);
  }

  console.log(
    `\nIPA ready:\n  ${ipaPath}\n\n` +
      `Upload: pnpm release:app:ios:upload\n` +
      `  (setup: pnpm ios:setup-app-store-connect)\n`,
  );
}

main();
