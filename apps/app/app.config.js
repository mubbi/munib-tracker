const { loadAppEnv } = require("./scripts/lib/release-app-env.cjs");
const {
  resolvePlatformVersion,
  resolveVersionPlatform,
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

function withIosUrlSchemes(iosConfig) {
  const googleSchemes = googleIosUrlSchemes();
  const prevTypes = iosConfig.infoPlist?.CFBundleURLTypes ?? [];
  const allSchemes = prevTypes.flatMap((entry) =>
    Array.isArray(entry?.CFBundleURLSchemes) ? entry.CFBundleURLSchemes : [],
  );

  /** Product deep links (screenshots, OAuth return, share) — must survive TV prebuild. */
  const needsProductScheme = !allSchemes.includes("munib-tracker");
  const needsGoogle =
    googleSchemes.length > 0 && !googleSchemes.every((s) => allSchemes.includes(s));

  if (!needsProductScheme && !needsGoogle) return iosConfig;

  const nextTypes = [...prevTypes];
  if (needsProductScheme) {
    nextTypes.unshift({
      CFBundleURLName: "munib-tracker",
      CFBundleURLSchemes: ["munib-tracker"],
    });
  }
  if (needsGoogle) {
    nextTypes.push({
      CFBundleURLName: "google-oauth",
      CFBundleURLSchemes: googleSchemes,
    });
  }

  return {
    ...iosConfig,
    infoPlist: {
      ...iosConfig.infoPlist,
      CFBundleURLTypes: nextTypes,
    },
  };
}

/**
 * Config plugins whose native module is excluded from TV autolinking
 * (react-native.config.js → TV_EXCLUDED) and whose only job is adding phone
 * permissions / usage strings. Running them on a TV prebuild would inject
 * CAMERA / RECORD_AUDIO / location permissions into the Leanback manifest.
 */
const TV_SKIPPED_PERMISSION_PLUGINS = new Set([
  "expo-image-picker",
  "expo-document-picker",
  "expo-local-authentication",
  "expo-location",
  "expo-speech-recognition",
]);

/**
 * Permissions that imply hardware TVs do not have. Google Play treats an implied
 * feature as `required="true"`, which hides the app from most Android TV /
 * Fire TV devices (Android TV "Declare hardware requirements for TV").
 * Blocked with tools:node="remove" so merged library manifests cannot re-add them.
 */
const TV_BLOCKED_ANDROID_PERMISSIONS = [
  "android.permission.CAMERA",
  "android.permission.RECORD_AUDIO",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.ACCESS_BACKGROUND_LOCATION",
  "android.permission.USE_BIOMETRIC",
  "android.permission.USE_FINGERPRINT",
  "android.permission.BLUETOOTH",
  "android.permission.BLUETOOTH_CONNECT",
  // Precise Adhan timing (exact alarms) is a phone-only setting.
  "android.permission.SCHEDULE_EXACT_ALARM",
];

/** True when generating Apple TV / Android TV native projects (`EXPO_TV=1`). */
function isTvPrebuild() {
  const v = process.env.EXPO_TV?.trim();
  return v === "1" || v === "true";
}

/** @type {import('expo/config').ConfigContext} */
module.exports = ({ config }) => {
  const prebuildPlatform = process.env.EXPO_PREBUILD_PLATFORM?.trim();
  const tvPrebuild = isTvPrebuild();
  const versionPlatform =
    prebuildPlatform === "ios" || prebuildPlatform === "android"
      ? resolveVersionPlatform(prebuildPlatform, { tv: tvPrebuild })
      : "web";
  const appVersion = resolvePlatformVersion(versionPlatform, __dirname);
  const androidVersionCode = resolveAndroidVersionCode(tvPrebuild ? "android-tv" : "android");
  const iosBuildNumber = resolveIosBuildNumber(tvPrebuild ? "tvos" : "ios");
  const vapidPublicKey = (process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY ?? "").trim();
  const appleTeamId = process.env.EXPO_APPLE_TEAM_ID?.trim() || undefined;

  const basePlugins = Array.isArray(config.plugins) ? config.plugins : [];
  const pluginsWithoutQuickActions = basePlugins
    .filter((entry) => {
      const name = typeof entry === "string" ? entry : Array.isArray(entry) ? entry[0] : null;
      if (name === "expo-quick-actions") return false;
      if (tvPrebuild && name && TV_SKIPPED_PERMISSION_PLUGINS.has(name)) return false;
      return true;
    })
    .map((entry) => {
      // TV has no microphone path (Qur'an practice is hidden there): keep the
      // recording permission out of the tvOS plist and the Leanback manifest.
      if (tvPrebuild && Array.isArray(entry) && entry[0] === "expo-audio") {
        return [
          "expo-audio",
          { ...(entry[1] ?? {}), microphonePermission: false, recordAudioAndroid: false },
        ];
      }
      return entry;
    });

  const baseAndroidFilters = Array.isArray(config.android?.intentFilters)
    ? config.android.intentFilters
    : [];

  /** Phone-only native surfaces — break tvOS / Leanback prebuild. */
  const phoneOnlyPlugins = tvPrebuild
    ? []
    : [
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
        /** Qur'an practice Phase 6: lets the minSdk-26 Quran Lab AAR merge into the minSdk-24 app; JS gates on API 26. */
        "./modules/munib-tajweedformer/app.plugin.js",
      ];

  const configTvPlugin = [
    "@react-native-tvos/config-tv",
    {
      androidTVBanner: "./assets/images/tv/android-banner.png",
      androidTVIcon: "./assets/images/tv/android-icon.png",
      appleTVImages: {
        icon: "./assets/images/tv/tvos-icon-1280x768.png",
        iconSmall: "./assets/images/tv/tvos-icon-400x240.png",
        iconSmall2x: "./assets/images/tv/tvos-icon-800x480.png",
        topShelf: "./assets/images/tv/tvos-topshelf-1920x720.png",
        topShelf2x: "./assets/images/tv/tvos-topshelf-3840x1440.png",
        topShelfWide: "./assets/images/tv/tvos-topshelf-wide-2320x720.png",
        topShelfWide2x: "./assets/images/tv/tvos-topshelf-wide-4640x1440.png",
      },
    },
  ];

  /** Patch Podfile `use_expo_modules!(exclude: …)` — see plugins/withTvExpoModuleExcludes.cjs. */
  const tvExpoModuleExcludesPlugin = tvPrebuild ? ["./plugins/withTvExpoModuleExcludes.cjs"] : [];
  /** Nil-safe Fabric third-party registry — see plugins/withTvNilSafeFabricComponents.cjs. */
  const tvNilSafeFabricPlugin = tvPrebuild ? ["./plugins/withTvNilSafeFabricComponents.cjs"] : [];

  const iosConfig = withIosUrlSchemes({
    ...config.ios,
    buildNumber: iosBuildNumber,
    ...(appleTeamId ? { appleTeamId } : {}),
    entitlements: {
      ...(config.ios?.entitlements ?? {}),
      ...(tvPrebuild
        ? {}
        : {
            "com.apple.security.application-groups": [WIDGET_APP_GROUP],
          }),
    },
  });

  const baseExtra = { ...(config.extra ?? {}) };
  const easExtra = { ...(baseExtra.eas ?? {}) };
  if (tvPrebuild) {
    // Phone widget/Watch/Intents targets must not ship with tvOS EAS builds.
    const build = { ...(easExtra.build ?? {}) };
    const experimental = { ...(build.experimental ?? {}) };
    const iosExp = { ...(experimental.ios ?? {}) };
    delete iosExp.appExtensions;
    experimental.ios = iosExp;
    build.experimental = experimental;
    easExtra.build = build;
  }

  return {
    ...config,
    version: appVersion,
    ios: iosConfig,
    android: {
      ...config.android,
      versionCode: androidVersionCode,
      ...(tvPrebuild
        ? {
            blockedPermissions: [
              ...new Set([
                ...(config.android?.blockedPermissions ?? []),
                ...TV_BLOCKED_ANDROID_PERMISSIONS,
              ]),
            ],
          }
        : {}),
      intentFilters: [...baseAndroidFilters, ...googleAndroidOAuthIntentFilter()],
    },
    plugins: [
      ...pluginsWithoutQuickActions,
      /** No-op unless EXPO_TV=1 / isTV — keeps phone prebuild unchanged. */
      configTvPlugin,
      ...tvExpoModuleExcludesPlugin,
      ...tvNilSafeFabricPlugin,
      ...phoneOnlyPlugins,
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
      ...baseExtra,
      eas: easExtra,
      /** Per-platform marketing semver from .env — used by runtime version helpers on native. */
      iosAppVersion: resolvePlatformVersion(tvPrebuild ? "tvos" : "ios", __dirname),
      androidAppVersion: resolvePlatformVersion(tvPrebuild ? "android-tv" : "android", __dirname),
      webAppVersion: resolvePlatformVersion("web", __dirname),
      tvosAppVersion: resolvePlatformVersion("tvos", __dirname),
      androidTvAppVersion: resolvePlatformVersion("android-tv", __dirname),
      /** Web Push VAPID public key for expo-constants on web. */
      vapidPublicKey: vapidPublicKey || undefined,
      /** Service worker path for web push registration. */
      serviceWorkerPath: "/expo-service-worker.js",
      /** True when this config was evaluated for a TV prebuild. */
      isTvBuild: tvPrebuild || undefined,
    },
  };
};
