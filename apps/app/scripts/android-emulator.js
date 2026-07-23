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
 *   ANDROID_AVD            Optional AVD override (else auto-picks phone vs TV by form factor)
 *   ANDROID_EMULATOR_GPU   GPU mode: host | auto | swiftshader_indirect (default: auto)
 *   ANDROID_SDK_ROOT / ANDROID_HOME   SDK location override
 *   ANDROID_AVD_HOME       AVD home override (default OS location)
 *
 * Flags:
 *   --tv                   Prefer Android TV / Leanback AVDs (also set when EXPO_TV=1)
 */
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { isAndroidTvAdbDevice, pickPreferredAvd } = require("./lib/android-form-factor.cjs");

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const COLD = flags.has("--cold") || flags.has("--restart");
const WIPE = flags.has("--wipe") || flags.has("--wipe-data");
const NO_SAVE = flags.has("--no-save");
const DOCTOR = flags.has("--doctor");
const PREFER_TV =
  flags.has("--tv") || process.env.EXPO_TV === "1" || process.env.EXPO_TV === "true";

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

function androidUserHome() {
  return (
    process.env.ANDROID_USER_HOME ||
    (process.env.ANDROID_SDK_HOME && path.join(process.env.ANDROID_SDK_HOME, ".android")) ||
    path.join(os.homedir(), ".android")
  );
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

/**
 * After a wipe (or corrupted host keys), adb can stick on `unauthorized`.
 * Regenerating ~/.android/adbkey* forces the next emulator boot to inject a
 * fresh androidboot.qemu.adb.pubkey and accept the host again.
 */
function regenerateAdbKeys() {
  const dir = androidUserHome();
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // best-effort
  }
  const stamp = Date.now();
  for (const name of ["adbkey", "adbkey.pub"]) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) continue;
    try {
      fs.copyFileSync(file, `${file}.bak.${stamp}`);
      fs.rmSync(file, { force: true });
    } catch {
      // leave existing key if locked
    }
  }
  console.log(`Regenerated adb host keys under ${dir}`);
  resetAdb();
}

function hasUnauthorizedTransport() {
  return emulatorTransports().some((t) => t.state === "unauthorized");
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

/**
 * `-wipe-data` persists forceColdBoot=yes in config.ini on some emulator
 * versions, so every later boot is a slow cold start. Restore Quick Boot.
 */
function restoreQuickBootConfig(avd) {
  const dir = avdDataDir(avd);
  if (!dir) return;
  const configPath = path.join(dir, "config.ini");
  if (!fs.existsSync(configPath)) return;
  let text;
  try {
    text = fs.readFileSync(configPath, "utf8");
  } catch {
    return;
  }
  const next = text
    .replace(/^fastboot\.forceColdBoot=yes$/m, "fastboot.forceColdBoot=no")
    .replace(/^fastboot\.forceFastBoot=no$/m, "fastboot.forceFastBoot=yes");
  if (next === text) return;
  try {
    fs.writeFileSync(configPath, next, "utf8");
    console.log(`Restored Quick Boot flags in ${configPath}`);
  } catch {
    // non-fatal
  }
}

function emulatorProcessAlive() {
  if (!isWin) {
    const result = spawnSync("pgrep", ["-f", "qemu-system"], { encoding: "utf8" });
    return result.status === 0 && Boolean((result.stdout || "").trim());
  }
  for (const image of ["qemu-system-x86_64.exe", "qemu-system-aarch64.exe", "emulator.exe"]) {
    const result = spawnSync("tasklist", ["/FI", `IMAGENAME eq ${image}`, "/NH"], {
      encoding: "utf8",
    });
    if (result.status === 0 && (result.stdout || "").toLowerCase().includes(image.toLowerCase())) {
      return true;
    }
  }
  return false;
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
  let refreshedKeys = false;
  process.stdout.write("Waiting for Android to finish booting");
  while (Date.now() - start < timeoutMs) {
    const transports = emulatorTransports();
    if (transports.some((t) => t.state === "unauthorized")) {
      process.stdout.write("U");
      if (!refreshedKeys) {
        process.stdout.write("\n");
        console.warn(
          "adb reports unauthorized (common after wipe). Regenerating host keys and reconnecting…",
        );
        regenerateAdbKeys();
        adb(["reconnect"], { stdio: "ignore" });
        refreshedKeys = true;
        // Guest still has the old injected pubkey until next cold boot — keep waiting;
        // if it stays unauthorized the caller should cold-restart.
      } else {
        adb(["reconnect"], { stdio: "ignore" });
      }
      sleep(2000);
      continue;
    }
    if (transports.some((t) => t.state === "offline")) {
      process.stdout.write("o");
      if ((Date.now() - start) % 10_000 < 2500) adb(["reconnect", "offline"], { stdio: "ignore" });
      sleep(2000);
      continue;
    }
    if (bootCompleted()) {
      process.stdout.write(" done.\n");
      return true;
    }
    if (transports.some((t) => t.state === "device")) {
      process.stdout.write(".");
    } else {
      process.stdout.write(".");
      // Process died mid-boot — fail fast so wipe/restart can retry.
      if (Date.now() - start > 15_000 && !emulatorProcessAlive()) {
        process.stdout.write("\n");
        console.warn("Emulator process exited before boot completed.");
        return false;
      }
    }
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
  if (!avd) {
    const picked = pickPreferredAvd(avds, { preferTv: PREFER_TV });
    avd = picked.avd;
    if (avd) {
      const kind = PREFER_TV ? "Android TV" : "phone";
      if (picked.usedFallback) {
        console.warn(
          `No ${kind} AVD found among: ${avds.join(", ")}.\n` +
            `  Falling back to "${avd}". Create a ${kind} AVD in Android Studio → Device Manager.\n`,
        );
      } else {
        console.log(`Using ${kind} AVD "${avd}" (override with ANDROID_AVD=… if needed).`);
      }
    }
  }
  if (!avd) {
    console.error(
      "No Android Virtual Device found.\n" + "  Create one in Android Studio → Device Manager.\n",
    );
    process.exit(1);
  }
  return avd;
}

/**
 * @param {string[]} serials
 * @returns {boolean}
 */
function onlineMatchesFormFactor(serials) {
  return serials.some((serial) => isAndroidTvAdbDevice(serial) === PREFER_TV);
}

function runDoctor() {
  console.log("Android emulator doctor — repairing adb/device connectivity.\n");
  resetAdb();
  let transports = emulatorTransports();
  if (transports.length === 0) {
    console.log("No emulator transport detected. Start one with: pnpm dev:app:android:emulator\n");
    return;
  }
  if (hasUnauthorizedTransport()) {
    console.warn(
      `adb unauthorized (${transports.map((t) => `${t.serial}=${t.state}`).join(", ")}).\n` +
        "Regenerating host keys — if it stays unauthorized, cold-restart so the guest picks up the new pubkey:\n" +
        "  pnpm dev:app:android:restart\n",
    );
    regenerateAdbKeys();
    adb(["reconnect"], { stdio: "ignore" });
    for (let i = 0; i < 8; i += 1) {
      sleep(2000);
      transports = emulatorTransports();
      if (onlineEmulators().length > 0) break;
      if (!hasUnauthorizedTransport()) break;
    }
  } else if (transports.some((t) => t.state !== "device")) {
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
    if (hasUnauthorizedTransport()) {
      console.warn(
        "Still unauthorized after key regen. Cold-restart the AVD so it injects the new pubkey:\n" +
          "  pnpm dev:app:android:restart\n",
      );
    } else {
      console.warn(
        "Emulator still not `device`. Do a clean restart: pnpm dev:app:android:restart\n",
      );
    }
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

function spawnEmulator(args) {
  const child = spawn(emulatorBin, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: false,
    // On Windows, start in a new process group so qemu survives the launcher.
    ...(isWin ? { windowsVerbatimArguments: false } : {}),
  });
  child.on("error", (err) => {
    console.error(`Failed to spawn emulator: ${err.message}`);
  });
  child.unref();
  return child;
}

function launch(avd) {
  const transports = emulatorTransports();
  const online = transports.filter((t) => t.state === "device").map((t) => t.serial);
  const unauthorized = hasUnauthorizedTransport();
  const wantKind = PREFER_TV ? "Android TV" : "phone";

  if (!COLD && !WIPE) {
    if (online.length > 0) {
      if (shellResponsive(online[0]) && onlineMatchesFormFactor(online)) {
        console.log(
          `Emulator already running and healthy (${online.join(", ")}). Skipping launch.`,
        );
        console.log("Force a clean restart with: pnpm dev:app:android:restart\n");
        return;
      }
      if (shellResponsive(online[0]) && !onlineMatchesFormFactor(online)) {
        console.warn(
          `Running emulator is not a ${wantKind} device (${online.join(", ")}).\n` +
            `Stopping it and launching "${avd}" instead…\n`,
        );
        killRunningEmulators(online);
        resetAdb();
      } else {
        console.warn(
          `Emulator ${online.join(", ")} is running but its shell is unresponsive.\n` +
            "Doing a clean cold restart instead…\n",
        );
        killRunningEmulators(online);
        resetAdb();
      }
    } else if (unauthorized) {
      console.warn("Emulator is unauthorized over adb. Regenerating keys and cold-restarting…\n");
      killRunningEmulators(transports.map((t) => t.serial));
      regenerateAdbKeys();
    } else if (transports.length > 0) {
      resetAdb();
    }
  } else {
    if (transports.length > 0) killRunningEmulators(transports.map((t) => t.serial));
    // Wipe clears guest authorized_keys; refresh host keys so the next boot
    // injects a matching androidboot.qemu.adb.pubkey.
    if (WIPE || unauthorized) regenerateAdbKeys();
    else resetAdb();
  }

  cleanStaleAvdLocks(avd);
  if (WIPE) restoreQuickBootConfig(avd);

  const gpu = process.env.ANDROID_EMULATOR_GPU || "auto";
  const args = ["-avd", avd, "-gpu", gpu, "-no-boot-anim", "-netfast"];
  // After wipe/key regen, always cold-boot so the guest picks up the new pubkey.
  if (COLD || WIPE) args.push("-no-snapshot-load");
  if (WIPE) args.push("-wipe-data");
  if (NO_SAVE) args.push("-no-snapshot-save");

  const mode = WIPE ? "factory reset" : COLD ? "cold boot" : "Quick Boot";
  console.log(`Launching emulator "${avd}" (${mode}, gpu=${gpu})…`);

  spawnEmulator(args);

  // Confirm the process tree actually came up (stdio:ignore can hide spawn failures).
  let alive = false;
  for (let i = 0; i < 10; i += 1) {
    sleep(1000);
    if (emulatorProcessAlive() || emulatorTransports().length > 0) {
      alive = true;
      break;
    }
  }
  if (!alive) {
    console.warn("Emulator process did not appear — retrying launch once…");
    spawnEmulator(args);
    sleep(3000);
  }

  const booted = waitForBoot();
  if (WIPE) restoreQuickBootConfig(avd);

  if (booted && shellResponsive()) {
    console.log(`\nEmulator "${avd}" is ready. Start the app with: pnpm dev:app:android\n`);
  } else if (booted) {
    console.warn(
      `\nEmulator booted but its shell is not responding yet.\n` +
        "If it stays wedged: pnpm dev:app:android:restart\n",
    );
  } else if (hasUnauthorizedTransport()) {
    console.warn(
      `\nEmulator stayed unauthorized after key regen.\n` +
        "Kill it and cold-restart so the guest injects the new pubkey:\n" +
        "  pnpm dev:app:android:restart\n",
    );
  } else {
    console.warn(
      `\nEmulator did not report boot completion in time.\n` +
        "If it stays stuck: pnpm dev:app:android:restart (or :wipe if corrupted).\n" +
        "GPU fallback: ANDROID_EMULATOR_GPU=swiftshader_indirect pnpm dev:app:android:restart\n",
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
