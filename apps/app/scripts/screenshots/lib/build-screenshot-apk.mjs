import fs from "node:fs";
import path from "node:path";
import { APP_ROOT } from "./config.mjs";
import { log, run, runCapture, warn } from "./shell.mjs";

const ANDROID_DIR = path.join(APP_ROOT, "android");
const APP_BUILD_GRADLE = path.join(ANDROID_DIR, "app", "build.gradle");
const GRADLEW = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const RELEASE_APK = path.join(
  ANDROID_DIR,
  "app",
  "build",
  "outputs",
  "apk",
  "release",
  "app-release.apk",
);
const DEBUG_APK = path.join(
  ANDROID_DIR,
  "app",
  "build",
  "outputs",
  "apk",
  "debug",
  "app-debug.apk",
);

/**
 * Patch release buildType so the APK stays debuggable (run-as storage seed)
 * while still embedding the JS bundle (no Metro / expo-dev-launcher).
 */
function withDebuggableReleaseBuildGradle(fn) {
  if (!fs.existsSync(APP_BUILD_GRADLE)) {
    throw new Error(`Missing ${APP_BUILD_GRADLE}. Run: pnpm prebuild:app:android`);
  }
  const original = fs.readFileSync(APP_BUILD_GRADLE, "utf8");
  const marker = "// munib-screenshot-apk: debuggable release for Maestro captures";
  if (original.includes(marker)) {
    return fn();
  }

  let patched = original;
  // Prefer patching the existing minifyEnabled line inside buildTypes.release so we
  // are not overridden by a later assignment in the same block.
  if (
    /buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?minifyEnabled\s+enableMinifyInReleaseBuilds/.test(
      original,
    )
  ) {
    patched = original.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{)/,
      `$1\n            ${marker}\n            debuggable true\n`,
    );
    patched = patched.replace(
      /minifyEnabled\s+enableMinifyInReleaseBuilds/,
      "minifyEnabled false // munib-screenshot-apk",
    );
  } else {
    patched = original.replace(
      /buildTypes\s*\{[\s\S]*?release\s*\{/,
      (block) =>
        `${block}\n            ${marker}\n            debuggable true\n            minifyEnabled false\n`,
    );
  }
  if (patched === original || !patched.includes(marker)) {
    throw new Error("Could not patch android/app/build.gradle release block for screenshot APK.");
  }

  fs.writeFileSync(APP_BUILD_GRADLE, patched, "utf8");
  try {
    return fn();
  } finally {
    fs.writeFileSync(APP_BUILD_GRADLE, original, "utf8");
  }
}

function resolveGradleEnv() {
  const env = { ...process.env };
  if (process.platform === "win32") {
    env.CMAKE_BUILD_PARALLEL_LEVEL = env.CMAKE_BUILD_PARALLEL_LEVEL ?? "1";
  }
  // Screenshot APKs are local-only — never block on Sentry source-map upload.
  env.SENTRY_DISABLE_AUTO_UPLOAD = "true";
  env.SENTRY_ALLOW_FAILURE = "true";
  env.NODE_ENV = env.NODE_ENV || "production";
  return env;
}

/**
 * Build a self-contained APK (embedded JS) and install it on the device.
 * Prefer release+debuggable so Expo Dev Client / Metro are not required.
 */
export function buildAndInstallScreenshotApk({ adb, serial, skipBuild = false } = {}) {
  let apkPath = null;

  if (!skipBuild) {
    log("Building screenshot APK (release + embedded JS, debuggable for storage seed)…");
    log("This embeds the bundle via Expo export:embed — no Metro needed at runtime.");
    withDebuggableReleaseBuildGradle(() => {
      // Fresh daemon so SENTRY_DISABLE_AUTO_UPLOAD from env is visible to sentry.gradle.
      runCapture(GRADLEW, ["--stop"], {
        cwd: ANDROID_DIR,
        env: resolveGradleEnv(),
        shell: process.platform === "win32",
      });
      run(GRADLEW, [":app:assembleRelease"], {
        cwd: ANDROID_DIR,
        env: resolveGradleEnv(),
        shell: process.platform === "win32",
      });
    });
    apkPath = RELEASE_APK;
  } else if (fs.existsSync(RELEASE_APK)) {
    warn(`SKIP_BUILD=1 — reusing existing release APK: ${RELEASE_APK}`);
    apkPath = RELEASE_APK;
  } else if (fs.existsSync(DEBUG_APK)) {
    warn(
      `SKIP_BUILD=1 — no release APK; installing debug APK (may still need Metro): ${DEBUG_APK}`,
    );
    apkPath = DEBUG_APK;
  } else {
    throw new Error(
      "No APK found. Re-run without SKIP_BUILD=1, or build first with pnpm screenshots:android",
    );
  }

  if (!fs.existsSync(apkPath)) {
    throw new Error(`APK missing after build: ${apkPath}`);
  }

  log(`Installing APK on ${serial || "device"}…`);
  const args = serial
    ? ["-s", serial, "install", "-r", "-d", "--no-incremental", apkPath]
    : ["install", "-r", "-d", "--no-incremental", apkPath];
  const result = runCapture(adb, args);
  if (!result.ok) {
    // Fallback without --no-incremental for older adb
    const fallback = runCapture(
      adb,
      serial ? ["-s", serial, "install", "-r", "-d", apkPath] : ["install", "-r", "-d", apkPath],
    );
    if (!fallback.ok) {
      throw new Error(
        `adb install failed:\n${result.stderr || result.stdout}\n${fallback.stderr || fallback.stdout}`,
      );
    }
  }
  log(`Installed: ${apkPath}`);
  return apkPath;
}

/** Cold-start the launcher activity (not the Expo Dev Client deep link). */
export function launchScreenshotApp({ adb, packageId }) {
  // Pre-grant runtime permissions so system dialogs do not block Maestro.
  for (const permission of [
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.CAMERA",
    "android.permission.RECORD_AUDIO",
    "android.permission.READ_MEDIA_IMAGES",
    "android.permission.ACTIVITY_RECOGNITION",
    "android.permission.SCHEDULE_EXACT_ALARM",
  ]) {
    runCapture(adb, ["shell", "pm", "grant", packageId, permission]);
  }

  // Force-stop first so seeded AsyncStorage is read on a clean process.
  runCapture(adb, ["shell", "am", "force-stop", packageId]);
  const result = runCapture(adb, [
    "shell",
    "am",
    "start",
    "-n",
    `${packageId}/.MainActivity`,
    "-a",
    "android.intent.action.MAIN",
    "-c",
    "android.intent.category.LAUNCHER",
  ]);
  if (!result.ok) {
    // Some Expo apps use a different activity name
    runCapture(adb, [
      "shell",
      "monkey",
      "-p",
      packageId,
      "-c",
      "android.intent.category.LAUNCHER",
      "1",
    ]);
  }
}

export { DEBUG_APK, RELEASE_APK };
