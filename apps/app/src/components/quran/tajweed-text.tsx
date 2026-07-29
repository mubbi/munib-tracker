import type { TajweedRuleId, TajweedSegment } from "@munib-tracker/shared/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, type TextStyle, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { getTajweedRule, type TajweedRuleDef } from "@/constants/tajweed";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { withArabicJoiningZwj } from "@/lib/arabic-text-join";
import { tTv } from "@/lib/i18n/t-tv";
import { arabicReadingLayout, resolveArabicLineHeight } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

type TajweedTextProps = {
  segments?: TajweedSegment[] | null;
  /** Plain Arabic fallback while segments load or when unavailable. */
  fallback: string;
  fontSize: number;
  style?: TextStyle;
};

/** Desktop web with a fine pointer — use hover; otherwise tap. */
function useFinePointerHover(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  return fine;
}

function formatRuleTooltip(rule: TajweedRuleDef, t: (key: string) => string): string {
  return `${t(rule.labelKey)} — ${t(rule.hintKey)}`;
}

/**
 * Colored Arabic ayah text for ayah study. Colored runs show a floating tajweed
 * tooltip on hover (desktop web, help cursor) or tap (native / mobile web).
 */
export function TajweedText({ segments, fallback, fontSize, style }: TajweedTextProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const fontFamily = useArabicFontFamily();
  const { fontPrefs } = usePreferences();
  const fineHover = useFinePointerHover();
  const [activeRuleId, setActiveRuleId] = useState<TajweedRuleId | null>(null);

  const lineHeight = resolveArabicLineHeight(fontSize, fontPrefs.arabic.family);
  const baseStyle = [
    styles.arabic,
    arabicReadingLayout(fontSize),
    { color: colors.foreground, fontFamily, lineHeight },
    style,
  ];
  const isDark = tokens.isDark;
  const activeRule = activeRuleId ? getTajweedRule(activeRuleId) : undefined;

  const clearTooltip = useCallback(() => setActiveRuleId(null), []);

  const showRule = useCallback((ruleId: TajweedRuleId) => {
    setActiveRuleId(ruleId);
  }, []);

  const onSegmentPress = useCallback(
    (ruleId: TajweedRuleId | undefined) => {
      if (!ruleId || fineHover) return;
      setActiveRuleId((prev) => (prev === ruleId ? null : ruleId));
    },
    [fineHover],
  );

  if (!segments?.length) {
    return <Text style={baseStyle}>{fallback}</Text>;
  }

  // Nested/colored spans break Arabic cursive joining on Android Fabric and RN
  // web — trail ZWJ across same-word boundaries so letters stay connected.
  const joinedTexts = withArabicJoiningZwj(segments.map((s) => s.text));

  return (
    <View style={styles.wrap}>
      {activeRule ? (
        <View
          accessibilityRole="text"
          style={[
            styles.tooltip,
            {
              backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.96 : 0.98),
              borderColor: tokens.hairline,
              // Soft lift so the pill reads as overlay, not in-flow content.
              shadowColor: "#000",
              shadowOpacity: tokens.isDark ? 0.45 : 0.18,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
              pointerEvents: "none",
            },
          ]}
        >
          <ThemedText type="small" style={styles.tooltipText} numberOfLines={2}>
            {formatRuleTooltip(activeRule, t)}
          </ThemedText>
        </View>
      ) : null}

      <Text style={baseStyle} onPress={fineHover ? undefined : clearTooltip}>
        {/* Segments are ordered runs from markup; index is required for duplicate text. */}
        {segments.map((segment, index) => {
          const rule = getTajweedRule(segment.rule);
          const color = rule ? (isDark ? rule.colorDark : rule.colorLight) : colors.foreground;
          const segmentKey = `${index}:${segment.rule ?? ""}:${segment.text}`;
          const text = joinedTexts[index] ?? segment.text;
          if (!rule) {
            return <Text key={segmentKey}>{text}</Text>;
          }

          const webHoverProps =
            Platform.OS === "web" && fineHover
              ? {
                  onMouseEnter: () => showRule(rule.id),
                  onMouseLeave: clearTooltip,
                }
              : {};

          return (
            <Text
              key={segmentKey}
              // Stay a nested span — role "button" becomes <button> on web and
              // splits Arabic words into isolated letter forms.
              accessibilityLabel={formatRuleTooltip(rule, t)}
              accessibilityHint={
                fineHover
                  ? t("quran.tajweed.hoverHint")
                  : tTv(t, "quran.tajweed.tapHint", "quran.tajweed.tapHintTv")
              }
              suppressHighlighting
              onPress={() => onSegmentPress(rule.id)}
              {...(webHoverProps as object)}
              style={[{ color }, Platform.OS === "web" ? styles.webInteractive : null]}
            >
              {text}
            </Text>
          );
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    width: "100%",
    // Room for the floating pill so it isn't clipped by the ayah card.
    overflow: "visible",
    zIndex: 1,
  },
  arabic: {
    writingDirection: "rtl",
    textAlign: "right",
    width: "100%",
  },
  tooltip: {
    position: "absolute",
    left: Spacing.two,
    right: Spacing.two,
    bottom: "100%",
    marginBottom: Spacing.one + 2,
    alignSelf: "center",
    maxWidth: "100%",
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 20,
    // Do not intercept hover — keeps the letter under the cursor active.
    pointerEvents: "none",
  },
  tooltipText: {
    textAlign: "center",
  },
  webInteractive: {
    // RN web — help cursor signals “rule info on hover”.
    cursor: "help",
    // Replaced elements (e.g. buttons) break Arabic joining across siblings.
    // RN TextStyle only allows none|flex|contents; "inline" is a web CSS value.
    display: "inline",
  } as unknown as TextStyle,
});
