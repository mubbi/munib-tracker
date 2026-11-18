/**
 * When EXPO_TV=1, keep Fabric codegen TV-aware and nil-safe on iOS/tvOS.
 *
 * 1. `ios/.xcode.env` exports EXPO_TV=1. Xcode script phases (ReactCodegen
 *    "[CP-User] Generate Specs") source this file, so build-time codegen reads
 *    react-native.config.js with the TV autolinking excludes. Without it, Xcode
 *    regenerates the providers with phone-only packages (RNCWebView, pager-view)
 *    and the app aborts at launch on a nil Class in an NSDictionary literal.
 * 2. Podfile post_install patches RCTThirdPartyComponentsProvider.mm once after
 *    pod install, and appends the same patch to the ReactCodegen
 *    "Generate Specs" phase so it re-runs right after build-time codegen —
 *    before ReactCodegen compiles the file. (An app-target phase runs too late:
 *    ReactCodegen is a dependency and has already compiled the unpatched file.)
 *
 * Complements excluding phone-only packages from autolinking — codegen can still
 * emit Classes that are not linked on tvOS.
 */
const { createRunOncePlugin, withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const NIL_SAFE_SCRIPT = "nil-safe-fabric-third-party-components.cjs";
const XCODE_ENV_MARKER = "# Munib TV: build-time codegen must see TV autolinking excludes";

function isTvEnv() {
  const v = process.env.EXPO_TV?.trim();
  return v === "1" || v === "true" || v === "True";
}

const PODFILE_HOOK = `
    # Munib TV: skip nil Fabric Classes (unlinked packages) in RCTThirdPartyComponentsProvider
    system("node", "#{Pod::Config.instance.installation_root}/../scripts/${NIL_SAFE_SCRIPT}")

    # Munib TV: re-apply after build-time codegen, before ReactCodegen compiles the provider
    installer.pods_project.targets.each do |target|
      next unless target.name == "ReactCodegen"
      target.shell_script_build_phases.each do |phase|
        next unless phase.name == "[CP-User] Generate Specs"
        next if phase.shell_script.include?("${NIL_SAFE_SCRIPT}")
        phase.shell_script += <<~'SH'

          # Munib TV: nil-safe Fabric third-party components (see withTvNilSafeFabricComponents)
          . "$RCT_SCRIPT_POD_INSTALLATION_ROOT/.xcode.env"
          if [ -f "$RCT_SCRIPT_POD_INSTALLATION_ROOT/.xcode.env.local" ]; then . "$RCT_SCRIPT_POD_INSTALLATION_ROOT/.xcode.env.local"; fi
          "\${NODE_BINARY:-node}" "$RCT_SCRIPT_APP_PATH/scripts/${NIL_SAFE_SCRIPT}" "$RCT_SCRIPT_OUTPUT_DIR/build/generated/ios/ReactCodegen/RCTThirdPartyComponentsProvider.mm"
        SH
      end
    end
`;

async function patchPodfile(platformProjectRoot) {
  const podfilePath = path.join(platformProjectRoot, "Podfile");
  let contents = await fs.promises.readFile(podfilePath, "utf8");
  if (contents.includes(NIL_SAFE_SCRIPT)) return;
  if (!contents.includes("react_native_post_install(")) {
    throw new Error("withTvNilSafeFabricComponents: Podfile missing react_native_post_install");
  }
  contents = contents.replace(
    /react_native_post_install\(\s*installer,[\s\S]*?\n\s*\)\n/,
    (match) => `${match}${PODFILE_HOOK}`,
  );
  await fs.promises.writeFile(podfilePath, contents);
}

async function patchXcodeEnv(platformProjectRoot) {
  const envPath = path.join(platformProjectRoot, ".xcode.env");
  const contents = fs.existsSync(envPath) ? await fs.promises.readFile(envPath, "utf8") : "";
  if (contents.includes(XCODE_ENV_MARKER)) return;
  const sep = contents && !contents.endsWith("\n") ? "\n" : "";
  await fs.promises.writeFile(
    envPath,
    `${contents}${sep}\n${XCODE_ENV_MARKER}\nexport EXPO_TV=1\n`,
  );
}

function withTvNilSafeFabricComponents(config) {
  if (!isTvEnv()) return config;

  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const root = cfg.modRequest.platformProjectRoot;
      await patchPodfile(root);
      await patchXcodeEnv(root);
      return cfg;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withTvNilSafeFabricComponents,
  "with-tv-nil-safe-fabric-components",
  "1.0.0",
);
