const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const xcode = require("xcode");

const {
  applyTopShelfTarget,
  findTargetUuid,
  isTopShelfEnabled,
  TOP_SHELF_TARGET,
} = require("./withTvTopShelf.cjs");

const FIXTURE = path.join(__dirname, "__fixtures__", "tvos-minimal.pbxproj");
const OPTIONS = {
  bundleIdentifier: "app.munibtracker",
  marketingVersion: "2.4.0",
  buildNumber: "77",
  teamId: "TEAM123456",
};

function load(file = FIXTURE) {
  const project = xcode.project(file);
  project.parseSync();
  return project;
}

/** Serialize + re-parse, as prebuild writes the file and Xcode reads it back. */
function roundTrip(project) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "topshelf-")), "project.pbxproj");
  fs.writeFileSync(file, project.writeSync());
  return load(file);
}

function configsOf(project, targetName) {
  const key = findTargetUuid(project, targetName);
  const target = project.pbxNativeTargetSection()[key];
  const list = project.pbxXCConfigurationList()[target.buildConfigurationList];
  const section = project.pbxXCBuildConfigurationSection();
  return list.buildConfigurations.map((ref) => section[ref.value]);
}

describe("withTvTopShelf", () => {
  it("is opt-in via EXPO_TVOS_TOP_SHELF", () => {
    expect(isTopShelfEnabled({})).toBe(false);
    expect(isTopShelfEnabled({ EXPO_TVOS_TOP_SHELF: "1" })).toBe(true);
    expect(isTopShelfEnabled({ EXPO_TVOS_TOP_SHELF: "true" })).toBe(true);
    expect(isTopShelfEnabled({ EXPO_TVOS_TOP_SHELF: "0" })).toBe(false);
  });

  it("adds an embedded tvOS app-extension target that survives a write/parse cycle", () => {
    const project = roundTrip(applyTopShelfTarget(load(), OPTIONS));

    const extensionUuid = findTargetUuid(project, TOP_SHELF_TARGET);
    const target = project.pbxNativeTargetSection()[extensionUuid];
    expect(target.productType).toBe('"com.apple.product-type.app-extension"');

    const main = project.getFirstTarget().firstTarget;
    expect(main.dependencies.length).toBe(1);
    const embedPhase = Object.values(project.hash.project.objects.PBXCopyFilesBuildPhase).find(
      (phase) => typeof phase === "object" && phase.dstSubfolderSpec === 13,
    );
    expect(embedPhase.files.length).toBe(1);

    const sources = project.pbxSourcesBuildPhaseObj(extensionUuid);
    expect(sources.files).toHaveLength(1);
    expect(sources.files[0].comment).toMatch(/ContentProvider\.swift"? in Sources/);
  });

  it("configures tvOS build settings, versions and per-target signing", () => {
    const project = applyTopShelfTarget(load(), OPTIONS);

    for (const config of configsOf(project, TOP_SHELF_TARGET)) {
      expect(config.buildSettings).toMatchObject({
        SDKROOT: "appletvos",
        TARGETED_DEVICE_FAMILY: '"3"',
        TVOS_DEPLOYMENT_TARGET: "17.0",
        PRODUCT_BUNDLE_IDENTIFIER: '"app.munibtracker.topshelf"',
        MARKETING_VERSION: "2.4.0",
        CURRENT_PROJECT_VERSION: "77",
        DEVELOPMENT_TEAM: "TEAM123456",
        CODE_SIGN_ENTITLEMENTS: '"MunibTopShelf/MunibTopShelf.entitlements"',
      });
    }
    const release = (name) => configsOf(project, name).find((c) => c.name === "Release");
    expect(release(TOP_SHELF_TARGET).buildSettings.PROVISIONING_PROFILE_SPECIFIER).toBe(
      '"$(MUNIB_TVOS_TOP_SHELF_PROFILE)"',
    );
    expect(release("MunibTracker").buildSettings.PROVISIONING_PROFILE_SPECIFIER).toBe(
      '"$(MUNIB_TVOS_APP_PROFILE)"',
    );
  });

  it("is idempotent across repeated prebuild passes", () => {
    const project = applyTopShelfTarget(roundTrip(applyTopShelfTarget(load(), OPTIONS)), OPTIONS);

    const extensions = Object.values(project.pbxNativeTargetSection()).filter(
      (t) => typeof t === "object" && String(t.name).replace(/"/g, "") === TOP_SHELF_TARGET,
    );
    expect(extensions).toHaveLength(1);
  });
});
