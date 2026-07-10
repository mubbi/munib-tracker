const fs = require("node:fs");
const path = require("node:path");
const {
  createRunOncePlugin,
  withDangerousMod,
  withGradleProperties,
  withProjectBuildGradle,
} = require("@expo/config-plugins");

const MARKER = "with-android-build-hygiene";

/**
 * Post-prebuild fixes for noisy Android build warnings that upstream Expo/RN
 * templates and modules still emit on SDK 57.
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
  "1.0.0",
);
