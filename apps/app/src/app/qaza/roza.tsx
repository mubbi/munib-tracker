import { computeMissedFasts } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { StatPair } from "@/components/ui/stat-pair";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useRoza, useTrackerActions } from "@/stores/tracker-store";

export default function QazaRozaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const roza = useRoza();
  const { setRoza, performRoza } = useTrackerActions();
  const [years, setYears] = useState("");

  const estimate = computeMissedFasts(Number.parseInt(years, 10) || 0);

  return (
    <ScreenLayout
      eyebrow={t("qazaRoza.eyebrow")}
      title={t("qazaRoza.title")}
      subtitle={t("qazaRoza.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        <Card>
          <View style={styles.summary}>
            <StatPair
              divider
              primary={{
                value: roza.remaining,
                label: t("stats.remaining"),
                color: tokens.status.info.color,
              }}
              secondary={{
                value: roza.completed,
                label: t("stats.completed"),
                color: tokens.status.success.color,
              }}
            />
          </View>

          <View style={styles.controls}>
            <Stepper
              value={roza.remaining}
              label={t("qazaRoza.fastsRemaining")}
              onDecrement={() => setRoza({ ...roza, remaining: Math.max(0, roza.remaining - 1) })}
              onIncrement={() => setRoza({ ...roza, remaining: roza.remaining + 1 })}
              size="md"
            />
            <Button
              label={t("qazaRoza.fastedQaza")}
              variant="secondary"
              icon={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
              disabled={roza.remaining === 0}
              onPress={() => performRoza()}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("qazaRoza.estimateTitle")}
            icon={{ ios: "function", android: "calculate", web: "calculate" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.calcHint}>
            {t("qazaRoza.estimateHint")}
          </ThemedText>
          <View style={styles.calcRow}>
            <TextInput
              value={years}
              onChangeText={(text) => setYears(text.replace(/[^0-9]/g, "").slice(0, 2))}
              keyboardType="number-pad"
              placeholder={t("qazaRoza.yearsPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  backgroundColor: colors.muted,
                  borderColor: colors.border,
                },
              ]}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.estimate}>
              {t("qazaRoza.estimateResult", { count: estimate })}
            </ThemedText>
          </View>
          <Button
            label={t("qazaRoza.addToRemaining")}
            fullWidth
            disabled={estimate === 0}
            onPress={() => {
              void setRoza({ ...roza, remaining: roza.remaining + estimate });
              setYears("");
            }}
            style={styles.applyButton}
          />
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginBottom: Spacing.four,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  calcHint: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  calcRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  input: {
    width: 100,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  estimate: {
    flex: 1,
  },
  applyButton: {
    marginTop: Spacing.three,
  },
});
