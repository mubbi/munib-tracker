import { type Dispatch, type SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahNavRow } from "@/components/jannah/primitives";
import { AmountInput } from "@/components/records/amount-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { useRequireVaultUnlock } from "@/components/vault";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { readOpenDebtsTotal } from "@/lib/mirath/debts-prefill";
import type { MirathEstateDraft } from "@/lib/mirath/estate";

type MirathEstateCardProps = {
  estate: MirathEstateDraft;
  onEstateChange: Dispatch<SetStateAction<MirathEstateDraft>>;
  currency: string;
  onCurrencyChange: (code: string) => void;
};

/**
 * Optional estate amounts (gross, funeral, debts, bequests) + currency, with a
 * "use my debts record" prefill behind the vault lock. Collapsed until wanted,
 * so "Show shares" lands next to the results.
 */
export function MirathEstateCard({
  estate,
  onEstateChange,
  currency,
  onCurrencyChange,
}: MirathEstateCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [debtsNote, setDebtsNote] = useState<string | null>(null);
  // Bumped after a prefill so the (uncontrolled-text) amount inputs remount with the new value.
  const [inputsKey, setInputsKey] = useState(0);
  const { requireVaultUnlock, unlockPrompt } = useRequireVaultUnlock();

  const prefillDebts = async () => {
    if (!(await requireVaultUnlock())) return;
    const total = await readOpenDebtsTotal(currency);
    if (total == null) {
      setDebtsNote(t("mirath.estate.debtsUnavailable"));
      return;
    }
    onEstateChange((e) => ({ ...e, debts: total > 0 ? total : undefined }));
    setInputsKey((k) => k + 1);
    setDebtsNote(total > 0 ? t("mirath.estate.debtsFilled") : t("mirath.estate.debtsNone"));
  };

  const field = (key: keyof MirathEstateDraft) => ({
    value: estate[key],
    onChange: (value: number | undefined) => onEstateChange((e) => ({ ...e, [key]: value })),
  });

  return (
    <>
      <Card padding="three">
        <CollapsibleSection
          title={t("mirath.estate.title")}
          icon={{ ios: "banknote.fill", android: "payments", web: "payments" }}
          open={open}
          onOpenChange={setOpen}
        >
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("mirath.estate.hint")}
          </ThemedText>
          <JannahNavRow
            icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
            title={t("mirath.estate.currency")}
            subtitle={currency}
            onPress={() => setCurrencyOpen(true)}
          />
          <View key={inputsKey} style={styles.gap}>
            <AmountInput label={t("mirath.estate.gross")} {...field("gross")} />
            <AmountInput label={t("mirath.estate.funeral")} {...field("funeral")} />
            <AmountInput
              label={t("mirath.estate.debts")}
              hint={t("mirath.estate.debtsHint")}
              {...field("debts")}
            />
            <AmountInput
              label={t("mirath.estate.bequests")}
              hint={t("mirath.estate.bequestsHint")}
              {...field("bequests")}
            />
          </View>
          <View style={styles.actions}>
            <Button
              label={t("mirath.estate.useDebts")}
              variant="ghost"
              size="sm"
              onPress={() => void prefillDebts()}
            />
          </View>
          {debtsNote ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {debtsNote}
            </ThemedText>
          ) : null}
        </CollapsibleSection>
      </Card>
      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={currency}
        onSelect={(code) => {
          onCurrencyChange(code);
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
      {unlockPrompt}
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.three },
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
