import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isRTL, mushafPageBackward, mushafPageForward } from "@/lib/rtl";

/** Stack the footer on two rows below this width so nav labels and page chip fit. */
const COMPACT_FOOTER_WIDTH = 420;

type PageReaderFooterProps = {
  currentPage: number;
  totalPages: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onOpenPage: () => void;
};

/** Bottom chrome for the Qur'an page / mushaf reader — RTL page turns, page picker, play. */
export function PageReaderFooter({
  currentPage,
  totalPages,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onPlay,
  onOpenPage,
}: PageReaderFooterProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const layoutRtl = isRTL();
  const compact = width < COMPACT_FOOTER_WIDTH;
  const pageLabel = compact
    ? t("quran.pageFraction", { page: currentPage, total: totalPages })
    : t("quran.pageOf", { page: currentPage, total: totalPages });

  const nextButton = (
    <PageNavButton
      icon={mushafPageForward()}
      label={t("common.next")}
      accessibilityLabel={t("quran.nextPage")}
      disabled={!canGoNext}
      onPress={onNext}
      iconFirst
      expanded={compact}
      showLabel
    />
  );
  const prevButton = (
    <PageNavButton
      icon={mushafPageBackward()}
      label={t("common.previous")}
      accessibilityLabel={t("quran.prevPage")}
      disabled={!canGoPrev}
      onPress={onPrev}
      iconFirst={false}
      expanded={compact}
      showLabel
    />
  );
  const pagePicker = (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={t("quran.pagePickerTitle")}
      onPress={onOpenPage}
      style={[
        styles.pageChip,
        { backgroundColor: colors.muted },
        compact && styles.pageChipCompact,
      ]}
    >
      <SymbolView
        name={{ ios: "book.pages", android: "menu_book", web: "menu_book" }}
        size={16}
        tintColor={colors.accent}
      />
      <ThemedText type="smallBold" numberOfLines={1} style={styles.pageLabel}>
        {pageLabel}
      </ThemedText>
      <SymbolView
        name={{
          ios: "chevron.down",
          android: "keyboard_arrow_down",
          web: "keyboard_arrow_down",
        }}
        size={12}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
  const playButton = (
    <IconButton
      name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
      accessibilityLabel={t("quran.playPage")}
      onPress={onPlay}
      background={colors.accent}
      tintColor={colors.accentForeground}
      hitTarget={compact ? 44 : 48}
      style={styles.playBtn}
    />
  );

  return (
    <View
      style={[
        styles.shell,
        {
          borderTopColor: tokens.hairline,
          paddingBottom: Math.max(insets.bottom, Spacing.two),
        },
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
      {compact ? (
        <View style={styles.compactLayout}>
          <View style={styles.centerRow}>
            {pagePicker}
            {playButton}
          </View>
          <View style={styles.navRow}>
            {layoutRtl ? (
              <>
                {prevButton}
                {nextButton}
              </>
            ) : (
              <>
                {nextButton}
                {prevButton}
              </>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          {layoutRtl ? (
            <>
              {prevButton}
              <View style={styles.center}>
                {pagePicker}
                {playButton}
              </View>
              {nextButton}
            </>
          ) : (
            <>
              {nextButton}
              <View style={styles.center}>
                {pagePicker}
                {playButton}
              </View>
              {prevButton}
            </>
          )}
        </View>
      )}
    </View>
  );
}

function PageNavButton({
  icon,
  label,
  accessibilityLabel,
  disabled,
  onPress,
  iconFirst,
  expanded = false,
  showLabel = true,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
  /** When true the chevron leads the label (forward / start side); when false it trails (back / end side). */
  iconFirst: boolean;
  /** Stretch to share a row evenly (compact nav row). */
  expanded?: boolean;
  showLabel?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const layoutRtl = isRTL();
  const contentDirection = iconFirst && layoutRtl ? "row-reverse" : "row";

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.navBtn,
        expanded ? styles.navBtnExpanded : styles.navBtnCompact,
        {
          backgroundColor: tokens.accentSoft,
          opacity: disabled ? 0.45 : 1,
          flexDirection: contentDirection,
        },
      ]}
    >
      {iconFirst ? (
        <>
          <SymbolView name={icon} size={18} tintColor={colors.accent} />
          {showLabel ? (
            <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accent }}>
              {label}
            </ThemedText>
          ) : null}
        </>
      ) : (
        <>
          {showLabel ? (
            <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accent }}>
              {label}
            </ThemedText>
          ) : null}
          <SymbolView name={icon} size={18} tintColor={colors.accent} />
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  compactLayout: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  navBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one + 2,
    minHeight: 44,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  navBtnCompact: {
    minWidth: 44,
    paddingHorizontal: Spacing.two,
    flexShrink: 0,
  },
  navBtnExpanded: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minWidth: 0,
  },
  pageChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minWidth: 0,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  pageChipCompact: {
    paddingHorizontal: Spacing.two,
  },
  pageLabel: {
    flexShrink: 1,
  },
  playBtn: {
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    flexShrink: 0,
  },
});
