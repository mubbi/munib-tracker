/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "app-intent",
  name: "MunibTrackerIntents",
  bundleIdentifier: ".munibtrackerintents",
  displayName: "Munib Tracker Intents",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.com.munibtracker.widgets",
    ],
  },
});
