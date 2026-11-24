jest.mock("@expo/config-plugins", () => ({
  createRunOncePlugin: (plugin) => plugin,
  withAndroidManifest: (config, action) => {
    const result = action({ ...config, modResults: config.__manifest });
    return { ...config, __manifest: result.modResults };
  },
}));

const plugin = require("./app.plugin");

const { applyNearbyIos, applyNearbyAndroidManifest, DEFAULT_BLUETOOTH_USAGE } = plugin;

function manifest(extra = {}) {
  return { manifest: { $: {}, "uses-permission": [], application: [{}], ...extra } };
}

describe("munib-nearby config plugin (NF-3.25)", () => {
  it("adds only the Bluetooth usage string on iOS — no background modes", () => {
    const ios = applyNearbyIos({
      bundleIdentifier: "app.munibtracker",
      infoPlist: { UIBackgroundModes: ["remote-notification"] },
    });
    expect(ios).toMatchSnapshot();
    expect(ios.infoPlist.UIBackgroundModes).toEqual(["remote-notification"]);
    expect(ios.infoPlist.NSBluetoothAlwaysUsageDescription).toBe(DEFAULT_BLUETOOTH_USAGE);
  });

  it("keeps an existing iOS usage string", () => {
    const ios = applyNearbyIos({ infoPlist: { NSBluetoothAlwaysUsageDescription: "Mine" } });
    expect(ios.infoPlist.NSBluetoothAlwaysUsageDescription).toBe("Mine");
  });

  it("declares Android 12+ scan (neverForLocation) / advertise, legacy perms capped at 30, BLE optional", () => {
    const once = applyNearbyAndroidManifest(manifest());
    const twice = applyNearbyAndroidManifest(once);
    expect(twice.manifest).toMatchSnapshot();
    expect(twice.manifest["uses-permission"]).toHaveLength(4);
    expect(twice.manifest["uses-feature"]).toEqual([
      { $: { "android:name": "android.hardware.bluetooth_le", "android:required": "false" } },
    ]);
  });

  it("never touches location permissions or adds BLUETOOTH_CONNECT", () => {
    const location = { $: { "android:name": "android.permission.ACCESS_FINE_LOCATION" } };
    const out = applyNearbyAndroidManifest(manifest({ "uses-permission": [location] }));
    expect(out.manifest["uses-permission"][0]).toEqual(location);
    const text = JSON.stringify(out);
    expect(text).not.toContain("BLUETOOTH_CONNECT");
    expect(text).not.toContain("ACCESS_BACKGROUND_LOCATION");
    expect(text.match(/ACCESS_FINE_LOCATION/g)).toHaveLength(1);
  });

  it("keeps another library's existing declaration instead of duplicating it", () => {
    const legacy = { $: { "android:name": "android.permission.BLUETOOTH" } };
    const out = applyNearbyAndroidManifest(manifest({ "uses-permission": [legacy] }));
    const names = out.manifest["uses-permission"].map((p) => p.$["android:name"]);
    expect(names.filter((n) => n === "android.permission.BLUETOOTH")).toHaveLength(1);
    expect(out.manifest["uses-permission"][0]).toBe(legacy);
  });

  it("wires both through the plugin entry point", () => {
    const out = plugin({ ios: {}, __manifest: manifest() }, { bluetoothUsage: "Custom" });
    expect(out.ios.infoPlist.NSBluetoothAlwaysUsageDescription).toBe("Custom");
    expect(out.__manifest.manifest["uses-permission"]).toHaveLength(4);
  });
});
