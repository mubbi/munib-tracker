import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ReadingFontControls } from "@/components/reading-font-controls";
import { ThemedText } from "@/components/themed-text";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { Durations } from "@/constants/motion";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ltrControlViewProps } from "@/lib/rtl";

/** SF Symbols → Material fallbacks for each toolbar chip. */
const TOOLBAR_ICONS = {
  arabic: { ios: "character.textbox", android: "translate", web: "translate" },
  translation: { ios: "text.alignleft", android: "notes", web: "notes" },
  narrator: { ios: "person.fill", android: "person", web: "person" },
  grade: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  isnad: { ios: "list.bullet", android: "format_list_bulleted", web: "format_list_bulleted" },
  sharh: { ios: "text.book.closed", android: "menu_book", web: "menu_book" },
  textSize: { ios: "textformat.size", android: "format_size", web: "format_size" },
  enterFullscreen: {
    ios: "arrow.up.left.and.arrow.down.right",
    android: "fullscreen",
    web: "fullscreen",
  },
  exitFullscreen: {
    ios: "arrow.down.right.and.arrow.up.left",
    android: "fullscreen_exit",
    web: "fullscreen_exit",
  },
} as const satisfies Record<string, SymbolViewProps["name"]>;

type HadithReadingToolbarProps = {
  /** Slide/fade the bar in once the header card has scrolled out of view. */
  visible: boolean;
  /** 0→1 reading progress driving the fill line beneath the toolbar. */
  progress: SharedValue<number>;
  showArabic: boolean;
  showTranslation: boolean;
  showNarrator: boolean;
  showGrade: boolean;
  showIsnad: boolean;
  showSharh: boolean;
  /** Hide isnad chip when the collection has no chains. */
  hasIsnad?: boolean;
  /** Hide sharh chip when the collection has no explanations. */
  hasSharh?: boolean;
  showBackToTop?: boolean;
  onBackToTop?: () => void;
  onToggleArabic: () => void;
  onToggleTranslation: () => void;
  onToggleNarrator: () => void;
  onToggleGrade: () => void;
  onToggleIsnad: () => void;
  onToggleSharh: () => void;
};

/**
 * Compact reading controls for hadith — text size plus show/hide toggles for
 * Arabic, translation, narrator, grade, isnad, and sharh. Mirrors the Qur'an
 * toolbar pattern so mid-scroll adjustments stay reachable after the header
 * filters scroll away.
 */
export function HadithReadingToolbar({
  visible,
  progress,
  showArabic,
  showTranslation,
  showNarrator,
  showGrade,
  showIsnad,
  showSharh,
  hasIsnad = true,
  hasSharh = true,
  showBackToTop = true,
  onBackToTop,
  onToggleArabic,
  onToggleTranslation,
  onToggleNarrator,
  onToggleGrade,
  onToggleIsnad,
  onToggleSharh,
}: HadithReadingToolbarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const scrollRef = useHorizontalWheelScroll();
  const fullscreen = useReadingFullscreen({ exitOnBlur: true });
  const showBar = visible || fullscreen.active;
  const reveal = useSharedValue(showBar ? 1 : 0);

  useEffect(() => {
    reveal.value = withTiming(showBar ? 1 : 0, { duration: Durations.fast });
  }, [showBar, reveal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * -8 }],
    display: reveal.value === 0 ? "none" : "flex",
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          borderBottomColor: tokens.hairline,
          pointerEvents: showBar ? "auto" : "none",
        },
        animatedStyle,
      ]}
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
      <View style={styles.row}>
        {showBackToTop && onBackToTop ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("hadith.backToTop")}
            onPress={onBackToTop}
            style={[styles.iconBtn, { backgroundColor: tokens.accentSoft }]}
          >
            <SymbolView
              name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
              size={18}
              tintColor={colors.accent}
            />
          </PressableScale>
        ) : null}
        <ScrollView
          ref={scrollRef}
          horizontal
          style={styles.scroll}
          showsHorizontalScrollIndicator={Platform.OS === "web"}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View
            {...ltrControlViewProps()}
            style={[styles.fontChip, { backgroundColor: colors.muted }]}
          >
            <SymbolView
              name={TOOLBAR_ICONS.textSize}
              size={16}
              tintColor={colors.mutedForeground}
            />
            <ReadingFontControls surface="hadith" />
          </View>
          <ToggleChip
            icon={TOOLBAR_ICONS.arabic}
            label={t("hadith.arabic")}
            enabled={showArabic}
            accessibilityLabel={t("hadith.showArabic")}
            onPress={onToggleArabic}
          />
          <ToggleChip
            icon={TOOLBAR_ICONS.translation}
            label={t("hadith.translation")}
            enabled={showTranslation}
            accessibilityLabel={t("hadith.showTranslation")}
            onPress={onToggleTranslation}
          />
          <ToggleChip
            icon={TOOLBAR_ICONS.narrator}
            label={t("hadith.narratorLabel")}
            enabled={showNarrator}
            accessibilityLabel={t("hadith.showNarrator")}
            onPress={onToggleNarrator}
          />
          <ToggleChip
            icon={TOOLBAR_ICONS.grade}
            label={t("hadith.gradeLabel")}
            enabled={showGrade}
            accessibilityLabel={t("hadith.showGrade")}
            onPress={onToggleGrade}
          />
          {hasIsnad ? (
            <ToggleChip
              icon={TOOLBAR_ICONS.isnad}
              label={t("hadith.isnad")}
              enabled={showIsnad}
              accessibilityLabel={t("hadith.showIsnad")}
              onPress={onToggleIsnad}
            />
          ) : null}
          {hasSharh ? (
            <ToggleChip
              icon={TOOLBAR_ICONS.sharh}
              label={t("hadith.sharh")}
              enabled={showSharh}
              accessibilityLabel={t("hadith.showSharh")}
              onPress={onToggleSharh}
            />
          ) : null}
        </ScrollView>
        {fullscreen.supported ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={
              fullscreen.active ? t("hadith.exitFullscreen") : t("hadith.enterFullscreen")
            }
            accessibilityState={{ selected: fullscreen.active }}
            onPress={() => void fullscreen.toggle()}
            style={[
              styles.iconBtn,
              styles.fullscreenBtn,
              {
                backgroundColor: fullscreen.active ? tokens.accentSoft : colors.muted,
              },
            ]}
          >
            <SymbolView
              name={
                fullscreen.active ? TOOLBAR_ICONS.exitFullscreen : TOOLBAR_ICONS.enterFullscreen
              }
              size={18}
              tintColor={fullscreen.active ? colors.accent : colors.mutedForeground}
            />
          </PressableScale>
        ) : null}
      </View>
      <ReadingProgressBar progress={progress} accessibilityLabel={t("hadith.readingProgress")} />
    </Animated.View>
  );
}

function ToggleChip({
  icon,
  label,
  enabled,
  accessibilityLabel,
  onPress,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  enabled: boolean;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const tint = enabled ? colors.accent : colors.mutedForeground;
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: enabled }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: enabled ? tokens.accentSoft : colors.muted,
          borderColor: enabled ? colors.accent : "transparent",
        },
      ]}
    >
      <SymbolView name={icon} size={16} tintColor={tint} />
      <ThemedText type="smallBold" numberOfLines={1} style={{ color: tint }}>
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: {
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingStart: Spacing.three,
    gap: Spacing.two,
    width: "100%",
  },
  scroll: {
    flex: 1,
    minWidth: 0,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fullscreenBtn: {
    marginEnd: Spacing.three,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    maxWidth: 200,
    paddingVertical: Spacing.two - 1,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "transparent",
  },
  fontChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});
