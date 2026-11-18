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
 * Contrast-tuned palettes — mirror `packages/theme/src/resolve-theme.ts`
 * (background / card / foreground / mutedForeground / border). Keep in sync with
 * `targets/_shared/WidgetSnapshotStore.swift` `WidgetPalette`.
 */
const LIGHT = {
  background: "#F5F0E6",
  cardBackground: "#FFFDF9",
  textPrimary: "#152921",
  /** ≥4.5:1 on background, card and muted. */
  textSecondary: "#4A6157",
  border: "#D2C7B1",
};

const DARK = {
  background: "#152921",
  cardBackground: "#1E3830",
  textPrimary: "#EEE4D2",
  /** ≥4.5:1 on background, card and muted. */
  textSecondary: "#A2BDB0",
  border: "#3D5F53",
};

export function resolveWidgetTheme(input: WidgetThemeInput) {
  const palette = input.isDark ? DARK : LIGHT;
  return {
    isDark: input.isDark,
    primary: input.primaryColor || "#059669",
    background: palette.background,
    cardBackground: palette.cardBackground,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    border: palette.border,
    success: input.primaryColor || "#059669",
    warning: "#D97706",
  };
}

export type ResolvedWidgetTheme = ReturnType<typeof resolveWidgetTheme>;

export const WIDGET_SEMANTIC = {
  success: "#059669",
  warning: "#D97706",
  active: "#059669",
  completed: "#059669",
  pending: "#4A6157",
} as const;
