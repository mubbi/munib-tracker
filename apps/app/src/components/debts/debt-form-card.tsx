import type { DebtDirection } from "@munib-tracker/shared/types";
import { DEBT_DIRECTIONS } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CurrencyField } from "@/components/money/currency-field";
import { useMoneyNumberFormat } from "@/components/money/use-number-format";
import { amountFromText, amountToText } from "@/components/records/amount-text";
import { DayInput } from "@/components/records/day-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { NumberField } from "@/components/ui/number-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import type { DebtFormState } from "@/lib/debts/debt-form";
import { isLoan } from "@/lib/debts/debts";
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
  const numberFormat = useMoneyNumberFormat();
  const directionOptions = useMemo(
    () => DEBT_DIRECTIONS.map((d) => ({ id: d, label: t(`debts.direction.${d}`) })),
    [t],
  );
  const loan = isLoan(form.direction);

  return (
    <Card>
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
        <NumberField
          label={t(loan ? "debts.form.amount" : "debts.form.amountOptional")}
          value={amountFromText(form.amount)}
          onChangeValue={(n) => onChange("amount", amountToText(n))}
          numberFormat={numberFormat}
          maxFractionDigits={2}
          suffix={form.currency}
        />
        <CurrencyField
          label={t("debts.form.currency")}
          value={form.currency}
          onChange={(code) => onChange("currency", code)}
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
        {error ? <Callout tone="danger">{error}</Callout> : null}
        <View style={styles.actions}>
          <Button
            label={saving ? t("common.saving") : t("common.save")}
            loading={saving}
            onPress={onSave}
          />
          <Button label={t("common.cancel")} variant="ghost" onPress={onCancel} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
