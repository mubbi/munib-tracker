const fs = require("node:fs");
const path = require("node:path");
const {
  withDangerousMod,
  withEntitlementsPlist,
  withXcodeProject,
} = require("@expo/config-plugins");

/**
 * Apple TV dynamic Top Shelf (TV prebuild only, opt-in with EXPO_TVOS_TOP_SHELF=1).
 *
 * `@bacons/apple-targets` has no tvOS / Top Shelf target type, so this plugin adds
 * the `com.apple.tv-top-shelf` app extension itself:
 *   - copies `tv-targets/top-shelf/` (ContentProvider.swift + art) to `ios/MunibTopShelf/`
 *     and writes its Info.plist + entitlements;
 *   - adds the extension target (embedded in the app, tvOS build settings);
 *   - adds the shared App Group to the app's entitlements.
 *
 * Signing: the extension needs its own App ID (`<bundle>.topshelf`) and a tvOS App
 * Store provisioning profile with the App Group. Release configurations read the
 * profile names from `$(MUNIB_TVOS_APP_PROFILE)` / `$(MUNIB_TVOS_TOP_SHELF_PROFILE)`,
 * which `scripts/ios-tv-release.js` passes to xcodebuild (see docs/TV.md).
 */
const TARGET = "MunibTopShelf";
const SOURCE_DIR = path.join(__dirname, "..", "tv-targets", "top-shelf");
const DEFAULT_TVOS_DEPLOYMENT_TARGET = "16.4";

function isTopShelfEnabled(env = process.env) {
  const value = env.EXPO_TVOS_TOP_SHELF?.trim().toLowerCase();
  return value === "1" || value === "true";
}

function artFiles() {
  const dir = path.join(SOURCE_DIR, "Art");
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".png"))
        .sort()
    : [];
}

function infoPlist({ displayName, appGroup }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>$(DEVELOPMENT_LANGUAGE)</string>
  <key>CFBundleDisplayName</key>
  <string>${displayName}</string>
  <key>CFBundleExecutable</key>
  <string>$(EXECUTABLE_NAME)</string>
  <key>CFBundleIdentifier</key>
  <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>$(PRODUCT_NAME)</string>
  <key>CFBundlePackageType</key>
  <string>XPC!</string>
  <key>CFBundleShortVersionString</key>
  <string>$(MARKETING_VERSION)</string>
  <key>CFBundleVersion</key>
  <string>$(CURRENT_PROJECT_VERSION)</string>
  <key>MunibAppGroup</key>
  <string>${appGroup}</string>
  <key>NSExtension</key>
  <dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.tv-top-shelf</string>
    <key>NSExtensionPrincipalClass</key>
    <string>$(PRODUCT_MODULE_NAME).ContentProvider</string>
  </dict>
</dict>
</plist>
`;
}

function entitlementsPlist(appGroup) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.application-groups</key>
  <array>
    <string>${appGroup}</string>
  </array>
</dict>
</plist>
`;
}

/** Build configurations (Debug / Release) of a native target. */
function configurationsForTarget(project, targetUuid) {
  const target = project.pbxNativeTargetSection()[targetUuid];
  if (!target) return [];
  const list = project.pbxXCConfigurationList()[target.buildConfigurationList];
  const section = project.pbxXCBuildConfigurationSection();
  return (list?.buildConfigurations ?? []).map((ref) => section[ref.value]).filter(Boolean);
}

function unquote(value) {
  return typeof value === "string" ? value.replace(/^"(.*)"$/, "$1") : value;
}

/** `xcode` stores names quoted (`"\"MunibTopShelf\""`), so `pbxTargetByName` misses them. */
function findTargetUuid(project, name) {
  const section = project.pbxNativeTargetSection();
  return (
    Object.keys(section).find(
      (key) => typeof section[key] === "object" && unquote(section[key].name) === name,
    ) ?? null
  );
}

/**
 * Pure Xcode-project edit (exported for tests). Idempotent: a second prebuild pass
 * finds the target and only refreshes build settings.
 */
function applyTopShelfTarget(project, { bundleIdentifier, marketingVersion, buildNumber, teamId }) {
  const objects = project.hash.project.objects;
  objects.PBXBuildFile = objects.PBXBuildFile || {};
  objects.PBXTargetDependency = objects.PBXTargetDependency || {};
  objects.PBXContainerItemProxy = objects.PBXContainerItemProxy || {};

  const mainTarget = project.getFirstTarget();
  const mainConfigs = configurationsForTarget(project, mainTarget.uuid);
  const deploymentTarget =
    unquote(
      mainConfigs.find((c) => c.buildSettings?.TVOS_DEPLOYMENT_TARGET)?.buildSettings
        .TVOS_DEPLOYMENT_TARGET,
    ) || DEFAULT_TVOS_DEPLOYMENT_TARGET;

  const existingUuid = findTargetUuid(project, TARGET);
  let target = existingUuid ? { uuid: existingUuid } : null;

  if (!target) {
    const files = [
      "ContentProvider.swift",
      `${TARGET}-Info.plist`,
      `${TARGET}.entitlements`,
      ...artFiles(),
    ];
    const group = project.addPbxGroup(files, TARGET, TARGET);
    const mainGroup = project.getFirstProject().firstProject.mainGroup;
    project.addToPbxGroup(group.uuid, mainGroup);

    target = project.addTarget(TARGET, "app_extension", TARGET, `${bundleIdentifier}.topshelf`);
    project.addBuildPhase(
      ["ContentProvider.swift"],
      "PBXSourcesBuildPhase",
      "Sources",
      target.uuid,
    );
    project.addBuildPhase(artFiles(), "PBXResourcesBuildPhase", "Resources", target.uuid);
    project.addBuildPhase([], "PBXFrameworksBuildPhase", "Frameworks", target.uuid);
  }

  for (const config of configurationsForTarget(project, target.uuid)) {
    Object.assign(config.buildSettings, {
      SDKROOT: "appletvos",
      TARGETED_DEVICE_FAMILY: '"3"',
      TVOS_DEPLOYMENT_TARGET: deploymentTarget,
      SWIFT_VERSION: "5.0",
      CLANG_ENABLE_MODULES: "YES",
      GENERATE_INFOPLIST_FILE: "NO",
      INFOPLIST_FILE: `"${TARGET}/${TARGET}-Info.plist"`,
      CODE_SIGN_ENTITLEMENTS: `"${TARGET}/${TARGET}.entitlements"`,
      PRODUCT_BUNDLE_IDENTIFIER: `"${bundleIdentifier}.topshelf"`,
      MARKETING_VERSION: marketingVersion,
      CURRENT_PROJECT_VERSION: buildNumber,
      ...(teamId ? { DEVELOPMENT_TEAM: teamId } : {}),
    });
    if (config.name === "Release") {
      config.buildSettings.PROVISIONING_PROFILE_SPECIFIER = '"$(MUNIB_TVOS_TOP_SHELF_PROFILE)"';
    }
  }

  // Per-target profiles: a single command-line PROVISIONING_PROFILE_SPECIFIER would
  // also be applied to the extension (different bundle ID) and fail signing.
  for (const config of mainConfigs) {
    if (config.name === "Release") {
      config.buildSettings.PROVISIONING_PROFILE_SPECIFIER = '"$(MUNIB_TVOS_APP_PROFILE)"';
    }
  }

  return project;
}

function withTvTopShelf(config, { appGroup }) {
  const bundleIdentifier = config.ios?.bundleIdentifier;
  if (!bundleIdentifier) throw new Error("withTvTopShelf: ios.bundleIdentifier is required");

  config = withEntitlementsPlist(config, (cfg) => {
    const key = "com.apple.security.application-groups";
    const groups = new Set(cfg.modResults[key] ?? []);
    groups.add(appGroup);
    cfg.modResults[key] = [...groups];
    return cfg;
  });

  config = withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const dest = path.join(cfg.modRequest.platformProjectRoot, TARGET);
      fs.mkdirSync(dest, { recursive: true });
      fs.copyFileSync(
        path.join(SOURCE_DIR, "ContentProvider.swift"),
        path.join(dest, "ContentProvider.swift"),
      );
      for (const art of artFiles()) {
        fs.copyFileSync(path.join(SOURCE_DIR, "Art", art), path.join(dest, art));
      }
      fs.writeFileSync(
        path.join(dest, `${TARGET}-Info.plist`),
        infoPlist({ displayName: cfg.name ?? "Munib Tracker", appGroup }),
      );
      fs.writeFileSync(path.join(dest, `${TARGET}.entitlements`), entitlementsPlist(appGroup));
      return cfg;
    },
  ]);

  return withXcodeProject(config, (cfg) => {
    cfg.modResults = applyTopShelfTarget(cfg.modResults, {
      bundleIdentifier,
      marketingVersion: cfg.version ?? "1.0.0",
      buildNumber: cfg.ios?.buildNumber ?? "1",
      teamId: cfg.ios?.appleTeamId,
    });
    return cfg;
  });
}

module.exports = withTvTopShelf;
module.exports.applyTopShelfTarget = applyTopShelfTarget;
module.exports.findTargetUuid = findTargetUuid;
module.exports.isTopShelfEnabled = isTopShelfEnabled;
module.exports.TOP_SHELF_TARGET = TARGET;
