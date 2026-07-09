#!/usr/bin/env node
/**
 * Run expo run:android with Windows-safe native build settings.
 *
 * NDK clang can crash when Ninja compiles many C++ units in parallel (OOM/signal).
 * Limiting CMAKE_BUILD_PARALLEL_LEVEL avoids react-native-reanimated build failures.
 */
const {
  runStep,
  prepareWindowsAndroidBuild,
  withAndroidNativeBuildEnv,
} = require("./lib/native-script-utils.cjs");

prepareWindowsAndroidBuild();

runStep("Expo run:android", "expo", ["run:android", ...process.argv.slice(2)], {
  env: withAndroidNativeBuildEnv(),
});
