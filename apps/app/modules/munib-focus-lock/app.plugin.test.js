jest.mock("@expo/config-plugins", () => ({
  createRunOncePlugin: (plugin) => plugin,
  withAndroidManifest: (config, action) => {
    const result = action({ ...config, modResults: config.__manifest });
    return { ...config, __manifest: result.modResults };
  },
}));

const plugin = require("./app.plugin");

const { applyFocusLockIos, applyFocusLockAndroidManifest, isHardIosEnabled } = plugin;

function manifest() {
  return { manifest: { $: {}, "uses-permission": [], application: [{}] } };
}

afterEach(() => {
  delete process.env.EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS;
});

describe("munib-focus-lock config plugin", () => {
  it("adds nothing to iOS when the hard block is switched off (D17 soft prompt)", () => {
    const ios = { bundleIdentifier: "app.munibtracker", entitlements: { a: 1 } };
    expect(applyFocusLockIos(ios, false)).toBe(ios);
    process.env.EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS = "0";
    expect(isHardIosEnabled(undefined)).toBe(false);
  });

  it("defaults the iOS hard block ON (Family Controls Distribution granted 2026-11-24)", () => {
    expect(isHardIosEnabled(undefined)).toBe(true);
    process.env.EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS = "false";
    expect(isHardIosEnabled(undefined)).toBe(false);
  });

  it("adds the entitlement, App Group and BGTask id with the hard block on", () => {
    const ios = applyFocusLockIos(
      {
        entitlements: {
          "com.apple.security.application-groups": ["group.app.munibtracker.widgets"],
        },
        infoPlist: { UIBackgroundModes: ["remote-notification", "audio"] },
      },
      true,
    );
    expect(ios).toEqual({
      entitlements: {
        "com.apple.developer.family-controls": true,
        "com.apple.security.application-groups": ["group.app.munibtracker.widgets"],
      },
      infoPlist: {
        BGTaskSchedulerPermittedIdentifiers: ["app.munibtracker.focuslock.refresh"],
        UIBackgroundModes: ["remote-notification", "audio", "fetch"],
      },
    });
  });

  it("reads the env flag when no prop is given", () => {
    process.env.EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS = "1";
    expect(isHardIosEnabled(undefined)).toBe(true);
    expect(isHardIosEnabled({ hardIos: false })).toBe(false);
  });

  it("adds the Android permissions + launcher <queries>, idempotently, without QUERY_ALL_PACKAGES", () => {
    const once = applyFocusLockAndroidManifest(manifest());
    const twice = applyFocusLockAndroidManifest(once);
    expect(twice.manifest["uses-permission"]).toEqual([
      {
        $: {
          "android:name": "android.permission.PACKAGE_USAGE_STATS",
          "tools:ignore": "ProtectedPermissions",
        },
      },
      { $: { "android:name": "android.permission.SYSTEM_ALERT_WINDOW" } },
      { $: { "android:name": "android.permission.FOREGROUND_SERVICE" } },
      { $: { "android:name": "android.permission.FOREGROUND_SERVICE_SPECIAL_USE" } },
      { $: { "android:name": "android.permission.RECEIVE_BOOT_COMPLETED" } },
      { $: { "android:name": "android.permission.POST_NOTIFICATIONS" } },
      { $: { "android:name": "android.permission.SCHEDULE_EXACT_ALARM" } },
    ]);
    expect(twice.manifest.queries).toEqual([
      {
        intent: [
          {
            action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
            category: [{ $: { "android:name": "android.intent.category.LAUNCHER" } }],
          },
        ],
      },
    ]);
    expect(twice.manifest.$["xmlns:tools"]).toBe("http://schemas.android.com/tools");
    expect(JSON.stringify(twice)).not.toContain("QUERY_ALL_PACKAGES");
    expect(JSON.stringify(twice)).not.toContain("BIND_ACCESSIBILITY_SERVICE");
  });

  it("wires both through the plugin entry point", () => {
    const out = plugin({ ios: {}, __manifest: manifest() }, { hardIos: true });
    expect(out.ios.entitlements["com.apple.developer.family-controls"]).toBe(true);
    expect(out.__manifest.manifest["uses-permission"]).toHaveLength(7);
  });
});
