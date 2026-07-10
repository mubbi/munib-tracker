/**
 * Read upload keystore SHA-1 and maintain android/PLAY_UPLOAD_CERT_SHA1.txt.
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

/**
 * @param {string} keystorePath
 * @param {string} alias
 * @param {string} storePassword
 * @returns {string} colon-separated SHA1
 */
function readKeystoreSha1(keystorePath, alias, storePassword) {
  const result = spawnSync(
    "keytool",
    ["-list", "-v", "-keystore", keystorePath, "-alias", alias, "-storepass", storePassword],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "keytool failed");
  }
  const match = `${result.stdout}\n${result.stderr}`.match(/SHA1:\s*([0-9A-F:]+)/i);
  if (!match) {
    throw new Error("Could not parse SHA1 from keytool output");
  }
  return match[1].trim();
}

/**
 * @param {string} appRoot
 */
function ensurePlayUploadCertSha1(appRoot) {
  const androidDir = path.join(appRoot, "android");
  const sha1File = path.join(androidDir, "PLAY_UPLOAD_CERT_SHA1.txt");
  if (fs.existsSync(sha1File)) {
    return;
  }

  const propsPath = path.join(appRoot, "android-keys", "keystore.properties");
  if (!fs.existsSync(propsPath)) {
    return;
  }

  const props = Object.fromEntries(
    fs
      .readFileSync(propsPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
      }),
  );

  const storeFile = props.storeFile;
  const storePassword = props.storePassword;
  const keyAlias = props.keyAlias;
  if (!storeFile || !storePassword || !keyAlias) {
    return;
  }

  const keystorePath = path.resolve(androidDir, storeFile);
  if (!fs.existsSync(keystorePath)) {
    return;
  }

  const sha1 = readKeystoreSha1(keystorePath, keyAlias, storePassword);
  fs.mkdirSync(androidDir, { recursive: true });
  fs.writeFileSync(
    sha1File,
    `# Play upload certificate SHA-1 (from android-keys/keystore.properties)\n${sha1}\n`,
    "utf8",
  );
  console.log(`Wrote ${sha1File}\n`);
}

module.exports = {
  readKeystoreSha1,
  ensurePlayUploadCertSha1,
};
