/**
 * When EXPO_TV=1, add an Xcode Run Script phase that nil-safes
 * RCTThirdPartyComponentsProvider.mm after ReactCodegen runs.
 *
 * Complements excluding phone-only packages from autolinking — codegen can still
 * emit Classes that are not linked on tvOS (e.g. pager-view).
 */
const { createRunOncePlugin, withXcodeProject, withDangerousMod } = require("@expo/config-plugins");
const path = require("node:path");

const PHASE_NAME = "[Munib] Nil-safe Fabric third-party components";

function isTvEnv() {
  const v = process.env.EXPO_TV?.trim();
  return v === "1" || v === "true" || v === "True";
}

function withTvNilSafeFabricComponents(config) {
  if (!isTvEnv()) return config;

  config = withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const fs = require("node:fs");
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let contents = await fs.promises.readFile(podfilePath, "utf8");
      if (contents.includes("nil-safe-fabric-third-party-components.cjs")) {
        return cfg;
      }
      if (!contents.includes("react_native_post_install(")) {
        throw new Error("withTvNilSafeFabricComponents: Podfile missing react_native_post_install");
      }
      // After codegen artifacts exist from pod install, patch immediately.
      const hook = `
    # Munib TV: skip nil Fabric Classes (unlinked packages) in RCTThirdPartyComponentsProvider
    system("node", "#{Pod::Config.instance.installation_root}/../scripts/nil-safe-fabric-third-party-components.cjs")
`;
      contents = contents.replace(
        /react_native_post_install\(\s*installer,[\s\S]*?\n\s*\)\n/,
        (match) => `${match}${hook}`,
      );
      await fs.promises.writeFile(podfilePath, contents);
      return cfg;
    },
  ]);

  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const nativeTargets = project.pbxNativeTargetSection();
    let appTargetUuid = null;
    for (const [uuid, target] of Object.entries(nativeTargets)) {
      if (typeof target !== "object" || !target) continue;
      if (target.productType !== '"com.apple.product-type.application"') continue;
      appTargetUuid = uuid;
      break;
    }
    if (!appTargetUuid) {
      throw new Error("withTvNilSafeFabricComponents: no application target");
    }

    const phases = project.hash.project.objects.PBXShellScriptBuildPhase || {};
    const already = Object.values(phases).some(
      (phase) => phase && typeof phase === "object" && phase.name === `"${PHASE_NAME}"`,
    );
    if (already) return cfg;

    const script = `set -e
PROVIDER=""
for candidate in \\
  "\${SRCROOT}/build/generated/ios/ReactCodegen/RCTThirdPartyComponentsProvider.mm" \\
  "\${PODS_ROOT}/../build/generated/ios/ReactCodegen/RCTThirdPartyComponentsProvider.mm" \\
  "\${BUILD_DIR%/Build/*}/Build/generated/ios/ReactCodegen/RCTThirdPartyComponentsProvider.mm"
do
  if [ -f "$candidate" ]; then PROVIDER="$candidate"; break; fi
done
if [ -z "$PROVIDER" ]; then
  echo "note: RCTThirdPartyComponentsProvider.mm not found yet — skip nil-safe patch"
  exit 0
fi
node "\${SRCROOT}/../scripts/nil-safe-fabric-third-party-components.cjs" "$PROVIDER"
`;

    project.addBuildPhase([], "PBXShellScriptBuildPhase", PHASE_NAME, appTargetUuid, {
      shellPath: "/bin/sh",
      shellScript: script,
    });
    return cfg;
  });
}

module.exports = createRunOncePlugin(
  withTvNilSafeFabricComponents,
  "with-tv-nil-safe-fabric-components",
  "1.0.0",
);
