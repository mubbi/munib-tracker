/**
 * Apple Watch simulator helpers: resolve/pair devices, seed App Group snapshot,
 * launch watch app, capture + resize to App Store Ultra 3 (422×514).
 */
import fs from "node:fs";
import path from "node:path";
import { APP_ID } from "./config.mjs";
import { run, runCapture, sleep } from "./shell.mjs";
import { WATCH_STORE_SIZE } from "./watch-scenes.mjs";

export const WATCH_APP_GROUP = "group.app.munibtracker.widgets";
export const WATCH_SNAPSHOT_KEY = "widget_snapshot_v1";

/** Parent iOS bundle + watch target suffix from expo-target.config.js */
export const WATCH_BUNDLE_ID = `${APP_ID.ios}.munibtrackerwatch`;

export const WATCH = {
  deviceNameEnv: "WATCH_SIMULATOR_DEVICE",
  defaultDeviceName: "Apple Watch Ultra 3 (49mm)",
  phoneDeviceNameEnv: "IOS_SIMULATOR_DEVICE",
  defaultPhoneDeviceName: "iPhone 17 Pro",
  bootMs: 8_000,
  settleMs: 2_500,
};

function listAvailableDevices() {
  const result = runCapture("xcrun", ["simctl", "list", "devices", "available", "-j"]);
  if (!result.ok) throw new Error("xcrun simctl not available (macOS + Xcode required)");
  const data = JSON.parse(result.stdout);
  const devices = [];
  for (const [runtime, list] of Object.entries(data.devices ?? {})) {
    for (const device of list ?? []) {
      if (device.isAvailable === false) continue;
      devices.push({ ...device, runtime });
    }
  }
  return devices;
}

export function resolveWatchSimulatorUdid(preferredName) {
  const devices = listAvailableDevices();
  const watches = devices.filter((d) => /watch/i.test(d.runtime) || /Apple Watch/i.test(d.name));
  if (preferredName) {
    const match = watches.find((d) => d.name === preferredName);
    if (match) return match.udid;
  }
  const ultra3 = watches.find((d) => /Ultra 3/i.test(d.name));
  if (ultra3) return ultra3.udid;
  const ultra = watches.find((d) => /Ultra/i.test(d.name));
  if (ultra) return ultra.udid;
  const booted = watches.find((d) => d.state === "Booted");
  if (booted) return booted.udid;
  if (watches[0]) return watches[0].udid;
  throw new Error(
    'No watchOS simulator found. Install "Apple Watch Ultra 3 (49mm)" in Xcode → Settings → Platforms.',
  );
}

export function resolvePhoneSimulatorUdid(preferredName) {
  const devices = listAvailableDevices();
  const phones = devices.filter((d) => /iPhone/i.test(d.name) && /iOS/i.test(d.runtime));
  if (preferredName) {
    const match = phones.find((d) => d.name === preferredName);
    if (match) return match.udid;
  }
  const booted = phones.find((d) => d.state === "Booted");
  if (booted) return booted.udid;
  const pro = phones.find((d) => /iPhone 17 Pro$/.test(d.name));
  if (pro) return pro.udid;
  if (phones[0]) return phones[0].udid;
  throw new Error("No iPhone simulator found (required to pair the Watch).");
}

function listPairs() {
  const result = runCapture("xcrun", ["simctl", "list", "pairs", "-j"]);
  if (!result.ok) return {};
  try {
    return JSON.parse(result.stdout)?.pairs ?? {};
  } catch {
    return {};
  }
}

/** Ensure watch is paired with phone (creates pair if missing). */
export function ensureWatchPhonePair(watchUdid, phoneUdid) {
  const pairs = listPairs();
  for (const [pairId, pair] of Object.entries(pairs)) {
    const watch = pair.watch?.udid;
    const phone = pair.phone?.udid;
    if (watch === watchUdid && phone === phoneUdid) return;
    if (watch === watchUdid && phone && phone !== phoneUdid) {
      runCapture("xcrun", ["simctl", "unpair", pairId]);
    }
  }
  const paired = runCapture("xcrun", ["simctl", "pair", watchUdid, phoneUdid]);
  if (!paired.ok) {
    const after = listPairs();
    const ok = Object.values(after).some(
      (p) => p.watch?.udid === watchUdid && p.phone?.udid === phoneUdid,
    );
    if (!ok) {
      throw new Error(`simctl pair failed: ${paired.stderr || paired.stdout}`);
    }
  }
}

export function bootSimulator(udid) {
  runCapture("xcrun", ["simctl", "boot", udid]);
  runCapture("open", ["-a", "Simulator"]);
  sleep(2_000);
}

export function bootWatchAndPhone({ watchUdid, phoneUdid }) {
  ensureWatchPhonePair(watchUdid, phoneUdid);
  bootSimulator(phoneUdid);
  bootSimulator(watchUdid);
  // Wait for watch runtime to finish booting
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const devices = listAvailableDevices();
    const watch = devices.find((d) => d.udid === watchUdid);
    if (watch?.state === "Booted") break;
    sleep(1_500);
  }
  sleep(WATCH.bootMs);
}

/**
 * Path to the App Group container for the watch (or phone) app.
 * Requires the app to be installed at least once.
 */
export function getAppGroupContainer(udid, bundleId, groupId = WATCH_APP_GROUP) {
  const result = runCapture("xcrun", ["simctl", "get_app_container", udid, bundleId, groupId]);
  if (!result.ok) {
    throw new Error(
      `App Group container not found for ${bundleId} on ${udid}.\n` +
        `Install the watch companion first (pair Watch + iPhone, then build without SKIP_BUILD).\n` +
        `${result.stderr || result.stdout}`,
    );
  }
  return result.stdout.trim();
}

function preferencesPlistPath(groupContainer) {
  return path.join(groupContainer, "Library", "Preferences", `${WATCH_APP_GROUP}.plist`);
}

/**
 * Write widget_snapshot_v1 via `defaults` so CFPreferences picks it up.
 * Direct plist edits are ignored by the watchOS simulator preferences daemon.
 */
export function writeWatchSnapshot({ udid, bundleId, snapshot }) {
  forceStopWatchApp({ udid, bundleId });
  clearWatchSavedState(udid, bundleId);

  const json = JSON.stringify(snapshot);
  const write = runCapture("xcrun", [
    "simctl",
    "spawn",
    udid,
    "defaults",
    "write",
    WATCH_APP_GROUP,
    WATCH_SNAPSHOT_KEY,
    "-string",
    json,
  ]);
  if (!write.ok) {
    throw new Error(`defaults write failed: ${write.stderr || write.stdout}`);
  }

  // Also mirror into the App Group container plist (WidgetSnapshotStore path).
  try {
    const groupPath = getAppGroupContainer(udid, bundleId);
    const plist = preferencesPlistPath(groupPath);
    fs.mkdirSync(path.dirname(plist), { recursive: true });
    if (!fs.existsSync(plist)) {
      run("plutil", ["-create", "xml1", plist]);
    }
    const replace = runCapture("plutil", ["-replace", WATCH_SNAPSHOT_KEY, "-string", json, plist]);
    if (!replace.ok) {
      runCapture("plutil", ["-insert", WATCH_SNAPSHOT_KEY, "-string", json, plist]);
    }
  } catch {
    // App Group mirror is best-effort; defaults write is the source of truth for sim.
  }

  runCapture("xcrun", ["simctl", "spawn", udid, "killall", "-9", "cfprefsd"]);
  sleep(800);
}

/** Clear watchOS state restoration so each scene starts from a cold model load. */
export function clearWatchSavedState(udid, bundleId = WATCH_BUNDLE_ID) {
  const home = process.env.HOME || "";
  const dataRoot = path.join(
    home,
    "Library/Developer/CoreSimulator/Devices",
    udid,
    "data/Containers/Data/Application",
  );
  if (!fs.existsSync(dataRoot)) return;
  for (const appDir of fs.readdirSync(dataRoot)) {
    const saved = path.join(
      dataRoot,
      appDir,
      "Library/Saved Application State",
      `${bundleId}.savedState`,
    );
    if (fs.existsSync(saved)) {
      fs.rmSync(saved, { recursive: true, force: true });
    }
  }
}

export function forceStopWatchApp({ udid, bundleId }) {
  runCapture("xcrun", ["simctl", "terminate", udid, bundleId]);
  sleep(400);
}

/**
 * Locate MunibTrackerWatch.app from DerivedData or the phone .app Watch/ embed.
 * Expo `run:ios` installs the phone app but often skips pushing the companion to the watch sim.
 */
export function findWatchAppBundle() {
  const home = process.env.HOME || "";
  const derived = path.join(home, "Library/Developer/Xcode/DerivedData");
  if (fs.existsSync(derived)) {
    for (const entry of fs.readdirSync(derived)) {
      if (!entry.startsWith("MunibTracker-")) continue;
      const candidates = [
        path.join(derived, entry, "Build/Products/Release-watchsimulator/MunibTrackerWatch.app"),
        path.join(derived, entry, "Build/Products/Debug-watchsimulator/MunibTrackerWatch.app"),
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) return c;
      }
      // Phone embed
      for (const config of ["Release-iphonesimulator", "Debug-iphonesimulator"]) {
        const embed = path.join(
          derived,
          entry,
          "Build/Products",
          config,
          "MunibTracker.app/Watch/MunibTrackerWatch.app",
        );
        if (fs.existsSync(embed)) return embed;
      }
    }
  }
  return null;
}

/** Install watch companion onto the watch simulator (required for App Group + launch). */
export function installWatchApp(watchUdid, watchAppPath = findWatchAppBundle()) {
  if (!watchAppPath || !fs.existsSync(watchAppPath)) {
    throw new Error(
      "MunibTrackerWatch.app not found in DerivedData. Build first without SKIP_BUILD.",
    );
  }
  const result = runCapture("xcrun", ["simctl", "install", watchUdid, watchAppPath]);
  if (!result.ok) {
    throw new Error(`simctl install watch failed: ${result.stderr || result.stdout}`);
  }
  sleep(1_000);
  return watchAppPath;
}

/** True if watch companion is installed (App Group container resolvable). */
export function isWatchAppInstalled(watchUdid, bundleId = WATCH_BUNDLE_ID) {
  const result = runCapture("xcrun", ["simctl", "get_app_container", watchUdid, bundleId, "app"]);
  return result.ok && Boolean(result.stdout.trim());
}

export function launchWatchApp({ udid, bundleId }) {
  const result = runCapture("xcrun", ["simctl", "launch", udid, bundleId]);
  if (!result.ok) {
    throw new Error(
      `Failed to launch ${bundleId} on watch simulator.\n${result.stderr || result.stdout}`,
    );
  }
  sleep(WATCH.settleMs);
}

export function captureWatchScreenshot({ udid, outPath }) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const rawPath = `${outPath}.raw.png`;
  const result = runCapture("xcrun", [
    "simctl",
    "io",
    udid,
    "screenshot",
    "--type=png",
    "--display=internal",
    "--mask=ignored",
    rawPath,
  ]);
  if (!result.ok) {
    throw new Error(`simctl screenshot failed: ${result.stderr || result.stdout}`);
  }
  resizeToStoreSize(rawPath, outPath);
  fs.rmSync(rawPath, { force: true });
}

/** Resize to exact App Store Ultra 3 pixels via macOS `sips` (`-z height width`). */
export function resizeToStoreSize(srcPath, destPath) {
  const { w, h } = WATCH_STORE_SIZE;
  const resize = runCapture("sips", ["-z", String(h), String(w), srcPath, "--out", destPath]);
  if (!resize.ok || !fs.existsSync(destPath)) {
    throw new Error(`sips resize failed: ${resize.stderr || resize.stdout}`);
  }
  const probe = runCapture("sips", ["-g", "pixelWidth", "-g", "pixelHeight", destPath]);
  const width = Number(/pixelWidth:\s*(\d+)/.exec(probe.stdout)?.[1] ?? 0);
  const height = Number(/pixelHeight:\s*(\d+)/.exec(probe.stdout)?.[1] ?? 0);
  if (width !== w || height !== h) {
    throw new Error(
      `Watch screenshot is ${width}×${height}, expected ${w}×${h}. Check simulator model (prefer Ultra 3).`,
    );
  }
}

export function copyToStoreAssets({ srcPath, storeRoot, storeFile }) {
  const dest = path.join(storeRoot, storeFile);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(srcPath, dest);
  return dest;
}
