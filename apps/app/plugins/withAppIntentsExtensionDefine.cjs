const { withXcodeProjectBeta } = require("@bacons/apple-targets/build/with-bacons-xcode");

const INTENTS_TARGET_NAME = "MunibTrackerIntents";
const CONDITION = "MUNIB_INTENTS_EXTENSION";

/**
 * Adds the `MUNIB_INTENTS_EXTENSION` Swift compilation condition to the
 * MunibTrackerIntents App Intents extension target.
 *
 * `targets/munib-tracker-intents/_shared/MunibAppIntents.swift` is compiled
 * into BOTH the main app and the extension (Apple requires the
 * `AppShortcutsProvider` + its intents in the main app target, while
 * background intents should also live in the extension so Siri can run them
 * without launching the app). The condition excludes the app-only parts
 * (`AppShortcutsProvider`, `openAppWhenRun = true` intents) from the
 * extension, where they are unsupported and cause Shortcuts'
 * "internal error".
 *
 * Must be listed BEFORE `@bacons/apple-targets` in the plugins array: xcode
 * mods run in reverse registration order, so this runs after the extension
 * target has been created, and apple-targets' base-mod provider must be the
 * last mod registered.
 */
module.exports = function withAppIntentsExtensionDefine(config) {
  return withXcodeProjectBeta(config, (config) => {
    const project = config.modResults;
    const target = project.rootObject.props.targets.find(
      (t) => t.props?.name === INTENTS_TARGET_NAME,
    );
    if (!target) {
      throw new Error(
        `[withAppIntentsExtensionDefine] Xcode target "${INTENTS_TARGET_NAME}" not found — ` +
          "was it renamed in targets/munib-tracker-intents/expo-target.config.js?",
      );
    }
    for (const buildConfig of target.props.buildConfigurationList.props.buildConfigurations) {
      const settings = buildConfig.props.buildSettings;
      const existing = settings.SWIFT_ACTIVE_COMPILATION_CONDITIONS;
      const parts = Array.isArray(existing)
        ? [...existing]
        : typeof existing === "string" && existing.length > 0
          ? existing.split(/\s+/)
          : ["$(inherited)"];
      if (!parts.includes(CONDITION)) parts.push(CONDITION);
      settings.SWIFT_ACTIVE_COMPILATION_CONDITIONS = parts.join(" ");
    }
    return config;
  });
};
