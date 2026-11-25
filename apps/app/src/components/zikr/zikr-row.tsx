import type { ZikrItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { zikrTarget } from "@/lib/zikr-count-key";

const CHEVRON_SIZE = 14;
const FAVORITE_SIZE = 18;
const FAVORITE_HIT = 44;
const ROW_GAP = Spacing.twoHalf;

type ZikrRowProps = {
  item: ZikrItem;
  /** 1-based position in the source list (category, favorites order, etc.). */
  index?: number;
  isFavorite?: boolean;
  /** Stable id-taking handlers so memoized rows keep their prop identity. */
  onPress: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  /** Opens the zikr detail (info icon); the row itself opens the guided session. */
  onInfo?: (id: string) => void;
  /** Optional category pill shown in cross-category search results. */
  categoryLabel?: string;
  /** Today's completion for the active prayer scope. */
  completed?: boolean;
  /** e.g. "3/5" when tracking across multiple salah slots. */
  progressLabel?: string;
  /** TV: initial D-pad focus (first row of a list). No-op on phone/web. */
  preferredFocus?: boolean;
  /** Repetitions in this context (e.g. the Quls ×3 after Fajr); defaults to the item's own. */
  target?: number;
  /** Weak-chain zikr — shown with an "Optional" badge, never required. */
  optional?: boolean;
};

export const ZikrRow = memo(function ZikrRow({
  item,
  index,
  isFavorite,
  onPress,
  onToggleFavorite,
  onInfo,
  categoryLabel,
  completed,
  progressLabel,
  preferredFocus,
  target: targetOverride,
  optional,
}: ZikrRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const tv = isTV();

  const handlePress = useCallback(() => onPress(item.id), [item.id, onPress]);
  const handleToggleFavorite = useCallback(
    () => onToggleFavorite?.(item.id),
    [item.id, onToggleFavorite],
  );

  const handleInfo = useCallback(() => onInfo?.(item.id), [item.id, onInfo]);
  // Phone / web: trailing controls overlay the row (one 44pt slot each, end-most first).
  const trailing = tv ? 0 : (onToggleFavorite ? 1 : 0) + (onInfo ? 1 : 0);

  const target = targetOverride ?? zikrTarget(item);
  const statusLabel = completed
    ? (progressLabel ?? t("zikr.done"))
    : (progressLabel ?? t("zikrSession.timesLabel", { times: target }));
  const accessibilityLabel = [
    index != null ? `${index}. ${item.title}` : item.title,
    statusLabel,
    optional ? t("zikrSession.optional") : undefined,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    // The favorite toggle is rendered as a sibling overlay rather than nested
    // inside the row's Pressable — on web, nesting a <button> inside another
    // <button> is invalid HTML and triggers a DOM-nesting warning.
    //
    // TV: the star sits *beside* the row (flex sibling), not over it — a D-pad
    // focus search can't move "right" into a control inside the row's bounds.
    <View style={[styles.wrapper, tv ? styles.wrapperTv : styles.fill]}>
      <PressableScale
        haptic="light"
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[
          styles.row,
          tv ? styles.rowTv : styles.fill,
          { backgroundColor: colors.muted, borderColor: tokens.hairline },
        ]}
      >
        {index != null ? <ListIndexBadge index={index} completed={completed} /> : null}

        <View style={styles.body}>
          <ThemedText type="small">{item.title}</ThemedText>
          {item.transliteration ? (
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
              {item.transliteration}
            </ThemedText>
          ) : null}

          {completed || progressLabel || target || categoryLabel ? (
            <View style={styles.badges}>
              {completed ? (
                <Pill
                  compact
                  label={progressLabel ?? t("zikr.done")}
                  color={tokens.status.success.color}
                  background={tokens.status.success.soft}
                  icon={{ ios: "checkmark", android: "check", web: "check" }}
                  style={styles.badge}
                />
              ) : progressLabel ? (
                <Pill
                  compact
                  label={progressLabel}
                  color={colors.accent}
                  background={tokens.accentSoft}
                  style={styles.badge}
                />
              ) : target ? (
                <Pill
                  compact
                  label={target > 1 ? `×${target}` : t("zikrSession.once")}
                  color={colors.accent}
                  background={tokens.accentSoft}
                  style={styles.badge}
                />
              ) : null}

              {optional && !completed ? (
                <Pill
                  compact
                  label={t("zikrSession.optional")}
                  color={tokens.status.warning.color}
                  background={tokens.status.warning.soft}
                  style={styles.badge}
                />
              ) : null}

              {categoryLabel ? (
                <Pill
                  compact
                  label={categoryLabel}
                  color={colors.mutedForeground}
                  background={colors.card}
                  style={styles.badge}
                />
              ) : null}
            </View>
          ) : null}
        </View>

        {trailing > 0 ? <View style={{ width: trailing * FAVORITE_HIT }} /> : null}

        <SymbolView name={chevronForward} size={CHEVRON_SIZE} tintColor={colors.mutedForeground} />
      </PressableScale>

      {onInfo ? (
        <IconButton
          name={{ ios: "info.circle", android: "info", web: "info" }}
          size={FAVORITE_SIZE}
          tintColor={colors.mutedForeground}
          accessibilityLabel={`${t("zikrSession.details")}: ${item.title}`}
          haptic="selection"
          onPress={handleInfo}
          hitTarget={tv ? TvLayout.minFocusTargetDp : FAVORITE_HIT}
          background={tv ? colors.muted : undefined}
          style={tv ? undefined : [styles.trailingButton, styles.infoButton]}
        />
      ) : null}

      {onToggleFavorite ? (
        <IconButton
          name={
            isFavorite
              ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
              : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
          }
          size={FAVORITE_SIZE}
          tintColor={isFavorite ? colors.accent : colors.mutedForeground}
          accessibilityLabel={isFavorite ? t("zikr.removeFavorite") : t("zikr.favorite")}
          accessibilityState={{ selected: isFavorite }}
          haptic="selection"
          onPress={handleToggleFavorite}
          hitTarget={tv ? TvLayout.minFocusTargetDp : FAVORITE_HIT}
          background={tv ? colors.muted : undefined}
          style={
            tv
              ? undefined
              : [styles.trailingButton, onInfo ? styles.favoriteWithInfo : styles.infoButton]
          }
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  /** Equal-height cells when rows sit side by side in a multi-column grid. */
  fill: { flexGrow: 1 },
  wrapperTv: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  // Horizontal padding stays put — the favorite button's absolute `end` offset
  // below is computed against it. Only height/vertical padding grow for TV.
  rowTv: {
    flex: 1,
    minWidth: 0,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    borderRadius: Radius.lg,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.half,
  },
  badge: {
    alignSelf: "flex-start",
  },
  trailingButton: {
    position: "absolute",
    // Center over the row: PressableScale keeps the glyph on an inner view that
    // does not stretch when top/bottom are set, so pin to mid-height instead.
    top: "50%",
    marginTop: -(FAVORITE_HIT / 2),
  },
  // The end-most 44pt slot sits just start-ward of the chevron; a second one stacks beside it.
  infoButton: { end: Spacing.three + CHEVRON_SIZE + ROW_GAP },
  favoriteWithInfo: { end: Spacing.three + CHEVRON_SIZE + ROW_GAP + FAVORITE_HIT },
});
