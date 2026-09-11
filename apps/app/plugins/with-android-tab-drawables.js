const fs = require("node:fs");
const path = require("node:path");
const { createRunOncePlugin, withDangerousMod } = require("@expo/config-plugins");

const ICONS_DIR = path.join(__dirname, "android-tab-icons");

/**
 * NativeTabs `md` icons render Material Symbols to a bitmap, then Fresco loads
 * that bitmap on the main thread (ImageRequestBuilder / Priority.<clinit>).
 * On low-RAM devices that class-init plus GC is a Background ANR.
 *
 * Vector drawables skip Fresco entirely (`getSystemDrawableResource`).
 * @param {string} drawableDir
 */
function copyTabDrawables(drawableDir) {
  fs.mkdirSync(drawableDir, { recursive: true });
  const names = fs.readdirSync(ICONS_DIR).filter((name) => name.endsWith(".xml"));
  for (const name of names) {
    fs.copyFileSync(path.join(ICONS_DIR, name), path.join(drawableDir, name));
  }
  return names;
}

function withAndroidTabDrawables(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      copyTabDrawables(
        path.join(config.modRequest.platformProjectRoot, "app/src/main/res/drawable"),
      );
      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withAndroidTabDrawables,
  "with-android-tab-drawables",
  "1.0.0",
);
module.exports.copyTabDrawables = copyTabDrawables;
module.exports.ICONS_DIR = ICONS_DIR;
