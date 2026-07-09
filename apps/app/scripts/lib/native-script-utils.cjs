/**
 * Shared helpers for native prebuild / release orchestration scripts.
 */
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");

const WINDOWS_GRADLE_PROPERTIES = {
  "org.gradle.jvmargs": "-Xmx1536m -XX:MaxMetaspaceSize=384m",
  "org.gradle.parallel": "false",
  "org.gradle.workers.max": "2",
};

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
 * Gradle daemon + parallel workers can OOM on Windows when many native C++ modules
 * compile alongside Kotlin/Java tasks. Lower heap/worker limits and stop stale daemons.
 *
 * @param {string} [appRoot]
 */
function prepareWindowsAndroidBuild(appRoot = DEFAULT_APP_ROOT) {
  if (process.platform !== "win32") {
    return;
  }

  const androidDir = path.join(appRoot, "android");
  const gradlePropsPath = path.join(androidDir, "gradle.properties");
  if (!fs.existsSync(gradlePropsPath)) {
    return;
  }

  let contents = fs.readFileSync(gradlePropsPath, "utf8");
  for (const [key, value] of Object.entries(WINDOWS_GRADLE_PROPERTIES)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key.replaceAll(".", "\\.")}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents.trimEnd()}\n${line}\n`;
  }
  fs.writeFileSync(gradlePropsPath, contents);

  const gradlew = path.join(androidDir, "gradlew.bat");
  if (fs.existsSync(gradlew)) {
    spawnSync(gradlew, ["--stop"], {
      cwd: androidDir,
      stdio: "ignore",
      shell: true,
    });
  }
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
  runStep,
  prepareWindowsAndroidBuild,
  withAndroidNativeBuildEnv,
};
