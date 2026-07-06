/**
 * Shared helpers for native prebuild / release orchestration scripts.
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const DEFAULT_APP_ROOT = path.join(__dirname, "../..");

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

module.exports = {
  DEFAULT_APP_ROOT,
  runStep,
};
