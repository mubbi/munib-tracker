const { withDangerousMod, createRunOncePlugin } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const HOME_SCREEN_CATEGORY = 'android:widgetCategory="home_screen"';
const LOCK_SCREEN_CATEGORY = 'android:widgetCategory="home_screen|keyguard"';

/**
 * react-native-android-widget registers widgets for the home screen only.
 * Patch provider XML so the same widgets can be placed on the lock screen (keyguard).
 */
function withAndroidLockScreenWidgets(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const xmlDir = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
      if (!fs.existsSync(xmlDir)) return config;

      for (const file of fs.readdirSync(xmlDir)) {
        if (!file.startsWith("widgetprovider_") || !file.endsWith(".xml")) continue;
        const filePath = path.join(xmlDir, file);
        const contents = fs.readFileSync(filePath, "utf8");
        if (!contents.includes(HOME_SCREEN_CATEGORY)) continue;
        fs.writeFileSync(filePath, contents.replace(HOME_SCREEN_CATEGORY, LOCK_SCREEN_CATEGORY));
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
