// Builds widget JSX consumed by react-native-android-widget via direct function
// calls, so opt out of the React Compiler to avoid "Invalid hook call" (blank widget).
"use no memo";

import type React from "react";
import type { WidgetInfo, WidgetRepresentation } from "react-native-android-widget";

import {
  AndroidLockScreenInline,
  AndroidLockScreenStrip,
  isCompactWidgetSurface,
} from "@/lib/appSurfaces/widgets/androidCompact";
import { readWidgetSnapshot } from "@/lib/appSurfaces/widgets/snapshotStorage";
import type {
  WidgetHexColor,
  WidgetSectionBase,
  WidgetThemeSnapshot,
} from "@/lib/appSurfaces/widgets/types";
import {
  type ResolvedWidgetTheme,
  resolveWidgetTheme,
} from "@/lib/appSurfaces/widgets/widgetTokens";

export async function readSnapshotForWidget() {
  return readWidgetSnapshot();
}

function toWidgetThemeSnapshot(resolved: ResolvedWidgetTheme): WidgetThemeSnapshot {
  return {
    isDark: resolved.isDark,
    followsSystem: true,
    primary: resolved.primary as WidgetHexColor,
    background: resolved.background as WidgetHexColor,
    cardBackground: resolved.cardBackground as WidgetHexColor,
    textPrimary: resolved.textPrimary as WidgetHexColor,
    textSecondary: resolved.textSecondary as WidgetHexColor,
    border: resolved.border as WidgetHexColor,
    success: resolved.success as WidgetHexColor,
    warning: resolved.warning as WidgetHexColor,
  };
}

/**
 * When Appearance is System, emit true light + dark trees so Android 12+ can
 * follow wallpaper/system. When the user forced light/dark, both slots use the
 * snapshot theme so widgets match Settings.
 */
export function withDualThemeSnapshot(
  theme: WidgetThemeSnapshot,
  build: (cardTheme: WidgetThemeSnapshot) => React.ReactElement,
): WidgetRepresentation {
  if (!theme.followsSystem) {
    return { light: build(theme), dark: build(theme) };
  }
  const primary = theme.primary;
  return {
    light: build(
      toWidgetThemeSnapshot(resolveWidgetTheme({ isDark: false, primaryColor: primary })),
    ),
    dark: build(toWidgetThemeSnapshot(resolveWidgetTheme({ isDark: true, primaryColor: primary }))),
  };
}

export function renderCompactOrCard(
  info: WidgetInfo,
  section: WidgetSectionBase,
  accentColor: WidgetHexColor,
  theme: WidgetThemeSnapshot,
  renderCard: (cardTheme: WidgetThemeSnapshot) => React.ReactElement,
): WidgetRepresentation {
  if (isCompactWidgetSurface(info)) {
    const compact = (cardTheme: WidgetThemeSnapshot): React.ReactElement =>
      info.height <= 56 ? (
        <AndroidLockScreenInline
          line={section.lockScreenLine}
          deepLink={section.deepLink}
          accentColor={accentColor}
          theme={cardTheme}
          accessibilityLabel={section.accessibilityLabel}
        />
      ) : (
        <AndroidLockScreenStrip
          title={section.title}
          line={section.lockScreenLine}
          detail={section.lockScreenDetail}
          deepLink={section.deepLink}
          accentColor={accentColor}
          theme={cardTheme}
          accessibilityLabel={section.accessibilityLabel}
        />
      );
    return withDualThemeSnapshot(theme, compact);
  }
  return withDualThemeSnapshot(theme, renderCard);
}
