/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "watch-widget",
  name: "MunibTrackerWatchWidgets",
  bundleIdentifier: ".munibtrackerwatchwidgets",
  displayName: "Munib Tracker",
  deploymentTarget: "10.0",
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
