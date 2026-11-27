import type {
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
  RawatibId,
} from "@munib-tracker/shared/types";
import { bestForeground } from "@munib-tracker/theme/color";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Opacity, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import {
  PRAYER_COMBINED_ICON,
  PRAYER_ICONS,
  PRAYER_JAMA_ICON,
  PRAYER_MASJID_ICON,
  PRAYER_STATUS_MARK_GLYPH,
  PRAYER_STATUS_META,
  statusToneColor,
  statusToneSoft,
} from "@/lib/prayer-ui";
import { useChevronForward } from "@/lib/rtl";

const ICON_WELL = 40;
/** Drawn status disc; the pressable around it is a full `Control.md` square. */
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
  /** Rawatib (NF-3.1) render as compact chips in their fard's card, never as a full row. */
  prayerId: Exclude<PrayerId, RawatibId>;
  status: PrayerStatus;
  /** Computed or flexible display time for this prayer. */
  time?: string;
  hasNotes?: boolean;
  /** Prayed in congregation (jama') — shows a badge on completed fard rows (NF-1.5). */
  isJama?: boolean;
  /** Prayed at the masjid (NF-3.11) — a small masjid glyph on completed fard rows. */
  atMasjid?: boolean;
  /** Prayed combined (jam') with this fard (NF-3.0a) — a small label in the row / history. */
  combinedWith?: ObligatoryPrayer;
  /** Pre-localized preferred-time hint (Fajr / Asr / Isha, NF-3.0a); today only. */
  preferredHint?: string;
  /** Row press — opens the full status sheet. */
  onPress: () => void;
  /**
   * One-tap mark (P5-02). When set, the trailing status mark becomes a 44pt
   * toggle: a press marks the Salah `completed`; pressing it again restores the
   * status it had before. Without it the mark is decorative (calendar days).
   */
  onSelect?: (status: PrayerStatus) => void;
  /** After-salah adhkar completion for this fard prayer today. */
  afterSalahProgress?: { completed: number; total: number };
  onPressAfterSalah?: () => void;
  /**
   * Sunnah sub-row inside this card (NF-3.1 rawatib chips), drawn under the fard
   * line and above the Adhkar line, aligned with the Salah name. Its controls are
   * siblings of the row's pressables (never nested) and come next in D-pad order.
   */
  sunnah?: ReactNode;
  /** TV: request initial D-pad focus on this row's primary (mark) target. */
  preferredFocus?: boolean;
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
              opacity: index < filled ? 1 : Opacity.disabled,
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
              borderWidth: BorderWidth.thick,
            }
          : {
              backgroundColor: toneColor,
              borderColor: toneColor,
              borderWidth: 0,
            },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {glyph && !isPending ? (
        <SymbolView name={glyph} size={IconSize.sm} tintColor={glyphColor} />
      ) : null}
    </View>
  );
}

/**
 * One Salah row on the tracker (P5-02): ~72pt, one status signal (the mark +
 * its label), the time, and optional detail glyphs. The row opens the full
 * status sheet; the trailing mark is a separate 44pt one-tap "prayed" toggle
 * (a sibling, never nested — web renders both as `<button>`). Prayer info lives
 * in the status sheet header.
 */
export function PrayerTrackerRow({
  prayerId,
  status,
  time,
  hasNotes,
  isJama,
  atMasjid,
  combinedWith,
  preferredHint,
  onPress,
  onSelect,
  afterSalahProgress,
  onPressAfterSalah,
  sunnah,
  preferredFocus = false,
}: PrayerTrackerRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const chevronForward = useChevronForward();
  const meta = PRAYER_STATUS_META[status];
  const toneColor = statusToneColor(meta.tone, colors, tokens);
  // A muted row needs the soft-accent fill so the pending well stays visible.
  const toneSoft = statusToneSoft(meta.tone, tokens.accentSoft, tokens);
  // Status text sits on the muted row — the AA `onSoft` tone, never the raw hue.
  const statusTextColor =
    meta.tone === "muted" ? colors.mutedForeground : tokens.status[meta.tone].onSoft;
  // The status a one-tap "prayed" replaced, so a second tap restores it.
  const restoreRef = useRef<PrayerStatus>("pending");
  // B-10: any status that is not "completed" (set from the sheet, Clear, a sync) invalidates
  // the remembered one, so the next un-tick returns to Pending rather than a stale status.
  useEffect(() => {
    if (status !== "completed") restoreRef.current = "pending";
  }, [status]);

  const prayerName = t(`prayers.${prayerId}`);
  const statusLabel = t(`prayerStatus.${status}`);
  const successText = tokens.status.success.onSoft;
  const adhkarDone =
    afterSalahProgress != null &&
    afterSalahProgress.total > 0 &&
    afterSalahProgress.completed >= afterSalahProgress.total;
  const showJama = status === "completed" && !!isJama;
  const showMasjid = status === "completed" && !!atMasjid;
  const combinedLabel = combinedWith
    ? t("tracker.combined.rowLabel", { prayer: t(`prayers.${combinedWith}`) })
    : null;
  const rowA11y = [
    showJama
      ? t("statusSheet.rowA11yJama", { prayer: prayerName, status: statusLabel })
      : t("statusSheet.rowA11y", { prayer: prayerName, status: statusLabel }),
    showMasjid ? t("masjidLog.toggle") : null,
    combinedLabel,
    preferredHint,
  ]
    .filter(Boolean)
    .join(". ");

  const showAdhkar = afterSalahProgress != null && afterSalahProgress.total > 0;
  const adhkarPressable = showAdhkar && onPressAfterSalah != null;
  const adhkarFg = adhkarDone ? successText : tokens.accentOnSoft;
  const adhkarCompleted = afterSalahProgress?.completed ?? 0;
  const adhkarTotal = afterSalahProgress?.total ?? 0;
  const tv = isTV();
  const rowHint = tTv(t, "tracker.tapToMark", "tracker.tapToMarkTv");
  const done = status === "completed";

  const onMarkPress = () => {
    if (!onSelect) return;
    if (done) {
      triggerHaptic("selection");
      const restore = restoreRef.current;
      restoreRef.current = "pending";
      onSelect(restore);
      return;
    }
    triggerHaptic("success");
    restoreRef.current = status;
    onSelect("completed");
  };

  const mark = <PrayerStatusMark status={status} toneColor={toneColor} toneSoft={toneSoft} />;

  const adhkarContent = (
    <View style={styles.adhkarLine}>
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
        size={IconSize.sm}
        tintColor={adhkarFg}
      />
      <ThemedText type="caption" weight="semibold" numberOfLines={1} style={{ color: adhkarFg }}>
        {t("tracker.afterSalahProgress", {
          completed: adhkarCompleted,
          total: adhkarTotal,
        })}
      </ThemedText>
      <View style={styles.adhkarBar}>
        <AdhkarProgressSegments completed={adhkarCompleted} total={adhkarTotal} tint={adhkarFg} />
      </View>
      {adhkarPressable ? (
        <SymbolView name={chevronForward} size={IconSize.xs} tintColor={adhkarFg} />
      ) : null}
    </View>
  );

  const adhkarA11y = t("tracker.afterSalahProgressA11y", {
    prayer: prayerName,
    completed: adhkarCompleted,
    total: adhkarTotal,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.muted,
          borderColor: colors.border,
        },
        tv ? styles.containerTv : null,
      ]}
    >
      <View style={styles.topRow}>
        <PressableScale
          haptic="light"
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={rowA11y}
          accessibilityHint={rowHint}
          {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
          // TV: the row is the big Select surface — pad it so the focus ring
          // frames the whole row header, not just the glyphs.
          style={[styles.primaryPress, tv ? styles.primaryPressTv : null]}
        >
          <IconWell
            icon={PRAYER_ICONS[prayerId]}
            size={IconSize.md + 2}
            well={ICON_WELL}
            tint={toneColor}
            background={toneSoft}
          />

          <View style={styles.copy}>
            <ThemedText type="smallBold" style={styles.name}>
              {prayerName}
            </ThemedText>
            <View style={styles.statusLine}>
              <ThemedText type="caption" weight="semibold" style={{ color: statusTextColor }}>
                {statusLabel}
              </ThemedText>
              {time ? (
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.time}>
                  · {time}
                </ThemedText>
              ) : null}
              {showJama ? (
                <SymbolView name={PRAYER_JAMA_ICON} size={IconSize.xs} tintColor={successText} />
              ) : null}
              {showMasjid ? (
                <SymbolView name={PRAYER_MASJID_ICON} size={IconSize.xs} tintColor={successText} />
              ) : null}
              {hasNotes ? (
                <SymbolView
                  name={{
                    ios: "note.text",
                    android: "sticky_note_2",
                    web: "sticky_note_2",
                  }}
                  size={IconSize.xs}
                  tintColor={colors.mutedForeground}
                />
              ) : null}
            </View>
            {combinedLabel ? (
              <View style={styles.statusLine}>
                <SymbolView
                  name={PRAYER_COMBINED_ICON}
                  size={IconSize.xs}
                  tintColor={colors.mutedForeground}
                />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.shrink}>
                  {combinedLabel}
                </ThemedText>
              </View>
            ) : null}
            {preferredHint ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {preferredHint}
              </ThemedText>
            ) : null}
          </View>
          {/* Decorative mark inside the row when there is no one-tap toggle. */}
          {onSelect ? null : mark}
        </PressableScale>

        {onSelect ? (
          <PressableScale
            haptic={false}
            onPress={onMarkPress}
            accessibilityRole="checkbox"
            accessibilityLabel={t("tracker.markA11y", { prayer: prayerName })}
            accessibilityHint={done ? t("tracker.markUndoHint") : t("tracker.markHint")}
            accessibilityState={{ checked: done }}
            aria-checked={done}
            scaleTo={0.9}
            style={[styles.markButton, tv ? styles.markButtonTv : null]}
            testID={`prayer-mark-${prayerId}`}
          >
            {mark}
          </PressableScale>
        ) : null}
      </View>

      {sunnah ? (
        <View
          style={[styles.subRow, tv ? styles.subRowTv : null]}
          testID={`prayer-sunnah-${prayerId}`}
        >
          {sunnah}
        </View>
      ) : null}

      {showAdhkar ? (
        adhkarPressable ? (
          <PressableScale
            haptic="light"
            onPress={onPressAfterSalah}
            accessibilityRole="button"
            accessibilityLabel={adhkarA11y}
            style={[styles.adhkarWrap, tv ? styles.adhkarWrapTv : null]}
          >
            {adhkarContent}
          </PressableScale>
        ) : (
          <View accessible accessibilityLabel={adhkarA11y} style={styles.adhkarWrap}>
            {adhkarContent}
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.oneHalf,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.one,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  containerTv: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  primaryPress: {
    flex: 1,
    minWidth: 0,
    minHeight: Control.md + Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
    paddingVertical: Spacing.one,
  },
  primaryPressTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
    justifyContent: "center",
  },
  name: {
    flexShrink: 1,
  },
  statusLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.one,
  },
  shrink: {
    flexShrink: 1,
  },
  time: {
    fontVariant: ["tabular-nums"],
  },
  markButton: {
    width: Control.md,
    height: Control.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.pill,
  },
  markButtonTv: {
    width: TvLayout.minFocusTarget,
    height: TvLayout.minFocusTarget,
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
    minHeight: Control.md,
    justifyContent: "center",
    paddingEnd: Spacing.two,
    borderRadius: Radius.md,
  },
  /** TV: ring follows the line's rounded shape. */
  adhkarWrapTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.two,
  },
  /** Sub-rows start under the Salah name (past the icon well), like the Adhkar line. */
  subRow: {
    gap: Spacing.two,
    paddingStart: ICON_WELL + Spacing.twoHalf,
    paddingEnd: Spacing.two,
    paddingBottom: Spacing.one,
  },
  subRowTv: {
    paddingStart: ICON_WELL + Spacing.twoHalf + Spacing.two,
  },
  adhkarLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingStart: ICON_WELL + Spacing.twoHalf,
  },
  adhkarBar: {
    flex: 1,
    minWidth: 0,
  },
  adhkarSegments: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    height: BorderWidth.thick + 1,
  },
  adhkarSegment: {
    flex: 1,
    height: BorderWidth.thick + 1,
    borderRadius: Radius.xs,
    borderCurve: "continuous",
  },
});
