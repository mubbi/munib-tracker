#!/usr/bin/env node
/**
 * Run expo run:android with Windows-safe native build settings.
 *
 * NDK clang can crash when Ninja compiles many C++ units in parallel (OOM/signal).
 * Limiting CMAKE_BUILD_PARALLEL_LEVEL avoids react-native-reanimated build failures.
 *
 * Phone:  pnpm dev:app:android      → phone AVD + phone native tree
 * TV:     pnpm dev:app:tv:android   → Android TV AVD + Leanback tree (EXPO_TV=1)
 */
const { spawnSync } = require("node:child_process");
const {
  runStep,
  clearMetroDiskCache,
  prepareWindowsAndroidBuild,
  ensureAndroidDeviceReady,
  withAndroidNativeBuildEnv,
  listAdbDevices,
  DEFAULT_APP_ROOT,
} = require("./lib/native-script-utils.cjs");
const { assertAndroidProjectMode } = require("./lib/tv-native-project.cjs");

const rawArgs = process.argv.slice(2);
const clearMetro = rawArgs.includes("--clear-metro") || rawArgs.includes("--clear");
const isTv = rawArgs.includes("--tv");
if (isTv) {
  process.env.EXPO_TV = "1";
}
const expoArgs = [
  "run:android",
  ...rawArgs.filter((arg) => arg !== "--clear-metro" && arg !== "--clear" && arg !== "--tv"),
];

assertAndroidProjectMode(DEFAULT_APP_ROOT, { expectTv: isTv });
prepareWindowsAndroidBuild();
ensureAndroidDeviceReady(DEFAULT_APP_ROOT, { tv: isTv });

if (clearMetro) {
  const removed = clearMetroDiskCache();
  console.log(`\nCleared ${removed} Metro disk cache entr${removed === 1 ? "y" : "ies"}.`);
}

/**
 * Android emulators reach the host via 10.0.2.2 (not the LAN IP Expo detects).
 * Without this, Dev Client opens `http://192.168.x.x:8081`, hangs on splash, then ANRs.
 */
function prepareEmulatorMetroBridge() {
  const devices = listAdbDevices().filter((d) => d.state === "device");
  const emulators = devices.filter((d) => d.serial.startsWith("emulator-"));
  if (!emulators.length) return {};

  for (const { serial } of emulators) {
    spawnSync("adb", ["-s", serial, "reverse", "tcp:8081", "tcp:8081"], {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: 10_000,
    });
  }
  console.log(
    "\nEmulator Metro bridge: adb reverse tcp:8081 + REACT_NATIVE_PACKAGER_HOSTNAME=10.0.2.2",
  );
  return { REACT_NATIVE_PACKAGER_HOSTNAME: "10.0.2.2" };
}

const emulatorMetroEnv = prepareEmulatorMetroBridge();

if (isTv) {
  console.log(
    "\nAndroid TV mode (EXPO_TV=1) — ensure Leanback prebuild: pnpm prebuild:app:tv:android",
  );
}

console.log(
  "\nStarting expo run:android…",
  "\nAfter a clean prebuild, Gradle configure + native compile can take 10–20 min on Windows.",
  "\nYou should soon see: › Building app…\n",
);

runStep("Expo run:android", "expo", expoArgs, {
  env: {
    ...withAndroidNativeBuildEnv(),
    ...emulatorMetroEnv,
  },
});
