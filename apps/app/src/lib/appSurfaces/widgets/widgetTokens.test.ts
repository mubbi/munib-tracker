import { accentColors } from "@munib-tracker/theme/accents";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import {
  resolveWidgetTheme,
  WIDGET_DESIGN,
  WIDGET_SYSTEM_RADIUS_MIN_API,
  widgetCornerRadius,
} from "./widgetTokens";

describe("widget tokens", () => {
  it("primaryText equals the in-app accentText for light and dark", () => {
    for (const isDark of [false, true]) {
      for (const id of Object.keys(accentColors) as (keyof typeof accentColors)[]) {
        const colors = resolveTheme(isDark ? "dark" : "light", null, id);
        const widget = resolveWidgetTheme({ isDark, primaryColor: colors.accent });
        expect(widget.primary).toBe(colors.accent);
        expect(widget.primaryText).toBe(colors.accentText);
      }
    }
  });

  it("uses the launcher radius (square card) on API 31+, fixed radius below", () => {
    expect(widgetCornerRadius(false, WIDGET_SYSTEM_RADIUS_MIN_API)).toBe(0);
    expect(widgetCornerRadius(true, 34)).toBe(0);
    expect(widgetCornerRadius(false, 30)).toBe(WIDGET_DESIGN.radius);
    expect(widgetCornerRadius(true, 30)).toBe(WIDGET_DESIGN.radiusCompact);
  });
});
