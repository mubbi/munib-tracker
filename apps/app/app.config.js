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

function googleClientIdToReversedScheme(clientId) {
  const trimmed = String(clientId || "").trim();
  const match = trimmed.match(/^([\w-]+)\.apps\.googleusercontent\.com$/i);
  if (!match) return null;
  return `com.googleusercontent.apps.${match[1]}`;
}

/** Reversed Google iOS client ID scheme (required for browser OAuth redirect on iOS). */
function googleIosUrlSchemes() {
  const scheme = googleClientIdToReversedScheme(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS);
  return scheme ? [scheme] : [];
}

/** Reversed Google Android client ID scheme (Custom Tab → app OAuth redirect). */
function googleAndroidOAuthIntentFilter() {
  const scheme = googleClientIdToReversedScheme(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID);
  if (!scheme) return [];
  return [
    {
      action: "VIEW",
      category: ["BROWSABLE", "DEFAULT"],
      data: [{ scheme, path: "/oauth2redirect" }],
    },
  ];
}

function withIosGoogleOAuthUrlSchemes(iosConfig) {
  const googleSchemes = googleIosUrlSchemes();
  if (!googleSchemes.length) return iosConfig;

  const prevTypes = iosConfig.infoPlist?.CFBundleURLTypes ?? [];
  const alreadyHasGoogle = prevTypes.some(
    (entry) =>
      Array.isArray(entry?.CFBundleURLSchemes) &&
      entry.CFBundleURLSchemes.some((s) => googleSchemes.includes(s)),
  );
  if (alreadyHasGoogle) return iosConfig;

  return {
    ...iosConfig,
    infoPlist: {
      ...iosConfig.infoPlist,
      CFBundleURLTypes: [
        ...prevTypes,
        {
          CFBundleURLName: "google-oauth",
          CFBundleURLSchemes: googleSchemes,
        },
      ],
    },
  };
}

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

  const baseAndroidFilters = Array.isArray(config.android?.intentFilters)
    ? config.android.intentFilters
    : [];

  return {
    ...config,
    version: appVersion,
    ios: withIosGoogleOAuthUrlSchemes({
      ...config.ios,
      buildNumber: iosBuildNumber,
      ...(appleTeamId ? { appleTeamId } : {}),
      entitlements: {
        ...(config.ios?.entitlements ?? {}),
        "com.apple.security.application-groups": [WIDGET_APP_GROUP],
      },
    }),
    android: {
      ...config.android,
      versionCode: androidVersionCode,
      intentFilters: [...baseAndroidFilters, ...googleAndroidOAuthIntentFilter()],
    },
    plugins: [
      ...pluginsWithoutQuickActions,
      [
        "expo-quick-actions",
        {
          androidIcons: QUICK_ACTION_ANDROID_ICONS,
        },
      ],
      /** Before @bacons/apple-targets: xcode mods run in reverse order, and its base-mod provider must register last. */
      "./plugins/withAppIntentsExtensionDefine.cjs",
      "@bacons/apple-targets",
      "./plugins/withExternalCommands.cjs",
      "./plugins/withWearOs.cjs",
      ["react-native-android-widget", { widgets: ANDROID_HOME_SCREEN_WIDGETS }],
      /** After react-native-android-widget so generated provider XML / receivers exist. */
      "./plugins/withAndroidLockScreenWidgets.cjs",
      "./plugins/withAndroidWidgetGallery.cjs",
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
