/**
 * Conditional autolinking for Apple TV / Android TV (`EXPO_TV=1`).
 * Phone-only native surfaces (widgets, Wear, quick actions, STT) still live in
 * node_modules and would otherwise link into Leanback / tvOS builds.
 */
const isTv =
  process.env.EXPO_TV === "1" || process.env.EXPO_TV === "true" || process.env.EXPO_TV === "True";

/** Packages that must not ship in TV native projects. */
const TV_EXCLUDED = [
  "react-native-android-widget",
  "expo-quick-actions",
  "expo-speech-recognition",
  // No WKWebView / SFSafariViewController path on tvOS; Metro stubs JS.
  // Must exclude from RN autolinking or Fabric codegen registers RNCWebView
  // with NSClassFromString → nil and NSDictionary literal aborts at launch.
  "react-native-webview",
  "expo-web-browser",
  // Fabric component not present in tvOS binary → nil Class in provider.
  "react-native-pager-view",
  // Phone-only Expo modules (not in tvOS Podfile) — Metro stubs JS.
  "expo-notifications",
  "expo-location",
  "expo-sensors",
  "expo-haptics",
  "expo-local-authentication",
  "expo-image-picker",
  "expo-document-picker",
  "expo-sharing",
  "expo-store-review",
  "expo-speech",
  "expo-apple-authentication",
  "expo-navigation-bar",
];

/** @type {import('@react-native-community/cli-types').Config} */
module.exports = {
  dependencies: Object.fromEntries(
    TV_EXCLUDED.map((name) => [
      name,
      isTv
        ? {
            platforms: {
              android: null,
              ios: null,
            },
          }
        : {},
    ]),
  ),
};
