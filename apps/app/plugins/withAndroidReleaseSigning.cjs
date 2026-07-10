const { withAppBuildGradle, createRunOncePlugin } = require("@expo/config-plugins");

const MARKER = "withAndroidReleaseSigning";

const RELEASE_SIGNING_BLOCK = `// ${MARKER}
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            signingConfig keystorePropertiesFile.exists() ? signingConfigs.release : signingConfigs.debug
            if (!keystorePropertiesFile.exists()) {
                println "WARNING [${MARKER}]: android/keystore.properties missing — release is debug-signed (not for Play). See apps/app/android-keys/README.md"
            }`;

/** True when buildTypes.release still uses the debug keystore (misconfigured or plugin misfire). */
function releaseBuildTypeUsesDebugKeystore(contents) {
  const match = contents.match(/buildTypes\s*\{[\s\S]*?\n\s*release\s*\{([\s\S]*?)\n\s*\}/);
  if (!match) return false;
  const body = match[1];
  return /signingConfig\s+signingConfigs\.debug/.test(body) && !body.includes(`// ${MARKER}`);
}

/** Undo plugin applying upload signing to debug instead of release (regex matched wrong block). */
function repairMisplacedDebugSigning(contents) {
  return contents.replace(
    /debug\s*\{\s*\/\/ withAndroidReleaseSigning[\s\S]*?if \(!keystorePropertiesFile\.exists\(\)\) \{\s*println[^}]+\}\s*\}/,
    `debug {
            signingConfig signingConfigs.debug
        }`,
  );
}

/** Remove earlier munib signing patch (wrong storeFile resolution). */
function stripLegacySigningPatch(contents) {
  let next = contents.replace(/\n\/\/ with-android-release-signing[\s\S]*?(?=\nandroid \{)/, "");

  if (next.includes("hasReleaseKeystore")) {
    next = next.replace(
      /signingConfigs\s*\{[\s\S]*?\n {4}\}\n {4}buildTypes/,
      `signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            def keystoreProperties = new Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                storeFile rootProject.file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes`,
    );
  }

  return next;
}

/** @param {string} contents */
function patchAppBuildGradle(contents) {
  let next = stripLegacySigningPatch(contents);

  if (!next.includes('keystorePropertiesFile = rootProject.file("keystore.properties")')) {
    next = next.replace(
      /signingConfigs\s*\{[\s\S]*?\n {4}\}\n {4}buildTypes/,
      `signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            def keystoreProperties = new Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                storeFile rootProject.file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes`,
    );
  }

  next = repairMisplacedDebugSigning(next);

  if (releaseBuildTypeUsesDebugKeystore(next) || next.includes("hasReleaseKeystore")) {
    next = next.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig (?:hasReleaseKeystore \? signingConfigs\.release : )?signingConfigs\.debug/,
      `$1${RELEASE_SIGNING_BLOCK}`,
    );
  }

  return next;
}

/** @type {import('@expo/config-plugins').ConfigPlugin} */
function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (mod) => {
    mod.modResults.contents = patchAppBuildGradle(mod.modResults.contents);
    return mod;
  });
}

/**
 * @param {string} appRoot
 */
function ensureAndroidReleaseSigning(appRoot) {
  const fs = require("node:fs");
  const path = require("node:path");
  const buildGradlePath = path.join(appRoot, "android", "app", "build.gradle");
  if (!fs.existsSync(buildGradlePath)) {
    return;
  }

  const before = fs.readFileSync(buildGradlePath, "utf8");
  const after = patchAppBuildGradle(before);
  if (after !== before) {
    fs.writeFileSync(buildGradlePath, after, "utf8");
    console.log("Applied release signing config to android/app/build.gradle.\n");
  }
}

module.exports = createRunOncePlugin(
  withAndroidReleaseSigning,
  "withAndroidReleaseSigning",
  "1.0.1",
);
module.exports.patchAppBuildGradle = patchAppBuildGradle;
module.exports.ensureAndroidReleaseSigning = ensureAndroidReleaseSigning;
