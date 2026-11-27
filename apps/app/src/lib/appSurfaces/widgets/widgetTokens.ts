import { accentOnSurface } from "@munib-tracker/theme/color";
import { Platform } from "react-native";
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

/** First API level whose launchers clip `@android:id/background` to `system_app_widget_background_radius`. */
export const WIDGET_SYSTEM_RADIUS_MIN_API = 31;

/**
 * Card corner radius in dp. The widget tree's root is the library's
 * `@android:id/background` FrameLayout, so on API 31+ the launcher clips it to its own
 * `system_app_widget_background_radius`; a JS-drawn radius (numeric only, no resource refs)
 * would mismatch neighbouring widgets, so the card stays square there and lets the system
 * round it. Below API 31 the fixed token radius applies. (Material You is intentionally
 * not adopted — see docs/NATIVE_SURFACES.md.)
 */
export function widgetCornerRadius(
  compact: boolean,
  apiLevel: number = typeof Platform.Version === "number" ? Platform.Version : 0,
): number {
  if (apiLevel >= WIDGET_SYSTEM_RADIUS_MIN_API) return 0;
  return compact ? WIDGET_DESIGN.radiusCompact : WIDGET_DESIGN.radius;
}

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
  const primary = input.primaryColor || defaultAccent;
  return {
    isDark: input.isDark,
    primary,
    primaryText: accentOnSurface(
      primary,
      input.isDark ? palette.cardBackground : palette.background,
    ),
    background: palette.background,
    cardBackground: palette.cardBackground,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    border: palette.border,
    success: primary,
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
