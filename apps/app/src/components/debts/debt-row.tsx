import type { DebtStatus } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type DebtEntry, isOverdue, outstanding } from "@/lib/debts/debts";

export function useDebtStatusTone() {
  const { tokens } = useThemeTokens();
  return (status: DebtStatus, overdue = false) =>
    status === "settled"
      ? tokens.status.success
      : status === "forgiven"
        ? tokens.status.info
        : overdue
          ? tokens.status.danger
          : tokens.status.warning;
}

export function DebtRow({
  record,
  today,
  onPress,
  selected = false,
}: {
  record: DebtEntry;
  today: string;
  onPress: () => void;
  /** Master–detail: this record is open in the detail pane. */
  selected?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const format = useRecordFormat();
  const toneFor = useDebtStatusTone();
  const overdue = isOverdue(record, today);
  const tone = toneFor(record.status, overdue);
  const left = outstanding(record);
  const amountText =
    left != null && record.currency
      ? record.status === "open" && record.payments.length
        ? t("debts.row.outstandingOf", {
            left: format.money(left, record.currency),
            total: format.money(record.amount ?? 0, record.currency),
          })
        : format.money(record.amount ?? 0, record.currency)
      : (record.item ?? "");
  const statusLabel = overdue ? t("debts.row.overdue") : t(`debts.status.${record.status}`);

  return (
    <Card
      padding="three"
      onPress={onPress}
      accessibilityState={{ selected }}
      style={
        selected ? { borderColor: colors.accent, backgroundColor: tokens.accentSoft } : undefined
      }
      accessibilityLabel={t("debts.row.a11y", {
        who: record.counterparty,
        amount: amountText,
        status: statusLabel,
      })}
    >
      <View style={styles.row}>
        <View style={styles.text}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {record.counterparty}
          </ThemedText>
          {amountText ? (
            <ThemedText type="small" themeColor="mutedForeground" numberOfLines={1}>
              {amountText}
            </ThemedText>
          ) : null}
          {record.dueOn && record.status === "open" ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("debts.row.due", { date: format.formatDate(record.dueOn) })}
            </ThemedText>
          ) : null}
        </View>
        <Pill label={statusLabel} color={tone.color} background={tone.soft} compact />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  text: { flex: 1, minWidth: 0, gap: 2 },
});
