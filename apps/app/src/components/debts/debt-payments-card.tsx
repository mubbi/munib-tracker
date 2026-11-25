import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahNavRow } from "@/components/jannah/primitives";
import { useMoneyNumberFormat } from "@/components/money/use-number-format";
import { amountToText } from "@/components/records/amount-text";
import { DayInput } from "@/components/records/day-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { NumberField } from "@/components/ui/number-field";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { repaymentFromForm } from "@/lib/debts/debt-form";
import { type DebtEntry, ribaExcess } from "@/lib/debts/debts";

/**
 * Repayments of a loan (NF-3.8): the list, and — while the record is open —
 * the add form with the riba notice when a repayment would exceed the
 * principal. `onAdd` resolves once the repayment is stored (the form clears).
 */
export function DebtPaymentsCard({
  record,
  currency,
  onAdd,
  onRemove,
}: {
  record: DebtEntry;
  currency: string;
  onAdd: (payment: { amount: number; date: string; note?: string }) => Promise<boolean>;
  onRemove: (paymentId: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const format = useRecordFormat();
  const numberFormat = useMoneyNumberFormat();
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(getLocalDateString());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const excess = ribaExcess(record, amount ?? 0);

  const add = () => {
    const result = repaymentFromForm(amountToText(amount), date, note);
    if (!result.ok) return setError(t(result.error));
    setError(null);
    void onAdd(result.payment).then((stored) => {
      if (!stored) return;
      setAmount(undefined);
      setNote("");
    });
  };

  return (
    <Card>
      <SectionHeader
        title={t("debts.payments.title")}
        icon={{ ios: "list.bullet", android: "list", web: "list" }}
      />
      <View style={styles.form}>
        {record.payments.length === 0 ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("debts.payments.empty")}
          </ThemedText>
        ) : (
          record.payments.map((p) => (
            <View key={p.id} style={styles.payment}>
              <View style={styles.paymentText}>
                <ThemedText type="smallBold">{format.money(p.amount, currency)}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {format.formatDate(p.date)}
                  {p.note ? ` · ${p.note}` : ""}
                </ThemedText>
              </View>
              <IconButton
                name={{ ios: "trash", android: "delete", web: "delete" }}
                accessibilityLabel={t("debts.payments.remove")}
                onPress={() => onRemove(p.id)}
              />
            </View>
          ))
        )}
        {record.status === "open" ? (
          <>
            <NumberField
              label={t("debts.payments.amount")}
              value={amount}
              onChangeValue={(next) => {
                setAmount(next);
                // B-38: a new amount clears the previous attempt's error.
                setError(null);
              }}
              numberFormat={numberFormat}
              maxFractionDigits={2}
              suffix={currency}
              error={error && amount == null ? error : undefined}
            />
            <DayInput label={t("debts.payments.date")} value={date} onChangeText={setDate} />
            <LabeledInput label={t("debts.payments.note")} value={note} onChangeText={setNote} />
            {excess > 0 ? (
              <View style={styles.riba}>
                <Callout tone="warning">
                  {t("debts.riba.body", { excess: format.money(excess, currency) })}
                </Callout>
                <JannahNavRow
                  icon={{ ios: "text.book.closed", android: "article", web: "article" }}
                  title={t("debts.riba.link")}
                  onPress={() =>
                    router.push({
                      pathname: "/finance/[topic]",
                      params: { topic: "riba-prohibition" },
                    } as Href)
                  }
                />
              </View>
            ) : null}
            {error && amount != null ? <Callout tone="danger">{error}</Callout> : null}
            <Button label={t("debts.payments.add")} onPress={add} />
          </>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, marginTop: Spacing.two },
  payment: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  paymentText: { flex: 1, gap: Spacing.half },
  riba: { gap: Spacing.two },
});
