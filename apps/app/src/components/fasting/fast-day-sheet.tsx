import type {
  AppLocale,
  CalendarMode,
  ExcusedReason,
  FastDayClassification,
  VoluntaryFastEntry,
  VoluntaryFastStatus,
} from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  RULING_ICON,
  RULING_TONE,
  STATUS_ICON,
  STATUS_TONE,
} from "@/components/fasting/fasting-ui";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatDualCalendarDate } from "@/lib/calendar-format";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";

const STATUSES: VoluntaryFastStatus[] = ["intended", "fasted", "broken"];

function statusHaptic(status: VoluntaryFastStatus | null): HapticFeedback {
  if (status === "fasted") return "success";
  if (status === "broken") return "warning";
  return "selection";
}

export type FastDaySheetProps = {
  visible: boolean;
  date: string | null;
  classification: FastDayClassification | null;
  entry: VoluntaryFastEntry | undefined;
  locale: AppLocale;
  calendar: CalendarMode;
  /** Roza qaza days still owed (offers "count as qaza" when > 0 or already flagged). */
  rozaRemaining: number;
  /** Day's excused reason, if any (hayd blocks `fasted`). */
  excused: ExcusedReason | null;
  /** Hint keys shown under the reasons (Ashura companion, Shawwal qaza order…). */
  hints: string[];
  /** Why the last write was refused — shown here, where the user just tapped. */
  error?: string | null;
  /** Read-only (TV): show the ruling and status, no logging controls. */
  readOnly?: boolean;
  onSelect: (status: VoluntaryFastStatus | null) => void;
  onToggleQaza: (asQaza: boolean) => void;
  onClose: () => void;
};

/** One day's ruling, evidence-backed reasons, and the log controls (NF-3.2). */
export function FastDaySheet({
  visible,
  date,
  classification,
  entry,
  locale,
  calendar,
  rozaRemaining,
  excused,
  hints,
  error,
  readOnly = false,
  onSelect,
  onToggleQaza,
  onClose,
}: FastDaySheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  if (!date || !classification) return null;

  const dates = formatDualCalendarDate(new Date(`${date}T12:00:00`), calendar, locale);
  const tone = RULING_TONE[classification.ruling];
  const toneColor = tone === "muted" ? colors.mutedForeground : tokens.status[tone].text;
  const toneSoft = tone === "muted" ? colors.muted : tokens.status[tone].soft;
  const noFastExcuse = excused === "hayd" || excused === "nifas";
  const blockedFasted = classification.blocking || noFastExcuse;
  const showQaza = !classification.blocking && (rozaRemaining > 0 || entry?.asQaza === true);

  const choose = (status: VoluntaryFastStatus | null) => {
    triggerHaptic(statusHaptic(status));
    onSelect(status);
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{dates.primary}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {dates.secondary}
      </ThemedText>

      <View style={styles.rulingRow}>
        <Pill
          label={t(`voluntaryFasting.ruling.${classification.ruling}`)}
          color={toneColor}
          background={toneSoft}
          icon={RULING_ICON[classification.ruling]}
        />
        {classification.kinds.map((kind) => (
          <Pill key={kind} compact label={t(`voluntaryFasting.kind.${kind}`)} />
        ))}
      </View>

      {classification.reasons
        .filter((key) => !key.startsWith("voluntaryFasting.kind."))
        .map((key) => (
          <ThemedText key={key} type="small" style={styles.reason}>
            {t(key)}
          </ThemedText>
        ))}
      {classification.madhhabNoteId ? <MadhhabNote id={classification.madhhabNoteId} /> : null}

      {classification.blocking ? (
        <View style={[styles.notice, { backgroundColor: tokens.status.danger.soft }]}>
          <SymbolView
            name={RULING_ICON.prohibited}
            size={18}
            tintColor={tokens.status.danger.color}
          />
          <ThemedText type="small" style={styles.noticeText}>
            {t("voluntaryFasting.block.eidTashriq")}
          </ThemedText>
        </View>
      ) : null}
      {!classification.blocking && noFastExcuse ? (
        <View style={[styles.notice, { backgroundColor: tokens.status.info.soft }]}>
          <SymbolView
            name={{ ios: "heart.circle", android: "favorite_border", web: "favorite_border" }}
            size={18}
            tintColor={tokens.status.info.color}
          />
          <ThemedText type="small" style={styles.noticeText}>
            {excused === "nifas"
              ? t("excusedFiqh.fastBlockNifas")
              : t("voluntaryFasting.block.hayd")}
          </ThemedText>
        </View>
      ) : null}
      {!classification.blocking && (excused === "sick" || excused === "travel") ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("voluntaryFasting.excused.allowed")}
        </ThemedText>
      ) : null}

      {hints.map((key) => (
        <ThemedText key={key} type="caption" style={{ color: tokens.status.info.text }}>
          {t(key)}
        </ThemedText>
      ))}

      {error ? (
        <View
          style={[styles.notice, { backgroundColor: tokens.status.warning.soft }]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <SymbolView
            name={RULING_ICON.disliked}
            size={18}
            tintColor={tokens.status.warning.color}
          />
          <ThemedText type="small" style={styles.noticeText}>
            {error}
          </ThemedText>
        </View>
      ) : null}

      {readOnly ? (
        entry ? (
          <ThemedText type="smallBold">{t(`voluntaryFasting.status.${entry.status}`)}</ThemedText>
        ) : null
      ) : (
        <>
          <View style={styles.options}>
            {STATUSES.map((status) => {
              const active = entry?.status === status;
              const disabled =
                (status !== "broken" && classification.blocking) ||
                (status === "fasted" && blockedFasted);
              const statusTone = tokens.status[STATUS_TONE[status]];
              return (
                <PressableScale
                  key={status}
                  haptic={false}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={t(`voluntaryFasting.action.${status}`)}
                  accessibilityState={{ selected: active, disabled }}
                  onPress={() => choose(status)}
                  style={[
                    styles.option,
                    {
                      backgroundColor: active ? statusTone.soft : colors.muted,
                      borderColor: active ? statusTone.color : "transparent",
                      opacity: disabled ? 0.45 : 1,
                    },
                  ]}
                >
                  <SymbolView name={STATUS_ICON[status]} size={20} tintColor={statusTone.color} />
                  <ThemedText type="smallBold" style={{ color: statusTone.text }}>
                    {t(`voluntaryFasting.action.${status}`)}
                  </ThemedText>
                </PressableScale>
              );
            })}
            {entry ? (
              <PressableScale
                haptic={false}
                accessibilityRole="button"
                accessibilityLabel={t("voluntaryFasting.action.clear")}
                onPress={() => choose(null)}
                style={[
                  styles.option,
                  { backgroundColor: colors.muted, borderColor: "transparent" },
                ]}
              >
                <SymbolView
                  name={{
                    ios: "circle",
                    android: "radio_button_unchecked",
                    web: "radio_button_unchecked",
                  }}
                  size={20}
                  tintColor={colors.mutedForeground}
                />
                <ThemedText type="smallBold" themeColor="mutedForeground">
                  {t("voluntaryFasting.action.clear")}
                </ThemedText>
              </PressableScale>
            ) : null}
          </View>

          {showQaza ? (
            <View style={styles.qazaRow}>
              <View style={styles.qazaCopy}>
                <ThemedText type="smallBold">{t("voluntaryFasting.qaza.toggle")}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {entry?.qazaCounted
                    ? t("voluntaryFasting.qaza.counted")
                    : t("voluntaryFasting.qaza.hint", { days: rozaRemaining })}
                </ThemedText>
              </View>
              <ThemedSwitch
                accessibilityLabel={t("voluntaryFasting.qaza.toggle")}
                value={entry?.asQaza === true}
                onValueChange={onToggleQaza}
              />
            </View>
          ) : null}
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  rulingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  reason: { marginTop: Spacing.one },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginTop: Spacing.two,
  },
  noticeText: { flex: 1 },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  option: {
    flexGrow: 1,
    flexBasis: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
  qazaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  qazaCopy: { flex: 1, gap: Spacing.half },
});
