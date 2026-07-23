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
