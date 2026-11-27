import type { DurudItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { duroodGradeClass } from "@/components/duroods/durood-browse";
import { SurahNumberMedallion } from "@/components/quran/surah-number-medallion";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

const CHEVRON_SIZE = 14;
const ICON_SIZE = 18;
const SLOT = 44;
const ROW_GAP = Spacing.twoHalf;
// Arabic is exempt from ThemedText's TV ramp, so size it for 10-ft viewing here.
// Full card width now (no longer squeezed by the actions), so it can read larger.
const PREVIEW_ARABIC_SIZE = isTV() ? tvDp(26) : 21;
const PREVIEW_ARABIC_LINE = Math.round(PREVIEW_ARABIC_SIZE * 1.85);

const PLAY = { ios: "play.circle", android: "play_circle", web: "play_circle" } as const;
const PAUSE = { ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" } as const;
const INFO = { ios: "info.circle", android: "info", web: "info" } as const;
const SAVED = { ios: "bookmark.fill", android: "bookmark", web: "bookmark" } as const;
const UNSAVED = { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" } as const;

type DuroodRowProps = {
  item: DurudItem;
  /** 1-based position in its section. */
  index?: number;
  /** Meaning in the reader's translation locale (resolved by the list). */
  translation: string;
  /**
   * Second line under the Arabic — the transliteration or the meaning, as the
   * reader's display settings allow (resolved by the list). Omit to hide it.
   */
  preview?: string;
  isFavorite?: boolean;
  /** Stable id-taking handlers so memoized rows keep their prop identity. */
  onOpen: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  /** Opens the reader on the source hadith (citation, grade, full narration). */
  onInfo?: (id: string) => void;
  /** Play / pause its recorded recitation — pass only when it has one. */
  onPlay?: (id: string) => void;
  playing?: boolean;
  /** TV: initial D-pad focus (first row of the list). No-op on phone/web. */
  preferredFocus?: boolean;
};

/**
 * One durood in the browse list: number, title, the Arabic opening, the
 * transliteration (or meaning), its grade, and trailing Play · Save · Info.
 * The trailing controls are siblings of the row's pressable (a <button> inside
 * a <button> is invalid HTML on web); on TV they sit beside the row so D-pad
 * "right" can reach them.
 */
export const DuroodRow = memo(function DuroodRow({
  item,
  index,
  translation,
  preview,
  isFavorite = false,
  onOpen,
  onToggleFavorite,
  onInfo,
  onPlay,
  playing = false,
  preferredFocus,
}: DuroodRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const tv = isTV();

  const handleOpen = useCallback(() => onOpen(item.id), [item.id, onOpen]);
  const handleFavorite = useCallback(
    () => onToggleFavorite?.(item.id),
    [item.id, onToggleFavorite],
  );
  const handleInfo = useCallback(() => onInfo?.(item.id), [item.id, onInfo]);
  const handlePlay = useCallback(() => onPlay?.(item.id), [item.id, onPlay]);

  // Phone / web: the actions sit in the card's footer row (one 44pt slot each,
  // end-most first: info, save, play), overlaid on a spacer inside the card.
  const slotCount = (onInfo ? 1 : 0) + (onToggleFavorite ? 1 : 0) + (onPlay ? 1 : 0);
  const infoSlot = 0;
  const favoriteSlot = onInfo ? 1 : 0;
  const playSlot = favoriteSlot + (onToggleFavorite ? 1 : 0);
  const slotStyle = (slot: number) =>
    tv ? undefined : [styles.footerButton, { end: Spacing.two + slot * SLOT }];

  const gradeClass = duroodGradeClass(item.grade);
  const gradeLabel = gradeClass ? t(`duroods.grade.${gradeClass}`) : null;
  const accessibilityLabel = [
    index != null ? `${index}. ${item.title}` : item.title,
    gradeLabel,
    translation,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <View style={[styles.wrapper, tv ? styles.wrapperTv : styles.fill]}>
      <PressableScale
        haptic="light"
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[
          styles.row,
          tv ? styles.rowTv : styles.fill,
          { backgroundColor: colors.muted, borderColor: tokens.hairline },
        ]}
      >
        {/* Header: number star · title + grade · chevron. */}
        <View style={styles.header}>
          {index != null ? <SurahNumberMedallion number={index} size={36} /> : null}
          <View style={styles.titleBlock}>
            <ThemedText type="smallBold" numberOfLines={2} style={styles.title}>
              {item.title}
            </ThemedText>
            {gradeLabel ? (
              <Pill
                compact
                label={gradeLabel}
                color={tokens.status.success.color}
                background={tokens.status.success.soft}
              />
            ) : null}
          </View>
          <SymbolView
            name={chevronForward}
            size={CHEVRON_SIZE}
            tintColor={colors.mutedForeground}
          />
        </View>

        {/* The Arabic across the full card width — the reading focus of the card. */}
        <ThemedText
          type="arabic"
          accessibilityLanguage="ar"
          numberOfLines={2}
          style={[styles.arabicPreview, { color: colors.foreground }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {item.arabic}
        </ThemedText>
        {preview ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {preview}
          </ThemedText>
        ) : null}

        {/* Footer spacer: the action buttons (siblings, see below) overlay it. */}
        {!tv && slotCount > 0 ? (
          <View style={[styles.footer, { borderTopColor: tokens.hairline }]} />
        ) : null}
      </PressableScale>

      {onInfo ? (
        <IconButton
          name={INFO}
          size={ICON_SIZE}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("duroods.sourceInfo", { title: item.title })}
          haptic="selection"
          onPress={handleInfo}
          hitTarget={tv ? TvLayout.minFocusTargetDp : SLOT}
          background={tv ? colors.muted : undefined}
          style={slotStyle(infoSlot)}
        />
      ) : null}

      {onToggleFavorite ? (
        <IconButton
          name={isFavorite ? SAVED : UNSAVED}
          size={ICON_SIZE}
          tintColor={isFavorite ? colors.accentText : colors.mutedForeground}
          accessibilityLabel={isFavorite ? t("duroods.unsave") : t("common.save")}
          accessibilityState={{ selected: isFavorite }}
          haptic="selection"
          onPress={handleFavorite}
          hitTarget={tv ? TvLayout.minFocusTargetDp : SLOT}
          background={tv ? colors.muted : undefined}
          style={slotStyle(favoriteSlot)}
        />
      ) : null}

      {onPlay ? (
        <IconButton
          name={playing ? PAUSE : PLAY}
          size={ICON_SIZE + 2}
          tintColor={playing ? colors.accent : colors.mutedForeground}
          accessibilityLabel={
            playing
              ? t("duroods.pause", { title: item.title })
              : t("duroods.play", { title: item.title })
          }
          accessibilityState={{ selected: playing }}
          haptic="selection"
          onPress={handlePlay}
          hitTarget={tv ? TvLayout.minFocusTargetDp : SLOT}
          background={tv ? colors.muted : undefined}
          style={slotStyle(playSlot)}
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  /** Equal-height cells when rows sit side by side in a multi-column grid. */
  fill: { flexGrow: 1 },
  wrapperTv: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  row: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  header: { flexDirection: "row", alignItems: "center", gap: ROW_GAP },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.oneHalf,
  },
  title: { flexShrink: 1 },
  rowTv: {
    flex: 1,
    minWidth: 0,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    borderRadius: Radius.lg,
  },
  arabicPreview: {
    fontSize: PREVIEW_ARABIC_SIZE,
    lineHeight: PREVIEW_ARABIC_LINE,
    writingDirection: "rtl",
    textAlign: "right",
  },
  // Grows so cards in one grid row align their footers at the bottom.
  footer: {
    marginTop: "auto",
    height: SLOT,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerButton: {
    position: "absolute",
    bottom: Spacing.two,
  },
});
