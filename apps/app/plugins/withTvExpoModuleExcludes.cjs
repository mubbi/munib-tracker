/**
 * When EXPO_TV=1, pass `exclude:` to `use_expo_modules!` so phone-only Expo
 * modules are not linked into the tvOS Podfile.
 *
 * Needed because some packages (notably expo-quick-actions) declare `:tvos` in
 * their podspec even though their APIs are unavailable on tvOS — Expo's
 * platform filter then links them and the native build fails.
 *
 * Complements `react-native.config.js` (RN community CLI / use_native_modules).
 */
const { createRunOncePlugin, withDangerousMod } = require("@expo/config-plugins");

/** Must stay aligned with `react-native.config.js` → TV_EXCLUDED. */
const TV_EXPO_MODULE_EXCLUDES = [
  "expo-quick-actions",
  "expo-speech-recognition",
  "react-native-android-widget",
];

function isTvEnv() {
  const v = process.env.EXPO_TV?.trim();
  return v === "1" || v === "true" || v === "True";
}

function withTvExpoModuleExcludes(config) {
  if (!isTvEnv()) return config;

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

      const excludeList = TV_EXPO_MODULE_EXCLUDES.map((name) => `'${name}'`).join(", ");
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
