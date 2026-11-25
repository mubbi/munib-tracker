import { RAWATIB_POSITION } from "@munib-tracker/shared/constants";
import type { PrayerStatus, RawatibId, RawatibPreset } from "@munib-tracker/shared/types";
import { hasRakahChoice, rakahsForLog } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Opacity, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { isRawatibExtra, rawatibChipKey } from "@/lib/rawatib";

const CHECK = { ios: "checkmark", android: "check", web: "check" } as const;
const PLUS = { ios: "plus", android: "add", web: "add" } as const;
/** Chips are full 44pt targets (B-82) — web ignores `hitSlop`, so no visual shortcut. */
const CHIP_HEIGHT = Control.md;

export type RawatibChipRowProps = {
  ids: readonly RawatibId[];
  status: Record<string, PrayerStatus | undefined>;
  rakahs: Record<string, number | undefined>;
  preset: RawatibPreset;
  /** Rows to show dimmed with a "usually after the fard" hint (still loggable). */
  beforeFardIds?: ReadonlySet<RawatibId>;
  /** Rows logged after their usual time (the Fajr sunnah after sunrise). */
  late?: Record<string, boolean | undefined>;
  onToggle: (id: RawatibId, completed: boolean) => void;
  /**
   * Opens the 2 | 4 rak'at sheet for a variable row: a visible "2 or 4" button
   * beside the chip on every platform (P5-08), plus long-press and a
   * screen-reader action on touch as shortcuts.
   */
  onChooseRakahs?: (id: RawatibId) => void;
  testID?: string;
};

/**
 * Chip row (`[2 before] [2 after]`) under a fard row (NF-3.1). One tap toggles
 * completed ↔ not logged; a variable row has a visible "2 or 4" button (and
 * long-press on touch). A late log shows "made up".
 */
export function RawatibChipRow({
  ids,
  status,
  rakahs,
  preset,
  beforeFardIds,
  late,
  onToggle,
  onChooseRakahs,
  testID,
}: RawatibChipRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  if (ids.length === 0) return null;

  return (
    <View style={styles.row} testID={testID}>
      {ids.map((id) => {
        const done = status[id] === "completed";
        const count = rakahsForLog({ rakahs: rakahs[id] }, id, preset);
        const label = t(rawatibChipKey(RAWATIB_POSITION[id]), { count });
        const name = t(`prayers.${id}`);
        const dim = !done && beforeFardIds?.has(id);
        const choosable = onChooseRakahs != null && hasRakahChoice(id);
        // The "2 or 4" choice is always visible; long-press stays a touch shortcut.
        const chooseButton = choosable;
        // Long-press is a touch convention only (not D-pad, not mouse).
        const canChoose = choosable && !tv && Platform.OS !== "web";
        const isLate = done && late?.[id] === true;
        const tint = done ? tokens.status.success.onSoft : colors.mutedForeground;
        return (
          <View key={id} style={styles.item}>
            <PressableScale
              testID={`rawatib-chip-${id}`}
              haptic={done ? "light" : "success"}
              scaleTo={0.95}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={
                isLate
                  ? `${t("rawatib.chip.a11y", { name, count })}, ${t("rawatib.chip.late")}`
                  : t("rawatib.chip.a11y", { name, count })
              }
              accessibilityHint={
                canChoose
                  ? t("rawatib.chip.a11yHintRakahs")
                  : dim
                    ? t("rawatib.chip.beforeFardHint")
                    : undefined
              }
              onPress={() => onToggle(id, !done)}
              onLongPress={canChoose ? () => onChooseRakahs?.(id) : undefined}
              accessibilityActions={
                canChoose
                  ? [{ name: "longpress", label: t("rawatib.chip.chooseRakahsA11y", { name }) }]
                  : undefined
              }
              onAccessibilityAction={
                canChoose
                  ? (event) => {
                      if (event.nativeEvent.actionName === "longpress") onChooseRakahs?.(id);
                    }
                  : undefined
              }
              style={[
                styles.chip,
                tv ? styles.chipTv : null,
                {
                  backgroundColor: done ? tokens.status.success.soft : colors.muted,
                  borderColor: done ? tokens.status.success.border : colors.border,
                  opacity: dim ? Opacity.disabled + 0.1 : 1,
                },
              ]}
            >
              <SymbolView name={done ? CHECK : PLUS} size={IconSize.xs} tintColor={tint} />
              <ThemedText
                type="caption"
                style={{ color: done ? tokens.status.success.onSoft : colors.foreground }}
              >
                {label}
              </ThemedText>
              {isRawatibExtra(id) ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("rawatib.chip.extra")}
                </ThemedText>
              ) : null}
              {isLate ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("rawatib.chip.late")}
                </ThemedText>
              ) : null}
            </PressableScale>
            {chooseButton ? (
              <PressableScale
                testID={`rawatib-rakahs-${id}`}
                haptic="selection"
                scaleTo={0.95}
                accessibilityRole="button"
                accessibilityLabel={t("rawatib.chip.chooseRakahsA11y", { name })}
                onPress={() => onChooseRakahs?.(id)}
                style={[
                  styles.chip,
                  tv ? styles.chipTv : null,
                  { backgroundColor: colors.muted, borderColor: colors.border },
                ]}
              >
                <ThemedText type="caption" style={{ color: colors.foreground }}>
                  {t("rawatib.chip.chooseRakahs")}
                </ThemedText>
              </PressableScale>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    paddingStart: Spacing.three,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.hairline,
    minHeight: CHIP_HEIGHT,
  },
  chipTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.three,
  },
});
