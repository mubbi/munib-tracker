/**
 * Sync Android versionName / versionCode into android/app/build.gradle.
 */
const fs = require("node:fs");
const path = require("node:path");
const { resolveAndroidVersionCode } = require("./platform-versions.cjs");

function gradlePath(androidDir) {
  return path.join(androidDir, "app", "build.gradle");
}

function readGradle(androidDir) {
  const filePath = gradlePath(androidDir);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return { filePath, contents: fs.readFileSync(filePath, "utf8") };
}

function failOrReturn(strict, message) {
  if (strict) {
    console.error(message);
    process.exit(1);
  }
  return false;
}

function syncAndroidVersionName(
  androidDir,
  versionName,
  { strict = true, envKey = "EXPO_ANDROID_APP_VERSION" } = {},
) {
  const gradle = readGradle(androidDir);
  if (!gradle) {
    return failOrReturn(strict, `Missing ${gradlePath(androidDir)}`);
  }
  if (!/versionName\s+"[^"]*"/.test(gradle.contents)) {
    return failOrReturn(strict, `Could not find versionName in ${gradle.filePath}`);
  }
  const contents = gradle.contents.replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
  fs.writeFileSync(gradle.filePath, contents, "utf8");
  console.log(`Android versionName ${versionName} (${envKey})\n`);
  return true;
}

function syncAndroidVersionCode(
  androidDir,
  { strict = true, versionCode, envKey = "EXPO_ANDROID_VERSION_CODE" } = {},
) {
  const gradle = readGradle(androidDir);
  if (!gradle) {
    return failOrReturn(strict, `Missing ${gradlePath(androidDir)}`);
  }
  const code = versionCode ?? resolveAndroidVersionCode("android");
  if (!/versionCode\s+\d+/.test(gradle.contents)) {
    return failOrReturn(strict, `Could not find versionCode in ${gradle.filePath}`);
  }
  const contents = gradle.contents.replace(/versionCode\s+\d+/, `versionCode ${code}`);
  fs.writeFileSync(gradle.filePath, contents, "utf8");
  console.log(`Android versionCode ${code} (${envKey})\n`);
  return true;
}

module.exports = {
  gradlePath,
  syncAndroidVersionName,
  syncAndroidVersionCode,
};
