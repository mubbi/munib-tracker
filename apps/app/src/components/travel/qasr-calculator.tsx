import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { TvStepButtons, useTvInputFocus } from "@/components/money/tv-number-input";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";
import { DEFAULT_NUMBER_FORMAT, formatNumberInput, parseNumberInput } from "@/lib/format-currency";
import { isTV } from "@/lib/platform/is-tv";
import {
  computeQasr,
  computeQasrAllSchools,
  type DistanceUnit,
  formatDistance,
  type QasrInput,
  type QasrResult,
} from "@/lib/qasr-calculator";

/** The two questions (+ Hajj switch) shared by the `/travel` calculator and the travel-mode sheet. */
export type QasrAnswers = { distance: string; unit: DistanceUnit; stayDays: string; hajj: boolean };

export const EMPTY_QASR_ANSWERS: QasrAnswers = {
  distance: "",
  unit: "km",
  stayDays: "",
  hajj: false,
};

export function qasrInputFrom(answers: QasrAnswers): QasrInput | null {
  const distance = parseNumberInput(answers.distance, DEFAULT_NUMBER_FORMAT) || 0;
  if (distance <= 0) return null;
  return {
    distance,
    unit: answers.unit,
    stayDays: parseNumberInput(answers.stayDays, DEFAULT_NUMBER_FORMAT) || 0,
    hajj: answers.hajj,
  };
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  maxFractionDigits,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  maxFractionDigits: number;
}) {
  const { colors, tokens } = useThemeTokens();
  const focus = useTvInputFocus();
  const tv = isTV();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={tv ? styles.tvLine : undefined}>
        <View
          style={[
            styles.inputRow,
            tv && styles.inputRowTv,
            tokens.inputSurface,
            focus.containerStyle,
          ]}
        >
          <TextInput
            {...focus.focusProps}
            value={value}
            onChangeText={(text) =>
              onChange(formatNumberInput(text, maxFractionDigits, DEFAULT_NUMBER_FORMAT))
            }
            keyboardType={maxFractionDigits > 0 ? "decimal-pad" : "number-pad"}
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={label}
            style={[styles.input, { color: colors.foreground }]}
          />
        </View>
        <TvStepButtons
          value={value}
          onChange={onChange}
          label={label}
          maxFractionDigits={maxFractionDigits}
        />
      </View>
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

/** Distance (km/mi), intended stay and the Hajj switch. */
export function QasrQuestions({
  answers,
  onChange,
  fullDaysHint,
}: {
  answers: QasrAnswers;
  onChange: (next: QasrAnswers) => void;
  /** Show "count full days, excluding arrival and departure" (Shafi'i/Maliki or all views). */
  fullDaysHint: boolean;
}) {
  const { t } = useTranslation();
  const unitOptions = useMemo(
    () => [
      { id: "km" as const, label: t("travel.qasrCalc.unitKm") },
      { id: "mi" as const, label: t("travel.qasrCalc.unitMi") },
    ],
    [t],
  );
  return (
    <View style={styles.questions}>
      <NumberField
        label={t("travel.qasrCalc.distanceLabel")}
        value={answers.distance}
        onChange={(distance) => onChange({ ...answers, distance })}
        maxFractionDigits={1}
      />
      <SegmentedControl<DistanceUnit>
        options={unitOptions}
        value={answers.unit}
        onChange={(unit) => onChange({ ...answers, unit })}
      />
      <NumberField
        label={t("travel.qasrCalc.stayLabel")}
        hint={fullDaysHint ? t("travel.qasrCalc.stayHintFullDays") : undefined}
        value={answers.stayDays}
        onChange={(stayDays) => onChange({ ...answers, stayDays })}
        maxFractionDigits={0}
      />
      <View style={styles.switchRow}>
        <ThemedText type="small" style={styles.switchLabel}>
          {t("travel.qasrCalc.hajjLabel")}
        </ThemedText>
        <ThemedSwitch
          value={answers.hajj}
          onValueChange={(hajj) => onChange({ ...answers, hajj })}
          accessibilityLabel={t("travel.qasrCalc.hajjLabel")}
        />
      </View>
    </View>
  );
}

function SchoolVerdict({ result, unit }: { result: QasrResult; unit: DistanceUnit }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const unitLabel = t(unit === "mi" ? "travel.qasrCalc.unitMi" : "travel.qasrCalc.unitKm");
  const [low, high] = result.thresholdKm;
  const tone =
    result.traveller === "yes"
      ? tokens.status.success
      : result.traveller === "differ"
        ? tokens.status.warning
        : tokens.status.info;
  const headline =
    result.traveller === "yes"
      ? t("travel.qasrCalc.travellerYes")
      : result.traveller === "no"
        ? t("travel.qasrCalc.travellerNo", { distance: formatDistance(low, unit), unit: unitLabel })
        : t("travel.qasrCalc.travellerDiffer", {
            min: formatDistance(low, unit),
            max: formatDistance(high, unit),
            unit: unitLabel,
          });
  const lines: string[] = [];
  if (result.traveller !== "no") {
    lines.push(t(`travel.qasrCalc.status.${result.qasrStatus}`));
    lines.push(
      result.residentOnArrival ? t("travel.qasrCalc.resident") : t("travel.qasrCalc.notResident"),
    );
    lines.push(
      t(`travel.qasrCalc.residencyRule.${result.residencyRule}`, { days: result.residencyDays }),
    );
    if (result.jam === "allowed") lines.push(t("travel.qasrCalc.jam.allowed"));
    if (result.jam === "hajj_only") lines.push(t("travel.qasrCalc.jam.hajjOnly"));
    lines.push(t(`travel.qasrCalc.rawatib.${result.rawatib}`));
  }
  return (
    <View
      accessible
      accessibilityLabel={[headline, ...lines].join(" ")}
      style={[styles.verdict, { backgroundColor: tone.soft, borderColor: tone.border }]}
    >
      <ThemedText type="smallBold" style={{ color: tone.text }}>
        {headline}
      </ThemedText>
      {lines.map((line) => (
        <ThemedText key={line} type="caption" style={{ color: colors.foreground }}>
          {line}
        </ThemedText>
      ))}
    </View>
  );
}

function AllSchoolsVerdict({ input }: { input: QasrInput }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const rows = useMemo(() => computeQasrAllSchools(input), [input]);
  return (
    <View style={styles.rows}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("travel.qasrCalc.allViewsHint")}
      </ThemedText>
      {rows.map(({ school, result }) => {
        const parts = [
          t(`travel.qasrCalc.row.traveller.${result.traveller}`),
          ...(result.traveller === "no"
            ? []
            : [
                t(`travel.qasrCalc.row.status.${result.qasrStatus}`),
                t(
                  result.residentOnArrival
                    ? "travel.qasrCalc.row.resident"
                    : "travel.qasrCalc.row.notResident",
                ),
                t(`travel.qasrCalc.row.jam.${result.jam}`),
              ]),
        ];
        const name = t(`fiqh.school.${school satisfies MadhhabId}`);
        return (
          <View
            key={school}
            accessible
            accessibilityLabel={`${name}: ${parts.join(", ")}`}
            style={[styles.schoolRow, { borderColor: tokens.hairline }]}
          >
            <ThemedText type="label">{name}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {parts.join(" · ")}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

/** The result for the user's travel school, or one row per school in all-views mode. */
export function QasrVerdict({ answers }: { answers: QasrAnswers }) {
  const { t } = useTranslation();
  const { resolve } = useMadhhab();
  const resolved = resolve("travel");
  const input = useMemo(() => qasrInputFrom(answers), [answers]);
  const custom =
    resolved.customKeys.includes("qasrDistanceKm") || resolved.customKeys.includes("residencyDays");

  return (
    <View style={styles.verdictBlock}>
      <MadhhabBadge school={resolved.school} custom={resolved.school != null && custom} />
      {input == null ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("travel.qasrCalc.enterTrip")}
        </ThemedText>
      ) : resolved.rules ? (
        <SchoolVerdict result={computeQasr(input, resolved.rules)} unit={answers.unit} />
      ) : (
        <AllSchoolsVerdict input={input} />
      )}
    </View>
  );
}

/** Whether to show the "full days, excluding arrival/departure" hint for the stay question. */
export function useFullDaysHint(): boolean {
  const { rules } = useMadhhab();
  const travel = rules("travel");
  return travel == null || travel.travel.residencyExcludesTravelDays;
}

/** `/travel#calculator` — the qasr calculator card (NF-3.0a retrofit). */
export function QasrCalculatorCard() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<QasrAnswers>(EMPTY_QASR_ANSWERS);
  const fullDaysHint = useFullDaysHint();

  return (
    <Card>
      <SectionHeader
        title={t("travel.qasrCalc.title")}
        icon={{ ios: "function", android: "calculate", web: "calculate" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("travel.qasrCalc.hint")}
      </ThemedText>
      <QasrQuestions answers={answers} onChange={setAnswers} fullDaysHint={fullDaysHint} />
      <QasrVerdict answers={answers} />
      <CollapsibleSection
        title={t("travel.qasrCalc.whyTitle")}
        icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
      >
        <View style={styles.notes}>
          {SCREEN_DIFFERENCES["/travel#calculator"].map((id) => (
            <MadhhabNote key={id} id={id} />
          ))}
        </View>
      </CollapsibleSection>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("fiqh.disclaimer")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two },
  questions: { gap: Spacing.three, marginTop: Spacing.three },
  field: { gap: Spacing.two },
  inputRow: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  input: { fontSize: 16, paddingVertical: Spacing.one },
  tvLine: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  inputRowTv: { flex: 1, justifyContent: "center" },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  switchLabel: { flex: 1 },
  verdictBlock: { gap: Spacing.two, marginTop: Spacing.three },
  verdict: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  rows: { gap: Spacing.two },
  schoolRow: {
    gap: Spacing.half,
    paddingStart: Spacing.three,
    borderStartWidth: BorderWidth.thick,
  },
  notes: { gap: Spacing.two, marginTop: Spacing.two },
});
