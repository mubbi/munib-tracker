/**
 * iOS (phone prebuild): keep the app's `PrivacyInfo.xcprivacy` out of the watchOS app.
 *
 * React Native's CocoaPods privacy-manifest aggregation
 * (`react-native/scripts/cocoapods/privacy_manifest_utils.rb`) links the app's
 * manifest into the Resources phase of *every* `:application` target. The
 * single-target watchOS app (`targets/munib-tracker-watch`, via
 * `@bacons/apple-targets`) is an `:application` too, and it already ships its own
 * `PrivacyInfo.xcprivacy` from its synchronized folder — RN can't see that copy,
 * so the archive fails with "Multiple commands produce …/MunibTrackerWatch.app/
 * PrivacyInfo.xcprivacy".
 *
 * This hook runs right after `react_native_post_install` and drops any
 * `PrivacyInfo.xcprivacy` build file from watchOS targets' Resources phase, so each
 * watch target keeps only the manifest in its own folder.
 *
 * TV prebuilds have no watch target; the hook is a no-op there.
 */
const { createRunOncePlugin, withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const MARKER = "# Munib: keep the app PrivacyInfo.xcprivacy out of watchOS targets";

const PODFILE_HOOK = `
    ${MARKER}
    # (RN privacy aggregation adds it to every :application target; the watch app ships its own.)
    installer.aggregate_targets.map(&:user_project).compact.uniq.each do |user_project|
      changed = false
      user_project.targets.each do |target|
        next unless target.respond_to?(:resources_build_phase)
        next unless target.build_configurations.any? { |c| c.build_settings["SDKROOT"] == "watchos" }
        target.resources_build_phase.files.to_a.each do |build_file|
          next unless build_file.file_ref&.path.to_s.end_with?("PrivacyInfo.xcprivacy")
          target.resources_build_phase.remove_build_file(build_file)
          changed = true
        end
      end
      user_project.save if changed
    end
`;

/**
 * Insert the hook after `react_native_post_install(...)`. Idempotent.
 * @param {string} contents Podfile text
 * @returns {string}
 */
function applyWatchPrivacyHook(contents) {
  if (contents.includes(MARKER)) return contents;
  const pattern = /react_native_post_install\(\s*installer,[\s\S]*?\n\s*\)\n/;
  if (!pattern.test(contents)) {
    throw new Error("withWatchPrivacyManifestDedup: Podfile missing react_native_post_install");
  }
  return contents.replace(pattern, (match) => `${match}${PODFILE_HOOK}`);
}

function withWatchPrivacyManifestDedup(config) {
  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      const contents = await fs.promises.readFile(podfilePath, "utf8");
      const next = applyWatchPrivacyHook(contents);
      if (next !== contents) await fs.promises.writeFile(podfilePath, next);
      return cfg;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withWatchPrivacyManifestDedup,
  "with-watch-privacy-manifest-dedup",
  "1.0.0",
);
module.exports.applyWatchPrivacyHook = applyWatchPrivacyHook;
module.exports.MARKER = MARKER;
