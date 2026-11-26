const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

jest.mock("@expo/config-plugins", () => ({
  createRunOncePlugin: (plugin) => plugin,
  withDangerousMod: (config) => config,
}));

const { KEEP_PATTERNS, writeResourceKeep } = require("./with-android-resource-keep");
const { ICONS_DIR } = require("./with-android-tab-drawables");
const appJson = require("../app.json");

describe("writeResourceKeep", () => {
  it("keeps the by-name resources from the release resource shrinker", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "resource-keep-"));
    try {
      const xml = fs.readFileSync(writeResourceKeep(dir), "utf8");
      expect(xml).toContain('xmlns:tools="http://schemas.android.com/tools"');
      expect(xml).toContain(
        'tools:keep="@drawable/ic_tab_*,@raw/adhan_*,@layout/widget_preview_glance"',
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("covers every tab drawable, notification sound and the generic widget preview", () => {
    const covers = (type, name) =>
      KEEP_PATTERNS.some((p) => {
        const [pType, pName] = p.slice(1).split("/");
        return pType === type && new RegExp(`^${pName.replace("*", ".*")}$`).test(name);
      });
    for (const file of fs.readdirSync(ICONS_DIR)) {
      expect(covers("drawable", path.basename(file, ".xml"))).toBe(true);
    }
    const notifications = appJson.expo.plugins.find(
      (p) => Array.isArray(p) && p[0] === "expo-notifications",
    );
    for (const sound of notifications[1].sounds) {
      expect(covers("raw", path.basename(sound, path.extname(sound)))).toBe(true);
    }
    expect(covers("layout", "widget_preview_glance")).toBe(true);
    expect(covers("drawable", "adhan_default")).toBe(false);
  });

  it("is registered in app.json", () => {
    expect(appJson.expo.plugins).toContain("./plugins/with-android-resource-keep.js");
  });
});
