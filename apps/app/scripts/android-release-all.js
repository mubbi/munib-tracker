#!/usr/bin/env node
/**
 * One-shot local Play release for every Android form factor: phone → Wear OS → Android TV.
 *
 * For each device it bumps the shared EXPO_ANDROID_VERSION_CODE in apps/app/.env (+1 per
 * device, since phone / Wear / TV share one Play package and one versionCode counter), runs
 * the prebuild that device needs, builds the signed AAB, and copies it to the repo root as
 *
 *   <device>-<versionCode>-<versionName>.aab   e.g. mobile-36-2.1.0.aab, wearos-37-2.1.0.aab,
 *                                                     tv-38-1.1.0.aab
 *
 * Phases run strictly one at a time — a clean prebuild wipes android/:
 *   mobile  pnpm cleanbuild:app:android      → pnpm release:app:android     (EXPO_ANDROID_APP_VERSION)
 *   wearos  (reuses the phone tree's `:wear`) → pnpm release:app:wear        (EXPO_ANDROID_APP_VERSION)
 *   tv      pnpm prebuild:app:tv:android     → pnpm release:app:android-tv  (EXPO_ANDROID_TV_APP_VERSION)
 *
 * Usage (from the repo root):
 *   pnpm release:app:android:all                # all three, codes = current + 1, +2, +3
 *   pnpm release:app:android:all --only tv      # subset (mobile,wearos,tv; order kept)
 *   pnpm release:app:android:all --start 40     # first device gets versionCode 40
 *   pnpm release:app:android:all --dry-run      # print the plan, change nothing
 *
 * Root /*.aab is gitignored. Play upload stays a separate, explicit step (release:app:*:upload).
 * Shared runner: scripts/lib/release-all.cjs (also used by ios-release-all.js).
 */
const fs = require("node:fs");
const path = require("node:path");
const { appRoot, run, runReleaseAll } = require("./lib/release-all.cjs");
const { isAndroidTvProject } = require("./lib/tv-native-project.cjs");

const androidDir = path.join(appRoot, "android");
const CODE_KEY = "EXPO_ANDROID_VERSION_CODE";
const PHONE_PREBUILD = ["cleanbuild:app:android"];

/** A clean prebuild hits EBUSY on android/ if adb or a Gradle daemon holds it. */
function releaseAndroidDirLocks() {
  const sdk =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    (process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Android", "Sdk"));
  const adb =
    sdk && path.join(sdk, "platform-tools", process.platform === "win32" ? "adb.exe" : "adb");
  if (adb && fs.existsSync(adb)) run(`"${adb}"`, ["kill-server"], { stdio: "ignore" });
  const gradlew = path.join(androidDir, process.platform === "win32" ? "gradlew.bat" : "gradlew");
  if (fs.existsSync(gradlew)) run(`"${gradlew}"`, ["--stop"], { cwd: androidDir, stdio: "ignore" });
}

/** android/ is already the phone tree with the `:wear` module (e.g. from an earlier phone build). */
function hasPhoneTreeWithWear() {
  const settings = ["settings.gradle", "settings.gradle.kts"]
    .map((f) => path.join(androidDir, f))
    .find((f) => fs.existsSync(f));
  return (
    !!settings &&
    fs.readFileSync(settings, "utf8").includes(":wear") &&
    fs.existsSync(path.join(androidDir, "wear")) &&
    !isAndroidTvProject(appRoot)
  );
}

const artifact =
  (...segments) =>
  () =>
    path.join(androidDir, "play-upload", ...segments);

runReleaseAll({
  title: `Android release (shared ${CODE_KEY})`,
  ext: "aab",
  order: ["mobile", "wearos", "tv"],
  beforePrebuild: releaseAndroidDirLocks,
  reuseNote: "Play rejects reused versionCodes.",
  devices: {
    mobile: {
      codeKey: CODE_KEY,
      versionKey: "EXPO_ANDROID_APP_VERSION",
      prebuild: PHONE_PREBUILD,
      release: ["release:app:android"],
      artifact: artifact("app-release.aab"),
    },
    wearos: {
      codeKey: CODE_KEY,
      versionKey: "EXPO_ANDROID_APP_VERSION",
      // `:wear` only exists in the phone tree — reuse it when present, else clean-prebuild it.
      prebuild: () => (hasPhoneTreeWithWear() ? null : PHONE_PREBUILD),
      release: ["release:app:wear"],
      artifact: artifact("wear", "wear-release.aab"),
    },
    tv: {
      codeKey: CODE_KEY,
      versionKey: "EXPO_ANDROID_TV_APP_VERSION",
      prebuild: ["prebuild:app:tv:android"],
      release: ["release:app:android-tv"],
      artifact: artifact("tv", "app-release.aab"),
    },
  },
});
