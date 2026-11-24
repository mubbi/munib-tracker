import { IQAMAH_TIMETABLE_PRAYERS } from "@munib-tracker/shared/timetable-parser";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatDisplayHhMm, parseHhMm } from "@/lib/time";
import {
  type DraftCell,
  type DraftRow,
  type IqamahPrayer,
  normaliseTypedTime,
  type ReviewDraft,
  rowsForReview,
  typedTimeReinterpreted,
} from "@/lib/timetable-ocr/review";

/**
 * NF-3.12 review grid: one editable iqamah cell per prayer per day. Cells the
 * parser flagged (low confidence, implausible vs the calculated time, out of
 * order, missing, unclear column heading) are highlighted, and their rows
 * come first. A typed 12-hour time is read for its Salah (Isha "8:15" →
 * 20:15) and the grid shows how it was read in both 24-hour and AM/PM form.
 */

type Props = {
  draft: ReviewDraft;
  /**
   * Formats a monthly row's label, e.g. "Mon 3 Nov". `monthOffset` counts
   * months after the sheet's first one (a sheet that runs into the next month).
   */
  dayLabel: (day: number, monthOffset: number) => string;
  onEdit: (day: number | null, prayer: IqamahPrayer, text: string, monthOffset: number) => void;
};

/** Most useful hint first: a column mix-up matters more than an assumed kind. */
const FLAG_PRIORITY = [
  "columnUnclear",
  "missing",
  "orderConflict",
  "iqamahWindow",
  "farFromCalculated",
  "kindAssumed",
  "lowConfidence",
] as const;

function flagHint(cell: DraftCell, t: (key: string) => string): string | undefined {
  if (!cell.needsReview) return undefined;
  const flag = FLAG_PRIORITY.find((f) => cell.flags.includes(f)) ?? "lowConfidence";
  return t(`timetableImport.flag.${flag}`);
}

/** "20:15 · 8:15 PM": how an edited cell will be saved. */
function readsAs(value: string): { time24: string; time12: string } {
  const { hour, minute } = parseHhMm(value);
  return {
    time24: formatDisplayHhMm(hour, minute, "24"),
    time12: formatDisplayHhMm(hour, minute, "12"),
  };
}

function Cell({
  cell,
  prayer,
  label,
  onChange,
}: {
  cell: DraftCell;
  prayer: IqamahPrayer;
  label: string;
  onChange: (text: string) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const value = normaliseTypedTime(cell.text, prayer);
  const invalid = value === null;
  const interpreted = cell.edited && value ? readsAs(value) : null;
  const reinterpreted = cell.edited && typedTimeReinterpreted(cell.text, prayer);
  const borderColor = invalid
    ? tokens.status.danger.color
    : cell.needsReview
      ? tokens.status.warning.color
      : colors.border;
  return (
    <View style={styles.cell}>
      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
        {label}
      </ThemedText>
      <TextInput
        value={cell.text}
        onChangeText={onChange}
        placeholder="--:--"
        placeholderTextColor={colors.mutedForeground}
        inputMode="numeric"
        maxLength={5}
        accessibilityLabel={label}
        accessibilityHint={
          invalid
            ? t("timetableImport.invalidHint")
            : interpreted
              ? t("timetableImport.readsAs", interpreted)
              : flagHint(cell, t as (key: string) => string)
        }
        style={[
          styles.input,
          tokens.inputSurface,
          {
            color: colors.foreground,
            borderColor,
            backgroundColor: cell.needsReview ? tokens.status.warning.soft : undefined,
          },
        ]}
      />
      {interpreted ? (
        <ThemedText
          type="caption"
          themeColor={reinterpreted ? undefined : "mutedForeground"}
          style={reinterpreted ? { color: tokens.status.warning.text } : undefined}
          numberOfLines={2}
        >
          {t("timetableImport.readsAs", interpreted)}
        </ThemedText>
      ) : null}
    </View>
  );
}

function Row({ row, title, onEdit }: { row: DraftRow; title: string; onEdit: Props["onEdit"] }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const hints = IQAMAH_TIMETABLE_PRAYERS.map((p) =>
    flagHint(row.cells[p], t as (key: string) => string),
  ).filter((h): h is string => !!h);
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <View style={styles.cells}>
        {IQAMAH_TIMETABLE_PRAYERS.map((prayer) => (
          <Cell
            key={prayer}
            cell={row.cells[prayer]}
            prayer={prayer}
            label={t(`prayers.${prayer}`)}
            onChange={(text) => onEdit(row.day, prayer, text, row.monthOffset ?? 0)}
          />
        ))}
      </View>
      {hints.length > 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {[...new Set(hints)].join(" · ")}
        </ThemedText>
      ) : null}
    </View>
  );
}

export function TimetableReviewGrid({ draft, dayLabel, onEdit }: Props) {
  const { t } = useTranslation();
  const { flagged, rest } = rowsForReview(draft);
  const titleOf = (row: DraftRow) =>
    row.day == null ? t("timetableImport.dailyRow") : dayLabel(row.day, row.monthOffset ?? 0);
  const keyOf = (row: DraftRow) => `${row.monthOffset ?? 0}-${row.day ?? "d"}`;
  return (
    <View style={styles.stack}>
      {draft.beginsOnly ? <Note text={t("timetableImport.beginsOnly")} /> : null}
      {draft.monthWrap ? <Note text={t("timetableImport.monthWrap")} /> : null}
      {flagged.length > 0 ? (
        <ThemedText type="smallBold">{t("timetableImport.checkFirst")}</ThemedText>
      ) : null}
      {flagged.map((row) => (
        <Row key={`f-${keyOf(row)}`} row={row} title={titleOf(row)} onEdit={onEdit} />
      ))}
      {flagged.length > 0 && rest.length > 0 ? (
        <ThemedText type="smallBold">{t("timetableImport.looksRight")}</ThemedText>
      ) : null}
      {rest.map((row) => (
        <Row key={`r-${keyOf(row)}`} row={row} title={titleOf(row)} onEdit={onEdit} />
      ))}
    </View>
  );
}

function Note({ text }: { text: string }) {
  const { tokens } = useThemeTokens();
  return (
    <View style={[styles.note, { backgroundColor: tokens.status.warning.soft }]}>
      <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  note: { padding: Spacing.two, borderRadius: Radius.md },
  stack: { gap: Spacing.three },
  row: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cells: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  cell: { flexBasis: "18%", flexGrow: 1, minWidth: 64, gap: 2 },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});
