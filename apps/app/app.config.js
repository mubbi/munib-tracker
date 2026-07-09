const { loadAppEnv } = require("./scripts/lib/release-app-env.cjs");
const {
  resolvePlatformVersion,
  resolveIosBuildNumber,
  resolveAndroidVersionCode,
} = require("./scripts/lib/platform-versions.cjs");
const {
  WIDGET_APP_GROUP,
  ANDROID_HOME_SCREEN_WIDGETS,
  QUICK_ACTION_ANDROID_ICONS,
} = require("./plugins/homeScreenSurfaces.cjs");

loadAppEnv(__dirname);

/** @type {import('expo/config').ConfigContext} */
module.exports = ({ config }) => {
  const prebuildPlatform = process.env.EXPO_PREBUILD_PLATFORM?.trim();
  const appVersion =
    prebuildPlatform === "ios" || prebuildPlatform === "android"
      ? resolvePlatformVersion(prebuildPlatform, __dirname)
      : resolvePlatformVersion("web", __dirname);
  const androidVersionCode = resolveAndroidVersionCode();
  const iosBuildNumber = resolveIosBuildNumber();
  const vapidPublicKey = (process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY ?? "").trim();
  const appleTeamId = process.env.EXPO_APPLE_TEAM_ID?.trim() || undefined;

  const basePlugins = Array.isArray(config.plugins) ? config.plugins : [];
  const pluginsWithoutQuickActions = basePlugins.filter((entry) => {
    if (typeof entry === "string") return entry !== "expo-quick-actions";
    if (Array.isArray(entry)) return entry[0] !== "expo-quick-actions";
    return true;
  });

  return {
    ...config,
    version: appVersion,
    ios: {
      ...config.ios,
      buildNumber: iosBuildNumber,
      ...(appleTeamId ? { appleTeamId } : {}),
      entitlements: {
        ...(config.ios?.entitlements ?? {}),
        "com.apple.security.application-groups": [WIDGET_APP_GROUP],
      },
    },
    android: {
      ...config.android,
      versionCode: androidVersionCode,
    },
    plugins: [
      ...pluginsWithoutQuickActions,
      [
        "expo-quick-actions",
        {
          androidIcons: QUICK_ACTION_ANDROID_ICONS,
        },
      ],
      "@bacons/apple-targets",
      "./plugins/withAndroidLockScreenWidgets.cjs",
      "./plugins/withExternalCommands.cjs",
      "./plugins/withWearOs.cjs",
      ["react-native-android-widget", { widgets: ANDROID_HOME_SCREEN_WIDGETS }],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          organization: process.env.SENTRY_ORG?.trim() || undefined,
          project: process.env.SENTRY_PROJECT?.trim() || undefined,
        },
      ],
    ],
    extra: {
      ...config.extra,
      /** Per-platform marketing semver from .env — used by runtime version helpers on native. */
      iosAppVersion: resolvePlatformVersion("ios", __dirname),
      androidAppVersion: resolvePlatformVersion("android", __dirname),
      webAppVersion: resolvePlatformVersion("web", __dirname),
      /** Web Push VAPID public key for expo-constants on web. */
      vapidPublicKey: vapidPublicKey || undefined,
      /** Service worker path for web push registration. */
      serviceWorkerPath: "/expo-service-worker.js",
    },
  };
};
