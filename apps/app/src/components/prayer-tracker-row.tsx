import { PRAYER_LABELS } from "@munib-tracker/shared/constants";
import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  PRAYER_ICONS,
  PRAYER_STATUS_META,
  PRAYER_TIME_HINTS,
  statusToneColor,
  statusToneSoft,
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
  const toneColor = statusToneColor(meta.tone, colors, tokens);
  // A muted row needs the soft-accent fill so the pending well stays visible.
  const toneSoft = statusToneSoft(meta.tone, tokens.accentSoft, tokens);

  const timeHint = PRAYER_TIME_HINTS[prayerId];

  return (
    <PressableScale
      haptic="light"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${PRAYER_LABELS[prayerId]}, ${meta.label}`}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={PRAYER_ICONS[prayerId]} tint={toneColor} background={toneSoft} />
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
        color={toneColor}
        background={toneSoft}
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
