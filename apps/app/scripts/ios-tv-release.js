#!/usr/bin/env node
/**
 * Archive and export a signed Apple TV (tvOS) IPA via xcodebuild.
 *
 * Requires EXPO_TV=1 prebuild (`pnpm prebuild:app:tv:ios`). Destination is
 * generic/platform=tvOS — not iPhone. Upload with pnpm release:app:tvos:upload
 * (altool --type appletvos).
 *
 * Usage:
 *   pnpm ios:archive:release:tv
 *   node scripts/ios-tv-release.js --archive-only
 */
const fs = require("node:fs");
const path = require("node:path");
const {
  iosDir,
  exportOptionsPath,
  SCHEME,
  WORKSPACE_NAME,
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
const { applyIosCredentialsEnv, logIosKeysSummary } = require("./lib/ios-keys.cjs");
const { assertIosProjectMode, enableExpoTvEnv } = require("./lib/tv-native-project.cjs");

const archiveOnly = process.argv.includes("--archive-only");
const appRoot = path.join(__dirname, "..");
const buildDir = path.join(iosDir, "build");
const archivePath = path.join(buildDir, `${SCHEME}-tvos.xcarchive`);
const exportDir = path.join(iosDir, "app-store-export-tvos");

enableExpoTvEnv();

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
  if (!fs.existsSync(exportDir)) return null;
  const named = path.join(exportDir, `${SCHEME}.ipa`);
  if (fs.existsSync(named)) return named;
  const alt = fs.readdirSync(exportDir).find((name) => name.endsWith(".ipa"));
  return alt ? path.join(exportDir, alt) : null;
}

function main() {
  ensureXcodeCli();
  ensureIosProject();
  assertIosProjectMode(appRoot, { expectTv: true });

  const envLoad = loadAppEnv(appRoot);
  if (!envLoad.loaded) {
    console.error(
      "\nMissing apps/app/.env — release builds cannot bake EXPO_PUBLIC_* into the JS bundle.\n" +
        "  Copy apps/app/.env.example → apps/app/.env\n",
    );
    process.exit(1);
  }
  assertVersionEnv({ tv: true });

  ensureJsBundleDeps();
  ensurePodsInstalled();
  loadProjectEnv();

  const { marketingVersion, buildNumber, versionEnvKey, buildEnvKey } = preparePlatformRelease(
    "tvos",
    appRoot,
  );
  logReleaseVersionSummary(appRoot, { activePlatform: "tvos" });
  syncIosMarketingVersion(marketingVersion, { envKey: versionEnvKey });
  syncIosBuildNumber(buildNumber, { envKey: buildEnvKey });
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
  env.EXPO_TV = "1";

  fs.mkdirSync(buildDir, { recursive: true });

  console.log(`\nxcodebuild archive (scheme ${SCHEME}, tvOS Release)…\n`);

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
      "generic/platform=tvOS",
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

  console.log(
    `\nApple TV IPA ready:\n  ${ipaPath}\n\n` +
      `Upload: pnpm release:app:tvos:upload\n` +
      `  (altool --type appletvos; setup: pnpm ios:setup-app-store-connect)\n` +
      `  tvOS needs its own provisioning profiles (local credentials recommended).\n`,
  );
}

main();
