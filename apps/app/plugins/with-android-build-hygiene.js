const fs = require("node:fs");
const path = require("node:path");
const {
  AndroidConfig,
  createRunOncePlugin,
  withAppBuildGradle,
  withAndroidStyles,
  withDangerousMod,
  withFinalizedMod,
  withGradleProperties,
  withProjectBuildGradle,
} = require("@expo/config-plugins");

const MARKER = "with-android-build-hygiene";

/**
 * Prefer R8 full optimizations for Play vitals (proguard-android.txt includes
 * -dontoptimize and tanks obfuscation/optimize scores).
 * @param {string} contents
 */
function patchProguardOptimizeFile(contents) {
  return contents.replace(
    /getDefaultProguardFile\(["']proguard-android\.txt["']\)/g,
    'getDefaultProguardFile("proguard-android-optimize.txt")',
  );
}

/**
 * Android 15+ deprecates Window status/navigation bar color APIs. Transparent
 * theme attrs still surface in Play's edge-to-edge deprecated-API report.
 * Edge-to-edge is already enabled via gradle.properties; safe-area handles insets.
 * @param {string} contents
 */
function stripDeprecatedSystemBarColorAttrs(contents) {
  return contents
    .replace(/\s*<item name="android:statusBarColor">[^<]*<\/item>/g, "")
    .replace(/\s*<item name="android:navigationBarColor">[^<]*<\/item>/g, "");
}

/**
 * @param {import('@expo/config-plugins').AndroidStyleXML} styles
 */
function removeDeprecatedSystemBarColorStyles(styles) {
  const parent = AndroidConfig.Styles.getAppThemeGroup();
  let next = AndroidConfig.Styles.removeStylesItem({
    xml: styles,
    parent,
    name: "android:statusBarColor",
  });
  next = AndroidConfig.Styles.removeStylesItem({
    xml: next,
    parent,
    name: "android:navigationBarColor",
  });
  return next;
}

/**
 * Post-prebuild fixes for noisy Android build warnings that upstream Expo/RN
 * templates and modules still emit on SDK 57, plus Play optimization hygiene.
 */
function withAndroidBuildHygiene(config) {
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const platformRoot = config.modRequest.platformProjectRoot;
      const debugManifestPaths = [
        path.join(platformRoot, "app/src/debug/AndroidManifest.xml"),
        path.join(platformRoot, "app/src/debugOptimized/AndroidManifest.xml"),
      ];

      for (const debugManifestPath of debugManifestPaths) {
        if (!fs.existsSync(debugManifestPath)) {
          continue;
        }

        const contents = fs
          .readFileSync(debugManifestPath, "utf8")
          .replace(/\s*tools:replace="android:usesCleartextTraffic"/g, "");
        fs.writeFileSync(debugManifestPath, contents);
      }

      return config;
    },
  ]);

  // Remove after Expo SystemBars (which re-adds transparent bar colors).
  config = withAndroidStyles(config, (config) => {
    config.modResults = removeDeprecatedSystemBarColorStyles(config.modResults);
    return config;
  });

  // Finalized runs after styles are written — belt-and-suspenders vs SystemBars.
  config = withFinalizedMod(config, [
    "android",
    async (config) => {
      const stylesPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values/styles.xml",
      );
      if (fs.existsSync(stylesPath)) {
        const before = fs.readFileSync(stylesPath, "utf8");
        const after = stripDeprecatedSystemBarColorAttrs(before);
        if (after !== before) {
          fs.writeFileSync(stylesPath, after);
        }
      }
      return config;
    },
  ]);

  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = patchProguardOptimizeFile(config.modResults.contents);
    return config;
  });

  config = withGradleProperties(config, (config) => {
    config.modResults.push({
      type: "property",
      key: "org.gradle.warning.mode",
      value: "none",
    });

    const {
      WINDOWS_GRADLE_PROPERTIES,
      ANDROID_RELEASE_GRADLE_PROPERTIES,
    } = require("../scripts/lib/native-script-utils.cjs");
    const gradleProperties = {
      ...ANDROID_RELEASE_GRADLE_PROPERTIES,
      ...(process.platform === "win32" ? WINDOWS_GRADLE_PROPERTIES : {}),
    };
    for (const [key, value] of Object.entries(gradleProperties)) {
      const existing = config.modResults.find(
        (entry) => entry.type === "property" && entry.key === key,
      );
      if (existing) {
        existing.value = value;
      } else {
        config.modResults.push({ type: "property", key, value });
      }
    }

    return config;
  });

  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes(MARKER)) {
      return config;
    }

    config.modResults.contents += `

// ${MARKER}: quiet Kotlin deprecation noise from Expo module dependencies
subprojects { subproject ->
  subproject.plugins.withId("org.jetbrains.kotlin.android") {
    subproject.tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
      compilerOptions {
        suppressWarnings.set(true)
      }
    }
  }

  subproject.plugins.withId("com.android.library") {
    subproject.tasks.withType(JavaCompile).configureEach {
      options.compilerArgs.add("-Xlint:none")
    }
  }

  subproject.plugins.withId("com.android.application") {
    subproject.tasks.withType(JavaCompile).configureEach {
      options.compilerArgs.add("-Xlint:none")
    }
  }
}
`;

    return config;
  });

  return config;
}

module.exports = createRunOncePlugin(
  withAndroidBuildHygiene,
  "with-android-build-hygiene",
  "1.1.0",
);
module.exports.patchProguardOptimizeFile = patchProguardOptimizeFile;
module.exports.stripDeprecatedSystemBarColorAttrs = stripDeprecatedSystemBarColorAttrs;
module.exports.removeDeprecatedSystemBarColorStyles = removeDeprecatedSystemBarColorStyles;
