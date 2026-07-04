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

const ICON_WELL = 34;

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

  const prayerName = t(`prayers.${prayerId}`);
  const statusLabel = t(`prayerStatus.${status}`);
  const isCompleted = status === "completed";
  const successColor = tokens.status.success.color;
  const rowA11y = t("statusSheet.rowA11y", { prayer: prayerName, status: statusLabel });

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
          hitSlop={8}
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

      <View style={styles.body}>
        <PressableScale
          haptic="light"
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={rowA11y}
          style={styles.mainPress}
        >
          <IconWell
            icon={PRAYER_ICONS[prayerId]}
            size={16}
            well={ICON_WELL}
            tint={toneColor}
            background={toneSoft}
          />
          <View style={styles.copy}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {prayerName}
            </ThemedText>
            {time || hasNotes ? (
              <View style={styles.metaLine}>
                {time ? (
                  <ThemedText
                    type="caption"
                    themeColor="mutedForeground"
                    numberOfLines={1}
                    style={styles.time}
                  >
                    {time}
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
            ) : null}
          </View>
        </PressableScale>

        <View style={styles.actions}>
          <Pill
            label={statusLabel}
            color={toneColor}
            background={toneSoft}
            icon={status === "pending" ? undefined : meta.icon}
            compact
          />
          <PrayerInfoButton prayerId={prayerId} hitTarget={32} showLabel />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minWidth: 0,
  },
  mainPress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minWidth: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 0,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: 1,
  },
  time: {
    flexShrink: 1,
    fontVariant: ["tabular-nums"],
  },
  actions: {
    flexShrink: 0,
    alignItems: "flex-end",
    gap: Spacing.half + 2,
  },
});
