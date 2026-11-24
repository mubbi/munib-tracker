import type { DebtDirection } from "@munib-tracker/shared/types";
import { DEBT_DIRECTIONS } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahNavRow } from "@/components/jannah/primitives";
import { DayInput } from "@/components/records/day-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { DebtFormState } from "@/lib/debts/debt-form";
import { isLoan } from "@/lib/debts/debts";
import { DEFAULT_NUMBER_FORMAT, formatNumberInput } from "@/lib/format-currency";
import { dueDayPresets, normalizeDayInput } from "@/lib/records/day";

/** The create / edit form of a debts & trusts record (NF-3.8). */
export function DebtFormCard({
  form,
  onChange,
  error,
  saving,
  onSave,
  onCancel,
}: {
  form: DebtFormState;
  onChange: <K extends keyof DebtFormState>(key: K, value: DebtFormState[K]) => void;
  error: string | null;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const directionOptions = useMemo(
    () => DEBT_DIRECTIONS.map((d) => ({ id: d, label: t(`debts.direction.${d}`) })),
    [t],
  );
  const loan = isLoan(form.direction);

  return (
    <Card padding="three">
      <View style={styles.form}>
        <ThemedText type="smallBold">{t("debts.form.direction")}</ThemedText>
        <SegmentedControl<DebtDirection>
          options={directionOptions}
          value={form.direction}
          onChange={(d) => onChange("direction", d)}
        />
        <LabeledInput
          label={t("debts.form.who")}
          value={form.counterparty}
          onChangeText={(v) => onChange("counterparty", v)}
          autoCapitalize="words"
        />
        <LabeledInput
          label={t(loan ? "debts.form.amount" : "debts.form.amountOptional")}
          value={form.amount}
          onChangeText={(v) => onChange("amount", formatNumberInput(v, 2, DEFAULT_NUMBER_FORMAT))}
          keyboardType="decimal-pad"
          placeholder="0"
        />
        <JannahNavRow
          icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
          title={t("debts.form.currency")}
          subtitle={form.currency}
          onPress={() => setCurrencyOpen(true)}
        />
        {!loan ? (
          <LabeledInput
            label={t("debts.form.item")}
            value={form.item}
            onChangeText={(v) => onChange("item", v)}
            placeholder={t("debts.form.itemPlaceholder")}
          />
        ) : null}
        <DayInput
          label={t("debts.form.createdOn")}
          value={form.createdOn}
          onChangeText={(v) => onChange("createdOn", v)}
          hint={t("debts.form.dateHint")}
        />
        <DayInput
          label={t("debts.form.dueOn")}
          value={form.dueOn}
          onChangeText={(v) => onChange("dueOn", v)}
          hint={t("debts.form.dueHint")}
          presets={dueDayPresets(normalizeDayInput(form.createdOn) ?? getLocalDateString())}
        />
        <LabeledInput
          label={t("debts.form.witnesses")}
          value={form.witnesses}
          onChangeText={(v) => onChange("witnesses", v)}
          hint={t("debts.form.witnessesHint")}
        />
        <LabeledInput
          label={t("debts.form.notes")}
          value={form.notes}
          onChangeText={(v) => onChange("notes", v)}
          multiline
        />
        {error ? (
          <ThemedText
            type="small"
            style={{ color: tokens.status.danger.text }}
            accessibilityRole="alert"
          >
            {error}
          </ThemedText>
        ) : null}
        <View style={styles.actions}>
          <Button
            label={saving ? t("privateUx.saving") : t("common.save")}
            disabled={saving}
            onPress={onSave}
          />
          <Button label={t("common.cancel")} variant="ghost" onPress={onCancel} />
        </View>
      </View>
      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={form.currency}
        onSelect={(code) => {
          onChange("currency", code);
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
