// react-native-android-widget renders these components by calling them as plain
// functions outside React, so the React Compiler's injected useMemoCache would throw
// "Invalid hook call" and leave the Android widget blank. Opt the whole file out.
"use no memo";

import type React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";
import type { WidgetHexColor, WidgetThemeSnapshot } from "@/lib/appSurfaces/widgets/types";
import { WIDGET_DESIGN } from "@/lib/appSurfaces/widgets/widgetTokens";

export type { WidgetHexColor } from "@/lib/appSurfaces/widgets/types";

export const WIDGET_COLORS = {
  textSecondary: "#5C7268" as WidgetHexColor,
};

export function hexWithAlpha(
  hex: WidgetHexColor,
  alpha: number,
): `rgba(${number}, ${number}, ${number}, ${number})` {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized.length >= 6
        ? normalized.slice(0, 6)
        : "000000";
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function themeColors(theme: WidgetThemeSnapshot) {
  return {
    card: theme.cardBackground,
    text: theme.textPrimary,
    textSecondary: theme.textSecondary,
    border: theme.border,
    primary: theme.primary,
    success: theme.success,
    warning: theme.warning,
  };
}

export function WidgetBodyText({
  text,
  color,
  bold = false,
  size = WIDGET_DESIGN.fontSizeBody,
}: {
  text: string;
  color: WidgetHexColor;
  bold?: boolean;
  size?: number;
}) {
  return (
    <TextWidget
      text={text}
      style={{
        fontSize: size,
        color,
        fontWeight: bold ? "700" : "400",
      }}
    />
  );
}

export function WidgetProgressBar({
  percent,
  fillColor,
  trackColor,
}: {
  percent: number;
  fillColor: WidgetHexColor;
  trackColor: WidgetHexColor;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const fillFlex = Math.max(clamped, 0);
  const trackFlex = Math.max(100 - clamped, 1);
  return (
    <FlexWidget
      style={{
        height: 6,
        width: "match_parent",
        flexDirection: "row",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <FlexWidget
        style={{
          flex: fillFlex,
          height: "match_parent",
          backgroundColor: fillColor,
        }}
      />
      <FlexWidget
        style={{
          flex: trackFlex,
          height: "match_parent",
          backgroundColor: trackColor,
        }}
      />
    </FlexWidget>
  );
}

type CardProps = {
  title: string;
  summary: string;
  deepLink: string;
  accentColor: WidgetHexColor;
  accessibilityLabel: string;
  theme: WidgetThemeSnapshot;
  footer?: string;
  updatedAgo?: string;
  children: React.ReactNode;
};

export function AndroidSurfaceCard({
  title,
  summary,
  deepLink,
  accentColor,
  accessibilityLabel,
  theme,
  footer,
  updatedAgo,
  children,
}: CardProps) {
  const colors = themeColors(theme);
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: deepLink }}
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: colors.card,
        borderRadius: WIDGET_DESIGN.radius,
        padding: WIDGET_DESIGN.padding,
        flexDirection: "column",
        flexGap: WIDGET_DESIGN.rowGap,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <FlexWidget style={{ flexDirection: "row", flexGap: 8, alignItems: "flex-start" }}>
        <FlexWidget
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: hexWithAlpha(accentColor, 0.18),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlexWidget
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: accentColor,
            }}
          />
        </FlexWidget>
        <FlexWidget style={{ flexDirection: "column", flex: 1, flexGap: 2 }}>
          <WidgetBodyText
            text={title}
            color={accentColor}
            bold
            size={WIDGET_DESIGN.fontSizeCaption}
          />
          {summary ? (
            <WidgetBodyText
              text={summary}
              color={colors.textSecondary}
              size={WIDGET_DESIGN.fontSizeCaption}
            />
          ) : null}
        </FlexWidget>
      </FlexWidget>
      {children}
      {footer ? (
        <WidgetBodyText
          text={footer}
          color={accentColor}
          bold
          size={WIDGET_DESIGN.fontSizeCaption}
        />
      ) : null}
      {updatedAgo ? (
        <WidgetBodyText text={updatedAgo} color={colors.textSecondary} size={11} />
      ) : null}
    </FlexWidget>
  );
}

export function WidgetHeroAmount({
  label,
  amount,
  theme,
  accent,
}: {
  label: string;
  amount: string;
  theme: WidgetThemeSnapshot;
  accent: WidgetHexColor;
}) {
  const colors = themeColors(theme);
  return (
    <FlexWidget style={{ flexDirection: "column", flexGap: 2 }}>
      <WidgetBodyText
        text={label}
        color={colors.textSecondary}
        size={WIDGET_DESIGN.fontSizeCaption}
      />
      <WidgetBodyText text={amount} color={accent} bold size={WIDGET_DESIGN.fontSizeHero} />
    </FlexWidget>
  );
}

export function WidgetStatPill({
  label,
  value,
  theme,
  valueColor,
}: {
  label: string;
  value: string;
  theme: WidgetThemeSnapshot;
  valueColor?: WidgetHexColor;
}) {
  const colors = themeColors(theme);
  return (
    <FlexWidget
      style={{
        flex: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: hexWithAlpha(colors.border, 0.35),
        flexDirection: "column",
        flexGap: 2,
      }}
    >
      <WidgetBodyText text={label} color={colors.textSecondary} size={11} />
      <WidgetBodyText
        text={value}
        color={valueColor ?? colors.text}
        bold
        size={WIDGET_DESIGN.fontSizeCaption}
      />
    </FlexWidget>
  );
}

export function scheduleRowColor(
  status: "completed" | "pending" | "active",
  theme: WidgetThemeSnapshot,
): WidgetHexColor {
  if (status === "completed") return theme.success;
  if (status === "active") return theme.primary;
  return theme.textSecondary;
}
