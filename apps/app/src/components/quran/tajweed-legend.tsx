import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Durations } from "@/constants/motion";
import { TAJWEED_RULES } from "@/constants/tajweed";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Collapsible tajweed color legend for ayah study. Each chip navigates to the
 * matching Learn Qur'an tajweed lesson.
 */
export function TajweedLegend() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const isDark = tokens.isDark;

  return (
    <View style={styles.wrap}>
      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={t("quran.tajweed.legend")}
        onPress={() => setExpanded((prev) => !prev)}
        style={[
          styles.header,
          {
            backgroundColor: colors.muted,
            borderColor: tokens.hairline,
          },
        ]}
      >
        <View style={styles.rainbowRow}>
          {TAJWEED_RULES.slice(0, 5).map((rule) => (
            <View
              key={rule.id}
              style={[
                styles.rainbowDot,
                { backgroundColor: isDark ? rule.colorDark : rule.colorLight },
              ]}
            />
          ))}
        </View>
        <ThemedText type="caption" style={[styles.headerLabel, { color: colors.mutedForeground }]}>
          {t("quran.tajweed.legend")}
        </ThemedText>
        <SymbolView
          name={{
            ios: expanded ? "chevron.up" : "chevron.down",
            android: expanded ? "expand_less" : "expand_more",
            web: expanded ? "expand_less" : "expand_more",
          }}
          size={14}
          tintColor={colors.mutedForeground}
        />
      </PressableScale>

      {expanded ? (
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.card,
              borderColor: tokens.hairline,
            },
          ]}
        >
          {TAJWEED_RULES.map((rule) => {
            const swatch = isDark ? rule.colorDark : rule.colorLight;
            return (
              <View key={rule.id} style={styles.cell}>
                <PressableScale
                  haptic="light"
                  accessibilityRole="link"
                  accessibilityLabel={t(rule.labelKey)}
                  accessibilityHint={t("quran.tajweed.openLesson")}
                  onPress={() =>
                    router.push({
                      pathname: "/learn-quran/tajweed/[id]",
                      params: { id: rule.lessonId },
                    })
                  }
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.muted,
                      borderColor: tokens.hairline,
                    },
                  ]}
                >
                  <View style={[styles.swatch, { backgroundColor: swatch }]} />
                  <ThemedText type="caption" numberOfLines={1} style={styles.chipLabel}>
                    {t(rule.labelKey)}
                  </ThemedText>
                  <SymbolView
                    name={{
                      ios: "arrow.up.right.square",
                      android: "open_in_new",
                      web: "open_in_new",
                    }}
                    size={12}
                    tintColor={colors.mutedForeground}
                  />
                </PressableScale>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

type TajweedStickyLegendBarProps = {
  /** True once the in-list legend has scrolled off-screen and tajweed is enabled. */
  visible: boolean;
};

/**
 * Compact horizontal tajweed swatches pinned under the reading toolbar after the
 * full legend card scrolls away.
 */
export function TajweedStickyLegendBar({ visible }: TajweedStickyLegendBarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const router = useRouter();
  const scrollRef = useHorizontalWheelScroll();
  const reveal = useSharedValue(visible ? 1 : 0);
  const isDark = tokens.isDark;

  useEffect(() => {
    reveal.value = withTiming(visible ? 1 : 0, { duration: Durations.fast });
  }, [visible, reveal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * -6 }],
    display: reveal.value === 0 ? "none" : "flex",
  }));

  return (
    <Animated.View
      style={[
        stickyStyles.bar,
        { borderBottomColor: tokens.hairline, pointerEvents: visible ? "auto" : "none" },
        animatedStyle,
      ]}
      accessibilityLabel={t("quran.tajweed.legend")}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            backgroundColor: withAlpha(
              colors.card,
              hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.5 : 0.62,
            ),
          },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === "web"}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={stickyStyles.content}
        style={stickyStyles.scroll}
      >
        {TAJWEED_RULES.map((rule) => {
          const swatch = isDark ? rule.colorDark : rule.colorLight;
          return (
            <PressableScale
              key={rule.id}
              haptic="light"
              accessibilityRole="link"
              accessibilityLabel={t(rule.labelKey)}
              accessibilityHint={t("quran.tajweed.openLesson")}
              onPress={() =>
                router.push({
                  pathname: "/learn-quran/tajweed/[id]",
                  params: { id: rule.lessonId },
                })
              }
              style={[
                stickyStyles.chip,
                {
                  backgroundColor: colors.muted,
                  borderColor: tokens.hairline,
                },
              ]}
            >
              <View style={[stickyStyles.swatch, { backgroundColor: swatch }]} />
              <ThemedText type="caption" numberOfLines={1}>
                {t(rule.labelKey)}
              </ThemedText>
            </PressableScale>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  header: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  rainbowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rainbowDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  headerLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  panel: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    width: "50%",
    padding: Spacing.one,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 36,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
    flexShrink: 0,
  },
  chipLabel: {
    flex: 1,
    flexShrink: 1,
  },
});

const stickyStyles = StyleSheet.create({
  bar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 0,
  },
});
