import type { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
  useWindowDimensions,
} from "react-native";

import { Fonts, type ThemeColor } from "@/constants/theme";
import { TV_DENSITY } from "@/constants/tv-density";
import { TvType } from "@/constants/tv-layout";
import { useTheme } from "@/hooks/use-theme";
import { isTV } from "@/lib/platform/is-tv";
import {
  DEFAULT_ARABIC_SIZE,
  resolveArabicFontFamily,
  resolveArabicLineHeight,
  sanitizeArabicText,
} from "@/lib/reading-typography";
import { arabicTextAlign, useIsRTL, useUiTextStyle } from "@/lib/rtl";
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

/** TV (10-foot) ramp per type — resolved once; `isTV()` is static per build. */
const TV_TEXT = isTV();

/**
 * Apple TV lays out at 1920×1080pt (2× Android TV's 960×540dp). Scale the final
 * font metrics — including explicit `fontSize` / `lineHeight` overrides passed
 * via `style` — so every ThemedText renders at the same physical size.
 */
function tvDensityTextStyle(styles: unknown[]): TextStyle | null {
  if (TV_DENSITY === 1) return null;
  const merged = StyleSheet.flatten(styles as TextProps["style"]) as TextStyle | undefined;
  if (!merged) return null;
  const out: TextStyle = {};
  if (typeof merged.fontSize === "number") out.fontSize = merged.fontSize * TV_DENSITY;
  if (typeof merged.lineHeight === "number") out.lineHeight = merged.lineHeight * TV_DENSITY;
  if (typeof merged.letterSpacing === "number") {
    out.letterSpacing = merged.letterSpacing * TV_DENSITY;
  }
  return out;
}

function sanitizeArabicChildren(children: ReactNode): ReactNode {
  if (typeof children === "string") return sanitizeArabicText(children);
  if (Array.isArray(children)) {
    let changed = false;
    const next = children.map((child) => {
      if (typeof child !== "string") return child;
      const sanitized = sanitizeArabicText(child);
      if (sanitized !== child) changed = true;
      return sanitized;
    });
    return changed ? next : children;
  }
  return children;
}

export function ThemedText({
  style,
  type = "default",
  themeColor,
  heading,
  children,
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  // The user-chosen Arabic typeface (NF-1.31) applies to every `type="arabic"`
  // node app-wide. Subscribing to just the family string keeps re-renders to the
  // rare moment the setting actually changes.
  const arabicFamily = useStore(preferencesStore, (s) => s.prefs.fontPrefs.arabic.family);
  // Subscribe to layout direction so React Compiler cannot keep a stale LTR
  // textAlign after the user switches to ar/ur/fa/ps/ku (see useUiTextStyle).
  const rtl = useIsRTL();
  const localeTextStyle = useUiTextStyle();
  const resolvedColor = type === "linkPrimary" ? colors.accent : colors[themeColor ?? "foreground"];
  const tvRamp = TV_TEXT && type !== "arabic" ? TvType[type as keyof typeof TvType] : undefined;
  const baseLineHeight = tvRamp?.lineHeight ?? LINE_HEIGHTS[type];
  const flatStyle = StyleSheet.flatten(style);
  const localeTextAlign =
    type !== "arabic" && flatStyle?.textAlign == null ? localeTextStyle : null;
  // Arabic scripture is always physical-right; compensate for native RTL mirroring.
  const arabicAlign =
    type === "arabic" && flatStyle?.textAlign == null ? { textAlign: arabicTextAlign(rtl) } : null;
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
  // Honorific ligatures / U+06DD hang iOS TextKit under font fallback — see
  // sanitizeArabicText. Walk string children so `{arabic}{marker}` still sanitizes.
  const content = type === "arabic" ? sanitizeArabicChildren(children) : children;

  const textStyles = [
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
    tvRamp ? { fontSize: tvRamp.fontSize } : null,
    localeTextAlign,
    arabicAlign,
    scaledLineHeight,
    style,
    arabicMetrics,
  ];

  return (
    <Text
      {...headingProps(heading)}
      style={[...textStyles, tvDensityTextStyle(textStyles)]}
      {...rest}
    >
      {content}
    </Text>
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
    // textAlign applied at render via arabicTextAlign() — native RTL mirrors left/right.
  },
});
