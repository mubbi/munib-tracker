import {
  ANDROID_WIDGET_DEFAULT_DP,
  isAppWidgetName,
  widgetDisplayName,
} from "@/lib/appSurfaces/widgets/constants";
import { normalizeWidgetInfo } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";
import { buildWidgetInfo } from "@/test-support/fixtures/widgets";

describe("normalizeWidgetInfo", () => {
  it("returns the same object when both dimensions are known", () => {
    const info = buildWidgetInfo({ widgetName: "QazaDebtWidget", width: 10, height: 20 });
    expect(normalizeWidgetInfo(info)).toBe(info);
  });

  it("fills 0×0 dp from the widget's default size", () => {
    expect(
      normalizeWidgetInfo(
        buildWidgetInfo({ widgetName: "PrayerScheduleWidget", width: 0, height: 0 }),
      ),
    ).toMatchObject(ANDROID_WIDGET_DEFAULT_DP.PrayerScheduleWidget);
  });

  const fallback = ANDROID_WIDGET_DEFAULT_DP.NextPrayerWidget;
  it.each([
    [
      { width: 0, height: 77 },
      { width: fallback.width, height: 77 },
    ],
    [
      { width: 99, height: 0 },
      { width: 99, height: fallback.height },
    ],
  ])(
    "keeps the known dimension of %o and uses the Next Salah default for unknown widgets",
    (size, expected) => {
      expect(
        normalizeWidgetInfo(buildWidgetInfo({ widgetName: "Mystery", ...size })),
      ).toMatchObject(expected);
    },
  );
});

describe("widget constants", () => {
  it("recognises widget names", () => {
    expect(isAppWidgetName("JumuahWidget")).toBe(true);
    expect(isAppWidgetName("jumuah")).toBe(false);
  });

  it("resolves gallery labels through i18n", () => {
    const { label, description } = widgetDisplayName("NextPrayerWidget");
    expect(label).toEqual(expect.any(String));
    expect(label).not.toBe("widgets.gallery.nextPrayer.label");
    expect(description.length).toBeGreaterThan(0);
  });
});
