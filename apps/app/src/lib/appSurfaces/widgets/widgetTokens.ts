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

const LIGHT = {
  background: "#F5F0E6",
  cardBackground: "#FFFCF7",
  textPrimary: "#152921",
  textSecondary: "#5C7268",
  border: "#C9C0AE",
};

const DARK = {
  background: "#152921",
  cardBackground: "#1C322C",
  textPrimary: "#E8DCC8",
  textSecondary: "#8BA89A",
  border: "#2A453C",
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
  pending: "#5C7268",
} as const;
