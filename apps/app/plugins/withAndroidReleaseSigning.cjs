const { withAppBuildGradle, createRunOncePlugin } = require("@expo/config-plugins");

const MARKER = "withAndroidReleaseSigning";

const RELEASE_SIGNING_BLOCK = `// ${MARKER}
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            if (keystorePropertiesFile.exists()) {
                signingConfig signingConfigs.release
            } else {
                def isReleaseTask = gradle.startParameter.taskNames.any { it.toLowerCase().contains("release") }
                if (isReleaseTask) {
                    throw new GradleException("[${MARKER}] android/keystore.properties missing — refusing to debug-sign a release build. See apps/app/android-keys/README.md")
                }
                println "[${MARKER}] keystore.properties missing — debug builds OK; sync android-keys/ before release"
                signingConfig signingConfigs.debug
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

  // Upgrade older hard-throw release signing (breaks assembleDebug at config time).
  next = next.replace(
    /\/\/ withAndroidReleaseSigning\s*\n\s*def keystorePropertiesFile = rootProject\.file\("keystore\.properties"\)\s*\n\s*if \(!keystorePropertiesFile\.exists\(\)\) \{\s*\n\s*throw new GradleException\("\[withAndroidReleaseSigning\][^"]+"\)\s*\n\s*\}\s*\n\s*signingConfig signingConfigs\.release/,
    RELEASE_SIGNING_BLOCK,
  );

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
