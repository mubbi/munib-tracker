/**
 * NF-3.13 Salah focus lock — ShieldAction extension (I've prayed / emergency unlock). Generated unless the build sets
 * EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0 (then app.config.js `match` excludes
 * `munib-tracker-focus-*`, D17 soft prompt). The hard block is on by default since
 * Apple approved the entitlement on 2026-11-24. Needs Apple's Family Controls
 * (Distribution) entitlement for this bundle id — see docs/FOCUS_LOCK_FILINGS.md.
 * @type {import('@bacons/apple-targets/app.plugin').ConfigFunction}
 */
module.exports = (config) => ({
  type: "shield-action",
  name: "MunibTrackerFocusAction",
  bundleIdentifier: ".munibtrackerfocusaction",
  deploymentTarget: "17.0",
  frameworks: ["ManagedSettings", "FamilyControls", "UserNotifications"],
  entitlements: {
    "com.apple.developer.family-controls": true,
    "com.apple.security.application-groups": [
      config.ios?.entitlements?.["com.apple.security.application-groups"]?.[0] ??
        "group.app.munibtracker.widgets",
    ],
  },
});
