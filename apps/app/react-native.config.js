/**
 * Conditional autolinking for Apple TV / Android TV (`EXPO_TV=1`).
 * Phone-only native surfaces (widgets, Wear, quick actions, STT) still live in
 * node_modules and would otherwise link into Leanback / tvOS builds.
 * The list lives in plugins/tvExcludedPackages.cjs (shared with withTvExpoModuleExcludes).
 */
const { TV_EXCLUDED_PACKAGES, isTvEnv } = require("./plugins/tvExcludedPackages.cjs");

const isTv = isTvEnv();

/** @type {import('@react-native-community/cli-types').Config} */
module.exports = {
  dependencies: Object.fromEntries(
    TV_EXCLUDED_PACKAGES.map((name) => [
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
