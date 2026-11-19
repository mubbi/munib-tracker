import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { WORK_DIR } from "./config.mjs";
import { buildDemoStoragePairs } from "./demo-data.mjs";
import { commandExists, runCapture, sleep } from "./shell.mjs";

/**
 * On-device AsyncStorage layouts, newest first. The app writes whichever its
 * installed `@react-native-async-storage/async-storage` major uses:
 *   - v3: Room DB `databases/AsyncStorage`, table `Storage` (rows mostly live in
 *     the WAL until checkpoint — so the WAL must be pulled too).
 *   - v1/v2 legacy: `databases/RKStorage`, table `catalystLocalStorage`.
 */
const STORAGE_LAYOUTS = [
  { db: "databases/AsyncStorage", table: "Storage" },
  { db: "databases/RKStorage", table: "catalystLocalStorage" },
];

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

function pullFile(adb, packageId, relative) {
  const result = spawnSync(adb, ["exec-out", "run-as", packageId, "cat", relative], {
    encoding: "buffer",
    maxBuffer: 32 * 1024 * 1024,
  });
  const buf = result.stdout;
  if (
    result.status !== 0 ||
    !buf ||
    buf.length < 100 ||
    buf.slice(0, 15).toString("utf8").startsWith("cat:") ||
    buf.slice(0, 7).toString("utf8").startsWith("run-as:")
  ) {
    return null;
  }
  return buf;
}

/**
 * Pull the DB (+ WAL when present) and fold the WAL into a single host file.
 * Room keeps freshly created tables in the WAL, so the main file alone is empty.
 */
function pullDb(adb, packageId, layout, localPath) {
  const main = pullFile(adb, packageId, layout.db);
  if (!main) {
    throw new Error(`Pulled ${layout.db} looks empty or missing`);
  }
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    try {
      fs.unlinkSync(`${localPath}${suffix}`);
    } catch {
      /* ignore */
    }
  }
  fs.writeFileSync(localPath, main);
  const wal = pullFile(adb, packageId, `${layout.db}-wal`);
  if (wal) fs.writeFileSync(`${localPath}-wal`, wal);
}

/**
 * Push a binary file into the app sandbox via base64.
 * Direct `adb shell` binary pipes corrupt data; on-device sqlite3 is often missing (API 34+).
 */
function pushDbViaBase64(adb, packageId, layout, localDbPath) {
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
    `cat ${remoteB64} | run-as ${packageId} sh -c 'base64 -d > ${layout.db}'`,
  ]);
  runCapture(adb, ["shell", `rm -f ${remoteB64}`]);
  try {
    fs.unlinkSync(b64Path);
  } catch {
    /* ignore */
  }
  if (!decode.ok) {
    throw new Error(`Failed to write ${layout.db}: ${decode.stderr || decode.stdout}`);
  }
}

/**
 * Launch once so the app creates its native AsyncStorage DB, then stop.
 * Returns the detected layout (see STORAGE_LAYOUTS).
 */
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
    const layout = STORAGE_LAYOUTS.find((candidate) => {
      const check = runCapture(adb, [
        "shell",
        `run-as ${packageId} sh -c 'test -s ${candidate.db} && echo OK'`,
      ]);
      return check.ok && check.stdout.includes("OK");
    });
    if (layout) {
      // Let the first writes land before stopping; the WAL is pulled with the DB.
      sleep(2_000);
      runCapture(adb, ["shell", "am", "force-stop", packageId]);
      sleep(500);
      return layout;
    }
  }
  runCapture(adb, ["shell", "am", "force-stop", packageId]);
  throw new Error(
    `Timed out waiting for native AsyncStorage (${STORAGE_LAYOUTS.map((l) => l.db).join(" / ")}) after warm launch. Is the screenshot APK installed?`,
  );
}

/**
 * Inject demo AsyncStorage by merging into the app-created native DB.
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

  const layout = warmNativeAsyncStorage(adb, packageId);

  fs.mkdirSync(WORK_DIR, { recursive: true });
  const dbPath = path.join(WORK_DIR, `AsyncStorage-${process.pid}.db`);
  const sqlite3 = resolveSqlite3();
  const pairs = buildDemoStoragePairs({ locale, theme });

  try {
    pullDb(adb, packageId, layout, dbPath);
    // Fold the WAL in and switch to DELETE journal so a single file round-trips cleanly.
    runSqlite(sqlite3, dbPath, "PRAGMA wal_checkpoint(TRUNCATE);\nPRAGMA journal_mode=DELETE;");
    const inserts = pairs
      .map(
        ([key, json]) =>
          `INSERT OR REPLACE INTO ${layout.table} (key, value) VALUES ('${sqlEscape(key)}', '${sqlEscape(json)}');`,
      )
      .join("\n");
    runSqlite(sqlite3, dbPath, inserts);

    runCapture(adb, [
      "shell",
      `run-as ${packageId} sh -c 'rm -f ${layout.db}-journal ${layout.db}-wal ${layout.db}-shm'`,
    ]);
    pushDbViaBase64(adb, packageId, layout, dbPath);
  } finally {
    for (const suffix of ["", "-wal", "-shm", "-journal"]) {
      try {
        fs.unlinkSync(`${dbPath}${suffix}`);
      } catch {
        /* ignore */
      }
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
