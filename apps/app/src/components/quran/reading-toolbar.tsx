import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
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
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** SF Symbols → Material fallbacks for each toolbar chip. */
const TOOLBAR_ICONS = {
  reciter: { ios: "person.wave.2.fill", android: "record_voice_over", web: "record_voice_over" },
  translation: { ios: "translate", android: "translate", web: "translate" },
  secondTranslation: { ios: "globe", android: "language", web: "language" },
  transliteration: { ios: "textformat.abc", android: "abc", web: "abc" },
  showTranslation: { ios: "text.alignleft", android: "notes", web: "notes" },
  textSize: { ios: "textformat.size", android: "format_size", web: "format_size" },
} as const satisfies Record<string, SymbolViewProps["name"]>;

type ReadingToolbarProps = {
  /** Slide/fade the bar in once the header card has scrolled out of view. */
  visible: boolean;
  /** 0→1 reading progress driving the fill line beneath the toolbar. */
  progress: SharedValue<number>;
  reciterName: string;
  translationName: string;
  secondTranslationName: string;
  showTransliteration: boolean;
  showTranslation: boolean;
  onBackToTop: () => void;
  onOpenReciter: () => void;
  onOpenTranslation: () => void;
  onOpenSecondary: () => void;
  onToggleTransliteration: () => void;
  onToggleTranslation: () => void;
};

/**
 * Flat, horizontally-scrollable reading controls that ride beneath the header
 * once the header card scrolls out of view — a compact echo of that card so the
 * reciter, translations, transliteration, and text size can be changed
 * mid-scroll without jumping back to the top.
 */
export function QuranReadingToolbar({
  visible,
  progress,
  reciterName,
  translationName,
  secondTranslationName,
  showTransliteration,
  showTranslation,
  onBackToTop,
  onOpenReciter,
  onOpenTranslation,
  onOpenSecondary,
  onToggleTransliteration,
  onToggleTranslation,
}: ReadingToolbarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reveal = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    reveal.value = withTiming(visible ? 1 : 0, { duration: Durations.fast });
  }, [visible, reveal]);

  // Collapse to `display: none` once fully hidden so the bar takes up no space
  // and never intercepts taps meant for the header card beneath it.
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * -8 }],
    display: reveal.value === 0 ? "none" : "flex",
  }));

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.bar, { borderBottomColor: tokens.hairline }, animatedStyle]}
    >
      {/* Frosted glass chrome to match the toasts and bottom sheets: a blur layer
          beneath a translucent card wash that keeps the chips legible. Real
          Liquid Glass on iOS 26, a native blur elsewhere, backdrop-filter on web. */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
      </View>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: withAlpha(
              colors.card,
              hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.5 : 0.62,
            ),
          },
        ]}
      />
      <View style={styles.row}>
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quran.backToTop")}
          onPress={onBackToTop}
          style={[styles.backToTop, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
            size={18}
            tintColor={colors.accent}
          />
        </PressableScale>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={[styles.fontChip, { backgroundColor: colors.muted }]}>
            <SymbolView
              name={TOOLBAR_ICONS.textSize}
              size={16}
              tintColor={colors.mutedForeground}
            />
            <ReadingFontControls surface="quran" />
          </View>
          <SelectChip
            icon={TOOLBAR_ICONS.reciter}
            value={reciterName}
            accessibilityLabel={t("quran.reciter")}
            onPress={onOpenReciter}
          />
          <SelectChip
            icon={TOOLBAR_ICONS.translation}
            value={translationName}
            accessibilityLabel={t("quran.translation")}
            onPress={onOpenTranslation}
          />
          <SelectChip
            icon={TOOLBAR_ICONS.secondTranslation}
            value={secondTranslationName}
            accessibilityLabel={t("quran.secondTranslation")}
            onPress={onOpenSecondary}
          />
          <ToggleChip
            icon={TOOLBAR_ICONS.transliteration}
            label={t("quran.transliteration")}
            enabled={showTransliteration}
            accessibilityLabel={t("quran.showTransliteration")}
            onPress={onToggleTransliteration}
          />
          <ToggleChip
            icon={TOOLBAR_ICONS.showTranslation}
            label={t("quran.translation")}
            enabled={showTranslation}
            accessibilityLabel={t("quran.showTranslation")}
            onPress={onToggleTranslation}
          />
        </ScrollView>
      </View>
      <ReadingProgressBar progress={progress} accessibilityLabel={t("quran.readingProgress")} />
    </Animated.View>
  );
}

/** Value chip that opens a picker sheet (reciter / translation). */
function SelectChip({
  icon,
  value,
  accessibilityLabel,
  onPress,
}: {
  icon: SymbolViewProps["name"];
  value: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}: ${value}`}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: colors.muted }]}
    >
      <SymbolView name={icon} size={16} tintColor={colors.accent} />
      <ThemedText type="smallBold" numberOfLines={1} style={styles.chipValue}>
        {value}
      </ThemedText>
      <SymbolView
        name={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        size={12}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

/** On/off chip for a visibility preference (transliteration / translation). */
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
  },
  backToTop: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  chipValue: {
    flexShrink: 1,
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
