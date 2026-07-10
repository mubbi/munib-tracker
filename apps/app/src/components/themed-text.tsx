import { Platform, StyleSheet, Text, type TextProps, useWindowDimensions } from "react-native";

import { Fonts, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  DEFAULT_ARABIC_SIZE,
  resolveArabicFontFamily,
  resolveArabicLineHeight,
} from "@/lib/reading-typography";
import { uiTextStyle } from "@/lib/rtl";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

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
  /**
   * Renders a semantic heading. On web this becomes a real `<h1>`–`<h6>` tag
   * (react-native-web maps `role="heading"` + `aria-level` to `<hN>`), giving
   * search engines and AI crawlers a proper document outline; on native it maps
   * to the accessibility "header" trait. Keep one `heading={1}` per screen.
   */
  heading?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** Cross-platform props that turn a Text node into a semantic heading. */
function headingProps(level?: 1 | 2 | 3 | 4 | 5 | 6): Record<string, unknown> {
  if (!level) return {};
  return Platform.OS === "web"
    ? { role: "heading", "aria-level": level }
    : { accessibilityRole: "header" };
}

/**
 * Base line heights per type. React Native scales `fontSize` with the OS font
 * scale but NOT a fixed `lineHeight`, so at large Dynamic Type the text clips.
 * We multiply these by the live `fontScale` so lines reflow instead.
 */
const LINE_HEIGHTS: Partial<Record<NonNullable<ThemedTextProps["type"]>, number>> = {
  default: 26,
  display: 58,
  title: 48,
  header: 34,
  subtitle: 28,
  small: 22,
  smallBold: 22,
  caption: 18,
  label: 16,
  link: 30,
  linkPrimary: 30,
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  heading,
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  // The user-chosen Arabic typeface (NF-1.31) applies to every `type="arabic"`
  // node app-wide. Subscribing to just the family string keeps re-renders to the
  // rare moment the setting actually changes.
  const arabicFamily = useStore(preferencesStore, (s) => s.prefs.fontPrefs.arabic.family);
  const resolvedColor = type === "linkPrimary" ? colors.accent : colors[themeColor ?? "foreground"];
  const baseLineHeight = LINE_HEIGHTS[type];
  const flatStyle = StyleSheet.flatten(style);
  const localeTextAlign = type !== "arabic" && flatStyle?.textAlign == null ? uiTextStyle() : null;
  const arabicFontSize =
    type === "arabic"
      ? typeof flatStyle?.fontSize === "number"
        ? flatStyle.fontSize
        : DEFAULT_ARABIC_SIZE
      : undefined;
  const scaledLineHeight =
    type !== "arabic" && baseLineHeight != null ? { lineHeight: baseLineHeight * fontScale } : null;
  const arabicMetrics =
    type === "arabic" && arabicFontSize != null
      ? { lineHeight: resolveArabicLineHeight(arabicFontSize, arabicFamily) * fontScale }
      : null;

  return (
    <Text
      {...headingProps(heading)}
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
        type === "arabic" && { fontFamily: resolveArabicFontFamily(arabicFamily) },
        localeTextAlign,
        scaledLineHeight,
        style,
        arabicMetrics,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
  },
  default: {
    fontSize: 16,
    lineHeight: 26,
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
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  label: {
    fontSize: 11,
    lineHeight: 16,
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
    fontSize: DEFAULT_ARABIC_SIZE,
    fontWeight: "500",
    writingDirection: "rtl",
    textAlign: "right",
  },
});
