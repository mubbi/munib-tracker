import { RAWATIB_POSITION } from "@munib-tracker/shared/constants";
import type { PrayerStatus, RawatibId, RawatibPreset } from "@munib-tracker/shared/types";
import { hasRakahChoice, rakahsForLog } from "@munib-tracker/shared/utils";
import { bestForeground } from "@munib-tracker/theme/color";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Springs } from "@/constants/motion";
import { BorderWidth, Control, IconSize, Opacity, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { isRawatibExtra, rawatibChipKey } from "@/lib/rawatib";

const CHECK = { ios: "checkmark", android: "check", web: "check" } as const;
const SUNNAH_ICON = { ios: "sparkle", android: "auto_awesome", web: "auto_awesome" } as const;
/** Chips are full 44pt targets (B-82) — web ignores `hitSlop`, so no visual shortcut. */
const CHIP_HEIGHT = Control.md;
/** Drawn check disc inside a chip (decorative — the chip carries the checkbox role). */
const DOT = 18;

/** Why a row is optional today (shown subtly on the row, spoken on each chip). */
export type RawatibOptionalReason = "travel" | "sick";

export type RawatibChipRowProps = {
  ids: readonly RawatibId[];
  status: Record<string, PrayerStatus | undefined>;
  rakahs: Record<string, number | undefined>;
  preset: RawatibPreset;
  /** After-rows whose fard isn't marked yet: a dashed outline + spoken hint (still loggable). */
  beforeFardIds?: ReadonlySet<RawatibId>;
  /** Today's rows whose time hasn't started: muted, still loggable. */
  futureIds?: ReadonlySet<RawatibId>;
  /** Rows logged after their usual time (the Fajr sunnah after sunrise). */
  late?: Record<string, boolean | undefined>;
  /** Rows that are optional today (travel / illness) and why. */
  optional?: { ids: ReadonlySet<RawatibId>; reason: RawatibOptionalReason };
  /** Leading row label ("Sunnah") when the row sits inside a Salah card. */
  label?: string;
  onToggle: (id: RawatibId, completed: boolean) => void;
  /**
   * Opens the 2 | 4 rakahs sheet for a variable row: a compact visible "2 or 4"
   * button beside the chip on every platform (P5-08; the D-pad path on TV),
   * plus long-press and a screen-reader action on touch as shortcuts.
   */
  onChooseRakahs?: (id: RawatibId) => void;
  testID?: string;
};

/** The chip's check disc — an outlined ring that fills and pops once when logged. */
function CheckDot({ done, size }: { done: boolean; size: number }) {
  const { tokens } = useThemeTokens();
  const reducedMotion = useHydrationSafeReducedMotion();
  const pop = useSharedValue(1);
  const prev = useRef(done);
  useEffect(() => {
    if (done && !prev.current && !reducedMotion) {
      pop.value = withSequence(withSpring(1.2, Springs.pop), withSpring(1, Springs.gentle));
    }
    prev.current = done;
  }, [done, pop, reducedMotion]);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const fill = tokens.status.success.color;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2 },
        done
          ? { backgroundColor: fill, borderColor: fill }
          : // Unchecked outline uses the switch off-track token (≥ 3:1 boundary).
            { backgroundColor: "transparent", borderColor: tokens.switchTrackOff },
        popStyle,
      ]}
    >
      {done ? (
        <SymbolView name={CHECK} size={IconSize.xs} tintColor={bestForeground(fill)} />
      ) : null}
    </Animated.View>
  );
}

/**
 * The Sunnah sub-row of a Salah card (NF-3.1): `Sunnah  (○ 2 before) (○ 2 after)`.
 * Each chip is a checkbox — one tap toggles completed ↔ not logged with a
 * success haptic and a tick pop; a variable row (4 or 2 before Dhuhr) has a
 * compact "2 or 4" button (and long-press on touch). Future rows are muted, an
 * after-row whose fard isn't marked is dashed, a late log shows "made up".
 */
export function RawatibChipRow({
  ids,
  status,
  rakahs,
  preset,
  beforeFardIds,
  futureIds,
  late,
  optional,
  label,
  onToggle,
  onChooseRakahs,
  testID,
}: RawatibChipRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  if (ids.length === 0) return null;

  const rowOptional = optional != null && ids.every((id) => optional.ids.has(id));
  const optionalA11y =
    optional?.reason === "sick"
      ? t("rawatib.chip.optionalWhileUnwell")
      : t("rawatib.card.optionalWhileTravelling");
  const dotSize = tv ? tvDp(DOT + 4) : DOT;

  return (
    <View style={styles.row} testID={testID}>
      {label || rowOptional ? (
        <View style={styles.lead}>
          {label ? (
            <>
              <SymbolView name={SUNNAH_ICON} size={IconSize.sm} tintColor={tokens.accentOnSoft} />
              <ThemedText type="caption" weight="semibold" style={{ color: tokens.accentOnSoft }}>
                {label}
              </ThemedText>
            </>
          ) : null}
          {rowOptional ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {label ? `· ${t("rawatib.chip.optional")}` : t("rawatib.chip.optional")}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
      {ids.map((id) => {
        const done = status[id] === "completed";
        const count = rakahsForLog({ rakahs: rakahs[id] }, id, preset);
        const chipLabel = t(rawatibChipKey(RAWATIB_POSITION[id]), { count });
        const name = t(`prayers.${id}`);
        const future = !done && futureIds?.has(id) === true;
        const beforeFard = !done && beforeFardIds?.has(id) === true;
        const isOptional = optional?.ids.has(id) === true;
        // The "2 or 4" choice is always visible; long-press stays a touch shortcut
        // (not D-pad, not mouse).
        const choosable = onChooseRakahs != null && hasRakahChoice(id);
        const canLongPress = choosable && !tv && Platform.OS !== "web";
        const isLate = done && late?.[id] === true;
        const a11yLabel = [
          t("rawatib.chip.a11y", { name, count }),
          isLate ? t("rawatib.chip.late") : null,
          isOptional ? optionalA11y : null,
        ]
          .filter(Boolean)
          .join(", ");
        const a11yHint =
          [
            canLongPress ? t("rawatib.chip.a11yHintRakahs") : null,
            future ? t("rawatib.chip.notYetHint") : null,
            beforeFard ? t("rawatib.chip.beforeFardHint") : null,
          ]
            .filter(Boolean)
            .join(". ") || undefined;
        return (
          <View key={id} style={[styles.item, future ? styles.future : null]}>
            <PressableScale
              testID={`rawatib-chip-${id}`}
              haptic={done ? "light" : "success"}
              scaleTo={0.95}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
              aria-checked={done}
              accessibilityLabel={a11yLabel}
              accessibilityHint={a11yHint}
              onPress={() => onToggle(id, !done)}
              onLongPress={canLongPress ? () => onChooseRakahs?.(id) : undefined}
              accessibilityActions={
                canLongPress
                  ? [{ name: "longpress", label: t("rawatib.chip.chooseRakahsA11y", { name }) }]
                  : undefined
              }
              onAccessibilityAction={
                canLongPress
                  ? (event) => {
                      if (event.nativeEvent.actionName === "longpress") onChooseRakahs?.(id);
                    }
                  : undefined
              }
              style={[
                styles.chip,
                tv ? styles.chipTv : null,
                {
                  backgroundColor: done ? tokens.status.success.soft : colors.card,
                  borderColor: done ? tokens.status.success.border : colors.border,
                  borderStyle: beforeFard ? "dashed" : "solid",
                },
              ]}
            >
              <CheckDot done={done} size={dotSize} />
              <ThemedText
                type="caption"
                weight="semibold"
                style={{ color: done ? tokens.status.success.onSoft : colors.foreground }}
              >
                {chipLabel}
              </ThemedText>
              {isRawatibExtra(id) ? (
                <ThemedText
                  type="caption"
                  style={{ color: done ? tokens.status.success.onSoft : colors.mutedForeground }}
                >
                  {t("rawatib.chip.extra")}
                </ThemedText>
              ) : null}
              {isLate ? (
                <ThemedText type="caption" style={{ color: tokens.status.success.onSoft }}>
                  {t("rawatib.chip.late")}
                </ThemedText>
              ) : null}
            </PressableScale>
            {choosable ? (
              <PressableScale
                testID={`rawatib-rakahs-${id}`}
                haptic="selection"
                scaleTo={0.95}
                accessibilityRole="button"
                accessibilityLabel={t("rawatib.chip.chooseRakahsA11y", { name })}
                onPress={() => onChooseRakahs?.(id)}
                style={[styles.choose, tv ? styles.chooseTv : null]}
              >
                <ThemedText type="caption" weight="semibold" style={{ color: tokens.accentOnSoft }}>
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
    alignItems: "center",
    columnGap: Spacing.two,
    rowGap: Spacing.one,
  },
  lead: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    minHeight: CHIP_HEIGHT,
    marginEnd: Spacing.half,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  /** Not due yet: present (the day's full picture) but quieter than due rows. */
  future: {
    opacity: Opacity.disabled + 0.1,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
    paddingVertical: Spacing.one,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.twoHalf + Spacing.half,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.hairline,
    minHeight: CHIP_HEIGHT,
  },
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
  },
  dot: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: BorderWidth.thick,
  },
  choose: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: CHIP_HEIGHT,
    minWidth: CHIP_HEIGHT,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
  },
  chooseTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
  },
});
