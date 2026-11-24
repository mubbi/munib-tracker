import { resolveTheme } from "@munib-tracker/theme/resolve";
import { Brand, CelebrationPalette, Mushaf, StatusPalette, withAlpha } from "@/constants/theme";
import { computeThemeTokens } from "@/lib/theme-tokens";

describe("computeThemeTokens", () => {
  it("derives light tokens from light colors", () => {
    const colors = resolveTheme("light", "light");
    const tokens = computeThemeTokens(colors, "light");
    expect(tokens.isDark).toBe(false);
    expect(tokens.accentSoft).toBe(withAlpha(colors.accent, 0.18));
    expect(tokens.accentBorder).toBe(withAlpha(colors.accent, 0.36));
    expect(tokens.hairline).toBe(withAlpha(colors.foreground, 0.12));
    expect(tokens.surfaceRaised).toBe(colors.card);
    expect(tokens.segmentThumb).toBe(colors.card);
    expect(tokens.inputSurface).toEqual({
      backgroundColor: colors.input,
      borderColor: colors.inputBorder,
      borderWidth: 1,
    });
    expect(tokens.inputSurfaceFocused.borderColor).toBe(colors.accent);
    expect(tokens.hero).toBe(Brand);
    expect(tokens.mushaf.paper).toBe(Mushaf.paperLight);
    expect(tokens.mushaf.frame).toBe(Mushaf.goldLight);
    expect(tokens.mushaf.ink).toBe(Mushaf.inkLight);
    expect(Object.keys(tokens.status)).toEqual(Object.keys(StatusPalette));
    const [key] = Object.keys(StatusPalette) as (keyof typeof StatusPalette)[];
    expect(tokens.status[key].color).toBe(StatusPalette[key]);
    expect(tokens.status[key].soft).toBe(withAlpha(StatusPalette[key], 0.14));
    expect(tokens.status[key].text).toMatch(/^#/);
  });

  it("derives dark tokens from dark colors", () => {
    const colors = resolveTheme("dark", "dark");
    const tokens = computeThemeTokens(colors, "dark");
    expect(tokens.isDark).toBe(true);
    expect(tokens.surfaceRaised).toBe(colors.muted);
    expect(tokens.segmentThumb).toBe(withAlpha(colors.foreground, 0.22));
    expect(tokens.mushaf.paper).toBe(colors.card);
    expect(tokens.mushaf.frame).toBe(Mushaf.goldDark);
    expect(tokens.mushaf.frameSoft).toBe(Mushaf.goldSoftDark);
    expect(tokens.mushaf.highlight).toBe(withAlpha(Mushaf.inkDark, 0.24));
    const [key] = Object.keys(StatusPalette) as (keyof typeof StatusPalette)[];
    expect(tokens.status[key].border).toBe(withAlpha(StatusPalette[key], 0.4));
  });

  it("exposes the constant celebration palette in both schemes", () => {
    const light = computeThemeTokens(resolveTheme("light", "light", "ocean"), "light");
    const dark = computeThemeTokens(resolveTheme("dark", "dark", "rose"), "dark");
    expect(light.celebration).toEqual(["#D4AF37", "#4CAF7D", "#5AA9E6", "#F2C94C"]);
    expect(light.celebration).toBe(CelebrationPalette);
    expect(dark.celebration).toBe(CelebrationPalette);
  });

  it("caches per colors object and recomputes when the scheme flips", () => {
    const colors = resolveTheme("light", "light");
    const a = computeThemeTokens(colors, "light");
    expect(computeThemeTokens(colors, "light")).toBe(a);
    const b = computeThemeTokens(colors, "dark");
    expect(b).not.toBe(a);
    expect(b.isDark).toBe(true);
    expect(computeThemeTokens(colors, "dark")).toBe(b);
  });
});
