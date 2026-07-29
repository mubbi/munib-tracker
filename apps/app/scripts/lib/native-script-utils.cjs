/**
 * Shared helpers for native prebuild / release orchestration scripts.
 */
const fs = require("node:fs");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { isAndroidTvAdbDevice } = require("./android-form-factor.cjs");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");

const WINDOWS_GRADLE_PROPERTIES = {
  // lintVitalAnalyzeRelease across many RN modules needs far more metaspace than native compile.
  "org.gradle.jvmargs": "-Xmx3072m -XX:MaxMetaspaceSize=768m -Dfile.encoding=UTF-8",
  "org.gradle.parallel": "false",
  "org.gradle.workers.max": "2",
};

/** Applied on every release build — lint vital on third-party AARs is slow and OOM-prone. */
const ANDROID_RELEASE_GRADLE_PROPERTIES = {
  "android.lint.checkReleaseBuilds": "false",
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
 * Gradle daemon + parallel workers can OOM on Windows when many native C++ modules
 * compile alongside Kotlin/Java tasks. Lower heap/worker limits and stop stale daemons.
 *
 * @param {string} [appRoot]
 */
function prepareWindowsAndroidBuild(appRoot = DEFAULT_APP_ROOT) {
  syncAndroidKeystoreProperties(appRoot);

  if (process.platform !== "win32") {
    return;
  }

  const gradlePropsPath = path.join(appRoot, "android", "gradle.properties");
  mergeGradlePropertiesFile(gradlePropsPath, WINDOWS_GRADLE_PROPERTIES);
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
  stopGradleDaemon(appRoot);
  console.log(
    "Gradle release settings applied (release lint off" +
      (process.platform === "win32" ? ", 3G heap / 768M metaspace" : "") +
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
    CMAKE_BUILD_PARALLEL_LEVEL: env.CMAKE_BUILD_PARALLEL_LEVEL ?? "1",
  };
}

module.exports = {
  DEFAULT_APP_ROOT,
  WINDOWS_GRADLE_PROPERTIES,
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
};
