import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TextInput, View } from "react-native";

import { TimetableDateColumnQuestion } from "@/components/masjid/timetable-date-column-question";
import { TimetableReviewGrid } from "@/components/masjid/timetable-review-grid";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  hasOutOfMonthRows,
  type IqamahPrayer,
  type ReviewDraft,
  reviewCounts,
  type TimetablePeriod,
} from "@/lib/timetable-ocr/review";

/**
 * NF-3.12 review step: month picker (monthly sheets), the date-column question,
 * the iqamah grid (flagged cells first), Jumu'ah slots and Save / Retake.
 */
export function TimetableImportReview({
  draft,
  period,
  photoUri,
  locale,
  saving,
  onShiftMonth,
  onChooseDateColumn,
  onEdit,
  onEditJumuah,
  onSave,
  onRetake,
  onMark,
}: {
  draft: ReviewDraft;
  period: TimetablePeriod | null;
  photoUri: string | null;
  locale: string;
  saving: boolean;
  onShiftMonth: (delta: number) => void;
  onChooseDateColumn: (id: number) => void;
  onEdit: (day: number | null, prayer: IqamahPrayer, text: string, monthOffset: number) => void;
  onEditJumuah: (index: number, text: string) => void;
  onSave: () => void;
  onRetake: () => void;
  /** Kept photo only: mark each time on the photo instead (or to fix a misread). */
  onMark?: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const counts = reviewCounts(draft);
  const monthLabel =
    period &&
    new Date(period.year, period.month - 1, 1).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  const dayLabel = (day: number, monthOffset: number) =>
    period
      ? new Date(period.year, period.month - 1 + monthOffset, day).toLocaleDateString(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : String(day);
  const outOfMonth = hasOutOfMonthRows(draft, period);

  return (
    <View style={styles.stack}>
      <Card>
        <SectionHeader
          title={t("timetableImport.reviewTitle")}
          subtitle={t("timetableImport.reviewSummary", {
            filled: counts.filled,
            check: counts.toCheck,
          })}
          icon={{ ios: "checkmark.shield.fill", android: "verified_user", web: "verified_user" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
          {t("timetableImport.reviewHint")}
        </ThemedText>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={[styles.photo, { borderColor: colors.border }]}
            resizeMode="contain"
            accessibilityLabel={t("timetableImport.photoA11y")}
          />
        ) : null}
        {onMark ? (
          <View style={[styles.row, styles.gapTop]}>
            <Button
              size="sm"
              variant="secondary"
              icon={{ ios: "viewfinder", android: "highlight_alt", web: "highlight_alt" }}
              label={t("timetableImport.mark.fromReview")}
              onPress={onMark}
            />
          </View>
        ) : null}
      </Card>

      {draft.layout === "monthly" && period ? (
        <Card>
          <SectionHeader title={t("timetableImport.monthTitle")} />
          <View style={styles.row}>
            <Button
              size="sm"
              variant="secondary"
              label={t("timetableImport.prevMonth")}
              onPress={() => onShiftMonth(-1)}
            />
            <ThemedText type="smallBold" style={styles.flexCenter}>
              {monthLabel}
            </ThemedText>
            <Button
              size="sm"
              variant="secondary"
              label={t("timetableImport.nextMonth")}
              onPress={() => onShiftMonth(1)}
            />
          </View>
          {outOfMonth ? (
            <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
              {t("timetableImport.outOfMonth")}
            </ThemedText>
          ) : null}
        </Card>
      ) : null}

      {draft.dateQuestion ? (
        <TimetableDateColumnQuestion
          columns={draft.dateQuestion.columns}
          onChoose={onChooseDateColumn}
        />
      ) : null}

      <Card>
        <SectionHeader title={t("timetableImport.iqamahTitle")} />
        <View style={styles.gapTop}>
          <TimetableReviewGrid draft={draft} dayLabel={dayLabel} onEdit={onEdit} />
        </View>
      </Card>

      {draft.jumuah.length > 0 ? (
        <Card>
          <SectionHeader title={t("masjids.jumuah")} />
          <View style={styles.list}>
            {draft.jumuah.map((slot, index) => (
              <View key={`j-${index.toString()}`} style={styles.row}>
                <ThemedText type="small" style={styles.flex}>
                  {slot.kind === "khutbah"
                    ? t("timetableImport.khutbah")
                    : t("masjids.times.jumuahSlot", { number: index + 1 })}
                </ThemedText>
                <JumuahInput value={slot.text} onChange={(text) => onEditJumuah(index, text)} />
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      {counts.invalid > 0 ? (
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
          {t("timetableImport.fixInvalid", { count: counts.invalid })}
        </ThemedText>
      ) : null}
      <View style={styles.row}>
        <Button
          label={t("timetableImport.save")}
          onPress={onSave}
          disabled={saving || counts.blocked || counts.invalid > 0 || counts.filled === 0}
        />
        <Button variant="ghost" label={t("timetableImport.retake")} onPress={onRetake} />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("masjids.times.privacy")}
      </ThemedText>
    </View>
  );
}

function JumuahInput({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="--:--"
      placeholderTextColor={colors.mutedForeground}
      inputMode="numeric"
      maxLength={5}
      accessibilityLabel={t("masjids.jumuah")}
      style={[
        styles.input,
        tokens.inputSurface,
        { color: colors.foreground, borderColor: colors.border },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  list: { gap: Spacing.two, marginTop: Spacing.two },
  gapTop: { marginTop: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  flex: { flex: 1 },
  flexCenter: { flex: 1, textAlign: "center" },
  photo: {
    marginTop: Spacing.two,
    width: "100%",
    height: 220,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
  },
  input: {
    width: 96,
    borderWidth: BorderWidth.thick,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});
