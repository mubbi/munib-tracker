import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { WORK_DIR } from "./config.mjs";
import { buildDemoStoragePairs } from "./demo-data.mjs";
import { commandExists, runCapture, sleep } from "./shell.mjs";

/** Legacy AsyncStorage (useNextStorage=false) — not Room `AsyncStorage.db`. */
const DB_RELATIVE = "databases/RKStorage";
const TABLE = "catalystLocalStorage";

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

function resolveSqlite3() {
  if (process.env.SQLITE3_PATH) return process.env.SQLITE3_PATH;
  if (commandExists("sqlite3")) return "sqlite3";
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (sdk) {
    const candidate = path.join(
      sdk,
      "platform-tools",
      process.platform === "win32" ? "sqlite3.exe" : "sqlite3",
    );
    if (fs.existsSync(candidate)) return candidate;
  }
  const winDefault = path.join(
    process.env.LOCALAPPDATA || "",
    "Android",
    "Sdk",
    "platform-tools",
    "sqlite3.exe",
  );
  if (winDefault && fs.existsSync(winDefault)) return winDefault;
  throw new Error("sqlite3 not found on host. Install Android platform-tools or set SQLITE3_PATH.");
}

function runSqlite(sqlite3, dbPath, sql) {
  const result = spawnSync(sqlite3, [dbPath], {
    input: `${sql}\n`,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(
      `sqlite3 failed: ${result.stderr?.trim() || result.stdout?.trim() || `exit ${result.status}`}`,
    );
  }
  return result.stdout ?? "";
}

function pullDb(adb, packageId, localPath) {
  const result = spawnSync(adb, ["exec-out", "run-as", packageId, "cat", DB_RELATIVE], {
    encoding: "buffer",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    const err = result.stderr?.toString() || result.stdout?.toString() || `exit ${result.status}`;
    throw new Error(`Failed to pull ${DB_RELATIVE}: ${err}`);
  }
  const buf = result.stdout;
  if (!buf || buf.length < 100 || buf.slice(0, 15).toString("utf8").startsWith("cat:")) {
    throw new Error(`Pulled ${DB_RELATIVE} looks empty or missing (${buf?.length ?? 0} bytes)`);
  }
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, buf);
}

/**
 * Push a binary file into the app sandbox via base64.
 * Direct `adb shell` binary pipes corrupt data; on-device sqlite3 is often missing (API 34+).
 */
function pushDbViaBase64(adb, packageId, localDbPath) {
  const b64Path = `${localDbPath}.b64`;
  const raw = fs.readFileSync(localDbPath);
  fs.writeFileSync(b64Path, raw.toString("base64"), "utf8");

  const remoteB64 = "/data/local/tmp/munib-rkstorage.b64";
  const push = runCapture(adb, ["push", b64Path, remoteB64]);
  if (!push.ok) {
    throw new Error(`adb push failed: ${push.stderr || push.stdout}`);
  }

  runCapture(adb, ["shell", `run-as ${packageId} mkdir -p databases`]);
  const decode = runCapture(adb, [
    "shell",
    `cat ${remoteB64} | run-as ${packageId} sh -c 'base64 -d > ${DB_RELATIVE}'`,
  ]);
  runCapture(adb, ["shell", `rm -f ${remoteB64}`]);
  try {
    fs.unlinkSync(b64Path);
  } catch {
    /* ignore */
  }
  if (!decode.ok) {
    throw new Error(`Failed to write ${DB_RELATIVE}: ${decode.stderr || decode.stdout}`);
  }
}

/** Launch once so Android creates a native-compatible RKStorage, then stop. */
function warmNativeAsyncStorage(adb, packageId) {
  runCapture(adb, ["shell", "am", "force-stop", packageId]);
  runCapture(adb, [
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

  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    sleep(1_500);
    const check = runCapture(adb, [
      "shell",
      `run-as ${packageId} sh -c 'test -s ${DB_RELATIVE} && echo OK'`,
    ]);
    if (check.ok && check.stdout.includes("OK")) {
      runCapture(adb, ["shell", "am", "force-stop", packageId]);
      sleep(500);
      // Checkpoint any WAL into the main DB file before we pull.
      runCapture(adb, [
        "shell",
        `run-as ${packageId} sh -c 'rm -f ${DB_RELATIVE}-wal ${DB_RELATIVE}-shm'`,
      ]);
      return;
    }
  }
  runCapture(adb, ["shell", "am", "force-stop", packageId]);
  throw new Error(
    "Timed out waiting for native RKStorage after warm launch. Is the screenshot APK installed?",
  );
}

/**
 * Inject demo AsyncStorage by merging into the app-created RKStorage.
 * Host-built DBs are often rejected/recreated by Android SQLite on first open.
 * Requires a debuggable build (run-as).
 */
export function injectDemoStorageAndroid({ adb, packageId, locale, theme, clearFirst = true }) {
  if (clearFirst) {
    runCapture(adb, ["shell", "pm", "clear", packageId]);
    sleep(800);
  }

  // Pre-grant so the warm launch is not stuck on permission sheets.
  for (const permission of [
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
  ]) {
    runCapture(adb, ["shell", "pm", "grant", packageId, permission]);
  }

  warmNativeAsyncStorage(adb, packageId);

  fs.mkdirSync(WORK_DIR, { recursive: true });
  const dbPath = path.join(WORK_DIR, `RKStorage-${process.pid}.db`);
  const sqlite3 = resolveSqlite3();
  const pairs = buildDemoStoragePairs({ locale, theme });

  try {
    pullDb(adb, packageId, dbPath);
    // Ensure DELETE journal so a single file round-trips cleanly.
    runSqlite(sqlite3, dbPath, "PRAGMA journal_mode=DELETE;");
    const inserts = pairs
      .map(
        ([key, json]) =>
          `INSERT OR REPLACE INTO ${TABLE} (key, value) VALUES ('${sqlEscape(key)}', '${sqlEscape(json)}');`,
      )
      .join("\n");
    runSqlite(sqlite3, dbPath, inserts);

    runCapture(adb, [
      "shell",
      `run-as ${packageId} sh -c 'rm -f ${DB_RELATIVE}-journal ${DB_RELATIVE}-wal ${DB_RELATIVE}-shm'`,
    ]);
    pushDbViaBase64(adb, packageId, dbPath);
  } finally {
    try {
      fs.unlinkSync(dbPath);
    } catch {
      /* ignore */
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
