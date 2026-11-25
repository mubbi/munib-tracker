import type { DuaItem } from "@munib-tracker/shared/types";
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
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatDuaHeading } from "@/lib/dua-browse";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

export type DuaListRowVariant =
  /** Heading + meaning — standalone duas, search results, recents. */
  | "titled"
  /** Arabic opening + meaning — rows under an occasion header (the heading is the header). */
  | "passage";

type DuaListRowProps = {
  item: DuaItem;
  /** Meaning in the user's translation locale (resolved by the parent list). */
  translation: string;
  variant?: DuaListRowVariant;
  /** Ordinal badge (position within its occasion). */
  index?: number;
  /** Trailing context pill, e.g. the category in cross-category results. */
  meta?: string;
  /** Omit both to render a row without the Save bookmark. */
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onOpen: (id: string) => void;
  /** TV: initial D-pad focus. No-op on phone/web. */
  preferredFocus?: boolean;
};

const CHEVRON_SIZE = 14;
const FAVORITE_SIZE = 18;
const FAVORITE_HIT = 44;
const ROW_GAP = Spacing.two;
// Arabic is exempt from ThemedText's TV ramp, so size it for 10-ft viewing here.
const PREVIEW_ARABIC_SIZE = isTV() ? tvDp(26) : 18;

/** One dua in a list. Memoized: rows only re-render when their own props change. */
export const DuaListRow = memo(function DuaListRow({
  item,
  translation,
  variant = "titled",
  index,
  meta,
  isFavorite,
  onToggleFavorite,
  onOpen,
  preferredFocus,
}: DuaListRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const tv = isTV();
  const heading = formatDuaHeading(item.title);
  const canFavorite = onToggleFavorite != null;

  const handleToggleFavorite = useCallback(
    () => onToggleFavorite?.(item.id),
    [onToggleFavorite, item.id],
  );
  const handleOpen = useCallback(() => onOpen(item.id), [onOpen, item.id]);
  const label = [index != null ? `${index}.` : null, heading, translation]
    .filter(Boolean)
    .join(" ");

  return (
    // The favorite toggle is a sibling overlay, not nested inside the row's
    // Pressable — a <button> inside a <button> is invalid HTML on web.
    // TV: the bookmark sits *beside* the row (flex sibling), so D-pad "right" reaches it.
    <View style={[styles.rowWrap, tv ? styles.rowWrapTv : styles.fill]}>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={handleOpen}
        {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[
          styles.row,
          tv ? styles.rowTv : styles.fill,
          { backgroundColor: colors.muted, borderColor: tokens.hairline },
        ]}
      >
        {index != null ? <ListIndexBadge index={index} /> : null}
        <View style={styles.body}>
          {variant === "passage" ? (
            <ThemedText
              type="arabic"
              accessibilityLanguage="ar"
              // Two lines: short duas show in full; a one-line cut put "…" on
              // complete duas and read as truncated content.
              numberOfLines={2}
              style={styles.arabicPreview}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {item.arabic}
            </ThemedText>
          ) : (
            <ThemedText type="smallBold" numberOfLines={2}>
              {heading}
            </ThemedText>
          )}
          <ThemedText
            type="caption"
            themeColor={variant === "passage" ? "foreground" : "mutedForeground"}
            numberOfLines={2}
          >
            {translation}
          </ThemedText>
          {meta ? (
            <Pill
              compact
              label={meta}
              color={colors.mutedForeground}
              background={colors.card}
              style={styles.meta}
            />
          ) : null}
        </View>
        {canFavorite && !tv ? <View style={styles.favoriteSlot} /> : null}
        <SymbolView
          name={chevronForwardIcon}
          size={CHEVRON_SIZE}
          tintColor={colors.mutedForeground}
        />
      </PressableScale>

      {canFavorite ? (
        <IconButton
          name={
            isFavorite
              ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
              : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
          }
          size={FAVORITE_SIZE}
          tintColor={isFavorite ? colors.accentText : colors.mutedForeground}
          accessibilityLabel={isFavorite ? t("dua.unfavorite") : t("dua.favorite")}
          accessibilityState={{ selected: Boolean(isFavorite) }}
          haptic="selection"
          onPress={handleToggleFavorite}
          hitTarget={tv ? TvLayout.minFocusTargetDp : FAVORITE_HIT}
          background={tv ? colors.muted : undefined}
          style={tv ? undefined : styles.favoriteButton}
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  rowWrap: { position: "relative" },
  /** Equal-height cells when rows sit side by side in a multi-column grid. */
  fill: { flexGrow: 1 },
  rowWrapTv: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  rowTv: {
    flex: 1,
    minWidth: 0,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    borderRadius: Radius.lg,
  },
  body: { flex: 1, minWidth: 0, gap: Spacing.one },
  arabicPreview: { fontSize: PREVIEW_ARABIC_SIZE, writingDirection: "rtl" },
  meta: { alignSelf: "flex-start", marginTop: Spacing.half },
  favoriteSlot: { width: FAVORITE_SIZE, height: FAVORITE_SIZE },
  favoriteButton: {
    position: "absolute",
    // PressableScale keeps the glyph on an inner view that does not stretch when
    // top/bottom are set, so pin to mid-height instead.
    top: "50%",
    marginTop: -(FAVORITE_HIT / 2),
    // Centre the 44pt target over the reserved slot (just start-ward of the chevron).
    end: Spacing.three + CHEVRON_SIZE + ROW_GAP + FAVORITE_SIZE / 2 - FAVORITE_HIT / 2,
  },
});
