import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_STATUS_META, statusToneColor, statusToneSoft } from "@/lib/prayer-ui";

type TodaySalahStripProps = {
  prayers: readonly PrayerId[];
  statuses: Record<string, PrayerStatus | undefined>;
};

/** Today's salah at a glance: one status mark per salah, in order. */
export function TodaySalahStrip({ prayers, statuses }: TodaySalahStripProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.row}>
      {prayers.map((prayerId) => {
        const status = statuses[prayerId] ?? "pending";
        const meta = PRAYER_STATUS_META[status];
        const tint = statusToneColor(meta.tone, colors, tokens);
        const soft = statusToneSoft(meta.tone, colors.muted, tokens);
        const name = t(`prayers.${prayerId}`);
        return (
          <View
            key={prayerId}
            style={styles.cell}
            accessible
            accessibilityLabel={`${name}, ${t(`prayerStatus.${status}`)}`}
          >
            <View style={[styles.mark, { backgroundColor: soft }]}>
              <SymbolView name={meta.icon} size={18} tintColor={tint} />
            </View>
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {name}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.one,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one,
    minWidth: 0,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
