const tokens = require("../../plugins/generated/native-tokens.json");

/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "MunibTrackerWidgets",
  bundleIdentifier: ".munibtrackerwidgets",
  displayName: "Munib Tracker Widgets",
  deploymentTarget: "17.0",
  frameworks: ["AppIntents", "WidgetKit"],
  colors: {
    $widgetBackground: { light: tokens.light.card, dark: tokens.dark.card },
    $accent: { light: tokens.defaultAccent.light, dark: tokens.defaultAccent.dark },
  },
  entitlements: {
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.app.munibtracker.widgets",
    ],
  },
});
