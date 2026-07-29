/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => {
  const mainBundleId = config.ios?.bundleIdentifier ?? "app.munibtracker";
  const watchBundleId = `${mainBundleId}.munibtrackerwatch`;

  return {
    type: "watch-widget",
    name: "MunibTrackerWatchWidgets",
    // Must be nested under the watch app bundle ID (one suffix segment only).
    bundleIdentifier: `${watchBundleId}.widgets`,
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
  };
};
