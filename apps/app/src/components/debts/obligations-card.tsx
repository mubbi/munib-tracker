import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahNavRow } from "@/components/jannah/primitives";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import type { VowEntry } from "@/lib/debts/debts";
import { debtsActions } from "@/lib/debts/debts-store";
import type { ObligationLine } from "@/lib/debts/obligations";

const ICONS = {
  qaza_salah: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
  qaza_fast: { ios: "moon.fill", android: "nightlight", web: "nightlight" },
  zakat: { ios: "banknote.fill", android: "payments", web: "payments" },
  fidyah: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  kaffarah: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  vows: { ios: "hand.raised.fill", android: "back_hand", web: "back_hand" },
} as const;

/** Read-only religious obligations summary + the vows list (NF-3.8). */
export function ObligationsCard({
  obligations,
  vows,
}: {
  obligations: readonly ObligationLine[];
  vows: readonly VowEntry[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const format = useRecordFormat();
  const [vowText, setVowText] = useState("");

  const valueFor = (o: ObligationLine) => {
    if (o.amount == null || !o.currency)
      return t("debts.obligations.countValue", { count: o.count ?? 0 });
    const amount = format.money(o.amount, o.currency);
    // Zakat: say which nisab basis (and whether it is the all-views headline) the figure uses.
    if (o.id !== "zakat" || !o.zakatBasis) return amount;
    return t(
      o.zakatAllViews ? "debts.obligations.zakatValueAllViews" : "debts.obligations.zakatValue",
      { amount, basis: t(`zakat.fiqh.basis.${o.zakatBasis}`) },
    );
  };

  const addVow = () => {
    void debtsActions.addVow(vowText);
    setVowText("");
  };

  return (
    <Card padding="three">
      <SectionHeader
        title={t("debts.obligations.title")}
        subtitle={t("debts.obligations.subtitle")}
        icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
      />
      <View style={styles.rows}>
        {obligations.filter((o) => o.id !== "vows").length === 0 ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("debts.obligations.none")}
          </ThemedText>
        ) : (
          obligations
            .filter((o) => o.id !== "vows")
            .map((o) => (
              <JannahNavRow
                key={o.id}
                icon={ICONS[o.id]}
                title={t(`debts.obligations.${o.id}`)}
                subtitle={valueFor(o)}
                onPress={() => router.push(o.route as Href)}
              />
            ))
        )}
      </View>

      <View style={styles.vows}>
        <ThemedText type="smallBold">{t("debts.vows.title")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("debts.vows.hint")}
        </ThemedText>
        {vows.map((vow) => (
          <View key={vow.id} style={styles.vowRow}>
            <PressableScale
              accessibilityRole="checkbox"
              accessibilityState={{ checked: vow.fulfilled }}
              accessibilityLabel={vow.text}
              onPress={() => void debtsActions.setVowFulfilled(vow.id, !vow.fulfilled)}
              style={styles.vowText}
            >
              <ThemedText
                type="small"
                themeColor={vow.fulfilled ? "mutedForeground" : "foreground"}
                style={vow.fulfilled ? styles.done : undefined}
              >
                {`${vow.fulfilled ? "☑" : "☐"} ${vow.text}`}
              </ThemedText>
            </PressableScale>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={t("debts.vows.delete")}
              onPress={() => void debtsActions.deleteVow(vow.id)}
            >
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("common.remove")}
              </ThemedText>
            </PressableScale>
          </View>
        ))}
        <LabeledInput
          label={t("debts.vows.add")}
          value={vowText}
          onChangeText={setVowText}
          placeholder={t("debts.vows.placeholder")}
          onSubmitEditing={addVow}
        />
        <Button label={t("common.add")} size="sm" variant="secondary" onPress={addVow} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.two },
  vows: { gap: Spacing.two, marginTop: Spacing.four },
  vowRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  vowText: { flex: 1 },
  done: { textDecorationLine: "line-through" },
});
