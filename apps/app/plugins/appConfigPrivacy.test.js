const { existsSync, readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

/**
 * D53 (SecureStore backup) and D54 (iOS privacy manifests): guard the app config and the
 * per-extension `PrivacyInfo.xcprivacy` files so a new target or a config refactor can't
 * silently drop them.
 */
const appRoot = join(__dirname, "..");
const appJson = require("../app.json");
const resolveConfig = require("../app.config.js");

function evaluate(tv) {
  const previous = process.env.EXPO_TV;
  if (tv) process.env.EXPO_TV = "1";
  else delete process.env.EXPO_TV;
  try {
    return resolveConfig({ config: structuredClone(appJson.expo) });
  } finally {
    if (previous === undefined) delete process.env.EXPO_TV;
    else process.env.EXPO_TV = previous;
  }
}

function pluginEntry(config, name) {
  return config.plugins.find((entry) => (Array.isArray(entry) ? entry[0] : entry) === name);
}

function userDefaultsReasons(config) {
  const entry = config.ios.privacyManifests.NSPrivacyAccessedAPITypes.find(
    (type) => type.NSPrivacyAccessedAPIType === "NSPrivacyAccessedAPICategoryUserDefaults",
  );
  return entry?.NSPrivacyAccessedAPITypeReasons;
}

describe("app config: SecureStore backup (D53)", () => {
  it.each([false, true])(
    "keeps the expo-secure-store plugin with Android backup rules (tv=%p)",
    (tv) => {
      const entry = pluginEntry(evaluate(tv), "expo-secure-store");
      expect(entry).toBeDefined();
      const options = Array.isArray(entry) ? (entry[1] ?? {}) : {};
      expect(options.configureAndroidBackup).not.toBe(false);
    },
  );
});

describe("app config: iOS privacy manifest (D54)", () => {
  it("declares UserDefaults for the app and its App Group on phone builds", () => {
    expect(userDefaultsReasons(evaluate(false))).toEqual(["CA92.1", "1C8F.1"]);
  });

  it("declares only the app's own defaults on tvOS (no App Group)", () => {
    expect(userDefaultsReasons(evaluate(true))).toEqual(["CA92.1"]);
  });
});

describe("Apple extension targets (D54)", () => {
  const targetsDir = join(appRoot, "targets");
  const targets = readdirSync(targetsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_shared")
    .map((entry) => entry.name);

  it("finds the extension targets", () => {
    expect(targets.length).toBeGreaterThan(0);
  });

  it.each(targets)("%s ships a PrivacyInfo.xcprivacy declaring App Group defaults", (target) => {
    const file = join(targetsDir, target, "PrivacyInfo.xcprivacy");
    expect(existsSync(file)).toBe(true);
    const xml = readFileSync(file, "utf8");
    expect(xml).toContain("<string>NSPrivacyAccessedAPICategoryUserDefaults</string>");
    expect(xml).toContain("<string>1C8F.1</string>");
    expect(xml).toMatch(/<key>NSPrivacyTracking<\/key>\s*<false\/>/);
  });

  it("keeps PrivacyInfo.xcprivacy out of targets/_shared (linked into the main app too)", () => {
    expect(existsSync(join(targetsDir, "_shared", "PrivacyInfo.xcprivacy"))).toBe(false);
  });
});
