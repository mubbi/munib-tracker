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
import {
  PRAYER_ICONS,
  PRAYER_JAMA_ICON,
  PRAYER_STATUS_META,
  statusToneColor,
  statusToneSoft,
} from "@/lib/prayer-ui";
import { useChevronForward } from "@/lib/rtl";

const ICON_WELL = 34;

type PrayerTrackerRowProps = {
  prayerId: PrayerId;
  status: PrayerStatus;
  /** Computed or flexible display time for this prayer. */
  time?: string;
  hasNotes?: boolean;
  /** Prayed in congregation (jama') — shows a badge on completed fard rows (NF-1.5). */
  isJama?: boolean;
  onPress: () => void;
  /** After-salah adhkar completion for this fard prayer today. */
  afterSalahProgress?: { completed: number; total: number };
  onPressAfterSalah?: () => void;
};

export function PrayerTrackerRow({
  prayerId,
  status,
  time,
  hasNotes,
  isJama,
  onPress,
  afterSalahProgress,
  onPressAfterSalah,
}: PrayerTrackerRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const chevronForward = useChevronForward();
  const meta = PRAYER_STATUS_META[status];
  const toneColor = statusToneColor(meta.tone, colors, tokens);
  // A muted row needs the soft-accent fill so the pending well stays visible.
  const toneSoft = statusToneSoft(meta.tone, tokens.accentSoft, tokens);

  const prayerName = t(`prayers.${prayerId}`);
  const statusLabel = t(`prayerStatus.${status}`);
  const successColor = tokens.status.success.color;
  const adhkarDone =
    afterSalahProgress != null &&
    afterSalahProgress.total > 0 &&
    afterSalahProgress.completed >= afterSalahProgress.total;
  const showJama = status === "completed" && !!isJama;
  const rowA11y = showJama
    ? t("statusSheet.rowA11yJama", { prayer: prayerName, status: statusLabel })
    : t("statusSheet.rowA11y", { prayer: prayerName, status: statusLabel });

  const showAdhkar = afterSalahProgress != null && afterSalahProgress.total > 0;
  const adhkarPressable = showAdhkar && onPressAfterSalah != null;
  const adhkarTint = adhkarDone ? successColor : colors.accent;
  // Cache narrowed values so JSX below stays type-safe and readable.
  const adhkarCompleted = afterSalahProgress?.completed ?? 0;
  const adhkarTotal = afterSalahProgress?.total ?? 0;
  const adhkarBg = adhkarDone ? tokens.status.success.soft : tokens.accentSoft;

  return (
    <View style={[styles.container, { backgroundColor: colors.muted }]}>
      <View style={styles.mainLine}>
        <View style={styles.leadingBlock}>
          <PressableScale
            haptic="light"
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={rowA11y}
            style={styles.primaryPress}
          >
            <View style={styles.primaryInner}>
              <IconWell
                icon={PRAYER_ICONS[prayerId]}
                size={16}
                well={ICON_WELL}
                tint={toneColor}
                background={toneSoft}
              />

              <View style={styles.content}>
                <View style={styles.nameRow}>
                  <View style={styles.copy}>
                    <ThemedText type="smallBold" numberOfLines={1} style={styles.name}>
                      {prayerName}
                    </ThemedText>
                    {time || hasNotes || showJama ? (
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
                        {showJama ? (
                          <SymbolView name={PRAYER_JAMA_ICON} size={12} tintColor={successColor} />
                        ) : null}
                        {hasNotes ? (
                          <SymbolView
                            name={{
                              ios: "note.text",
                              android: "sticky_note_2",
                              web: "sticky_note_2",
                            }}
                            size={12}
                            tintColor={colors.mutedForeground}
                          />
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.rowChevron}>
                    <SymbolView
                      name={chevronForward}
                      size={14}
                      tintColor={colors.mutedForeground}
                    />
                  </View>
                </View>
              </View>
            </View>
          </PressableScale>

          {showAdhkar ? (
            adhkarPressable ? (
              <PressableScale
                haptic="light"
                onPress={onPressAfterSalah}
                accessibilityRole="button"
                accessibilityLabel={t("tracker.afterSalahProgressA11y", {
                  prayer: prayerName,
                  completed: adhkarCompleted,
                  total: adhkarTotal,
                })}
                style={styles.adhkarRow}
              >
                <View style={[styles.adhkarBadge, { backgroundColor: adhkarBg }]}>
                  <SymbolView
                    name={
                      adhkarDone
                        ? { ios: "checkmark.seal.fill", android: "verified", web: "verified" }
                        : {
                            ios: "hands.and.sparkles.fill",
                            android: "volunteer_activism",
                            web: "volunteer_activism",
                          }
                    }
                    size={12}
                    tintColor={adhkarTint}
                  />
                  <ThemedText type="caption" numberOfLines={1} style={{ color: adhkarTint }}>
                    {t("tracker.afterSalahProgress", {
                      completed: adhkarCompleted,
                      total: adhkarTotal,
                    })}
                  </ThemedText>
                  <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
                </View>
              </PressableScale>
            ) : (
              <View
                accessible
                accessibilityLabel={t("tracker.afterSalahProgressA11y", {
                  prayer: prayerName,
                  completed: adhkarCompleted,
                  total: adhkarTotal,
                })}
                style={styles.adhkarRow}
              >
                <View style={[styles.adhkarBadge, { backgroundColor: adhkarBg }]}>
                  <SymbolView
                    name={
                      adhkarDone
                        ? { ios: "checkmark.seal.fill", android: "verified", web: "verified" }
                        : {
                            ios: "hands.and.sparkles.fill",
                            android: "volunteer_activism",
                            web: "volunteer_activism",
                          }
                    }
                    size={12}
                    tintColor={adhkarTint}
                  />
                  <ThemedText type="caption" numberOfLines={1} style={{ color: adhkarTint }}>
                    {t("tracker.afterSalahProgress", {
                      completed: adhkarCompleted,
                      total: adhkarTotal,
                    })}
                  </ThemedText>
                </View>
              </View>
            )
          ) : null}
        </View>

        <View style={styles.trailing}>
          <Pill
            label={statusLabel}
            color={toneColor}
            background={toneSoft}
            icon={status === "pending" ? undefined : meta.icon}
            compact
          />
          <PrayerInfoButton prayerId={prayerId} hitTarget={44} showLabel />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  mainLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  leadingBlock: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one + 2,
  },
  primaryPress: {
    alignSelf: "stretch",
  },
  primaryInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 0,
    justifyContent: "center",
  },
  rowChevron: {
    flexShrink: 0,
    marginStart: Spacing.one,
  },
  name: {
    flexShrink: 1,
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
  adhkarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    minWidth: 0,
    marginStart: ICON_WELL + Spacing.two,
  },
  adhkarBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half + 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 1,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    flexShrink: 1,
  },
  trailing: {
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: Spacing.one,
  },
});
