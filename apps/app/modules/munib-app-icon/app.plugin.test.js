const fs = require("node:fs");
const path = require("node:path");

const plugin = require("./app.plugin");

const {
  ALTERNATE_ICONS,
  ICONS_DIR,
  applyAppIconManifest,
  applyAlternateIconBuildSettings,
  appTargetBuildConfigurations,
  adaptiveIconXml,
  androidResourceFiles,
  androidAliasName,
  androidIconResource,
  iosIconName,
} = plugin;

const APP_ROOT = path.join(__dirname, "..", "..");

/** Shape of the prebuilt app manifest: launcher + deep links + shortcuts on MainActivity. */
function manifest() {
  return {
    manifest: {
      $: { "xmlns:android": "http://schemas.android.com/apk/res/android" },
      application: [
        {
          $: { "android:name": ".MainApplication", "android:icon": "@mipmap/ic_launcher" },
          activity: [
            {
              $: { "android:name": ".MainActivity", "android:exported": "true" },
              "intent-filter": [
                {
                  action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
                  category: [{ $: { "android:name": "android.intent.category.LAUNCHER" } }],
                },
                {
                  action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
                  category: [
                    { $: { "android:name": "android.intent.category.DEFAULT" } },
                    { $: { "android:name": "android.intent.category.BROWSABLE" } },
                  ],
                  data: [{ $: { "android:scheme": "munib-tracker" } }],
                },
              ],
              "meta-data": [
                {
                  $: {
                    "android:name": "android.app.shortcuts",
                    "android:resource": "@xml/shortcuts",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

const app = (m) => m.manifest.application[0];
const mainActivity = (m) => app(m).activity[0];
const filterNames = (filter, key) => (filter[key] ?? []).map((e) => e.$["android:name"]);

describe("munib-app-icon config plugin (NF-2.23b)", () => {
  describe("Android manifest", () => {
    it("moves the launcher entry and static shortcuts onto one alias per icon", () => {
      const result = applyAppIconManifest(manifest());
      const aliases = app(result)["activity-alias"];
      expect(aliases.map((a) => a.$["android:name"])).toEqual([
        ".AppIconDefault",
        ".AppIconRamadan",
        ".AppIconLastTen",
        ".AppIconEidFitr",
        ".AppIconHajj",
        ".AppIconEidAdha",
        ".AppIconNewYear",
        ".AppIconAshura",
      ]);
      // Exactly one launcher entry is enabled out of the box: the classic icon.
      expect(aliases.filter((a) => a.$["android:enabled"] === "true")).toHaveLength(1);
      expect(aliases[0].$).toMatchObject({
        "android:enabled": "true",
        "android:icon": "@mipmap/ic_launcher",
        "android:roundIcon": "@mipmap/ic_launcher_round",
        "android:targetActivity": ".MainActivity",
        "android:exported": "true",
      });
      expect(aliases[2].$["android:icon"]).toBe("@mipmap/ic_launcher_season_last_ten");
      for (const alias of aliases) {
        expect(alias["intent-filter"]).toHaveLength(1);
        expect(filterNames(alias["intent-filter"][0], "category")).toEqual([
          "android.intent.category.LAUNCHER",
        ]);
        expect(alias["meta-data"]).toEqual([
          {
            $: { "android:name": "android.app.shortcuts", "android:resource": "@xml/shortcuts" },
          },
        ]);
      }
    });

    it("keeps MainActivity enabled with its deep-link filters, minus the launcher entry", () => {
      const main = mainActivity(applyAppIconManifest(manifest()));
      expect(main.$["android:enabled"]).toBeUndefined();
      expect(main["intent-filter"]).toHaveLength(1);
      expect(filterNames(main["intent-filter"][0], "action")).toEqual([
        "android.intent.action.VIEW",
      ]);
      expect(main["meta-data"]).toBeUndefined();
    });

    it("is idempotent (prebuild without --clean)", () => {
      const once = applyAppIconManifest(manifest());
      const twice = applyAppIconManifest(JSON.parse(JSON.stringify(once)));
      expect(twice).toEqual(once);
    });

    it("keeps other activity-aliases and works without static shortcuts", () => {
      const m = manifest();
      delete mainActivity(m)["meta-data"];
      app(m)["activity-alias"] = [{ $: { "android:name": ".SomethingElse" } }];
      const aliases = app(applyAppIconManifest(m))["activity-alias"];
      expect(aliases[0].$["android:name"]).toBe(".SomethingElse");
      expect(aliases.slice(1).every((a) => a["meta-data"] === undefined)).toBe(true);
    });
  });

  describe("Android resources", () => {
    it("names resources in snake_case and writes a themed adaptive icon", () => {
      expect(androidIconResource("eidAdha")).toBe("ic_launcher_season_eid_adha");
      expect(androidAliasName("eidAdha")).toBe(".AppIconEidAdha");
      const xml = adaptiveIconXml("eidAdha");
      expect(xml).toContain(
        '<background android:drawable="@drawable/ic_launcher_season_eid_adha_background"/>',
      );
      expect(xml).toContain(
        '<foreground android:drawable="@drawable/ic_launcher_season_eid_adha_foreground"/>',
      );
      expect(xml).toContain(
        '<monochrome android:drawable="@drawable/ic_launcher_season_eid_adha_monochrome"/>',
      );
    });

    it.each(ALTERNATE_ICONS)("bundles every generated layer for %s", (id) => {
      for (const [from] of androidResourceFiles(id)) {
        expect(fs.existsSync(path.join(APP_ROOT, ICONS_DIR, id, from))).toBe(true);
      }
      expect(fs.existsSync(path.join(APP_ROOT, ICONS_DIR, id, "icon.png"))).toBe(true);
    });
  });

  describe("iOS", () => {
    it("declares the alternate icon sets for actool", () => {
      const settings = applyAlternateIconBuildSettings({
        ASSETCATALOG_COMPILER_APPICON_NAME: "AppIcon",
      });
      expect(settings.ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS).toBe("YES");
      expect(settings.ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES).toBe(
        '"AppIcon-ramadan AppIcon-lastTen AppIcon-eidFitr AppIcon-hajj AppIcon-eidAdha AppIcon-newYear AppIcon-ashura"',
      );
      expect(iosIconName("hajj")).toBe("AppIcon-hajj");
    });

    it("only touches the app target's build configurations", () => {
      const project = {
        pbxNativeTargetSection: () => ({
          APP: { name: '"MunibTracker"', buildConfigurationList: "LIST_APP" },
          APP_comment: "MunibTracker",
          WATCH: { name: "MunibTrackerWatch", buildConfigurationList: "LIST_WATCH" },
        }),
        pbxXCConfigurationList: () => ({
          LIST_APP: { buildConfigurations: [{ value: "DEBUG" }, { value: "RELEASE" }] },
          LIST_WATCH: { buildConfigurations: [{ value: "WATCH_DEBUG" }] },
        }),
        pbxXCBuildConfigurationSection: () => ({
          DEBUG: { name: "Debug", buildSettings: {} },
          RELEASE: { name: "Release", buildSettings: {} },
          WATCH_DEBUG: { name: "Debug", buildSettings: {} },
        }),
      };
      const configs = appTargetBuildConfigurations(project, "MunibTracker");
      expect(configs.map((c) => c.name)).toEqual(["Debug", "Release"]);
      expect(() => appTargetBuildConfigurations(project, "Missing")).toThrow(/no Xcode target/);
    });
  });
});
