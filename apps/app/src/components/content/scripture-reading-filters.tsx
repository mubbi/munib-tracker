import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ControlLabel, PrefToggle } from "@/components/content/pref-toggle";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ToggleChip } from "@/components/ui/chip";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Durations } from "@/constants/motion";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { ltrControlViewProps } from "@/lib/rtl";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";

/** Extra width so a reading list and filters pane can sit side by side. */
export const SCRIPTURE_LIST_DETAIL_MAX_WIDTH = 1280;

export const scriptureListDetailStyles = StyleSheet.create({
  readerRoot: { flex: 1, width: "100%" },
  listDetailRoot: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    gap: Spacing.four,
  },
  listDetailPrimary: {
    flex: 1.25,
    minWidth: 0,
  },
  listDetailSecondary: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    borderStartWidth: BorderWidth.hairline,
    gap: Spacing.three,
  },
  listDetailSecondaryTv: {
    minWidth: TvLayout.detailPaneMinWidth,
    maxWidth: TvLayout.detailPaneMaxWidth,
  },
  listDetailSecondaryScroll: {
    flex: 1,
  },
  listDetailSecondaryContent: {
    paddingStart: Spacing.four,
    flexGrow: 1,
    gap: Spacing.three,
  },
});

const FILTER_ICONS = {
  transliteration: { ios: "textformat.abc", android: "abc", web: "abc" },
  translation: { ios: "text.alignleft", android: "notes", web: "notes" },
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

/** Filter card: text size + transliteration/translation toggles for dua/zikr/durood. */
export function ScriptureReadingFilters() {
  const { t } = useTranslation();
  const tv = isTV();
  const { showTransliteration, showTranslation, toggleTransliteration, toggleTranslation } =
    useReadingDisplayToggles();

  return (
    <Card style={[styles.filtersCard, tv && styles.filtersCardTv]}>
      <View
        style={[
          styles.controlRow,
          styles.translationRow,
          tv && styles.controlRowTv,
          tv && styles.controlRowStackTv,
        ]}
      >
        <ControlLabel icon={FILTER_ICONS.textSize} label={t("reading.textSize")} />
        <View style={[styles.controlValue, tv && styles.controlValueTv]}>
          <ReadingFontControls surface="dua_zikr" />
        </View>
      </View>
      <PrefToggle
        icon={FILTER_ICONS.transliteration}
        label={t("reading.showTransliteration")}
        enabled={showTransliteration}
        onToggle={() => void toggleTransliteration()}
      />
      <PrefToggle
        icon={FILTER_ICONS.translation}
        label={t("reading.showTranslation")}
        enabled={showTranslation}
        onToggle={() => void toggleTranslation()}
      />
    </Card>
  );
}

type ScriptureReadingToolbarProps = {
  visible: boolean;
  progress: SharedValue<number>;
  showBackToTop?: boolean;
  onBackToTop?: () => void;
  progressLabel?: string;
};

/** Compact sticky chips for mid-scroll control on narrow screens. */
export function ScriptureReadingToolbar({
  visible,
  progress,
  showBackToTop = true,
  onBackToTop,
  progressLabel,
}: ScriptureReadingToolbarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const scrollRef = useHorizontalWheelScroll();
  const fullscreen = useReadingFullscreen({ exitOnBlur: true });
  const { showTransliteration, showTranslation, toggleTransliteration, toggleTranslation } =
    useReadingDisplayToggles();
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
      {/* TV: skip the live blur (expensive on Fire TV sticks) — opaque card wash. */}
      {!tv ? (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
          <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
        </View>
      ) : null}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            backgroundColor: tv
              ? colors.card
              : withAlpha(
                  colors.card,
                  hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.5 : 0.62,
                ),
          },
        ]}
      />
      <View style={styles.row}>
        {/* TV: back-to-top scrolls away from the focused card, stranding focus
            off-screen — remote users press Up instead. */}
        {showBackToTop && onBackToTop && !tv ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("reading.backToTop")}
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
        {/* Horizontal chip row: never trap Up/Down — Down must reach the reading
            content below (a vertical trap here was a TV dead end). The guide is
            the row's flex child, so it must carry the flex/minWidth bounds —
            unbounded it grows to the chips' width and the ScrollView never
            overflows (no touch/wheel scroll on web). */}
        <TvFocusGuide style={styles.scroll}>
          <TvScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === "web"}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <View
              {...ltrControlViewProps()}
              style={[styles.fontChip, { backgroundColor: colors.muted }]}
            >
              <SymbolView
                name={FILTER_ICONS.textSize}
                size={16}
                tintColor={colors.mutedForeground}
              />
              <ReadingFontControls surface="dua_zikr" />
            </View>
            <ToggleChip
              icon={FILTER_ICONS.transliteration}
              label={t("quran.transliteration")}
              enabled={showTransliteration}
              accessibilityLabel={t("reading.showTransliteration")}
              onPress={() => void toggleTransliteration()}
            />
            <ToggleChip
              icon={FILTER_ICONS.translation}
              label={t("quran.translation")}
              enabled={showTranslation}
              accessibilityLabel={t("reading.showTranslation")}
              onPress={() => void toggleTranslation()}
            />
          </TvScrollView>
        </TvFocusGuide>
        {fullscreen.supported ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={
              fullscreen.active ? t("reading.exitFullscreen") : t("reading.enterFullscreen")
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
              name={fullscreen.active ? FILTER_ICONS.exitFullscreen : FILTER_ICONS.enterFullscreen}
              size={18}
              tintColor={fullscreen.active ? colors.accent : colors.mutedForeground}
            />
          </PressableScale>
        ) : null}
      </View>
      <ReadingProgressBar
        progress={progress}
        accessibilityLabel={progressLabel ?? t("reading.readingProgress")}
      />
    </Animated.View>
  );
}

/** Back-to-top / fullscreen row for the large-screen side pane. */
export function ScriptureReaderChrome({
  toolbarVisible,
  onBackToTop,
}: {
  toolbarVisible: boolean;
  onBackToTop: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const fullscreen = useReadingFullscreen({ exitOnBlur: true });
  const tv = isTV();

  return (
    <View style={styles.readerChromeRow}>
      {/* TV: hidden — scrolling to top strands D-pad focus off-screen. */}
      {toolbarVisible && !tv ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("reading.backToTop")}
          onPress={onBackToTop}
          scaleTo={0.97}
          style={[styles.readerChromeBtn, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText weight="semibold" type="caption" style={{ color: colors.accentText }}>
            {t("reading.backToTop")}
          </ThemedText>
        </PressableScale>
      ) : null}
      {fullscreen.supported ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={
            fullscreen.active ? t("reading.exitFullscreen") : t("reading.enterFullscreen")
          }
          accessibilityState={{ selected: fullscreen.active }}
          onPress={() => void fullscreen.toggle()}
          scaleTo={0.97}
          style={[
            styles.readerChromeBtn,
            {
              backgroundColor: fullscreen.active ? tokens.accentSoft : colors.muted,
              borderColor: fullscreen.active ? colors.accent : "transparent",
              borderWidth: BorderWidth.thin,
            },
          ]}
        >
          <SymbolView
            name={fullscreen.active ? FILTER_ICONS.exitFullscreen : FILTER_ICONS.enterFullscreen}
            size={16}
            tintColor={fullscreen.active ? colors.accent : colors.mutedForeground}
          />
          <ThemedText
            weight="semibold"
            type="caption"
            style={{
              color: fullscreen.active ? colors.accentText : colors.mutedForeground,
            }}
          >
            {fullscreen.active ? t("reading.exitFullscreen") : t("reading.enterFullscreen")}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  filtersCard: { gap: Spacing.two },
  filtersCardTv: { gap: Spacing.three },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    minHeight: 44,
  },
  controlRowTv: {
    minHeight: TvLayout.minFocusTarget,
  },
  controlRowStackTv: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  translationRow: {
    alignItems: "center",
  },
  controlValue: {
    flexShrink: 0,
  },
  controlValueTv: {
    width: "100%",
    flexShrink: 1,
  },
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

  fontChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  readerChromeRow: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingStart: Spacing.four,
  },
  readerChromeBtn: {
    flex: 1,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.oneHalf,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
