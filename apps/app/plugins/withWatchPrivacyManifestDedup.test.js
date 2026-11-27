const { applyWatchPrivacyHook, MARKER } = require("./withWatchPrivacyManifestDedup.cjs");

const PODFILE = `target 'MunibTracker' do
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
    )

    # other hook
  end
end
`;

describe("withWatchPrivacyManifestDedup", () => {
  it("inserts the watchOS PrivacyInfo cleanup right after react_native_post_install", () => {
    const out = applyWatchPrivacyHook(PODFILE);
    const rnEnd = out.indexOf("    )\n");
    const hook = out.indexOf(MARKER);
    expect(hook).toBeGreaterThan(rnEnd);
    expect(hook).toBeLessThan(out.indexOf("# other hook"));
    expect(out).toContain('build_settings["SDKROOT"] == "watchos"');
    expect(out).toContain("remove_build_file(build_file)");
  });

  it("is idempotent", () => {
    const once = applyWatchPrivacyHook(PODFILE);
    expect(applyWatchPrivacyHook(once)).toBe(once);
  });

  it("fails loudly when the Podfile has no react_native_post_install", () => {
    expect(() => applyWatchPrivacyHook("platform :ios\n")).toThrow(/react_native_post_install/);
  });
});
