import { resolveTheme } from "@munib-tracker/theme/resolve";

import { computeThemeTokens } from "@/lib/theme-tokens";
import {
  FOCUS_RING_CSS,
  THEME_CSS_VARIABLES_DEFAULTS,
  themeCssVariables,
} from "@/styles/theme-css-variables";

describe("themeCssVariables", () => {
  it("maps the ring to tokens.focusRing and the halo to the page background", () => {
    const colors = resolveTheme("dark", "dark", "amber");
    const tokens = computeThemeTokens(colors, "dark");
    expect(themeCssVariables(colors, tokens)).toEqual({
      "--munib-focus": tokens.focusRing,
      "--munib-focus-halo": colors.background,
      "--munib-bg": colors.background,
      "--munib-fg": colors.foreground,
    });
  });

  it("ships light defaults with a dark prefers-color-scheme override", () => {
    const light = resolveTheme("light", "light");
    const dark = resolveTheme("dark", "dark");
    const [lightBlock, darkBlock] = THEME_CSS_VARIABLES_DEFAULTS.split("@media");
    expect(lightBlock).toContain(`--munib-focus:${computeThemeTokens(light, "light").focusRing};`);
    expect(lightBlock).toContain(`--munib-bg:${light.background};`);
    expect(darkBlock).toMatch(/^ \(prefers-color-scheme: dark\)/);
    expect(darkBlock).toContain(`--munib-focus:${computeThemeTokens(dark, "dark").focusRing};`);
    expect(darkBlock).toContain(`--munib-fg:${dark.foreground};`);
  });
});

describe("FOCUS_RING_CSS", () => {
  it("is a 2px ring with a 2px offset and a background halo", () => {
    expect(FOCUS_RING_CSS).toContain("outline:2px solid var(--munib-focus);");
    expect(FOCUS_RING_CSS).toContain("outline-offset:2px;");
    expect(FOCUS_RING_CSS).toContain("box-shadow:0 0 0 2px var(--munib-focus-halo);");
  });

  it("never reshapes the focused element", () => {
    expect(FOCUS_RING_CSS).not.toMatch(/border-radius/);
  });

  it("defers to the system colour in forced-colors mode", () => {
    expect(FOCUS_RING_CSS).toMatch(
      /@media \(forced-colors: active\)\{[^}]*\{outline-color:Highlight;\}/,
    );
  });

  it("covers form fields and interactive roles but not programmatic landmarks", () => {
    for (const selector of ["input", "textarea", "select", '[role="radio"]', '[role="menuitem"]']) {
      expect(FOCUS_RING_CSS).toContain(`${selector}:not([tabindex="-1"]):focus-visible`);
    }
    expect(FOCUS_RING_CSS).toContain('[tabindex="-1"]:focus-visible{outline:none;}');
  });
});
