import { formatUpdatedAgo } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import type { WidgetThemeSnapshot } from "@/lib/appSurfaces/widgets/types";
import { withDualThemeSnapshot } from "@/lib/appSurfaces/widgets/widgetRenderUtils";
import { resolveWidgetTheme } from "@/lib/appSurfaces/widgets/widgetTokens";

const t = (_key: string, fallback: string, options?: Record<string, unknown>) => {
  if (options?.count != null) {
    return fallback.replace("{{count}}", String(options.count));
  }
  return fallback;
};

describe("formatUpdatedAgo", () => {
  it("returns just-now for recent timestamps", () => {
    const iso = new Date(Date.now() - 10_000).toISOString();
    expect(formatUpdatedAgo(iso, t)).toBe("Updated just now");
  });

  it("returns minutes for older timestamps", () => {
    const iso = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(formatUpdatedAgo(iso, t)).toBe("Updated 5m ago");
  });
});

describe("withDualThemeSnapshot", () => {
  const base = resolveWidgetTheme({ isDark: false, primaryColor: "#059669" });
  const theme: WidgetThemeSnapshot = {
    isDark: false,
    followsSystem: true,
    primary: base.primary as WidgetThemeSnapshot["primary"],
    background: base.background as WidgetThemeSnapshot["background"],
    cardBackground: base.cardBackground as WidgetThemeSnapshot["cardBackground"],
    textPrimary: base.textPrimary as WidgetThemeSnapshot["textPrimary"],
    textSecondary: base.textSecondary as WidgetThemeSnapshot["textSecondary"],
    border: base.border as WidgetThemeSnapshot["border"],
    success: base.success as WidgetThemeSnapshot["success"],
    warning: base.warning as WidgetThemeSnapshot["warning"],
  };

  it("emits distinct light and dark trees when followsSystem", () => {
    const result = withDualThemeSnapshot(
      theme,
      (cardTheme) =>
        ({
          props: { "data-dark": cardTheme.isDark },
        }) as never,
    );
    expect((result.light as { props: { "data-dark": boolean } }).props["data-dark"]).toBe(false);
    expect((result.dark as { props: { "data-dark": boolean } }).props["data-dark"]).toBe(true);
  });

  it("uses the same theme for both slots when appearance is forced", () => {
    const forced = { ...theme, followsSystem: false, isDark: true };
    const result = withDualThemeSnapshot(
      forced,
      (cardTheme) =>
        ({
          props: { "data-dark": cardTheme.isDark },
        }) as never,
    );
    expect((result.light as { props: { "data-dark": boolean } }).props["data-dark"]).toBe(true);
    expect((result.dark as { props: { "data-dark": boolean } }).props["data-dark"]).toBe(true);
  });
});
