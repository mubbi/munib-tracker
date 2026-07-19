import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const REORDER_HIT = 36;
const REORDER_SIZE = 16;
const ACTION_SIZE = 18;

type FavoritesOrderRowProps = {
  /** 0-based position in the ordered list. */
  index: number;
  total: number;
  title: string;
  subtitle?: string | null;
  onPress: () => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  removeAccessibilityLabel: string;
};

/**
 * Reorderable favorites list row — index badge, tappable title body, vertical
 * up/down chevrons (so text keeps horizontal room), and an unfavorite control.
 */
export function FavoritesOrderRow({
  index,
  total,
  title,
  subtitle,
  onPress,
  onMove,
  onRemove,
  removeAccessibilityLabel,
}: FavoritesOrderRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const isFirst = index === 0;
  const isLast = index >= total - 1;

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.muted,
          borderColor: tokens.hairline,
        },
      ]}
    >
      <ListIndexBadge index={index + 1} />

      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={`${index + 1}. ${title}`}
        onPress={onPress}
        style={styles.body}
      >
        <ThemedText type="smallBold" numberOfLines={3}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {subtitle}
          </ThemedText>
        ) : null}
      </PressableScale>

      <View style={styles.actions}>
        <View style={styles.reorder}>
          <IconButton
            name={{
              ios: "chevron.up",
              android: "keyboard_arrow_up",
              web: "keyboard_arrow_up",
            }}
            size={REORDER_SIZE}
            hitTarget={REORDER_HIT}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("zikr.moveUp")}
            disabled={isFirst}
            onPress={() => onMove(-1)}
            style={styles.reorderBtn}
          />
          <IconButton
            name={{
              ios: "chevron.down",
              android: "keyboard_arrow_down",
              web: "keyboard_arrow_down",
            }}
            size={REORDER_SIZE}
            hitTarget={REORDER_HIT}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("zikr.moveDown")}
            disabled={isLast}
            onPress={() => onMove(1)}
            style={styles.reorderBtn}
          />
        </View>
        <IconButton
          name={{ ios: "star.fill", android: "star", web: "star" }}
          size={ACTION_SIZE}
          tintColor={tokens.status.warning.color}
          accessibilityLabel={removeAccessibilityLabel}
          haptic="warning"
          onPress={onRemove}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 76,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
    paddingEnd: Spacing.one,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: Spacing.half,
  },
  reorder: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  reorderBtn: {
    // Pull the 36pt hit targets together so the stack stays compact.
    marginVertical: -6,
  },
});
