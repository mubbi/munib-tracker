/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "watch",
  name: "MunibTrackerWatch",
  bundleIdentifier: ".munibtrackerwatch",
  displayName: "Munib Tracker",
  deploymentTarget: "10.0",
  icon: "../../assets/images/icon.png",
  entitlements: {
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.app.munibtracker.widgets",
    ],
  },
});
