const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

jest.mock("@expo/config-plugins", () => ({
  createRunOncePlugin: (plugin) => plugin,
  withDangerousMod: (config) => config,
}));

const { copyTabDrawables } = require("./with-android-tab-drawables");

describe("copyTabDrawables", () => {
  it("copies the NativeTabs vector icons into res/drawable", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tab-drawables-"));
    try {
      const names = copyTabDrawables(dir).sort();
      expect(names).toEqual([
        "ic_tab_home.xml",
        "ic_tab_library.xml",
        "ic_tab_settings.xml",
        "ic_tab_tracker.xml",
      ]);
      for (const name of names) {
        const xml = fs.readFileSync(path.join(dir, name), "utf8");
        expect(xml).toContain("<vector");
        expect(xml).toContain("android:pathData=");
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
