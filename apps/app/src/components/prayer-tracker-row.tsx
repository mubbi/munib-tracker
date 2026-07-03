import { PRAYER_LABELS } from "@munib-tracker/shared/constants";
import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  PRAYER_ICONS,
  PRAYER_STATUS_META,
  PRAYER_TIME_HINTS,
  type StatusTone,
} from "@/lib/prayer-ui";

type PrayerTrackerRowProps = {
  prayerId: PrayerId;
  status: PrayerStatus;
  hasNotes?: boolean;
  onPress: () => void;
};

export function PrayerTrackerRow({ prayerId, status, hasNotes, onPress }: PrayerTrackerRowProps) {
  const { colors, tokens } = useThemeTokens();
  const meta = PRAYER_STATUS_META[status];

  const toneColor = (tone: StatusTone) =>
    tone === "muted" ? colors.mutedForeground : tokens.status[tone].color;
  const toneSoft = (tone: StatusTone) =>
    tone === "muted" ? tokens.accentSoft : tokens.status[tone].soft;

  const timeHint = PRAYER_TIME_HINTS[prayerId];

  return (
    <PressableScale
      haptic="light"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${PRAYER_LABELS[prayerId]}, ${meta.label}`}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={[styles.iconWell, { backgroundColor: toneSoft(meta.tone) }]}>
        <SymbolView name={PRAYER_ICONS[prayerId]} size={18} tintColor={toneColor(meta.tone)} />
      </View>
      <View style={styles.body}>
        <ThemedText type="small">{PRAYER_LABELS[prayerId]}</ThemedText>
        <View style={styles.subRow}>
          {timeHint ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {timeHint}
            </ThemedText>
          ) : null}
          {hasNotes ? (
            <SymbolView
              name={{ ios: "note.text", android: "sticky_note_2", web: "sticky_note_2" }}
              size={12}
              tintColor={colors.mutedForeground}
            />
          ) : null}
        </View>
      </View>
      <Pill
        label={meta.label}
        color={toneColor(meta.tone)}
        background={toneSoft(meta.tone)}
        icon={status === "pending" ? undefined : meta.icon}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
