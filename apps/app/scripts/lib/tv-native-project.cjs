/**
 * Detect whether apps/app/android|ios was generated with EXPO_TV=1 (Leanback / tvOS).
 * Phone ↔ TV always requires a clean prebuild — release scripts refuse the wrong tree.
 */
const fs = require("node:fs");
const path = require("node:path");

/**
 * @param {string} projectRoot
 * @returns {boolean}
 */
function isAndroidTvProject(projectRoot) {
  const manifest = path.join(projectRoot, "android", "app", "src", "main", "AndroidManifest.xml");
  if (!fs.existsSync(manifest)) return false;
  const xml = fs.readFileSync(manifest, "utf8");
  return (
    xml.includes("android.software.leanback") ||
    xml.includes("LEANBACK_LAUNCHER") ||
    xml.includes("android:banner")
  );
}

/**
 * @param {string} projectRoot
 * @returns {boolean}
 */
function isIosTvProject(projectRoot) {
  const iosDir = path.join(projectRoot, "ios");
  if (!fs.existsSync(iosDir)) return false;
  const xcodeprojs = fs.readdirSync(iosDir).filter((name) => name.endsWith(".xcodeproj"));
  for (const proj of xcodeprojs) {
    const pbx = path.join(iosDir, proj, "project.pbxproj");
    if (!fs.existsSync(pbx)) continue;
    const text = fs.readFileSync(pbx, "utf8");
    if (
      text.includes("SDKROOT = appletvos") ||
      text.includes("TVOS_DEPLOYMENT_TARGET") ||
      /TARGETED_DEVICE_FAMILY\s*=\s*"?3"?/.test(text)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} projectRoot
 * @param {{ expectTv: boolean }} opts
 */
function assertAndroidProjectMode(projectRoot, { expectTv }) {
  const androidDir = path.join(projectRoot, "android");
  if (!fs.existsSync(androidDir)) {
    console.error(
      "\nMissing apps/app/android/ — generate the native project first:\n" +
        (expectTv ? "  pnpm prebuild:app:tv:android\n" : "  pnpm prebuild:app:android\n"),
    );
    process.exit(1);
  }

  const isTv = isAndroidTvProject(projectRoot);
  if (expectTv && !isTv) {
    console.error(
      "\nandroid/ looks like a phone Leanback-free project, but this is a TV release.\n" +
        "  Run: pnpm prebuild:app:tv:android\n" +
        "  (Phone ↔ TV always needs a clean prebuild.)\n",
    );
    process.exit(1);
  }
  if (!expectTv && isTv) {
    console.error(
      "\nandroid/ looks like an Android TV (Leanback) project, but this is a phone release.\n" +
        "  Revert: pnpm cleanbuild:app:android\n" +
        "  Or ship TV with: pnpm release:app:android-tv\n",
    );
    process.exit(1);
  }
}

/**
 * @param {string} projectRoot
 * @param {{ expectTv: boolean }} opts
 */
function assertIosProjectMode(projectRoot, { expectTv }) {
  const iosDir = path.join(projectRoot, "ios");
  if (!fs.existsSync(iosDir)) {
    console.error(
      "\nMissing apps/app/ios/ — generate the native project first:\n" +
        (expectTv ? "  pnpm prebuild:app:tv:ios\n" : "  pnpm prebuild:app:ios\n"),
    );
    process.exit(1);
  }

  const isTv = isIosTvProject(projectRoot);
  if (expectTv && !isTv) {
    console.error(
      "\nios/ looks like an iPhone project, but this is an Apple TV release.\n" +
        "  Run: pnpm prebuild:app:tv:ios\n" +
        "  (Phone ↔ TV always needs a clean prebuild.)\n",
    );
    process.exit(1);
  }
  if (!expectTv && isTv) {
    console.error(
      "\nios/ looks like a tvOS project, but this is an iPhone release.\n" +
        "  Revert: pnpm cleanbuild:app:ios\n" +
        "  Or ship Apple TV with: pnpm release:app:tvos\n",
    );
    process.exit(1);
  }
}

/** Ensure process.env.EXPO_TV=1 for Metro / config during TV native builds. */
function enableExpoTvEnv() {
  process.env.EXPO_TV = "1";
}

module.exports = {
  isAndroidTvProject,
  isIosTvProject,
  assertAndroidProjectMode,
  assertIosProjectMode,
  enableExpoTvEnv,
};
