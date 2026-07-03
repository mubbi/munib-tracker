/**
 * Prepare process.env before `expo export --platform web`.
 *
 * Metro/babel-preset-expo inlines `process.env.APP_MANIFEST` from this value so
 * expo-constants exposes extra.vapidPublicKey on static hosting.
 */
const path = require("path");
const { loadAppEnv } = require("./lib/release-app-env.cjs");

/** Matches babel-preset-expo/expo-inline-manifest-plugin RESTRICTED_MANIFEST_FIELDS. */
const RESTRICTED_MANIFEST_FIELDS = [
  "androidNavigationBar",
  "androidStatusBar",
  "privacy",
  "ios",
  "android",
  "plugins",
  "hooks",
  "_internal",
  "assetBundlePatterns",
];

function buildPublicWebManifest(projectRoot) {
  const { getConfig } = require("expo/config");
  const { exp } = getConfig(projectRoot, {
    isPublicConfig: true,
    skipSDKVersionRequirement: true,
    skipPlugins: true,
  });
  const manifest = { ...exp };
  for (const field of RESTRICTED_MANIFEST_FIELDS) {
    delete manifest[field];
  }
  return manifest;
}

function readConfiguredVapidPublicKey(manifest) {
  const fromExtra =
    typeof manifest.extra?.vapidPublicKey === "string" ? manifest.extra.vapidPublicKey.trim() : "";
  if (fromExtra) return fromExtra;
  const fromNotification =
    typeof manifest.notification?.vapidPublicKey === "string"
      ? manifest.notification.vapidPublicKey.trim()
      : "";
  if (fromNotification) return fromNotification;
  return (process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY ?? "").trim();
}

/**
 * @param {string} projectRoot apps/app absolute path
 * @returns {{ vapidConfigured: boolean }}
 */
function prepareWebExportEnv(projectRoot) {
  loadAppEnv(projectRoot);

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "production";
  }

  const manifest = buildPublicWebManifest(projectRoot);
  process.env.APP_MANIFEST = JSON.stringify(manifest);

  const vapidConfigured = readConfiguredVapidPublicKey(manifest).length > 0;
  if (!vapidConfigured) {
    console.warn(
      "\n[build:web] EXPO_PUBLIC_VAPID_PUBLIC_KEY is not set — browser push will be disabled in this export.\n" +
        "Set it in apps/app/.env when you enable web push notifications.\n",
    );
  }

  return { vapidConfigured };
}

module.exports = {
  RESTRICTED_MANIFEST_FIELDS,
  buildPublicWebManifest,
  prepareWebExportEnv,
  readConfiguredVapidPublicKey,
};

if (require.main === module) {
  prepareWebExportEnv(path.join(__dirname, ".."));
}
