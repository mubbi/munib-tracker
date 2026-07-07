const {
  WIDGET_APP_GROUP,
  ANDROID_HOME_SCREEN_WIDGETS,
  QUICK_ACTION_ANDROID_ICONS,
} = require("./plugins/homeScreenSurfaces.cjs");

/** @type {import('expo/config').ConfigContext} */
module.exports = ({ config }) => {
  const version = process.env.APP_VERSION ?? config.version ?? "1.0.0";
  const androidVersionCode = Number.parseInt(
    process.env.ANDROID_VERSION_CODE ?? String(config.android?.versionCode ?? 1),
    10,
  );
  const iosBuildNumber = process.env.IOS_BUILD_NUMBER ?? config.ios?.buildNumber ?? "1";
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
    version,
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
    ],
    extra: {
      ...config.extra,
      /** Web Push VAPID public key for expo-constants on web. */
      vapidPublicKey: vapidPublicKey || undefined,
      /** Service worker path for web push registration. */
      serviceWorkerPath: "/expo-service-worker.js",
    },
  };
};
