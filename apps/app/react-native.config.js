/**
 * Conditional autolinking for Apple TV / Android TV (`EXPO_TV=1`).
 * Phone-only native surfaces (widgets, Wear, quick actions, STT) still live in
 * node_modules and would otherwise link into Leanback / tvOS builds; TV-only
 * modules (munib-tv-home) would otherwise link into phone builds.
 * The lists live in plugins/tvExcludedPackages.cjs (shared with withTvExpoModuleExcludes).
 */
const { autolinkingExcludes } = require("./plugins/tvExcludedPackages.cjs");

/** @type {import('@react-native-community/cli-types').Config} */
module.exports = {
  dependencies: Object.fromEntries(
    autolinkingExcludes().map((name) => [
      name,
      {
        platforms: {
          android: null,
          ios: null,
        },
      },
    ]),
  ),
};
