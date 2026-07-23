import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { bestForeground } from "@munib-tracker/theme/color";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { PrayerInfoButton } from "@/components/prayer-info-button";
import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  PRAYER_ICONS,
  PRAYER_JAMA_ICON,
  PRAYER_STATUS_MARK_GLYPH,
  PRAYER_STATUS_META,
  statusToneColor,
  statusToneSoft,
} from "@/lib/prayer-ui";
import { useChevronForward } from "@/lib/rtl";

const ICON_WELL = 40;
const STATUS_MARK = 28;
/** Stable keys so segmented progress avoids index-as-key lint. */
const ADHKAR_SEGMENT_IDS = [
  "s0",
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
] as const;

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

function AdhkarProgressSegments({
  completed,
  total,
  tint,
}: {
  completed: number;
  total: number;
  tint: string;
}) {
  const segmentCount = Math.min(Math.max(total, 1), ADHKAR_SEGMENT_IDS.length);
  const filled = Math.round((completed / Math.max(total, 1)) * segmentCount);
  const ids = ADHKAR_SEGMENT_IDS.slice(0, segmentCount);

  return (
    <View style={styles.adhkarSegments} accessibilityElementsHidden importantForAccessibility="no">
      {ids.map((id, index) => (
        <View
          key={id}
          style={[
            styles.adhkarSegment,
            {
              backgroundColor: tint,
              opacity: index < filled ? 1 : 0.35,
            },
          ]}
        />
      ))}
    </View>
  );
}

/** Circular status mark — empty ring for pending; filled disc + glyph otherwise. */
function PrayerStatusMark({
  status,
  toneColor,
  toneSoft,
}: {
  status: PrayerStatus;
  toneColor: string;
  toneSoft: string;
}) {
  const glyph = PRAYER_STATUS_MARK_GLYPH[status];
  const isPending = status === "pending";
  // Pending sits on a soft fill — use the tone color. Filled marks need on-fill contrast.
  const glyphColor = isPending ? toneColor : bestForeground(toneColor);

  return (
    <View
      style={[
        styles.statusMark,
        isPending
          ? {
              backgroundColor: toneSoft,
              borderColor: toneColor,
              borderWidth: 2.5,
            }
          : {
              backgroundColor: toneColor,
              borderColor: toneColor,
              borderWidth: 0,
            },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {glyph ? <SymbolView name={glyph} size={isPending ? 14 : 13} tintColor={glyphColor} /> : null}
    </View>
  );
}

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
  // Soft secondary fill — marking salah stays the primary action on the card.
  const adhkarFg = adhkarDone ? tokens.status.success.color : colors.accentText;
  const adhkarCompleted = afterSalahProgress?.completed ?? 0;
  const adhkarTotal = afterSalahProgress?.total ?? 0;
  const adhkarBg = adhkarDone
    ? tokens.status.success.soft
    : withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.14);
  const adhkarBorder = adhkarDone ? tokens.status.success.border : tokens.accentBorder;
  const tv = isTV();

  const adhkarContent = (
    <View
      style={[
        styles.adhkarButton,
        {
          backgroundColor: adhkarBg,
          borderColor: adhkarBorder,
        },
      ]}
    >
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
        size={16}
        tintColor={adhkarFg}
      />
      <View style={styles.adhkarCopy}>
        <ThemedText type="smallBold" numberOfLines={1} style={{ color: adhkarFg }}>
          {t("tracker.afterSalahProgress", {
            completed: adhkarCompleted,
            total: adhkarTotal,
          })}
        </ThemedText>
        <AdhkarProgressSegments completed={adhkarCompleted} total={adhkarTotal} tint={adhkarFg} />
      </View>
      {adhkarPressable ? <SymbolView name={chevronForward} size={14} tintColor={adhkarFg} /> : null}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.muted,
          borderColor: colors.border,
        },
        tv ? { minHeight: TvLayout.minFocusTarget } : null,
      ]}
    >
      <PressableScale
        haptic="light"
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={rowA11y}
        accessibilityHint={t("tracker.tapToMark")}
        style={styles.primaryPress}
      >
        <View style={styles.topRow}>
          <IconWell
            icon={PRAYER_ICONS[prayerId]}
            size={18}
            well={ICON_WELL}
            tint={toneColor}
            background={toneSoft}
          />

          <View style={styles.copy}>
            <ThemedText type="smallBold" numberOfLines={1} style={styles.name}>
              {prayerName}
            </ThemedText>
            <ThemedText
              type="caption"
              numberOfLines={1}
              style={[styles.tapHint, { color: colors.accent }]}
            >
              {t("tracker.tapToMark")}
            </ThemedText>
            {hasNotes || showJama ? (
              <View style={styles.metaLine}>
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

          <View style={styles.trailing}>
            <Pill label={statusLabel} color={toneColor} background={toneSoft} compact />
            <View style={styles.trailingBottom}>
              {time ? (
                <ThemedText
                  type="caption"
                  numberOfLines={1}
                  style={[styles.time, { color: colors.accent }]}
                >
                  {time}
                </ThemedText>
              ) : null}
              <PrayerStatusMark status={status} toneColor={toneColor} toneSoft={toneSoft} />
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
            style={styles.adhkarWrap}
          >
            {adhkarContent}
          </PressableScale>
        ) : (
          <View
            accessible
            accessibilityLabel={t("tracker.afterSalahProgressA11y", {
              prayer: prayerName,
              completed: adhkarCompleted,
              total: adhkarTotal,
            })}
            style={styles.adhkarWrap}
          >
            {adhkarContent}
          </View>
        )
      ) : null}

      <View style={styles.footer}>
        <PrayerInfoButton
          prayerId={prayerId}
          hitTarget={44}
          showLabel
          underlined
          tintColor={colors.accent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two + 2,
  },
  primaryPress: {
    alignSelf: "stretch",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    justifyContent: "center",
  },
  name: {
    flexShrink: 1,
  },
  tapHint: {
    alignSelf: "flex-start",
    textDecorationLine: "underline",
    textDecorationStyle: "dashed",
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
  trailing: {
    flexShrink: 0,
    alignItems: "flex-end",
    gap: Spacing.one,
  },
  trailingBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  statusMark: {
    width: STATUS_MARK,
    height: STATUS_MARK,
    borderRadius: STATUS_MARK / 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  adhkarWrap: {
    alignSelf: "stretch",
  },
  adhkarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  adhkarCopy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half + 1,
  },
  adhkarSegments: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 3,
  },
  adhkarSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    borderCurve: "continuous",
  },
  footer: {
    alignSelf: "flex-start",
  },
});
