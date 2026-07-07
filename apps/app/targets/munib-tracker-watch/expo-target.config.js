/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "watch",
  name: "MunibTrackerWatch",
  bundleIdentifier: ".munibtrackerwatch",
  displayName: "Munib Tracker",
  deploymentTarget: "10.0",
  entitlements: {
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.com.munibtracker.widgets",
    ],
  },
});
