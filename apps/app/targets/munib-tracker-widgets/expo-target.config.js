/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "MunibTrackerWidgets",
  bundleIdentifier: ".munibtrackerwidgets",
  displayName: "Munib Tracker Widgets",
  deploymentTarget: "17.0",
  colors: {
    $widgetBackground: "#FFFCF7",
    $accent: "#059669",
  },
  entitlements: {
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.app.munibtracker.widgets",
    ],
  },
});
