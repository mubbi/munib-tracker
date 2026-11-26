import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton } from "@/components/ui/icon-button";
import { SortableList } from "@/components/ui/sortable";
import { BorderWidth, Control, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { type ToastContextValue, useToast } from "@/providers/toast-provider";

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

/**
 * Writes a reordered *visible* list back into a stored order that may also hold
 * ids this device cannot show (TV-hidden tiles, finance tools off): the visible
 * ids take the new order and the unavailable ones keep their place at the end.
 */
export function mergeVisibleOrder(
  stored: readonly string[],
  nextVisible: readonly string[],
  available: readonly string[],
): string[] {
  const availableSet = new Set(available);
  return [...nextVisible, ...stored.filter((id) => !availableSet.has(id))];
}

/**
 * The toast host when one is mounted. The editor also renders inside sheets and
 * tests without a `ToastProvider`; there the remove simply has no Undo toast.
 * (`useToast` always runs its `useContext` first, so the hook order is stable.)
 */
function useToastIfMounted(): ToastContextValue | null {
  try {
    // biome-ignore lint/correctness/useHookAtTopLevel: always called, in the same order; only its throw is caught
    return useToast();
  } catch {
    return null;
  }
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
   * Every id that can be shown. Ids not in `order` are listed under "Hidden"
   * with an inline add button — only when `removable`.
   */
  allIds: readonly string[];
  labelFor: (id: string) => string;
  iconFor?: (id: string) => { icon: AppIconType; tint: string } | undefined;
  onChange: (next: string[]) => void;
  /** Rows can be hidden / re-added (quick actions). Ordering-only lists (Library sections) omit it. */
  removable?: boolean;
  testID?: string;
};

const MINUS = { ios: "minus.circle.fill", android: "remove_circle", web: "remove_circle" } as const;
const PLUS = { ios: "plus.circle.fill", android: "add_circle", web: "add_circle" } as const;

/**
 * Reorderable list shared by the home Explore shortcuts, the Library order (D13)
 * and the Sunnah habits list. Phones and web: slim grouped rows (~52pt, hairline
 * dividers) with a trailing drag handle (≡) — drag to move, or use the row's
 * "Move up / down" accessibility actions, or focus the handle and press ↑ / ↓ on
 * web — and, when `removable`, an inline red "−" (with an Undo toast) plus a
 * "Hidden" group with inline "+". TV keeps one Up / Down / Remove button per row
 * (one D-pad Select per move).
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
  const toast = useToastIfMounted();
  const hiddenItems = removable ? allIds.filter((id) => !order.includes(id)) : [];
  const tv = isTV();

  const remove = (id: string) => {
    const previous = [...order];
    onChange(toggleItem(order, id, false));
    toast?.show(t("settings.reorder.removed", { item: labelFor(id) }), {
      type: "info",
      action: { label: t("common.undo"), onPress: () => onChange(previous) },
    });
  };

  const hiddenGroup =
    hiddenItems.length > 0 ? (
      <>
        <ThemedText type="smallBold" style={styles.hiddenHeader}>
          {tv ? t("homeCustomize.available") : t("settings.reorder.hidden")}
        </ThemedText>
        <View
          style={
            tv ? styles.rowsTv : [styles.group, { backgroundColor: colors.muted }, styles.gapTop]
          }
        >
          {hiddenItems.map((id, index) => {
            const iconMeta = iconFor?.(id);
            const label = labelFor(id);
            return (
              <View
                key={id}
                style={[
                  tv ? [styles.rowTvCard, { backgroundColor: colors.muted }] : styles.row,
                  !tv && index > 0 && [styles.divided, { borderTopColor: tokens.hairline }],
                ]}
              >
                {iconMeta ? <RowIcon icon={iconMeta.icon} tint={iconMeta.tint} /> : null}
                <ThemedText
                  type="small"
                  themeColor="mutedForeground"
                  style={styles.rowLabel}
                  numberOfLines={tv ? 1 : undefined}
                >
                  {label}
                </ThemedText>
                <IconButton
                  name={PLUS}
                  size={tv ? 18 : 22}
                  tintColor={colors.accentText}
                  accessibilityLabel={`${t("homeCustomize.add")}: ${label}`}
                  onPress={() => onChange(toggleItem(order, id, true))}
                />
              </View>
            );
          })}
        </View>
      </>
    ) : null;

  if (tv) {
    return (
      <View testID={testID}>
        <TvRows
          order={order}
          labelFor={labelFor}
          iconFor={iconFor}
          onChange={onChange}
          removable={removable}
        />
        {hiddenGroup}
      </View>
    );
  }

  return (
    <View testID={testID}>
      {order.length > 0 ? (
        <View style={[styles.group, styles.gapTop, { backgroundColor: colors.muted }]}>
          <SortableList
            ids={order}
            onReorder={onChange}
            itemLabel={labelFor}
            onRemove={removable ? remove : undefined}
            renderItem={(id, info) => {
              const iconMeta = iconFor?.(id);
              const label = labelFor(id);
              return (
                <View
                  // One screen-reader element per row: its name plus the move /
                  // remove actions (the handle and "−" stay visual on native).
                  accessible={Platform.OS !== "web"}
                  accessibilityLabel={label}
                  {...info.accessibility}
                  style={[
                    styles.row,
                    info.index > 0 && [styles.divided, { borderTopColor: tokens.hairline }],
                    info.active && [styles.rowActive, { backgroundColor: colors.card }],
                  ]}
                >
                  {iconMeta ? <RowIcon icon={iconMeta.icon} tint={iconMeta.tint} /> : null}
                  <ThemedText type="small" style={styles.rowLabel}>
                    {label}
                  </ThemedText>
                  {removable ? (
                    <IconButton
                      name={MINUS}
                      size={22}
                      tintColor={tokens.status.danger.text}
                      accessibilityLabel={`${t("homeCustomize.remove")}: ${label}`}
                      onPress={() => remove(id)}
                    />
                  ) : null}
                  {info.handle}
                </View>
              );
            }}
          />
        </View>
      ) : null}
      {hiddenGroup}
    </View>
  );
}

/** TV: today's inline Up / Down / Remove buttons per row (one D-pad Select per move). */
function TvRows({
  order,
  labelFor,
  iconFor,
  onChange,
  removable,
}: Pick<OrderedListEditorProps, "order" | "labelFor" | "iconFor" | "onChange" | "removable">) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  /**
   * Never disable the focused Up/Down control at the list edge — a disabled
   * Pressable drops D-pad focus and the engine jumps elsewhere. Dim it instead;
   * `moveItem` already ignores out-of-range moves.
   */
  const edgeProps = (atEdge: boolean) => ({
    accessibilityState: { disabled: atEdge },
    style: atEdge ? styles.edgeDimmedTv : undefined,
  });
  return (
    <View style={styles.rowsTv}>
      {order.map((id, index) => {
        const iconMeta = iconFor?.(id);
        const label = labelFor(id);
        return (
          <View key={id} style={[styles.rowTvCard, { backgroundColor: colors.muted }]}>
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
                name={MINUS}
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
  );
}

const styles = StyleSheet.create({
  gapTop: { marginTop: Spacing.three },
  hiddenHeader: { marginTop: Spacing.four },
  /** Grouped list: one muted surface, rows separated by hairlines. */
  group: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: Control.row,
    paddingVertical: Spacing.one,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.one,
  },
  divided: { borderTopWidth: BorderWidth.hairline },
  rowActive: { borderRadius: Radius.md, borderCurve: "continuous" },
  rowLabel: { flex: 1, minWidth: 0 },
  rowsTv: { gap: Spacing.two, marginTop: Spacing.three },
  rowTvCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: TvLayout.minFocusTarget,
    padding: Spacing.twoHalf,
    paddingStart: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  edgeDimmedTv: { opacity: 0.35 },
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
});
