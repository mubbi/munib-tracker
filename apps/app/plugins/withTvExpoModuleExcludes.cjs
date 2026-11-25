/**
 * When EXPO_TV=1, pass `exclude:` to `use_expo_modules!` so phone-only Expo
 * modules are not linked into the tvOS Podfile. On phone builds the same patch
 * excludes the TV-only modules (TV_ONLY_PACKAGES, e.g. munib-tv-home).
 *
 * Needed because some packages (notably expo-quick-actions) declare `:tvos` in
 * their podspec even though their APIs are unavailable on tvOS — Expo's
 * platform filter then links them and the native build fails.
 *
 * Complements `react-native.config.js` (RN community CLI / use_native_modules).
 *
 * Android: the same list is written to `expoAutolinking.exclude` in
 * `android/settings.gradle`, so local Expo modules (munib-tajweedformer, munib-wear,
 * munib-external-commands) never link into the Leanback build.
 *
 * Both lists come from plugins/tvExcludedPackages.cjs.
 */
const {
  createRunOncePlugin,
  withDangerousMod,
  withSettingsGradle,
} = require("@expo/config-plugins");
const { autolinkingExcludes } = require("./tvExcludedPackages.cjs");

function withTvAndroidExpoModuleExcludes(config, excludes) {
  return withSettingsGradle(config, (cfg) => {
    const marker = "expoAutolinking.exclude =";
    if (cfg.modResults.contents.includes(marker)) return cfg;
    const list = excludes.map((name) => `'${name}'`).join(", ");
    if (!cfg.modResults.contents.includes("expoAutolinking.useExpoModules()")) {
      throw new Error(
        "withTvExpoModuleExcludes: settings.gradle has no expoAutolinking.useExpoModules()",
      );
    }
    cfg.modResults.contents = cfg.modResults.contents.replace(
      "expoAutolinking.useExpoModules()",
      `${marker} [${list}]
expoAutolinking.useExpoModules()`,
    );
    return cfg;
  });
}

function withTvExpoModuleExcludes(config) {
  const excludes = autolinkingExcludes();
  if (excludes.length === 0) return config;

  config = withTvAndroidExpoModuleExcludes(config, excludes);

  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const fs = require("node:fs");
      const path = require("node:path");
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let contents = await fs.promises.readFile(podfilePath, "utf8");

      if (contents.includes("use_expo_modules!(exclude:")) {
        return cfg;
      }

      const excludeList = excludes.map((name) => `'${name}'`).join(", ");
      if (!contents.includes("use_expo_modules!")) {
        throw new Error("withTvExpoModuleExcludes: Podfile has no use_expo_modules! to patch");
      }

      contents = contents.replace(
        /use_expo_modules!/,
        `use_expo_modules!(exclude: [${excludeList}])`,
      );
      await fs.promises.writeFile(podfilePath, contents);
      return cfg;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withTvExpoModuleExcludes,
  "with-tv-expo-module-excludes",
  "1.0.0",
);
