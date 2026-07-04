import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { PrayerInfoButton } from "@/components/prayer-info-button";
import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { PRAYER_ICONS, PRAYER_STATUS_META, statusToneColor, statusToneSoft } from "@/lib/prayer-ui";

type PrayerTrackerRowProps = {
  prayerId: PrayerId;
  status: PrayerStatus;
  /** Computed or flexible display time for this prayer. */
  time?: string;
  hasNotes?: boolean;
  onPress: () => void;
  /** Quick one-tap toggle between completed and pending. */
  onToggleComplete?: () => void;
};

export function PrayerTrackerRow({
  prayerId,
  status,
  time,
  hasNotes,
  onPress,
  onToggleComplete,
}: PrayerTrackerRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const meta = PRAYER_STATUS_META[status];
  const toneColor = statusToneColor(meta.tone, colors, tokens);
  // A muted row needs the soft-accent fill so the pending well stays visible.
  const toneSoft = statusToneSoft(meta.tone, tokens.accentSoft, tokens);

  const timeHint = time;
  const prayerName = t(`prayers.${prayerId}`);
  const statusLabel = t(`prayerStatus.${status}`);
  const isCompleted = status === "completed";
  const successColor = tokens.status.success.color;

  return (
    <View style={[styles.row, { backgroundColor: colors.muted }]}>
      {onToggleComplete ? (
        <PressableScale
          haptic={false}
          onPress={() => {
            triggerHaptic("success");
            onToggleComplete();
          }}
          accessibilityRole="checkbox"
          accessibilityLabel={prayerName}
          accessibilityState={{ checked: isCompleted }}
          style={[
            styles.check,
            {
              backgroundColor: isCompleted ? successColor : "transparent",
              borderColor: isCompleted ? successColor : colors.border,
            },
          ]}
        >
          {isCompleted ? (
            <SymbolView
              name={{ ios: "checkmark", android: "check", web: "check" }}
              size={14}
              tintColor="#ffffff"
            />
          ) : null}
        </PressableScale>
      ) : null}
      <PressableScale
        haptic="light"
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t("statusSheet.rowA11y", { prayer: prayerName, status: statusLabel })}
        style={styles.mainPress}
      >
        <IconWell icon={PRAYER_ICONS[prayerId]} tint={toneColor} background={toneSoft} />
        <View style={styles.body}>
          <ThemedText type="small">{prayerName}</ThemedText>
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
      </PressableScale>
      <PrayerInfoButton prayerId={prayerId} hitTarget={32} showLabel />
      <Pill
        label={statusLabel}
        color={toneColor}
        background={toneSoft}
        icon={status === "pending" ? undefined : meta.icon}
      />
    </View>
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
  mainPress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minWidth: 0,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: 2,
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
