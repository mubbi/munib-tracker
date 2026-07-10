/**
 * Apple .p8 keys under apps/app/ios-keys/.
 *
 * Filename convention (Key ID is parsed from the suffix):
 *   munib_build_api_AuthKey_<KEY_ID>.p8  — App Store Connect API (EAS build / submit)
 *   munib_signin_AuthKey_<KEY_ID>.p8     — Sign in with Apple (API OAuth)
 *   munib_apn_AuthKey_<KEY_ID>.p8        — APNs push (EAS credentials)
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { loadDotEnv } = require("./release-app-env.cjs");

const KEY_PREFIX = {
  buildApi: "munib_build_api_AuthKey_",
  signIn: "munib_signin_AuthKey_",
  apn: "munib_apn_AuthKey_",
};

const ENV_OVERRIDE = {
  buildApi: "IOS_BUILD_API_KEY",
  signIn: "IOS_SIGNIN_AUTH_KEY",
  apn: "IOS_APN_AUTH_KEY",
};

const AUTH_KEY_ID_RE = /AuthKey_([A-Z0-9]{10})\.p8$/;

function iosKeysDir(projectRoot) {
  return path.join(projectRoot, "ios-keys");
}

function extractAuthKeyId(filename) {
  return AUTH_KEY_ID_RE.exec(filename)?.[1] ?? null;
}

function listP8Files(keysDir) {
  if (!fs.existsSync(keysDir)) {
    return [];
  }
  return fs.readdirSync(keysDir).filter((name) => name.endsWith(".p8"));
}

function resolveKeyByRole(keysDir, role) {
  const prefix = KEY_PREFIX[role];
  const envOverride = process.env[ENV_OVERRIDE[role]];

  if (envOverride?.trim()) {
    const candidate = path.isAbsolute(envOverride)
      ? envOverride.trim()
      : path.join(keysDir, envOverride.trim());
    if (!fs.existsSync(candidate)) {
      throw new Error(`Missing ${candidate} (${ENV_OVERRIDE[role]} path)`);
    }
    const filename = path.basename(candidate);
    const keyId = extractAuthKeyId(filename);
    if (!keyId) {
      throw new Error(`Cannot parse Key ID from ${filename}`);
    }
    return { role, filename, path: candidate, keyId };
  }

  const matches = listP8Files(keysDir).filter((name) => name.startsWith(prefix));
  if (matches.length === 0) {
    return null;
  }
  if (matches.length > 1) {
    throw new Error(`Multiple keys match ${prefix}* in ${keysDir}: ${matches.join(", ")}`);
  }

  const filename = matches[0];
  const keyId = extractAuthKeyId(filename);
  if (!keyId) {
    throw new Error(`Cannot parse Key ID from ios-keys/${filename}`);
  }
  return { role, filename, path: path.join(keysDir, filename), keyId };
}

function loadIosKeysDotEnv(projectRoot) {
  const keysDir = iosKeysDir(projectRoot);
  loadDotEnv(path.join(keysDir, "app-store-connect.env"));
  loadDotEnv(path.join(keysDir, "keys.env"));
  loadDotEnv(path.join(keysDir, "team.env"));
}

function resolveIosKeys(projectRoot) {
  const keysDir = iosKeysDir(projectRoot);
  loadIosKeysDotEnv(projectRoot);

  return {
    keysDir,
    buildApi: resolveKeyByRole(keysDir, "buildApi"),
    signIn: resolveKeyByRole(keysDir, "signIn"),
    apn: resolveKeyByRole(keysDir, "apn"),
  };
}

function readP8AsOneLinePem(filePath) {
  return fs.readFileSync(filePath, "utf8").trim().replace(/\r?\n/g, "\\n");
}

function setEnvIfUnset(key, value) {
  if (value && process.env[key] === undefined) {
    process.env[key] = value;
  }
}

function applyBuildApiKeyEnv(projectRoot) {
  const key = resolveIosKeys(projectRoot).buildApi;
  if (!key) {
    return null;
  }

  const absPath = path.resolve(key.path);
  setEnvIfUnset("EXPO_ASC_API_KEY_PATH", absPath);
  setEnvIfUnset("EXPO_ASC_API_KEY_ID", key.keyId);
  setEnvIfUnset("EXPO_ASC_KEY_ID", key.keyId);
  setEnvIfUnset("APP_STORE_CONNECT_API_KEY_ID", key.keyId);
  setEnvIfUnset("APP_STORE_CONNECT_API_KEY_PATH", absPath);

  const issuer =
    process.env.APP_STORE_CONNECT_API_ISSUER_ID?.trim() ||
    process.env.EXPO_ASC_API_KEY_ISSUER_ID?.trim() ||
    process.env.EXPO_ASC_ISSUER_ID?.trim();
  if (issuer) {
    setEnvIfUnset("APP_STORE_CONNECT_API_ISSUER_ID", issuer);
    setEnvIfUnset("EXPO_ASC_API_KEY_ISSUER_ID", issuer);
    setEnvIfUnset("EXPO_ASC_ISSUER_ID", issuer);
  }

  return key;
}

function applySignInKeyEnv(projectRoot) {
  const key = resolveIosKeys(projectRoot).signIn;
  if (!key) {
    return null;
  }

  setEnvIfUnset("APPLE_KEY_ID", key.keyId);
  if (!process.env.APPLE_PRIVATE_KEY?.trim()) {
    setEnvIfUnset("APPLE_PRIVATE_KEY", readP8AsOneLinePem(key.path));
  }
  return key;
}

function applyApnKeyEnv(projectRoot) {
  const key = resolveIosKeys(projectRoot).apn;
  if (!key) {
    return null;
  }

  const absPath = path.resolve(key.path);
  setEnvIfUnset("IOS_APN_AUTH_KEY_PATH", absPath);
  setEnvIfUnset("IOS_APN_KEY_ID", key.keyId);
  return key;
}

function applyIosCredentialsEnv(
  projectRoot,
  { buildApi = false, signIn = false, apn = false } = {},
) {
  loadIosKeysDotEnv(projectRoot);

  const applied = {};
  if (buildApi) {
    applied.buildApi = applyBuildApiKeyEnv(projectRoot);
  }
  if (signIn) {
    applied.signIn = applySignInKeyEnv(projectRoot);
  }
  if (apn) {
    applied.apn = applyApnKeyEnv(projectRoot);
  }
  return applied;
}

function requireAscApiCredentials(projectRoot) {
  loadIosKeysDotEnv(projectRoot);
  applyBuildApiKeyEnv(projectRoot);
  const key = requireIosKey(projectRoot, "buildApi");
  const issuerId =
    process.env.APP_STORE_CONNECT_API_ISSUER_ID?.trim() ||
    process.env.EXPO_ASC_API_KEY_ISSUER_ID?.trim() ||
    process.env.EXPO_ASC_ISSUER_ID?.trim();
  if (!issuerId) {
    console.error(
      "\nMissing App Store Connect Issuer ID.\n" +
        "  Run: pnpm ios:setup-app-store-connect\n" +
        "  Set APP_STORE_CONNECT_API_ISSUER_ID in apps/app/ios-keys/app-store-connect.env\n",
    );
    process.exit(1);
  }
  return {
    key,
    keyId: key.keyId,
    issuerId,
    keyPath: path.resolve(key.path),
  };
}

/**
 * altool / iTMSTransporter expect AuthKey_<KEY_ID>.p8 under ~/.appstoreconnect/private_keys/.
 */
function stageBuildApiKeyForAppleUpload({ keyPath, keyId }) {
  const dir = path.join(os.homedir(), ".appstoreconnect", "private_keys");
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, `AuthKey_${keyId}.p8`);
  fs.copyFileSync(keyPath, dest);
  return dest;
}

function requireIosKey(projectRoot, role) {
  const keys = resolveIosKeys(projectRoot);
  const key = keys[role];
  if (!key) {
    console.error(`\nMissing ios-keys/${KEY_PREFIX[role]}<KEY_ID>.p8\n`);
    process.exit(1);
  }
  return key;
}

function logIosKeysSummary(projectRoot) {
  const keys = resolveIosKeys(projectRoot);
  console.log("\n--- ios-keys ---");
  for (const [role, label] of [
    ["buildApi", "Build API (EAS / ASC)"],
    ["signIn", "Sign in with Apple"],
    ["apn", "APNs push"],
  ]) {
    const key = keys[role];
    console.log(
      key
        ? `  ${label}: ${key.filename} (Key ID ${key.keyId})`
        : `  ${label}: (not found — expected ${KEY_PREFIX[role]}<KEY_ID>.p8)`,
    );
  }

  const issuer =
    process.env.APP_STORE_CONNECT_API_ISSUER_ID?.trim() ||
    process.env.EXPO_ASC_API_KEY_ISSUER_ID?.trim() ||
    process.env.EXPO_ASC_ISSUER_ID?.trim();
  console.log(
    issuer
      ? `  ASC Issuer ID: ${issuer}`
      : "  ASC Issuer ID: (set APP_STORE_CONNECT_API_ISSUER_ID in ios-keys/app-store-connect.env)",
  );
  console.log("");
}

module.exports = {
  KEY_PREFIX,
  iosKeysDir,
  loadIosKeysDotEnv,
  resolveIosKeys,
  applyIosCredentialsEnv,
  requireIosKey,
  requireAscApiCredentials,
  stageBuildApiKeyForAppleUpload,
  logIosKeysSummary,
  readP8AsOneLinePem,
};
