/**
 * Launch / recover an Android emulator fast and reliably on Windows.
 *
 * Quick Boot (default) loads + saves a snapshot for warm starts in seconds.
 *
 * Usage (repo root):
 *   pnpm dev:app:android:emulator   # fast Quick Boot (skips if already healthy)
 *   pnpm dev:app:android:restart    # kill running instance + clean cold boot
 *   pnpm dev:app:android:wipe       # factory reset (corrupted AVD)
 *   pnpm dev:app:android:doctor     # reset adb + reconnect, no relaunch
 *
 * Env:
 *   ANDROID_AVD            AVD name (default: $ANDROID_AVD → first `emulator -list-avds`)
 *   ANDROID_EMULATOR_GPU   GPU mode: host | auto | swiftshader_indirect (default: auto)
 *   ANDROID_SDK_ROOT / ANDROID_HOME   SDK location override
 *   ANDROID_AVD_HOME       AVD home override (default OS location)
 */
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const COLD = flags.has("--cold") || flags.has("--restart");
const WIPE = flags.has("--wipe") || flags.has("--wipe-data");
const NO_SAVE = flags.has("--no-save");
const DOCTOR = flags.has("--doctor");

const exe = process.platform === "win32" ? ".exe" : "";
const isWin = process.platform === "win32";

function sdkRoots() {
  const roots = [process.env.ANDROID_SDK_ROOT, process.env.ANDROID_HOME];
  if (isWin && process.env.LOCALAPPDATA) {
    roots.push(path.join(process.env.LOCALAPPDATA, "Android", "Sdk"));
  } else if (process.platform === "darwin") {
    roots.push(path.join(os.homedir(), "Library", "Android", "sdk"));
  } else {
    roots.push(path.join(os.homedir(), "Android", "Sdk"));
  }
  return roots.filter(Boolean);
}

function resolveTool(subdir, name) {
  for (const root of sdkRoots()) {
    const candidate = path.join(root, subdir, `${name}${exe}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return `${name}${exe}`;
}

const emulatorBin = resolveTool("emulator", "emulator");
const adbBin = resolveTool("platform-tools", "adb");

function adb(args, opts = {}) {
  return spawnSync(adbBin, args, { encoding: "utf8", timeout: 12000, ...opts });
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function listAvds() {
  const result = spawnSync(emulatorBin, ["-list-avds"], { encoding: "utf8" });
  if (result.status !== 0 || !result.stdout) return [];
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("INFO") && !line.includes(" "));
}

function emulatorTransports() {
  const result = adb(["devices"]);
  if (result.status !== 0 || !result.stdout) return [];
  return result.stdout
    .split(/\r?\n/)
    .filter((line) => line.startsWith("emulator-"))
    .map((line) => {
      const [serial, state] = line.split(/\s+/);
      return { serial, state };
    });
}

function onlineEmulators() {
  return emulatorTransports()
    .filter((t) => t.state === "device")
    .map((t) => t.serial);
}

function shellResponsive(serial) {
  const args = serial
    ? ["-s", serial, "shell", "getprop", "sys.boot_completed"]
    : ["shell", "getprop", "sys.boot_completed"];
  const result = adb(args, { timeout: 8000 });
  return result.status === 0 && (result.stdout || "").trim() === "1";
}

function resetAdb() {
  console.log("Resetting adb server…");
  adb(["kill-server"], { stdio: "ignore" });
  sleep(500);
  if (isWin) {
    spawnSync("taskkill", ["/F", "/IM", "adb.exe"], { stdio: "ignore" });
    sleep(500);
  }
  adb(["start-server"], { stdio: "ignore" });
  sleep(1000);
}

function avdHomes() {
  const homes = [
    process.env.ANDROID_AVD_HOME,
    process.env.ANDROID_USER_HOME && path.join(process.env.ANDROID_USER_HOME, "avd"),
    process.env.ANDROID_SDK_HOME && path.join(process.env.ANDROID_SDK_HOME, ".android", "avd"),
    path.join(os.homedir(), ".android", "avd"),
    process.env.USERPROFILE && path.join(process.env.USERPROFILE, ".android", "avd"),
  ];
  return [...new Set(homes.filter(Boolean))];
}

function avdDataDir(avd) {
  for (const home of avdHomes()) {
    const ini = path.join(home, `${avd}.ini`);
    if (fs.existsSync(ini)) {
      try {
        const match = fs.readFileSync(ini, "utf8").match(/^path\s*=\s*(.+)\s*$/m);
        if (match && fs.existsSync(match[1].trim())) return match[1].trim();
      } catch {
        // unreadable ini
      }
    }
    const fallback = path.join(home, `${avd}.avd`);
    if (fs.existsSync(fallback)) return fallback;
  }
  return null;
}

function cleanStaleAvdLocks(avd) {
  const dir = avdDataDir(avd);
  if (!dir) return;
  let removed = 0;
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name.endsWith(".lock") || name === "read-snapshot.txt") {
      try {
        fs.rmSync(path.join(dir, name), { recursive: true, force: true });
        removed += 1;
      } catch {
        // held by live process
      }
    }
  }
  if (removed > 0) console.log(`Cleaned ${removed} stale lock file(s) for "${avd}".`);
}

function killRunningEmulators(serials) {
  console.log(`Stopping running emulator(s): ${serials.join(", ") || "(none)"}…`);
  for (const serial of serials) {
    adb(["-s", serial, "emu", "kill"], { stdio: "ignore" });
  }
  for (let i = 0; i < 10; i += 1) {
    sleep(1000);
    if (emulatorTransports().length === 0) break;
  }
  if (isWin && emulatorTransports().length > 0) {
    for (const image of ["qemu-system-x86_64.exe", "qemu-system-aarch64.exe", "emulator.exe"]) {
      spawnSync("taskkill", ["/F", "/IM", image], { stdio: "ignore" });
    }
    sleep(1500);
  }
}

function bootCompleted() {
  const result = adb(["shell", "getprop", "sys.boot_completed"], { timeout: 8000 });
  return result.status === 0 && (result.stdout || "").trim() === "1";
}

function waitForBoot(timeoutMs = 180_000) {
  const start = Date.now();
  adb(["wait-for-device"], { timeout: timeoutMs });
  process.stdout.write("Waiting for Android to finish booting");
  while (Date.now() - start < timeoutMs) {
    if (bootCompleted()) {
      process.stdout.write(" done.\n");
      return true;
    }
    process.stdout.write(".");
    sleep(2000);
  }
  process.stdout.write("\n");
  return false;
}

function resolveAvd() {
  const avds = listAvds();
  const requested = positional[0] || process.env.ANDROID_AVD;
  let avd = requested;
  if (avd && avds.length && !avds.includes(avd)) {
    console.warn(`AVD "${avd}" not found. Available: ${avds.join(", ") || "(none)"}`);
    avd = undefined;
  }
  if (!avd) avd = avds[0];
  if (!avd) {
    console.error(
      "No Android Virtual Device found.\n" + "  Create one in Android Studio → Device Manager.\n",
    );
    process.exit(1);
  }
  return avd;
}

function runDoctor() {
  console.log("Android emulator doctor — repairing adb/device connectivity.\n");
  resetAdb();
  const transports = emulatorTransports();
  if (transports.length === 0) {
    console.log("No emulator transport detected. Start one with: pnpm dev:app:android:emulator\n");
    return;
  }
  if (transports.some((t) => t.state !== "device")) {
    console.log(
      `Reconnecting (states: ${transports.map((t) => `${t.serial}=${t.state}`).join(", ")})…`,
    );
    adb(["reconnect", "offline"], { stdio: "ignore" });
    for (let i = 0; i < 8; i += 1) {
      sleep(2000);
      if (onlineEmulators().length > 0) break;
    }
  }
  const online = onlineEmulators();
  if (online.length === 0) {
    console.warn("Emulator still not `device`. Do a clean restart: pnpm dev:app:android:restart\n");
    return;
  }
  const start = Date.now();
  const ok = shellResponsive(online[0]);
  const ms = Date.now() - start;
  if (ok) {
    console.log(`\nadb is healthy: ${online[0]} responds in ${ms} ms.\n`);
  } else {
    console.warn(
      `\n${online[0]} reports \`device\` but its shell is unresponsive.\n` +
        "Do a clean restart: pnpm dev:app:android:restart\n",
    );
  }
}

function launch(avd) {
  const transports = emulatorTransports();
  const online = transports.filter((t) => t.state === "device").map((t) => t.serial);

  if (!COLD && !WIPE) {
    if (online.length > 0) {
      if (shellResponsive(online[0])) {
        console.log(
          `Emulator already running and healthy (${online.join(", ")}). Skipping launch.`,
        );
        console.log("Force a clean restart with: pnpm dev:app:android:restart\n");
        return;
      }
      console.warn(
        `Emulator ${online.join(", ")} is running but its shell is unresponsive.\n` +
          "Doing a clean cold restart instead…\n",
      );
      killRunningEmulators(online);
      resetAdb();
    } else if (transports.length > 0) {
      resetAdb();
    }
  } else {
    if (transports.length > 0) killRunningEmulators(transports.map((t) => t.serial));
    resetAdb();
  }

  cleanStaleAvdLocks(avd);

  const gpu = process.env.ANDROID_EMULATOR_GPU || "auto";
  const args = ["-avd", avd, "-gpu", gpu, "-no-boot-anim", "-netfast"];
  if (COLD) args.push("-no-snapshot-load");
  if (WIPE) args.push("-wipe-data");
  if (NO_SAVE) args.push("-no-snapshot-save");

  const mode = WIPE ? "factory reset" : COLD ? "cold boot" : "Quick Boot";
  console.log(`Launching emulator "${avd}" (${mode}, gpu=${gpu})…`);

  const child = spawn(emulatorBin, args, { detached: true, stdio: "ignore", windowsHide: false });
  child.unref();

  sleep(3000);

  const booted = waitForBoot();
  if (booted && shellResponsive()) {
    console.log(`\nEmulator "${avd}" is ready. Start the app with: pnpm dev:app:android\n`);
  } else if (booted) {
    console.warn(
      `\nEmulator booted but its shell is not responding yet.\n` +
        "If it stays wedged: pnpm dev:app:android:restart\n",
    );
  } else {
    console.warn(
      `\nEmulator did not report boot completion in time.\n` +
        "If it stays stuck: pnpm dev:app:android:restart (or :wipe if corrupted).\n",
    );
  }
}

function main() {
  if (DOCTOR) {
    runDoctor();
    return;
  }
  launch(resolveAvd());
}

main();
