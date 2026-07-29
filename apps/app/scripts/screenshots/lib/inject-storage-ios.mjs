import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildDemoStoragePairs } from "./demo-data.mjs";
import { runCapture, sleep } from "./shell.mjs";

/** Matches RNCAsyncStorage.mm RCTInlineValueThreshold. */
const INLINE_VALUE_THRESHOLD = 1024;

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

/**
 * Pre-approve custom URL schemes so iOS does not show "Open in App?" on openLink.
 * Survives app clearState; lives in the simulator's LaunchServices preferences.
 */
export function approveIosUrlSchemes(
  udid,
  bundleId,
  schemes = ["munib-tracker", "app.munibtracker", "exp+munib-tracker"],
) {
  const plist = path.join(
    process.env.HOME || os.homedir(),
    "Library/Developer/CoreSimulator/Devices",
    udid,
    "data/Library/Preferences/com.apple.launchservices.schemeapproval.plist",
  );
  fs.mkdirSync(path.dirname(plist), { recursive: true });
  if (!fs.existsSync(plist)) {
    runCapture("plutil", ["-create", "xml1", plist]);
  }
  for (const scheme of schemes) {
    const key = `com.apple.CoreSimulator.CoreSimulatorBridge-->${scheme}`;
    const set = runCapture("/usr/libexec/PlistBuddy", ["-c", `Set :${key} ${bundleId}`, plist]);
    if (!set.ok) {
      runCapture("/usr/libexec/PlistBuddy", ["-c", `Add :${key} string ${bundleId}`, plist]);
    }
  }
}

export function resolveSimulatorUdid(preferredName) {
  const result = runCapture("xcrun", ["simctl", "list", "devices", "available", "-j"]);
  if (!result.ok) throw new Error("xcrun simctl not available (macOS + Xcode required)");
  const data = JSON.parse(result.stdout);
  const runtimes = Object.keys(data.devices);
  const candidates = [];
  for (const rt of runtimes) {
    for (const device of data.devices[rt] ?? []) {
      if (device.isAvailable !== false) candidates.push(device);
    }
  }
  if (preferredName) {
    const match = candidates.find((d) => d.name === preferredName);
    if (match) return match.udid;
  }
  const booted = candidates.find((d) => d.state === "Booted");
  if (booted) return booted.udid;
  const iphone = candidates.find((d) => d.name.includes("iPhone"));
  if (iphone) return iphone.udid;
  throw new Error("No available iOS simulator found");
}

export function bootSimulator(udid) {
  runCapture("xcrun", ["simctl", "boot", udid]);
  runCapture("open", ["-a", "Simulator"]);
  sleep(2_000);
}

export function getAppDataContainer(udid, bundleId) {
  const result = runCapture("xcrun", ["simctl", "get_app_container", udid, bundleId, "data"]);
  if (!result.ok) {
    throw new Error(`App not installed on simulator (${bundleId}). Run: pnpm --filter app ios`);
  }
  return result.stdout.trim();
}

/**
 * Legacy file store used by @react-native-async-storage/async-storage on iOS:
 *   Library/Application Support/<bundleId>/RCTAsyncLocalStorage_V1/{manifest.json, <md5>}
 */
function findFileAsyncStorageDir(containerPath, bundleId) {
  const candidates = [
    path.join(containerPath, "Library", "Application Support", bundleId, "RCTAsyncLocalStorage_V1"),
    path.join(containerPath, "Library", "Application Support", bundleId, "RNCAsyncLocalStorage_V1"),
    path.join(containerPath, "Documents", "RCTAsyncLocalStorage_V1"),
    path.join(containerPath, "Documents", "RNCAsyncLocalStorage_V1"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
  }
  // Walk Application Support for any RCTAsyncLocalStorage_V1 folder.
  const appSupport = path.join(containerPath, "Library", "Application Support");
  if (fs.existsSync(appSupport)) {
    for (const entry of fs.readdirSync(appSupport)) {
      const dir = path.join(appSupport, entry, "RCTAsyncLocalStorage_V1");
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
    }
  }
  return null;
}

/** Optional SQLite backend (older / next-storage layouts). */
function findAsyncStorageDb(containerPath) {
  const candidates = [
    path.join(containerPath, "Library", "LocalDatabase", "AsyncStorage.db"),
    path.join(containerPath, "Documents", "RCTAsyncLocalStorage_V1"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && candidate.endsWith(".db")) return candidate;
  }
  const localDb = path.join(containerPath, "Library", "LocalDatabase");
  if (fs.existsSync(localDb)) {
    for (const file of fs.readdirSync(localDb)) {
      if (file === "AsyncStorage.db") return path.join(localDb, file);
    }
  }
  return null;
}

function md5Key(key) {
  return crypto.createHash("md5").update(key, "utf8").digest("hex");
}

/**
 * Write key/value pairs into RCTAsyncLocalStorage_V1 (manifest + optional value files).
 * Mirrors RNCAsyncStorage `_writeEntry` / inline threshold behavior.
 */
function writeFileAsyncStorage(storageDir, pairs) {
  fs.mkdirSync(storageDir, { recursive: true });
  const manifestPath = path.join(storageDir, "manifest.json");
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {
      manifest = {};
    }
  }

  for (const [key, value] of pairs) {
    const filePath = path.join(storageDir, md5Key(key));
    if (value.length <= INLINE_VALUE_THRESHOLD) {
      manifest[key] = value;
      try {
        fs.unlinkSync(filePath);
      } catch {
        /* ignore */
      }
    } else {
      manifest[key] = null;
      fs.writeFileSync(filePath, value, "utf8");
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest), "utf8");
}

function writeSqliteAsyncStorage(dbPath, pairs) {
  for (const [key, json] of pairs) {
    const sql = `INSERT OR REPLACE INTO Storage (key, value) VALUES ('${sqlEscape(key)}', '${sqlEscape(json)}');`;
    const result = runCapture("sqlite3", [dbPath, sql]);
    if (!result.ok) {
      throw new Error(`iOS storage inject failed for ${key}: ${result.stderr}`);
    }
  }
}

/**
 * Launch once and poll until AsyncStorage directory (or sqlite DB) exists.
 * Debug builds may need Metro to finish bundling before storage is created.
 */
function warmAsyncStorage(udid, bundleId, container) {
  runCapture("xcrun", ["simctl", "launch", udid, bundleId]);
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    sleep(2_000);
    if (findFileAsyncStorageDir(container, bundleId) || findAsyncStorageDb(container)) {
      runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
      sleep(500);
      return;
    }
  }
  runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
}

/**
 * Inject demo storage on iOS Simulator via the host filesystem.
 * Prefers RCTAsyncLocalStorage_V1 (current async-storage); falls back to sqlite.
 */
export function injectDemoStorageIos({ udid, bundleId, locale, theme, resetApp = true }) {
  if (resetApp) {
    runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
    runCapture("xcrun", ["simctl", "privacy", udid, "reset", "all", bundleId]);
    sleep(500);
  }

  // Re-grant permissions after reset so system dialogs do not block Maestro.
  for (const service of ["location", "location-always", "notifications", "photos", "calendar"]) {
    runCapture("xcrun", ["simctl", "privacy", udid, "grant", service, bundleId]);
  }
  approveIosUrlSchemes(udid, bundleId);

  const container = getAppDataContainer(udid, bundleId);
  let fileDir = findFileAsyncStorageDir(container, bundleId);
  let dbPath = findAsyncStorageDb(container);

  if (!fileDir && !dbPath) {
    warmAsyncStorage(udid, bundleId, container);
    fileDir = findFileAsyncStorageDir(container, bundleId);
    dbPath = findAsyncStorageDb(container);
  }

  // Create the Application Support path ourselves if the app never wrote yet
  // (Release cold start can be slow; file format does not require a prior write).
  if (!fileDir && !dbPath) {
    fileDir = path.join(
      container,
      "Library",
      "Application Support",
      bundleId,
      "RCTAsyncLocalStorage_V1",
    );
    fs.mkdirSync(fileDir, { recursive: true });
  }

  const pairs = buildDemoStoragePairs({ locale, theme });

  if (fileDir) {
    writeFileAsyncStorage(fileDir, pairs);
    return;
  }

  if (dbPath) {
    writeSqliteAsyncStorage(dbPath, pairs);
    return;
  }

  throw new Error(`AsyncStorage not found under ${container}`);
}

export function launchIosApp({ udid, bundleId, deepLink }) {
  runCapture("xcrun", ["simctl", "launch", udid, bundleId, deepLink]);
}

export function iosScreenshot({ udid, outPath }) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const result = runCapture("xcrun", ["simctl", "io", udid, "screenshot", outPath]);
  if (!result.ok) throw new Error(`simctl screenshot failed: ${result.stderr}`);
}

export function forceStopIosApp({ udid, bundleId }) {
  runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
}
