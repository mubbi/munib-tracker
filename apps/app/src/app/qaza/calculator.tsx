import { OBLIGATORY_PRAYERS, PRAYER_LABELS } from "@munib-tracker/shared/constants";
import { computeLifetimeMissedPrayers } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useQazaCounters, useTrackerActions } from "@/stores/tracker-store";

function toInt(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function QazaCalculatorScreen() {
  const router = useRouter();
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
    for (const prayerId of OBLIGATORY_PRAYERS) {
      const existing = counters.find((c) => c.prayerId === prayerId);
      void adjustQaza(prayerId, result.byPrayer[prayerId], existing?.completed ?? 0);
    }
    router.back();
  };

  return (
    <ScreenLayout
      eyebrow="Qaza"
      title="Calculator"
      subtitle="Estimate a lifetime of missed prayers"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.fields}>
            <NumberField
              label="Current age"
              value={currentAge}
              onChange={setCurrentAge}
              placeholder="30"
            />
            <NumberField label="Age at puberty" value={pubertyAge} onChange={setPubertyAge} />
            <NumberField
              label="Years prayed consistently"
              value={yearsPrayed}
              onChange={setYearsPrayed}
            />
            <NumberField
              label="Exempt days / year (optional)"
              value={exemptDays}
              onChange={setExemptDays}
              hint="e.g. menstruation days when prayers are not owed"
            />
            <View>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
                Year length
              </ThemedText>
              <SegmentedControl<"lunar" | "solar">
                options={[
                  { id: "lunar", label: "Lunar (354)" },
                  { id: "solar", label: "Solar (365)" },
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
              Estimated missed days
            </ThemedText>
            <ThemedText type="header">{result.missedDays.toLocaleString()}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {result.missedYears} year{result.missedYears === 1 ? "" : "s"} · one of each prayer
              per day
            </ThemedText>
          </View>
          <View style={styles.perPrayer}>
            {OBLIGATORY_PRAYERS.map((prayerId) => (
              <View key={prayerId} style={styles.perPrayerItem}>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {PRAYER_LABELS[prayerId]}
                </ThemedText>
                <ThemedText type="smallBold">
                  {result.byPrayer[prayerId].toLocaleString()}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label="Apply to my counters"
          icon={{ ios: "square.and.arrow.down", android: "save", web: "save" }}
          fullWidth
          disabled={result.missedDays === 0}
          onPress={() => setConfirmOpen(true)}
        />

        <Disclaimer />
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title="Apply estimate?"
        message="This replaces the remaining count for every obligatory prayer with the estimate above. Completed counts are kept."
        confirmLabel="Apply"
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
  return (
    <View style={[styles.disclaimer, { backgroundColor: tokens.status.warning.soft }]}>
      <SymbolView
        name={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
        size={16}
        tintColor={tokens.status.warning.color}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimerText}>
        This is an estimate only. Rulings on making up missed prayers vary — please consult a
        knowledgeable scholar for your situation.
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
