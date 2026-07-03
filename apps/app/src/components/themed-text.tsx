import { Platform, StyleSheet, Text, type TextProps, useWindowDimensions } from "react-native";

import { Fonts, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "display"
    | "title"
    | "header"
    | "subtitle"
    | "small"
    | "smallBold"
    | "caption"
    | "label"
    | "link"
    | "linkPrimary"
    | "code"
    | "arabic";
  themeColor?: ThemeColor;
};

/**
 * Base line heights per type. React Native scales `fontSize` with the OS font
 * scale but NOT a fixed `lineHeight`, so at large Dynamic Type the text clips.
 * We multiply these by the live `fontScale` so lines reflow instead.
 */
const LINE_HEIGHTS: Partial<Record<NonNullable<ThemedTextProps["type"]>, number>> = {
  default: 24,
  display: 58,
  title: 46,
  header: 32,
  subtitle: 26,
  small: 20,
  smallBold: 20,
  caption: 16,
  label: 14,
  link: 30,
  linkPrimary: 30,
  arabic: 52,
};

export function ThemedText({ style, type = "default", themeColor, ...rest }: ThemedTextProps) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  const resolvedColor = type === "linkPrimary" ? colors.accent : colors[themeColor ?? "foreground"];
  const baseLineHeight = LINE_HEIGHTS[type];
  const scaledLineHeight =
    baseLineHeight != null ? { lineHeight: baseLineHeight * fontScale } : null;

  return (
    <Text
      style={[
        { color: resolvedColor },
        type === "default" && styles.default,
        type === "display" && styles.display,
        type === "title" && styles.title,
        type === "header" && styles.header,
        type === "subtitle" && styles.subtitle,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "caption" && styles.caption,
        type === "label" && styles.label,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        type === "arabic" && styles.arabic,
        scaledLineHeight,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  display: {
    fontSize: 56,
    fontWeight: "800",
    lineHeight: 58,
    letterSpacing: -1,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 46,
    letterSpacing: -0.6,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: "700" }) ?? "500",
    fontSize: 12,
  },
  arabic: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    lineHeight: 52,
    fontWeight: "500",
  },
});
