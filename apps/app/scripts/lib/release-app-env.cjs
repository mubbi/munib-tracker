/**
 * Load apps/app/.env into process.env (without overwriting existing shell vars).
 */
const fs = require("fs");
const path = require("path");

const ENV_FILE_NAME = ".env";

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return { loaded: false, path: filePath };
  }
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return { loaded: true, path: filePath };
}

function loadAppEnv(projectRoot) {
  const envPath = path.join(projectRoot, ENV_FILE_NAME);
  return loadDotEnv(envPath);
}

module.exports = {
  ENV_FILE_NAME,
  loadDotEnv,
  loadAppEnv,
};
