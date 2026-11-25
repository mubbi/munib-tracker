const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  GALLERY_KEYS,
  LOCALE_QUALIFIERS,
  PREVIEW_HERO,
  writePreviewLayouts,
} = require("./withAndroidWidgetGallery.cjs");
const { ANDROID_HOME_SCREEN_WIDGETS } = require("./homeScreenSurfaces.cjs");
const tokens = require("./generated/native-tokens.json");

const widgetNames = ANDROID_HOME_SCREEN_WIDGETS.map((w) => w.name).sort();

describe("withAndroidWidgetGallery", () => {
  it("GALLERY_KEYS and PREVIEW_HERO cover exactly the registered widgets", () => {
    expect(Object.keys(GALLERY_KEYS).sort()).toEqual(widgetNames);
    expect(Object.keys(PREVIEW_HERO).sort()).toEqual(widgetNames);
    const registry = fs.readFileSync(
      path.join(__dirname, "../src/lib/appSurfaces/widgets/constants.ts"),
      "utf8",
    );
    for (const name of widgetNames) expect(registry).toContain(`"${name}"`);
  });

  it("every locale (incl. ar / ur) has a label and description for every widget", () => {
    expect(Object.keys(LOCALE_QUALIFIERS)).toHaveLength(24);
    for (const locale of Object.keys(LOCALE_QUALIFIERS)) {
      const json = JSON.parse(
        fs.readFileSync(path.join(__dirname, `../src/i18n/${locale}.json`), "utf8"),
      );
      for (const key of Object.values(GALLERY_KEYS)) {
        const entry = json.widgets?.gallery?.[key];
        expect({ locale, key, label: Boolean(entry?.label) }).toEqual({
          locale,
          key,
          label: true,
        });
        expect({ locale, key, description: Boolean(entry?.description) }).toEqual({
          locale,
          key,
          description: true,
        });
      }
    }
  });

  describe("preview layouts", () => {
    const res = fs.mkdtempSync(path.join(os.tmpdir(), "widget-gallery-"));
    beforeAll(() => writePreviewLayouts(res));
    afterAll(() => fs.rmSync(res, { recursive: true, force: true }));

    it("writes a distinct light and -night layout per widget", () => {
      for (const dir of ["layout", "layout-night"]) {
        const files = widgetNames.map((n) =>
          fs.readFileSync(path.join(res, dir, `widget_preview_${n.toLowerCase()}.xml`), "utf8"),
        );
        expect(new Set(files).size).toBe(widgetNames.length);
      }
      const light = fs.readFileSync(
        path.join(res, "layout/widget_preview_nextprayerwidget.xml"),
        "utf8",
      );
      const night = fs.readFileSync(
        path.join(res, "layout-night/widget_preview_nextprayerwidget.xml"),
        "utf8",
      );
      expect(light).toContain(tokens.light.text);
      expect(night).toContain(tokens.dark.text);
      expect(night).not.toContain(tokens.light.text);
    });

    it("uses string resources only (no hard-coded text except numeral heroes)", () => {
      for (const name of widgetNames) {
        const xml = fs.readFileSync(
          path.join(res, "layout", `widget_preview_${name.toLowerCase()}.xml`),
          "utf8",
        );
        const texts = [...xml.matchAll(/android:text="([^"]*)"/g)].map((m) => m[1]);
        expect(texts).toHaveLength(3);
        expect(texts.filter((t) => t.startsWith("@string/"))).toHaveLength(2);
        const hero = texts.find((t) => !t.startsWith("@string/"));
        expect(hero).not.toMatch(/[A-Za-z]{3,}/);
      }
    });

    it("card background uses the system radius on API 31+ in light and night", () => {
      for (const dir of ["drawable-v31", "drawable-night-v31"]) {
        expect(
          fs.readFileSync(path.join(res, dir, "widget_preview_background.xml"), "utf8"),
        ).toContain("@android:dimen/system_app_widget_background_radius");
      }
      expect(
        fs.readFileSync(path.join(res, "drawable-night/widget_preview_background.xml"), "utf8"),
      ).toContain(tokens.dark.card);
    });
  });
});
