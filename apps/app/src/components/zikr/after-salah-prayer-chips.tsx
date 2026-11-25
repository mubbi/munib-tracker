import type { AfterSalahPrayer } from "@munib-tracker/shared/types";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useScrollToActiveHorizontal } from "@/hooks/use-scroll-to-active";
import { type AdhkarSetStatus, AFTER_SALAH_SESSION_PRAYERS } from "@/lib/adhkar-session";
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
          const done = state.status === "done";
          const missed = state.status === "missed";
          const isNow = prayer === current && !done;
          // Status glyph stays on the chip: done = check, missed = alert, else the salah icon.
          const icon = done ? CHECK_ICON : missed ? MISSED_ICON : PRAYER_ICONS[prayer];
          const name = t(`prayers.${prayer}`);
          return (
            <View key={prayer} ref={register(prayer)} collapsable={false}>
              <Chip
                role="radio"
                variant="solid"
                selected={active}
                icon={icon}
                label={isNow && !active ? `${name} · ${t("zikrSession.now")}` : name}
                count={!done && state.completed > 0 ? state.completed : undefined}
                accessibilityLabel={`${name}${isNow ? `, ${t("zikrSession.now")}` : ""}, ${statusLabel}, ${t(
                  "zikrSession.progressShort",
                  { completed: state.completed, total: state.total },
                )}`}
                onPress={() => onSelect(prayer)}
              />
            </View>
          );
        })}
      </TvScrollView>
    </TvFocusGuide>
  );
}

const CHECK_ICON = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;
const MISSED_ICON = {
  ios: "exclamationmark.circle.fill",
  android: "error",
  web: "error",
} as const;

const styles = StyleSheet.create({
  row: { flexGrow: 0 },
  chips: { gap: Spacing.two, paddingEnd: Spacing.one },
});
