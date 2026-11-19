/**
 * Shared helpers for native prebuild / release orchestration scripts.
 */
const fs = require("node:fs");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { isAndroidTvAdbDevice } = require("./android-form-factor.cjs");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");

const GIB = 1024 ** 3;

/**
 * Parallel Gradle workers, sized to the machine: half the logical CPUs, but at most one
 * worker per ~5 GB of RAM (each worker can drive native compiles + Kotlin/R8 work).
 * Override with ANDROID_GRADLE_WORKERS.
 */
function resolveGradleWorkers() {
  const override = Number.parseInt(process.env.ANDROID_GRADLE_WORKERS ?? "", 10);
  if (override > 0) return override;
  const byCpu = Math.floor(os.cpus().length / 2);
  const byRam = Math.floor(os.totalmem() / GIB / 5);
  return Math.max(2, Math.min(byCpu, byRam));
}

/**
 * Concurrent clang jobs per CMake/Ninja build. Each Gradle worker can run one native build,
 * so total clang processes ≈ workers × this. Unbounded Ninja (cores + 2 per build) crashed
 * NDK clang with OOM on Windows; 2 keeps a 6-worker build around 12 compilers.
 * Override with CMAKE_BUILD_PARALLEL_LEVEL.
 */
const WINDOWS_CMAKE_PARALLEL_LEVEL = "2";

/**
 * Windows Gradle tuning (https://developer.android.com/build/optimize-your-build):
 * 6 GB heap + ParallelGC + explicit metaspace/heap-dump flags (Gradle #19750),
 * parallel project execution, workers sized to the machine.
 */
const WINDOWS_GRADLE_PROPERTIES = {
  "org.gradle.jvmargs":
    "-Xmx6g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError -XX:+UseParallelGC -Dfile.encoding=UTF-8",
  "org.gradle.parallel": "true",
  "org.gradle.workers.max": String(resolveGradleWorkers()),
};

/**
 * Applied on every Android prebuild/release, all platforms.
 * The Gradle build cache lives in GRADLE_USER_HOME, so task outputs survive a clean
 * prebuild (phone ↔ TV switches) and repeated release builds.
 */
const ANDROID_COMMON_GRADLE_PROPERTIES = {
  "org.gradle.caching": "true",
};

/** Applied on every release — lint quiet + R8 resource pipeline (AGP 8.12). */
const ANDROID_RELEASE_GRADLE_PROPERTIES = {
  ...ANDROID_COMMON_GRADLE_PROPERTIES,
  "android.lint.checkReleaseBuilds": "false",
  // Play vitals / DEX optimization — pairs with enableMinifyInReleaseBuilds.
  "android.r8.optimizedResourceShrinking": "true",
  // optimize-your-build: PNG crunching is a release-only cost with little size gain.
  "android.enablePngCrunchInReleaseBuilds": "false",
};

/**
 * @param {string} gradlePropsPath
 * @param {Record<string, string>} properties
 */
function mergeGradlePropertiesFile(gradlePropsPath, properties) {
  if (!fs.existsSync(gradlePropsPath)) {
    return;
  }

  let contents = fs.readFileSync(gradlePropsPath, "utf8");
  for (const [key, value] of Object.entries(properties)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key.replaceAll(".", "\\.")}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents.trimEnd()}\n${line}\n`;
  }
  fs.writeFileSync(gradlePropsPath, contents);
}

/** Android SDK root: ANDROID_HOME / ANDROID_SDK_ROOT, else the Android Studio default. */
function resolveAndroidSdkDir() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Android", "Sdk"),
  ].filter(Boolean);
  return candidates.find((dir) => fs.existsSync(dir)) ?? null;
}

/** Oldest SDK CMake whose bundled ninja (1.12+) is long-path aware on Windows. */
const MIN_LONG_PATH_CMAKE = [3, 31];

/**
 * Newest installed SDK CMake 3.x that is >= 3.31 (CMake 4 drops support for the
 * old `cmake_minimum_required` values some native libraries still declare).
 *
 * @param {string} sdkDir
 * @returns {string | null}
 */
function findLongPathCmakeDir(sdkDir) {
  const cmakeRoot = path.join(sdkDir, "cmake");
  let versions;
  try {
    versions = fs.readdirSync(cmakeRoot);
  } catch {
    return null;
  }
  const parsed = versions
    .map((name) => ({ name, parts: name.split(".").map(Number) }))
    .filter(
      ({ parts }) =>
        parts.length >= 2 &&
        parts.every(Number.isFinite) &&
        parts[0] === MIN_LONG_PATH_CMAKE[0] &&
        parts[1] >= MIN_LONG_PATH_CMAKE[1],
    )
    .sort((a, b) => {
      for (let i = 0; i < Math.max(a.parts.length, b.parts.length); i++) {
        const diff = (b.parts[i] ?? 0) - (a.parts[i] ?? 0);
        if (diff) return diff;
      }
      return 0;
    });
  const best = parsed.find(({ name }) =>
    fs.existsSync(path.join(cmakeRoot, name, "bin", "ninja.exe")),
  );
  return best ? path.join(cmakeRoot, best.name) : null;
}

/** `local.properties` paths use forward slashes (backslashes are escapes there). */
function toPropertiesPath(dir) {
  return dir.replaceAll("\\", "/");
}

/**
 * Windows only: write `android/local.properties` (a clean prebuild deletes it).
 *
 * - `sdk.dir`, so Gradle builds from shells that don't export ANDROID_HOME.
 * - `cmake.dir`, pointing at SDK CMake >= 3.31. The default 3.22.1 ships ninja
 *   1.10, which is not long-path aware: since react-native-gesture-handler 3 the
 *   codegen object paths exceed 260 characters and the C++ build fails with
 *   "Filename longer than 260 characters". Install one with
 *   `sdkmanager "cmake;3.31.6"`. Windows long paths must also be enabled
 *   (HKLM\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1).
 *
 * @param {string} appRoot
 */
function writeWindowsLocalProperties(appRoot) {
  const androidDir = path.join(appRoot, "android");
  if (!fs.existsSync(androidDir)) return;

  const sdkDir = resolveAndroidSdkDir();
  if (!sdkDir) {
    console.warn("[android] Android SDK not found — set ANDROID_HOME.");
    return;
  }
  const cmakeDir = findLongPathCmakeDir(sdkDir);
  const file = path.join(androidDir, "local.properties");
  const keep = fs.existsSync(file)
    ? fs
        .readFileSync(file, "utf8")
        .split(/\r?\n/)
        .filter((line) => line.trim() && !/^(sdk|cmake)\.dir=/.test(line))
    : [];
  const lines = [...keep, `sdk.dir=${toPropertiesPath(sdkDir)}`];
  if (cmakeDir) {
    lines.push(`cmake.dir=${toPropertiesPath(cmakeDir)}`);
  } else {
    console.warn(
      "[android] No SDK CMake >= 3.31 found. C++ builds can fail on Windows with " +
        '"Filename longer than 260 characters". Install one: sdkmanager "cmake;3.31.6"',
    );
  }
  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

/**
 * Remove stale Metro file-map caches (v8 serialized blobs in the OS temp dir).
 * Corrupted entries cause "Unable to deserialize cloned data" on startup.
 *
 * @returns {number} removed entry count
 */
function clearMetroDiskCache() {
  const tmpDir = os.tmpdir();
  let removed = 0;

  let entries;
  try {
    entries = fs.readdirSync(tmpDir);
  } catch {
    return removed;
  }

  for (const name of entries) {
    if (!name.startsWith("metro-file-map-expo-") && name !== "metro-cache") {
      continue;
    }
    try {
      fs.rmSync(path.join(tmpDir, name), { recursive: true, force: true });
      removed += 1;
    } catch {
      // ignore busy files
    }
  }

  return removed;
}

/**
 * @param {string} label
 * @param {string} command
 * @param {string[]} args
 * @param {{ cwd?: string, env?: NodeJS.ProcessEnv, shell?: boolean }} [options]
 */
function runStep(label, command, args, options = {}) {
  const {
    cwd = DEFAULT_APP_ROOT,
    env = process.env,
    shell = process.platform === "win32",
  } = options;

  console.log(`\n▶ ${label}`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell,
    env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

/**
 * Stop Gradle daemons before deleting or regenerating apps/app/android.
 * A running release build leaves the folder locked (EBUSY on Windows).
 *
 * @param {string} [appRoot]
 */
function stopGradleDaemon(appRoot = DEFAULT_APP_ROOT) {
  if (process.platform !== "win32") {
    return;
  }

  const gradlew = path.join(appRoot, "android", "gradlew.bat");
  if (!fs.existsSync(gradlew)) {
    return;
  }

  spawnSync(gradlew, ["--stop"], {
    cwd: path.join(appRoot, "android"),
    stdio: "ignore",
    shell: true,
    timeout: 30_000,
  });
}

/**
 * Sync android-keys/keystore.properties → android/keystore.properties.
 * Survives clean prebuild; required because withAndroidReleaseSigning evaluates
 * the release signingConfig even for assembleDebug.
 *
 * @param {string} [appRoot]
 * @returns {boolean} true if synced or already present under android/
 */
function syncAndroidKeystoreProperties(appRoot = DEFAULT_APP_ROOT) {
  const androidDir = path.join(appRoot, "android");
  const canonical = path.join(appRoot, "android-keys", "keystore.properties");
  const target = path.join(androidDir, "keystore.properties");

  if (!fs.existsSync(androidDir)) {
    return false;
  }

  if (fs.existsSync(canonical)) {
    fs.copyFileSync(canonical, target);
    console.log("Synced android-keys/keystore.properties → android/keystore.properties\n");
    return true;
  }

  return fs.existsSync(target);
}

/**
 * Post-prebuild Gradle settings: build cache everywhere; on Windows also heap/worker
 * sizing, local.properties, and a daemon restart so new JVM args apply.
 *
 * @param {string} [appRoot]
 */
function prepareWindowsAndroidBuild(appRoot = DEFAULT_APP_ROOT) {
  syncAndroidKeystoreProperties(appRoot);

  const gradlePropsPath = path.join(appRoot, "android", "gradle.properties");
  mergeGradlePropertiesFile(gradlePropsPath, ANDROID_COMMON_GRADLE_PROPERTIES);

  if (process.platform !== "win32") {
    return;
  }

  mergeGradlePropertiesFile(gradlePropsPath, WINDOWS_GRADLE_PROPERTIES);
  writeWindowsLocalProperties(appRoot);
  stopGradleDaemon(appRoot);
}

/**
 * Gradle settings for signed release artifacts (AAB/APK).
 *
 * @param {string} [appRoot]
 */
function prepareAndroidReleaseBuild(appRoot = DEFAULT_APP_ROOT) {
  syncAndroidKeystoreProperties(appRoot);
  const gradlePropsPath = path.join(appRoot, "android", "gradle.properties");
  const properties = {
    ...ANDROID_RELEASE_GRADLE_PROPERTIES,
    ...(process.platform === "win32" ? WINDOWS_GRADLE_PROPERTIES : {}),
  };
  mergeGradlePropertiesFile(gradlePropsPath, properties);
  if (process.platform === "win32") writeWindowsLocalProperties(appRoot);
  stopGradleDaemon(appRoot);
  console.log(
    "Gradle release settings applied (release lint off, build cache on" +
      (process.platform === "win32"
        ? `, 6G heap, ${WINDOWS_GRADLE_PROPERTIES["org.gradle.workers.max"]} workers, ` +
          `CMake -j${process.env.CMAKE_BUILD_PARALLEL_LEVEL ?? WINDOWS_CMAKE_PARALLEL_LEVEL}`
        : "") +
      ").\n",
  );
}

/**
 * @returns {{ serial: string, state: string }[]}
 */
function listAdbDevices() {
  const result = spawnSync("adb", ["devices"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.status !== 0 || !result.stdout) {
    return [];
  }

  return result.stdout
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [serial, state] = line.split(/\s+/);
      return { serial, state };
    });
}

/**
 * @param {string} serial
 */
function isAndroidDeviceResponsive(serial) {
  const result = spawnSync("adb", ["-s", serial, "shell", "getprop", "sys.boot_completed"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 8000,
  });
  return result.status === 0 && result.stdout?.trim() === "1";
}

/**
 * Expo run:android queries the connected device ABI before Gradle starts. An offline
 * emulator makes adb getprop hang indefinitely with no console output.
 *
 * Phone runs reject Android TV emulators (and vice versa) so a leftover TV AVD
 * from `dev:app:tv:android` does not steal `dev:app:android`.
 *
 * @param {string} [appRoot]
 * @param {{ tv?: boolean }} [opts]
 */
function ensureAndroidDeviceReady(appRoot = DEFAULT_APP_ROOT, { tv = false } = {}) {
  const wantKind = tv ? "Android TV" : "phone";

  /**
   * @param {{ allowPhysicalPhone?: boolean }} [findOpts]
   * @returns {string | null}
   */
  const findReadyDevice = ({ allowPhysicalPhone = true } = {}) => {
    for (const { serial, state } of listAdbDevices()) {
      if (state !== "device" || !isAndroidDeviceResponsive(serial)) continue;

      const isEmulator = serial.startsWith("emulator-");
      if (isEmulator) {
        if (isAndroidTvAdbDevice(serial) === tv) return serial;
        continue;
      }

      // Physical USB / wireless devices: phone runs may use them; TV runs need Leanback.
      if (tv) {
        if (isAndroidTvAdbDevice(serial)) return serial;
      } else if (allowPhysicalPhone) {
        return serial;
      }
    }
    return null;
  };

  const findWrongFormFactorEmulator = () => {
    for (const { serial, state } of listAdbDevices()) {
      if (state !== "device" || !serial.startsWith("emulator-")) continue;
      if (!isAndroidDeviceResponsive(serial)) continue;
      if (isAndroidTvAdbDevice(serial) !== tv) return serial;
    }
    return null;
  };

  let readySerial = findReadyDevice();
  if (readySerial) {
    console.log(`\nAndroid ${wantKind} device ready (${readySerial}).`);
    return;
  }

  const transports = listAdbDevices();
  const offline = transports.filter(({ state }) => state === "offline");
  if (offline.length > 0) {
    console.warn(
      `\nAndroid emulator is offline (${offline.map(({ serial }) => serial).join(", ")}).`,
    );
    console.warn("Expo would hang here while querying device ABI via adb.\n");
    spawnSync("adb", ["reconnect", "offline"], {
      stdio: "ignore",
      shell: process.platform === "win32",
    });
    readySerial = findReadyDevice();
    if (readySerial) {
      console.log(`adb reconnect restored ${readySerial}.\n`);
      return;
    }
  }

  const wrongSerial = findWrongFormFactorEmulator();
  if (wrongSerial) {
    console.warn(
      `\nConnected emulator ${wrongSerial} is not a ${wantKind} device.\n` +
        `Stopping it and cold-booting a ${wantKind} AVD for this command…\n`,
    );
  } else {
    console.log(`Starting a clean ${wantKind} emulator boot before expo run:android…\n`);
  }

  const emulatorArgs = [path.join(appRoot, "scripts/android-emulator.js"), "--cold"];
  if (tv) emulatorArgs.push("--tv");

  runStep("Android emulator cold restart", process.execPath, emulatorArgs, {
    cwd: appRoot,
  });

  readySerial = findReadyDevice();
  if (readySerial) {
    console.log(`\nAndroid ${wantKind} device ready (${readySerial}).`);
    return;
  }

  console.error(
    `\nNo responsive ${wantKind} Android device found.\n` +
      "  pnpm dev:app:android:restart   # cold boot phone emulator\n" +
      "  pnpm dev:app:tv:android        # TV (passes --tv to the emulator helper)\n" +
      "  pnpm dev:app:android:doctor    # repair adb only\n" +
      "  pnpm dev:app:android:wipe      # factory reset if corrupted\n",
  );
  process.exit(1);
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {NodeJS.ProcessEnv}
 */
function withAndroidNativeBuildEnv(env = process.env) {
  if (process.platform !== "win32") {
    return env;
  }

  return {
    ...env,
    CMAKE_BUILD_PARALLEL_LEVEL: env.CMAKE_BUILD_PARALLEL_LEVEL ?? WINDOWS_CMAKE_PARALLEL_LEVEL,
  };
}

/**
 * Metro settings for the release JS bundle (`createBundleReleaseJsAndAssets` runs
 * `expo export:embed` inside Gradle and inherits this env).
 *
 * metro.config.js defaults Windows to 2 transform workers + an in-memory cache to avoid
 * EMFILE in the dev server's async-route HMR. A one-shot release bundle has no HMR, so
 * use more workers and the on-disk transform cache (os.tmpdir(), reused across releases).
 * Explicit METRO_MAX_WORKERS / METRO_DISK_CACHE in the environment still win.
 *
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {NodeJS.ProcessEnv}
 */
function withReleaseJsBundleEnv(env = process.env) {
  if (process.platform !== "win32") {
    return env;
  }

  return {
    ...env,
    METRO_MAX_WORKERS: env.METRO_MAX_WORKERS ?? String(resolveGradleWorkers()),
    METRO_DISK_CACHE: env.METRO_DISK_CACHE ?? "1",
  };
}

module.exports = {
  DEFAULT_APP_ROOT,
  WINDOWS_GRADLE_PROPERTIES,
  WINDOWS_CMAKE_PARALLEL_LEVEL,
  ANDROID_COMMON_GRADLE_PROPERTIES,
  ANDROID_RELEASE_GRADLE_PROPERTIES,
  mergeGradlePropertiesFile,
  runStep,
  clearMetroDiskCache,
  stopGradleDaemon,
  prepareWindowsAndroidBuild,
  prepareAndroidReleaseBuild,
  syncAndroidKeystoreProperties,
  listAdbDevices,
  ensureAndroidDeviceReady,
  withAndroidNativeBuildEnv,
  withReleaseJsBundleEnv,
};
