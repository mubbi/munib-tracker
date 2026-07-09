import fs from "node:fs";
import path from "node:path";
import { buildDemoStoragePairs } from "./demo-data.mjs";
import { runCapture, sleep } from "./shell.mjs";

function sqlEscape(value) {
  return value.replace(/'/g, "''");
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

function findAsyncStorageDb(containerPath) {
  const candidates = [
    path.join(containerPath, "Library", "LocalDatabase", "AsyncStorage.db"),
    path.join(containerPath, "Documents", "RCTAsyncLocalStorage_V1"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && candidate.endsWith(".db")) return candidate;
  }
  // Walk for AsyncStorage.db (RN 0.76+ layout varies)
  const localDb = path.join(containerPath, "Library", "LocalDatabase");
  if (fs.existsSync(localDb)) {
    for (const file of fs.readdirSync(localDb)) {
      if (file === "AsyncStorage.db") return path.join(localDb, file);
    }
  }
  return null;
}

/**
 * Inject demo storage on iOS Simulator via host sqlite3.
 * Clears app container first by uninstalling/reinstalling is heavy — we overwrite keys.
 */
export function injectDemoStorageIos({ udid, bundleId, locale, theme, resetApp = true }) {
  if (resetApp) {
    runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
    runCapture("xcrun", ["simctl", "privacy", udid, "reset", "all", bundleId]);
    sleep(500);
  }

  const container = getAppDataContainer(udid, bundleId);
  let dbPath = findAsyncStorageDb(container);

  if (!dbPath) {
    // Launch once so RN creates the DB, then retry.
    runCapture("xcrun", ["simctl", "launch", udid, bundleId]);
    sleep(3_000);
    runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
    dbPath = findAsyncStorageDb(container);
  }

  if (!dbPath) {
    throw new Error(`AsyncStorage.db not found under ${container}`);
  }

  const pairs = buildDemoStoragePairs({ locale, theme });
  for (const [key, json] of pairs) {
    const sql = `INSERT OR REPLACE INTO Storage (key, value) VALUES ('${sqlEscape(key)}', '${sqlEscape(json)}');`;
    const result = runCapture("sqlite3", [dbPath, sql]);
    if (!result.ok) {
      throw new Error(`iOS storage inject failed for ${key}: ${result.stderr}`);
    }
  }
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
