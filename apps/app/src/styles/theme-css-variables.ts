import { resolveTheme } from "@munib-tracker/theme/resolve";
import type { ThemeColors } from "@munib-tracker/theme/types";

import { computeThemeTokens, type ThemeTokens } from "@/lib/theme-tokens";

/**
 * Document-level CSS custom properties the web shell reads (`+html.tsx`):
 * the single `:focus-visible` ring and anything else outside React Native
 * styles. MunibThemeProvider writes them on `:root` whenever the theme
 * changes; `+html.tsx` ships the same values for the default palette so the
 * ring is themed before the bundle runs.
 */
export type ThemeCssVariables = {
  /** Keyboard focus ring (`tokens.focusRing`, ≥3:1 on every ladder surface). */
  "--munib-focus": string;
  /** 2px gap between element and ring, in the page background. */
  "--munib-focus-halo": string;
  "--munib-bg": string;
  "--munib-fg": string;
};

export function themeCssVariables(
  colors: Pick<ThemeColors, "background" | "foreground">,
  tokens: Pick<ThemeTokens, "focusRing">,
): ThemeCssVariables {
  return {
    "--munib-focus": tokens.focusRing,
    "--munib-focus-halo": colors.background,
    "--munib-bg": colors.background,
    "--munib-fg": colors.foreground,
  };
}

function defaultVariables(scheme: "light" | "dark"): ThemeCssVariables {
  const colors = resolveTheme(scheme, scheme);
  return themeCssVariables(colors, computeThemeTokens(colors, scheme));
}

function declarations(vars: ThemeCssVariables): string {
  return Object.entries(vars)
    .map(([name, value]) => `${name}:${value};`)
    .join("");
}

/** Pre-bundle defaults (default accent; dark under `prefers-color-scheme`). */
export const THEME_CSS_VARIABLES_DEFAULTS = `:root{${declarations(defaultVariables("light"))}}@media (prefers-color-scheme: dark){:root{${declarations(defaultVariables("dark"))}}}`;

/**
 * The one keyboard focus rule for web (WCAG 2.4.7 / 1.4.11): 2px ring, 2px
 * offset, page-background halo in the gap. Never touches `border-radius`, so a
 * focused pill keeps its shape (outline + box-shadow follow the element's own
 * radius). Programmatic landmark focus (`tabindex="-1"`) draws nothing.
 */
const FOCUSABLE = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="menuitem"]',
  '[tabindex="0"]',
];
const FOCUS_VISIBLE = FOCUSABLE.map(
  (selector) => `${selector}:not([tabindex="-1"]):focus-visible`,
).join(",");

export const FOCUS_RING_CSS = `:focus:not(:focus-visible){outline:none;}[tabindex="-1"]:focus,[tabindex="-1"]:focus-visible{outline:none;}${FOCUS_VISIBLE}{outline:2px solid var(--munib-focus);outline-offset:2px;box-shadow:0 0 0 2px var(--munib-focus-halo);}@media (forced-colors: active){${FOCUS_VISIBLE}{outline-color:Highlight;}}`;
