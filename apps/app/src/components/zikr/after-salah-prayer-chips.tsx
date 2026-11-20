import type { AfterSalahPrayer } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useScrollToActiveHorizontal } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type AdhkarSetStatus, AFTER_SALAH_SESSION_PRAYERS } from "@/lib/adhkar-session";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";

export type AfterSalahChipState = {
  status: AdhkarSetStatus;
  completed: number;
  total: number;
};

/**
 * One chip per salah (Fajr … Isha, Witr). Each carries its own status so users
 * see at a glance which salah's adhkar are done, pending, or missed today.
 */
export function AfterSalahPrayerChips({
  selected,
  onSelect,
  states,
  current,
}: {
  selected: AfterSalahPrayer;
  onSelect: (prayer: AfterSalahPrayer) => void;
  states: Record<AfterSalahPrayer, AfterSalahChipState>;
  /** The salah whose time is running now — gets a "Now" cue. */
  current?: AfterSalahPrayer;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { register, onScroll } = useScrollToActiveHorizontal(scrollRef, selected);

  return (
    <TvFocusGuide autoFocus trapFocusLeft trapFocusRight>
      <TvScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.row}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {AFTER_SALAH_SESSION_PRAYERS.map((prayer) => {
          const active = prayer === selected;
          const state = states[prayer];
          const statusLabel = t(`zikrSession.status.${state.status}`);
          const fg = active
            ? tv
              ? colors.accentText
              : colors.accentForeground
            : colors.foreground;
          const done = state.status === "done";
          const missed = state.status === "missed";
          const isNow = prayer === current && !done;
          const iconTint = active ? fg : missed ? tokens.status.warning.color : colors.accent;
          return (
            <PressableScale
              key={prayer}
              ref={register(prayer)}
              haptic="selection"
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${t(`prayers.${prayer}`)}${isNow ? `, ${t("zikrSession.now")}` : ""}, ${statusLabel}, ${t(
                "zikrSession.progressShort",
                { completed: state.completed, total: state.total },
              )}`}
              onPress={() => onSelect(prayer)}
              style={[
                styles.chip,
                tv && styles.chipTv,
                tv
                  ? {
                      backgroundColor: active ? tokens.accentSoft : colors.muted,
                      borderColor: active ? colors.accent : "transparent",
                    }
                  : { backgroundColor: active ? colors.accent : colors.muted },
              ]}
            >
              <SymbolView name={PRAYER_ICONS[prayer]} size={tv ? 18 : 15} tintColor={iconTint} />
              <ThemedText
                type="small"
                style={{
                  color: fg,
                  fontSize: tv ? TvLayout.bodyFontSize : undefined,
                  fontWeight: active ? "600" : "400",
                }}
              >
                {t(`prayers.${prayer}`)}
              </ThemedText>
              {isNow && !active ? (
                <ThemedText type="caption" style={[styles.now, { color: colors.accent }]}>
                  {t("zikrSession.now")}
                </ThemedText>
              ) : null}
              {done ? (
                <SymbolView
                  name={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  size={14}
                  tintColor={active && !tv ? colors.accentForeground : tokens.status.success.color}
                />
              ) : missed ? (
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        active && !tv ? colors.accentForeground : tokens.status.warning.color,
                    },
                  ]}
                />
              ) : state.completed > 0 ? (
                <ThemedText type="caption" style={[styles.count, { color: fg }]}>
                  {state.completed}/{state.total}
                </ThemedText>
              ) : null}
            </PressableScale>
          );
        })}
      </TvScrollView>
    </TvFocusGuide>
  );
}

const styles = StyleSheet.create({
  row: { flexGrow: 0 },
  chips: { gap: Spacing.two, paddingEnd: Spacing.one },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    minHeight: 40,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    borderCurve: "continuous",
  },
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  now: { fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4, fontSize: 10 },
  count: { fontVariant: ["tabular-nums"], opacity: 0.85 },
});
