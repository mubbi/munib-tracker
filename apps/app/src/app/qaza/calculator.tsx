import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import { computeLifetimeMissedPrayers } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import { useQazaCounters, useTrackerActions } from "@/stores/tracker-store";

function toInt(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function QazaCalculatorScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const counters = useQazaCounters();
  const { adjustQaza } = useTrackerActions();

  const [currentAge, setCurrentAge] = useState("");
  const [pubertyAge, setPubertyAge] = useState("15");
  const [yearsPrayed, setYearsPrayed] = useState("0");
  const [exemptDays, setExemptDays] = useState("0");
  const [yearMode, setYearMode] = useState<"lunar" | "solar">("lunar");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const result = useMemo(
    () =>
      computeLifetimeMissedPrayers({
        currentAge: toInt(currentAge),
        pubertyAge: toInt(pubertyAge),
        yearsPrayedConsistently: toInt(yearsPrayed),
        annualExemptDays: toInt(exemptDays),
        useLunarYear: yearMode === "lunar",
      }),
    [currentAge, pubertyAge, yearsPrayed, exemptDays, yearMode],
  );

  const applyToCounters = () => {
    for (const prayerId of QAZA_PRAYERS) {
      const existing = counters.find((c) => c.prayerId === prayerId);
      void adjustQaza(prayerId, result.byPrayer[prayerId], existing?.completed ?? 0);
    }
    router.back();
  };

  return (
    <ScreenLayout
      eyebrow={t("qazaCalc.eyebrow")}
      title={t("qazaCalc.title")}
      subtitle={t("qazaCalc.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/qaza/calculator"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("qaza.title"), path: "/qaza" },
          { name: t("qazaCalc.title"), path: "/qaza/calculator" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/qaza/calculator",
            name: "Qaza Prayer Calculator",
            description:
              "Estimate a lifetime of missed prayers from your age, age at puberty, and years prayed.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
              { name: t("qazaCalc.title"), path: "/qaza/calculator" },
            ],
          }),
          faqSchema(getRouteFaq("/qaza/calculator") ?? []),
        ]}
      />
      <Stagger>
        <Card padding="three">
          <View style={styles.fields}>
            <NumberField
              label={t("qazaCalc.currentAge")}
              value={currentAge}
              onChange={setCurrentAge}
              placeholder="30"
            />
            <NumberField
              label={t("qazaCalc.pubertyAge")}
              value={pubertyAge}
              onChange={setPubertyAge}
            />
            <NumberField
              label={t("qazaCalc.yearsPrayed")}
              value={yearsPrayed}
              onChange={setYearsPrayed}
            />
            <NumberField
              label={t("qazaCalc.exemptDays")}
              value={exemptDays}
              onChange={setExemptDays}
              hint={t("qazaCalc.exemptHint")}
            />
            <View>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
                {t("qazaCalc.yearLength")}
              </ThemedText>
              <SegmentedControl<"lunar" | "solar">
                options={[
                  { id: "lunar", label: t("qazaCalc.lunar") },
                  { id: "solar", label: t("qazaCalc.solar") },
                ]}
                value={yearMode}
                onChange={setYearMode}
              />
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.resultHeader}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("qazaCalc.estimatedDays")}
            </ThemedText>
            <ThemedText type="header">{result.missedDays.toLocaleString()}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("qazaCalc.resultYears", { years: result.missedYears })}
            </ThemedText>
          </View>
          <View style={styles.perPrayer}>
            {QAZA_PRAYERS.map((prayerId) => (
              <View key={prayerId} style={styles.perPrayerItem}>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t(`prayers.${prayerId}`)}
                </ThemedText>
                <ThemedText type="smallBold">
                  {result.byPrayer[prayerId].toLocaleString()}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label={t("qazaCalc.apply")}
          icon={{ ios: "square.and.arrow.down", android: "save", web: "save" }}
          fullWidth
          disabled={result.missedDays === 0}
          onPress={() => setConfirmOpen(true)}
        />

        <Disclaimer />
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title={t("qazaCalc.confirmTitle")}
        message={t("qazaCalc.confirmMsg")}
        confirmLabel={t("common.apply")}
        onConfirm={applyToCounters}
        onClose={() => setConfirmOpen(false)}
      />
    </ScreenLayout>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const { colors } = useThemeTokens();
  return (
    <View>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/[^0-9]/g, "").slice(0, 3))}
        keyboardType="number-pad"
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border },
        ]}
      />
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

function Disclaimer() {
  const { tokens } = useThemeTokens();
  const { t } = useTranslation();
  return (
    <View style={[styles.disclaimer, { backgroundColor: tokens.status.warning.soft }]}>
      <SymbolView
        name={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
        size={16}
        tintColor={tokens.status.warning.color}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimerText}>
        {t("qazaCalc.disclaimer")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.three,
  },
  fieldLabel: {
    marginBottom: Spacing.one,
  },
  input: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 17,
    fontWeight: "600",
  },
  hint: {
    marginTop: Spacing.one,
  },
  resultHeader: {
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  perPrayer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  perPrayerItem: {
    alignItems: "center",
    minWidth: "28%",
    gap: 2,
  },
  disclaimer: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  disclaimerText: {
    flex: 1,
  },
});
