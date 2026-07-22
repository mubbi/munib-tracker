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
const isTv = rawArgs.includes("--tv");
if (isTv) {
  process.env.EXPO_TV = "1";
}
const expoArgs = [
  "run:android",
  ...rawArgs.filter((arg) => arg !== "--clear-metro" && arg !== "--clear" && arg !== "--tv"),
];

prepareWindowsAndroidBuild();
ensureAndroidDeviceReady();

if (clearMetro) {
  const removed = clearMetroDiskCache();
  console.log(`\nCleared ${removed} Metro disk cache entr${removed === 1 ? "y" : "ies"}.`);
}

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
  env: withAndroidNativeBuildEnv(),
});
