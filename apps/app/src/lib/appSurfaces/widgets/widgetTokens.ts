import {
  WIDGET_DARK,
  WIDGET_DEFAULT_ACCENT,
  WIDGET_LIGHT,
  WIDGET_STATUS,
} from "./widgetTokens.generated";

/** Design tokens shared by Android widget renderers — mirrors in-app theme cards. */
export const WIDGET_DESIGN = {
  radius: 16,
  radiusCompact: 12,
  padding: 16,
  paddingCompact: 12,
  rowGap: 8,
  fontSizeTitle: 16,
  fontSizeBody: 14,
  fontSizeCaption: 12,
  fontSizeHero: 28,
} as const;

export type WidgetThemeInput = {
  isDark: boolean;
  primaryColor: string;
};

/**
 * Contrast-tuned palettes — generated from `packages/theme/src/native-tokens.ts` into
 * `widgetTokens.generated.ts` (`pnpm --filter app generate:native-tokens`). Mirrored by
 * `targets/_shared/MunibTokens.generated.swift` (`WidgetPalette`).
 */
const LIGHT = WIDGET_LIGHT;
const DARK = WIDGET_DARK;

export function resolveWidgetTheme(input: WidgetThemeInput) {
  const palette = input.isDark ? DARK : LIGHT;
  const defaultAccent = input.isDark ? WIDGET_DEFAULT_ACCENT.dark : WIDGET_DEFAULT_ACCENT.light;
  return {
    isDark: input.isDark,
    primary: input.primaryColor || defaultAccent,
    background: palette.background,
    cardBackground: palette.cardBackground,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    border: palette.border,
    success: input.primaryColor || defaultAccent,
    warning: WIDGET_STATUS.warning,
  };
}

export type ResolvedWidgetTheme = ReturnType<typeof resolveWidgetTheme>;

export const WIDGET_SEMANTIC = {
  success: WIDGET_STATUS.success,
  warning: WIDGET_STATUS.warning,
  active: WIDGET_DEFAULT_ACCENT.light,
  completed: WIDGET_DEFAULT_ACCENT.light,
  pending: WIDGET_LIGHT.textSecondary,
} as const;
