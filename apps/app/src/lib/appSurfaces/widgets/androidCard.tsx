// react-native-android-widget renders these components by calling them as plain
// functions outside React, so the React Compiler's injected useMemoCache would throw
// "Invalid hook call" and leave the Android widget blank. Opt the whole file out.
"use no memo";

import type React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";
import type { WidgetMarkClickAction } from "@/lib/appSurfaces/widgets/constants";
import type { WidgetHexColor, WidgetThemeSnapshot } from "@/lib/appSurfaces/widgets/types";
import { WIDGET_DESIGN } from "@/lib/appSurfaces/widgets/widgetTokens";

export type { WidgetHexColor } from "@/lib/appSurfaces/widgets/types";

export const WIDGET_COLORS = {
  textSecondary: "#4A5F56" as WidgetHexColor,
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
  maxLines = 2,
  align = "left",
}: {
  text: string;
  color: WidgetHexColor;
  bold?: boolean;
  size?: number;
  maxLines?: number;
  align?: "left" | "center" | "right";
}) {
  return (
    <TextWidget
      text={text}
      maxLines={maxLines}
      truncate="END"
      style={{
        fontSize: size,
        color,
        fontWeight: bold ? "700" : "400",
        adjustsFontSizeToFit: true,
        textAlign: align,
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
  /** Small cells: skip chrome so prayer/data content is not truncated. */
  compact?: boolean;
  markLabel?: string;
  /** Legacy mark control: opens the app via `OPEN_URI` deep link. */
  markUri?: string;
  /**
   * Preferred mark control: fires the real `ACTION_MARK_CURRENT` /
   * `ACTION_MARK_PRAYER` broadcast from a headless click task instead of
   * opening the app. Takes precedence over `markUri` when both are set.
   */
  markClickAction?: WidgetMarkClickAction;
  markClickActionData?: Record<string, unknown>;
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
  compact = false,
  markLabel,
  markUri,
  markClickAction,
  markClickActionData,
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
        borderRadius: compact ? WIDGET_DESIGN.radiusCompact : WIDGET_DESIGN.radius,
        padding: compact ? WIDGET_DESIGN.paddingCompact : WIDGET_DESIGN.padding,
        flexDirection: "column",
        flexGap: compact ? 6 : WIDGET_DESIGN.rowGap,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      {!compact ? (
        <FlexWidget style={{ flexDirection: "row", flexGap: 8, alignItems: "flex-start" }}>
          <FlexWidget
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
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
              maxLines={1}
            />
            {summary ? (
              <WidgetBodyText
                text={summary}
                color={colors.textSecondary}
                size={WIDGET_DESIGN.fontSizeCaption}
                maxLines={2}
              />
            ) : null}
          </FlexWidget>
        </FlexWidget>
      ) : null}
      {children}
      {!compact && markLabel && (markClickAction || markUri) ? (
        <FlexWidget
          clickAction={markClickAction ?? "OPEN_URI"}
          clickActionData={markClickAction ? (markClickActionData ?? {}) : { uri: markUri }}
          style={{
            height: 48,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: hexWithAlpha(accentColor, 0.16),
            justifyContent: "center",
            alignItems: "center",
          }}
          accessibilityLabel={markLabel}
        >
          <WidgetBodyText text={markLabel} color={accentColor} bold size={13} maxLines={1} />
        </FlexWidget>
      ) : null}
      {!compact && footer && !markLabel ? (
        <WidgetBodyText
          text={footer}
          color={accentColor}
          bold
          size={WIDGET_DESIGN.fontSizeCaption}
          maxLines={1}
        />
      ) : null}
      {!compact && updatedAgo ? (
        <WidgetBodyText text={updatedAgo} color={colors.textSecondary} size={11} maxLines={1} />
      ) : null}
    </FlexWidget>
  );
}

export function WidgetHeroAmount({
  label,
  amount,
  theme,
  accent,
  amountSize = WIDGET_DESIGN.fontSizeHero,
}: {
  label: string;
  amount: string;
  theme: WidgetThemeSnapshot;
  accent: WidgetHexColor;
  amountSize?: number;
}) {
  const colors = themeColors(theme);
  return (
    <FlexWidget style={{ flexDirection: "column", flexGap: 2 }}>
      <WidgetBodyText
        text={label}
        color={colors.text}
        bold
        size={WIDGET_DESIGN.fontSizeTitle}
        maxLines={2}
      />
      <WidgetBodyText text={amount} color={accent} bold size={amountSize} maxLines={1} />
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
      <WidgetBodyText text={label} color={colors.textSecondary} size={11} maxLines={1} />
      <WidgetBodyText
        text={value}
        color={valueColor ?? colors.text}
        bold
        size={WIDGET_DESIGN.fontSizeCaption}
        maxLines={1}
      />
    </FlexWidget>
  );
}

export function WidgetStatusDot({ color }: { color: WidgetHexColor }) {
  return (
    <FlexWidget
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: color,
      }}
    />
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
