import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout, JannahNavRow } from "@/components/jannah/primitives";
import { DayInput } from "@/components/records/day-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { repaymentFromForm } from "@/lib/debts/debt-form";
import { type DebtEntry, ribaExcess } from "@/lib/debts/debts";
import { DEFAULT_NUMBER_FORMAT, formatNumberInput, parseNumberInput } from "@/lib/format-currency";

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
  const { tokens } = useThemeTokens();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getLocalDateString());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const excess = ribaExcess(record, parseNumberInput(amount, DEFAULT_NUMBER_FORMAT));

  const add = () => {
    const result = repaymentFromForm(amount, date, note);
    if (!result.ok) return setError(t(result.error));
    setError(null);
    void onAdd(result.payment).then((stored) => {
      if (!stored) return;
      setAmount("");
      setNote("");
    });
  };

  return (
    <Card padding="three">
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
              <Button
                label={t("common.remove")}
                variant="ghost"
                size="sm"
                accessibilityHint={t("debts.payments.remove")}
                onPress={() => onRemove(p.id)}
              />
            </View>
          ))
        )}
        {record.status === "open" ? (
          <>
            <LabeledInput
              label={t("debts.payments.amount")}
              value={amount}
              onChangeText={(v) => setAmount(formatNumberInput(v, 2, DEFAULT_NUMBER_FORMAT))}
              keyboardType="decimal-pad"
              placeholder="0"
            />
            <DayInput label={t("debts.payments.date")} value={date} onChangeText={setDate} />
            <LabeledInput label={t("debts.payments.note")} value={note} onChangeText={setNote} />
            {excess > 0 ? (
              <View style={styles.riba}>
                <JannahCallout tone="warning">
                  {t("debts.riba.body", { excess: format.money(excess, currency) })}
                </JannahCallout>
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
            {error ? (
              <ThemedText
                type="small"
                style={{ color: tokens.status.danger.text }}
                accessibilityRole="alert"
              >
                {error}
              </ThemedText>
            ) : null}
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
  paymentText: { flex: 1, gap: 2 },
  riba: { gap: Spacing.two },
});
