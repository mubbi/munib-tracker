// Rendered by react-native-android-widget as plain functions; opt out of the
// React Compiler so injected useMemoCache does not throw and blank the widget.
"use no memo";

import type { WidgetInfo } from "react-native-android-widget";
import { FlexWidget } from "react-native-android-widget";

import {
  WIDGET_COLORS,
  WidgetBodyText,
  type WidgetHexColor,
} from "@/lib/appSurfaces/widgets/androidCard";

/** Android lock-screen / communal widgets are typically short in height (dp). */
export function isCompactWidgetSurface(info: WidgetInfo): boolean {
  return info.height <= 96 || info.width <= 200;
}

/** Resizable home-screen widgets at 4×4 cells or larger (dp). */
export function isLargeWidgetSurface(info: WidgetInfo): boolean {
  return info.height > 180 && info.width > 280;
}

type CompactProps = {
  title: string;
  line: string;
  detail: string;
  deepLink: string;
  accentColor: WidgetHexColor;
};

/** Two-line strip for lock screen and other compact Android widget surfaces. */
export function AndroidLockScreenStrip({
  title,
  line,
  detail,
  deepLink,
  accentColor,
}: CompactProps) {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: deepLink }}
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 10,
        flexDirection: "column",
        justifyContent: "center",
      }}
      accessibilityLabel={title}
    >
      <WidgetBodyText text={line} color={accentColor} bold />
      <WidgetBodyText text={detail} color={WIDGET_COLORS.textSecondary} />
    </FlexWidget>
  );
}

/** Single-line strip for very narrow lock screen slots. */
export function AndroidLockScreenInline({
  line,
  deepLink,
  accentColor,
}: {
  line: string;
  deepLink: string;
  accentColor: WidgetHexColor;
}) {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: deepLink }}
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 10,
        justifyContent: "center",
      }}
      accessibilityLabel={line}
    >
      <WidgetBodyText text={line} color={accentColor} bold />
    </FlexWidget>
  );
}
