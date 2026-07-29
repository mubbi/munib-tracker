#!/usr/bin/env node
/**
 * Verify an AAB/APK is signed with the Play upload certificate.
 * Usage: node scripts/verify-android-upload-aab.js [path-to.aab]
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const defaultAab = path.join(projectRoot, "android/play-upload/app-release.aab");
const expectedFile = path.join(projectRoot, "android/PLAY_UPLOAD_CERT_SHA1.txt");

function normalizeSha1(value) {
  return value.replace(/[^A-Fa-f0-9]/g, "").toUpperCase();
}

function readExpectedSha1() {
  if (!fs.existsSync(expectedFile)) {
    console.error(`Missing ${expectedFile}`);
    process.exit(1);
  }
  const line = fs
    .readFileSync(expectedFile, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#"));
  if (!line) {
    console.error(`No SHA1 in ${expectedFile}`);
    process.exit(1);
  }
  return normalizeSha1(line);
}

function findApksigner() {
  const sdkRoot =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    (process.platform === "win32"
      ? path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk")
      : path.join(process.env.HOME || "", "Library", "Android", "sdk"));
  const buildTools = path.join(sdkRoot, "build-tools");
  if (!fs.existsSync(buildTools)) return null;
  const bin = process.platform === "win32" ? "apksigner.bat" : "apksigner";
  const versions = fs
    .readdirSync(buildTools)
    .filter((name) => fs.existsSync(path.join(buildTools, name, bin)))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  for (const version of versions) {
    const full = path.join(buildTools, version, bin);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

/** AAB is a signed JAR; APK must use apksigner (keytool prints "Not a signed jar file"). */
function readAabSha1(aabPath) {
  const result = spawnSync("keytool", ["-printcert", "-jarfile", aabPath], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "keytool failed");
    process.exit(1);
  }
  const output = `${result.stdout}\n${result.stderr}`;
  const match = output.match(/SHA1:\s*([0-9A-F:]+)/i);
  if (!match) {
    console.error("Could not parse SHA1 from keytool output");
    process.exit(1);
  }
  return normalizeSha1(match[1]);
}

function readApkSha1(apkPath) {
  const apksigner = findApksigner();
  if (!apksigner) {
    console.error(
      "apksigner not found — set ANDROID_HOME or install Android SDK build-tools.\n" +
        "APK signing cannot be checked with keytool -jarfile.",
    );
    process.exit(1);
  }
  const result = spawnSync(apksigner, ["verify", "--print-certs", apkPath], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.status !== 0) {
    console.error(output.trim() || "apksigner failed");
    process.exit(1);
  }
  const match = output.match(/SHA-1 digest:\s*([0-9a-f]+)/i);
  if (!match) {
    console.error("Could not parse SHA-1 digest from apksigner output");
    process.exit(1);
  }
  return normalizeSha1(match[1]);
}

function readArtifactSha1(artifactPath) {
  return artifactPath.toLowerCase().endsWith(".apk")
    ? readApkSha1(artifactPath)
    : readAabSha1(artifactPath);
}

const aabPath = path.resolve(process.argv[2] || defaultAab);
if (!fs.existsSync(aabPath)) {
  console.error(`File not found: ${aabPath}`);
  process.exit(1);
}

const expected = readExpectedSha1();
const actual = readArtifactSha1(aabPath);

const pretty = (hex) => hex.match(/.{1,2}/g)?.join(":") ?? hex;
console.log(`File: ${aabPath}`);
console.log(`SHA1: ${pretty(actual)}`);

if (actual !== expected) {
  console.error("\nWrong upload certificate — do not upload to Play.");
  console.error(`Expected: ${pretty(expected)}`);
  console.error(`Actual:   ${pretty(actual)}`);
  console.error("\nRebuild: pnpm release:app:android");
  process.exit(1);
}

console.log("\nOK — matches Play upload certificate.\n");
process.exit(0);
