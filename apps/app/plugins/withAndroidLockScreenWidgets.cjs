const { withFinalizedMod, createRunOncePlugin } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const HOME_SCREEN_CATEGORY = 'android:widgetCategory="home_screen"';
const LOCK_SCREEN_CATEGORY = 'android:widgetCategory="home_screen|keyguard"';

/**
 * react-native-android-widget registers widgets for the home screen only.
 * Patch provider XML so the same widgets can be placed on the lock screen (keyguard).
 */
function withAndroidLockScreenWidgets(config) {
  // Finalized: runs after react-native-android-widget has written its provider XML
  // (plugin order alone is not enough from react-native-android-widget 0.26).
  return withFinalizedMod(config, [
    "android",
    async (config) => {
      const xmlDir = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
      let providers = 0;
      if (fs.existsSync(xmlDir)) {
        for (const file of fs.readdirSync(xmlDir)) {
          if (!file.startsWith("widgetprovider_") || !file.endsWith(".xml")) continue;
          providers += 1;
          const filePath = path.join(xmlDir, file);
          const contents = fs.readFileSync(filePath, "utf8");
          if (!contents.includes(HOME_SCREEN_CATEGORY)) continue;
          fs.writeFileSync(filePath, contents.replace(HOME_SCREEN_CATEGORY, LOCK_SCREEN_CATEGORY));
        }
      }
      if (providers === 0) {
        console.warn("[withAndroidLockScreenWidgets] no widgetprovider_*.xml found to patch");
      }
      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withAndroidLockScreenWidgets,
  "withAndroidLockScreenWidgets",
  "1.0.0",
);
