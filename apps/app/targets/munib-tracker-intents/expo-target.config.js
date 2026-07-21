/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "app-intent",
  name: "MunibTrackerIntents",
  bundleIdentifier: ".munibtrackerintents",
  displayName: "Munib Tracker Intents",
  deploymentTarget: "17.0",
  frameworks: ["AppIntents", "WidgetKit"],
  // `_shared/MunibAppIntents.swift` is also compiled into the main app target
  // (App Shortcuts + openAppWhenRun require it). The extension gets
  // `MUNIB_INTENTS_EXTENSION` via plugins/withAppIntentsExtensionDefine.cjs.
  entitlements: {
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.app.munibtracker.widgets",
    ],
  },
});
