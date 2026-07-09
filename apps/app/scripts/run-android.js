#!/usr/bin/env node
/**
 * Run expo run:android with Windows-safe native build settings.
 *
 * NDK clang can crash when Ninja compiles many C++ units in parallel (OOM/signal).
 * Limiting CMAKE_BUILD_PARALLEL_LEVEL avoids react-native-reanimated build failures.
 */
const {
  runStep,
  clearMetroDiskCache,
  prepareWindowsAndroidBuild,
  ensureAndroidDeviceReady,
  withAndroidNativeBuildEnv,
} = require("./lib/native-script-utils.cjs");

const rawArgs = process.argv.slice(2);
const clearMetro = rawArgs.includes("--clear-metro") || rawArgs.includes("--clear");
const expoArgs = [
  "run:android",
  ...rawArgs.filter((arg) => arg !== "--clear-metro" && arg !== "--clear"),
];

prepareWindowsAndroidBuild();
ensureAndroidDeviceReady();

if (clearMetro) {
  const removed = clearMetroDiskCache();
  console.log(`\nCleared ${removed} Metro disk cache entr${removed === 1 ? "y" : "ies"}.`);
}

console.log(
  "\nStarting expo run:android…",
  "\nAfter a clean prebuild, Gradle configure + native compile can take 10–20 min on Windows.",
  "\nYou should soon see: › Building app…\n",
);

runStep("Expo run:android", "expo", expoArgs, {
  env: withAndroidNativeBuildEnv(),
});
