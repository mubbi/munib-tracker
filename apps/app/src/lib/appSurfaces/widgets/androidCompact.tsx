// Rendered by react-native-android-widget as plain functions; opt out of the
// React Compiler so injected useMemoCache does not throw and blank the widget.
"use no memo";

import type { WidgetInfo } from "react-native-android-widget";
import { FlexWidget } from "react-native-android-widget";

import {
  themeColors,
  WidgetBodyText,
  type WidgetHexColor,
} from "@/lib/appSurfaces/widgets/androidCard";
import type { WidgetThemeSnapshot } from "@/lib/appSurfaces/widgets/types";

/** Android lock-screen / communal widgets are typically short in height (dp). */
export function isCompactWidgetSurface(info: WidgetInfo): boolean {
  return info.height <= 96 || info.width <= 200;
}

/** Resizable home-screen widgets at 4×4 cells or larger (dp). */
export function isLargeWidgetSurface(info: WidgetInfo): boolean {
  return info.height > 180 && info.width > 280;
}

/** Small home-screen cells (2×2) where chrome must stay minimal. */
export function isSmallHomeWidgetSurface(info: WidgetInfo): boolean {
  return info.width <= 160 || info.height <= 140;
}

/** Medium 4×2-class surface. */
export function isMediumWidgetSurface(info: WidgetInfo): boolean {
  return !isSmallHomeWidgetSurface(info) && !isLargeWidgetSurface(info);
}

type CompactProps = {
  title: string;
  line: string;
  detail: string;
  deepLink: string;
  accentColor: WidgetHexColor;
  theme: WidgetThemeSnapshot;
  accessibilityLabel?: string;
};

/** Two-line strip for lock screen and other compact Android widget surfaces. */
export function AndroidLockScreenStrip({
  title,
  line,
  detail,
  deepLink,
  accentColor,
  theme,
  accessibilityLabel,
}: CompactProps) {
  const colors = themeColors(theme);
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: deepLink }}
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 10,
        flexDirection: "column",
        justifyContent: "center",
        flexGap: 2,
      }}
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <WidgetBodyText text={line} color={accentColor} bold maxLines={1} />
      <WidgetBodyText text={detail} color={colors.textSecondary} maxLines={2} size={12} />
    </FlexWidget>
  );
}

/** Single-line strip for very narrow lock screen slots. */
export function AndroidLockScreenInline({
  line,
  deepLink,
  accentColor,
  theme,
  accessibilityLabel,
}: {
  line: string;
  deepLink: string;
  accentColor: WidgetHexColor;
  theme: WidgetThemeSnapshot;
  accessibilityLabel?: string;
}) {
  const colors = themeColors(theme);
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: deepLink }}
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: colors.card,
        borderRadius: 12,
        paddingHorizontal: 10,
        justifyContent: "center",
      }}
      accessibilityLabel={accessibilityLabel ?? line}
    >
      <WidgetBodyText text={line} color={accentColor} bold maxLines={1} />
    </FlexWidget>
  );
}
