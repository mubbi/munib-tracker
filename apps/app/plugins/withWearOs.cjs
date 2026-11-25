const { withDangerousMod, withSettingsGradle } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Wear OS companion module (`:wear`): the Munib app on the watch (home + tasbeeh
 * activities), three tiles (Next Salah, Today, Tasbeeh), two complications and the
 * snapshot listener. Sources live as real files in `plugins/wear-os/` and are copied
 * into `android/wear/` on prebuild; edit them there, not the copy.
 */
const TEMPLATE_DIR = path.join(__dirname, "wear-os");

/** Adaptive launcher icon layers, shared with the phone app's Android icon. */
const ICON_LAYERS = {
  "android-icon-background.png": "ic_launcher_background.png",
  "android-icon-foreground.png": "ic_launcher_foreground.png",
  "android-icon-monochrome.png": "ic_launcher_monochrome.png",
};

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(source, target);
    else fs.copyFileSync(source, target);
  }
}

/** Writes the `:wear` module into `<androidRoot>/wear` (exported for tests / local syncs). */
function writeWearModule(androidRoot, projectRoot) {
  const wearDir = path.join(androidRoot, "wear");
  // Sources are generated: drop the old copy so renamed / removed files can't linger
  // (e.g. a drawable XML and PNG with the same name would clash). Keeps build/.
  fs.rmSync(path.join(wearDir, "src"), { recursive: true, force: true });
  copyTree(TEMPLATE_DIR, wearDir);
  // 432 px layers = 108 dp at xxxhdpi; Android scales them for other densities.
  const iconDir = path.join(wearDir, "src/main/res/drawable-xxxhdpi");
  fs.mkdirSync(iconDir, { recursive: true });
  for (const [source, target] of Object.entries(ICON_LAYERS)) {
    fs.copyFileSync(path.join(projectRoot, "assets/images", source), path.join(iconDir, target));
  }
  return wearDir;
}

function withWearOs(config) {
  config = withSettingsGradle(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes(":wear")) {
      config.modResults.contents = `${contents.trim()}\ninclude ':wear'\n`;
    }
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      writeWearModule(config.modRequest.platformProjectRoot, config.modRequest.projectRoot);
      return config;
    },
  ]);

  return config;
}

module.exports = withWearOs;
module.exports.writeWearModule = writeWearModule;
module.exports.TEMPLATE_DIR = TEMPLATE_DIR;
