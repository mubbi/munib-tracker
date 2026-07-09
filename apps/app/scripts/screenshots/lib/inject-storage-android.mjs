import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { buildDemoStoragePairs } from "./demo-data.mjs";
import { runCapture, sleep } from "./shell.mjs";

const DB_RELATIVE = "databases/AsyncStorage.db";

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

/**
 * Inject demo AsyncStorage via sqlite3 inside `run-as`.
 * Requires a debuggable dev build installed on the emulator/device.
 */
export function injectDemoStorageAndroid({ adb, packageId, locale, theme, clearFirst = true }) {
  if (clearFirst) {
    runCapture(adb, ["shell", "pm", "clear", packageId]);
    sleep(800);
  }

  const pairs = buildDemoStoragePairs({ locale, theme });
  const dbPath = DB_RELATIVE;

  for (const [key, json] of pairs) {
    const sql = `INSERT OR REPLACE INTO Storage (key, value) VALUES ('${sqlEscape(key)}', '${sqlEscape(json)}');`;
    const cmd = `run-as ${packageId} sqlite3 ${dbPath} "${sql.replace(/"/g, '\\"')}"`;
    const result = runCapture(adb, ["shell", cmd]);
    if (!result.ok) {
      throw new Error(
        `Android storage inject failed for key ${key}.\n` +
          `Ensure dev build is installed and sqlite3 exists on device.\n${result.stderr}`,
      );
    }
  }
}

/** Native PNG via adb exec-out screencap (fallback if Maestro unavailable). */
export function adbScreenshot({ adb, serial, outPath }) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const prefix = serial ? ["-s", serial] : [];
  const result = spawnSync(adb, [...prefix, "exec-out", "screencap", "-p"], {
    encoding: "buffer",
  });
  if (result.status !== 0) {
    throw new Error(`adb screencap failed: ${result.stderr?.toString() ?? "unknown"}`);
  }
  fs.writeFileSync(outPath, result.stdout);
}

export function launchAndroidApp({ adb, packageId, deepLink }) {
  runCapture(adb, [
    "shell",
    "am",
    "start",
    "-a",
    "android.intent.action.VIEW",
    "-d",
    deepLink,
    "-p",
    packageId,
  ]);
}

export function forceStopAndroidApp({ adb, packageId }) {
  runCapture(adb, ["shell", "am", "force-stop", packageId]);
}

export function resolveAdbBinary() {
  return process.env.ADB_PATH || "adb";
}

export function listAndroidDevices(adb) {
  const result = runCapture(adb, ["devices"]);
  if (!result.ok) return [];
  return result.stdout
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/))
    .filter(([, state]) => state === "device")
    .map(([serial]) => serial);
}
