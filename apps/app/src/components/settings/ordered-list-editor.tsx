import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton } from "@/components/ui/icon-button";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

/** Swap `order[index]` with its neighbour (`-1` up, `+1` down). Out-of-range moves are no-ops. */
export function moveItem<T>(order: readonly T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= order.length || target < 0 || target >= order.length) {
    return [...order];
  }
  const next = [...order];
  [next[index], next[target]] = [next[target] as T, next[index] as T];
  return next;
}

/** Show (`on`) or hide an id: hidden ids are removed, re-shown ids go to the end. */
export function toggleItem(order: readonly string[], id: string, on: boolean): string[] {
  if (on) return order.includes(id) ? [...order] : [...order, id];
  return order.filter((x) => x !== id);
}

function RowIcon({ tint, icon }: { tint: string; icon: AppIconType }) {
  const { tokens } = useThemeTokens();
  return (
    <View
      style={[
        styles.iconWell,
        {
          backgroundColor: withAlpha(tint, tokens.isDark ? 0.2 : 0.12),
          borderColor: withAlpha(tint, tokens.isDark ? 0.34 : 0.22),
        },
      ]}
    >
      <AppIcon icon={icon} size={18} tintColor={tint} />
    </View>
  );
}

export type OrderedListEditorProps = {
  /** Visible ids, in display order. */
  order: readonly string[];
  /**
   * Every id that can be shown. Ids not in `order` are listed under
   * "Available" with an Add button — only when `removable`.
   */
  allIds: readonly string[];
  labelFor: (id: string) => string;
  iconFor?: (id: string) => { icon: AppIconType; tint: string } | undefined;
  onChange: (next: string[]) => void;
  /** Rows can be hidden / re-added (quick actions). Ordering-only lists (Library sections) omit it. */
  removable?: boolean;
  testID?: string;
};

/**
 * Up/down list editor shared by the home quick actions and the Library order
 * (D13), generalised from the quick-actions editor. Each move is one tap or one
 * D-pad Select, so it works the same with touch, keyboard and TV remotes.
 */
export function OrderedListEditor({
  order,
  allIds,
  labelFor,
  iconFor,
  onChange,
  removable = false,
  testID,
}: OrderedListEditorProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const hiddenItems = removable ? allIds.filter((id) => !order.includes(id)) : [];
  const tv = isTV();
  /**
   * TV: never disable the focused Up/Down control at the list edge — a disabled
   * Pressable drops D-pad focus and the engine jumps elsewhere. Dim it instead;
   * `moveItem` already ignores out-of-range moves.
   */
  const edgeProps = (atEdge: boolean) =>
    tv
      ? {
          accessibilityState: { disabled: atEdge },
          style: atEdge ? styles.edgeDimmedTv : undefined,
        }
      : { disabled: atEdge };

  return (
    <View testID={testID}>
      <View style={styles.rows}>
        {order.map((id, index) => {
          const iconMeta = iconFor?.(id);
          const label = labelFor(id);
          return (
            <View
              key={id}
              style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
            >
              {iconMeta ? <RowIcon icon={iconMeta.icon} tint={iconMeta.tint} /> : null}
              <ThemedText type="small" style={styles.rowLabel} numberOfLines={1}>
                {label}
              </ThemedText>
              <IconButton
                name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
                size={18}
                tintColor={colors.foreground}
                accessibilityLabel={`${t("zikr.moveUp")}: ${label}`}
                {...edgeProps(index === 0)}
                onPress={() => onChange(moveItem(order, index, -1))}
              />
              <IconButton
                name={{
                  ios: "chevron.down",
                  android: "keyboard_arrow_down",
                  web: "keyboard_arrow_down",
                }}
                size={18}
                tintColor={colors.foreground}
                accessibilityLabel={`${t("zikr.moveDown")}: ${label}`}
                {...edgeProps(index === order.length - 1)}
                onPress={() => onChange(moveItem(order, index, 1))}
              />
              {removable ? (
                <IconButton
                  name={{
                    ios: "minus.circle.fill",
                    android: "remove_circle",
                    web: "remove_circle",
                  }}
                  size={18}
                  tintColor={tokens.status.danger.color}
                  accessibilityLabel={`${t("homeCustomize.remove")}: ${label}`}
                  onPress={() => onChange(toggleItem(order, id, false))}
                />
              ) : null}
            </View>
          );
        })}
      </View>

      {hiddenItems.length > 0 ? (
        <>
          <ThemedText type="smallBold" style={styles.hiddenHeader}>
            {t("homeCustomize.available")}
          </ThemedText>
          <View style={styles.rows}>
            {hiddenItems.map((id) => {
              const iconMeta = iconFor?.(id);
              const label = labelFor(id);
              return (
                <View
                  key={id}
                  style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
                >
                  {iconMeta ? <RowIcon icon={iconMeta.icon} tint={iconMeta.tint} /> : null}
                  <ThemedText
                    type="small"
                    themeColor="mutedForeground"
                    style={styles.rowLabel}
                    numberOfLines={1}
                  >
                    {label}
                  </ThemedText>
                  <IconButton
                    name={{ ios: "plus.circle.fill", android: "add_circle", web: "add_circle" }}
                    size={18}
                    tintColor={colors.accent}
                    accessibilityLabel={`${t("homeCustomize.add")}: ${label}`}
                    onPress={() => onChange(toggleItem(order, id, true))}
                  />
                </View>
              );
            })}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  hiddenHeader: { marginTop: Spacing.four },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    padding: Spacing.two + 2,
    paddingStart: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowLabel: { flex: 1 },
  rowTv: { minHeight: TvLayout.minFocusTarget, gap: Spacing.two },
  edgeDimmedTv: { opacity: 0.35 },
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
