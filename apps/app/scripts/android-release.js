#!/usr/bin/env node
/**
 * Build a signed release AAB/APK via Gradle.
 *
 * Loads apps/app/.env for version metadata and EXPO_PUBLIC_* values baked into the bundle.
 * Syncs android-keys/keystore.properties into android/ for Gradle (survives clean prebuild).
 * Verifies the AAB signature matches PLAY_UPLOAD_CERT_SHA1.txt before exiting.
 *
 * Usage:
 *   pnpm android:bundle:release   # Play Store AAB
 *   pnpm android:apk:release      # APK (sideload / local install)
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
  buildNativeReleaseProcessEnv,
} = require("./lib/release-app-env.cjs");
const {
  withAndroidNativeBuildEnv,
  prepareAndroidReleaseBuild,
} = require("./lib/native-script-utils.cjs");
const { preparePlatformRelease } = require("./lib/platform-versions.cjs");
const {
  syncAndroidVersionName,
  syncAndroidVersionCode,
} = require("./lib/sync-android-versions.cjs");
const { ensurePlayUploadCertSha1 } = require("./lib/android-upload-cert.cjs");
const { ensureAndroidReleaseSigning } = require("../plugins/withAndroidReleaseSigning.cjs");

const projectRoot = path.resolve(__dirname, "..");
const androidDir = path.join(projectRoot, "android");
const androidKeysDir = path.join(projectRoot, "android-keys");
const canonicalKeystoreProps = path.join(androidKeysDir, "keystore.properties");
const androidKeystoreProps = path.join(androidDir, "keystore.properties");
const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const task = process.argv.includes("--apk") ? "assembleRelease" : "bundleRelease";
const artifactName = task === "bundleRelease" ? "app-release.aab" : "app-release.apk";
const playUploadDir = path.join(androidDir, "play-upload");
const gradleArtifactDir =
  task === "bundleRelease"
    ? path.join(androidDir, "app", "build", "outputs", "bundle", "release")
    : path.join(androidDir, "app", "build", "outputs", "apk", "release");

const envLoad = loadAppEnv(projectRoot);
if (!envLoad.loaded) {
  console.error(
    "\nMissing apps/app/.env — release builds cannot bake EXPO_PUBLIC_* into the JS bundle.\n" +
      "  Copy apps/app/.env.example → apps/app/.env\n",
  );
  process.exit(1);
}
assertVersionEnv();

/** Prefer android-keys/ (survives clean prebuild); sync into android/ for Gradle. */
function ensureKeystoreProperties() {
  if (fs.existsSync(canonicalKeystoreProps)) {
    fs.mkdirSync(androidDir, { recursive: true });
    fs.copyFileSync(canonicalKeystoreProps, androidKeystoreProps);
    console.log("Using android-keys/keystore.properties (synced to android/keystore.properties)\n");
    return;
  }
  if (fs.existsSync(androidKeystoreProps)) {
    return;
  }
  console.error(
    "\nMissing signing config — release builds need the upload keystore.\n" +
      "  apps/app/android-keys/keystore.properties  (recommended; survives cleanbuild)\n" +
      "  or apps/app/android/keystore.properties\n\n" +
      "See apps/app/android-keys/README.md\n",
  );
  process.exit(1);
}

if (!fs.existsSync(androidDir)) {
  console.error(
    "\nMissing apps/app/android/ — generate the native project first:\n" +
      "  pnpm prebuild:app:android\n",
  );
  process.exit(1);
}

ensureKeystoreProperties();
ensurePlayUploadCertSha1(projectRoot);
ensureAndroidReleaseSigning(projectRoot);

const { marketingVersion } = preparePlatformRelease("android", projectRoot);
logReleaseVersionSummary(projectRoot, { activePlatform: "android" });
syncAndroidVersionName(androidDir, marketingVersion);
syncAndroidVersionCode(androidDir);

prepareAndroidReleaseBuild(projectRoot);

const env = withAndroidNativeBuildEnv(buildNativeReleaseProcessEnv());

console.log(`Gradle :app:${task} (NODE_ENV=production)…\n`);

const result = spawnSync(gradlew, [`:app:${task}`], {
  cwd: androidDir,
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const gradleArtifactPath = path.join(gradleArtifactDir, artifactName);
if (!fs.existsSync(gradleArtifactPath)) {
  console.error(`\nMissing artifact: ${gradleArtifactPath}\n`);
  process.exit(1);
}

let releaseArtifactPath = gradleArtifactPath;
if (task === "bundleRelease") {
  fs.mkdirSync(playUploadDir, { recursive: true });
  releaseArtifactPath = path.join(playUploadDir, artifactName);
  fs.copyFileSync(gradleArtifactPath, releaseArtifactPath);

  const verify = spawnSync(
    process.execPath,
    [path.join(__dirname, "verify-android-upload-aab.js"), releaseArtifactPath],
    { stdio: "inherit" },
  );
  if (verify.status !== 0) {
    process.exit(verify.status ?? 1);
  }
}

console.log(`\nRelease artifact ready:\n  ${releaseArtifactPath}\n`);
