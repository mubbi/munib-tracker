import { OBLIGATORY_PRAYERS, PRAYER_LABELS } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { computeQazaEta, formatShortDate, getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { QazaRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useQazaSummary } from "@/stores/tracker-store";

type Targets = Record<ObligatoryPrayer, string>;

function emptyTargets(): Targets {
  return OBLIGATORY_PRAYERS.reduce((acc, prayerId) => {
    acc[prayerId] = "0";
    return acc;
  }, {} as Targets);
}

export default function QazaPlannerScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const summary = useQazaSummary();
  const [targets, setTargets] = useState<Targets>(emptyTargets);
  const [saved, setSaved] = useState(false);
  const today = getLocalDateString();

  useEffect(() => {
    let active = true;
    void QazaRepository.getPlan(today).then((plan) => {
      if (!active || !plan) return;
      setTargets((prev) => {
        const next = { ...prev };
        for (const prayerId of OBLIGATORY_PRAYERS) {
          const target = plan.targets[prayerId];
          if (target != null) next[prayerId] = String(target);
        }
        return next;
      });
    });
    return () => {
      active = false;
    };
  }, [today]);

  const dailyTotal = useMemo(
    () => OBLIGATORY_PRAYERS.reduce((sum, p) => sum + (Number.parseInt(targets[p], 10) || 0), 0),
    [targets],
  );

  const eta = computeQazaEta(summary.remaining, dailyTotal, today);

  const save = () => {
    const parsed: Partial<Record<ObligatoryPrayer, number>> = {};
    for (const prayerId of OBLIGATORY_PRAYERS) {
      parsed[prayerId] = Number.parseInt(targets[prayerId], 10) || 0;
    }
    void QazaRepository.setPlan({ date: today, targets: parsed });
    setSaved(true);
  };

  return (
    <ScreenLayout
      eyebrow="Qaza"
      title="Planner"
      subtitle="Set a daily pace to clear your backlog"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card>
          <View style={styles.etaRow}>
            <View style={styles.etaStat}>
              <ThemedText type="header">{dailyTotal}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                prayers / day
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
            <View style={styles.etaStat}>
              <ThemedText type="header">{eta ? eta.days : "—"}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                days to clear
              </ThemedText>
            </View>
          </View>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.etaCaption}>
            {eta
              ? `At this pace, ${summary.remaining} qaza prayers are cleared by ${formatShortDate(eta.date)}.`
              : "Set a daily target below to estimate a completion date."}
          </ThemedText>
        </Card>

        <Card padding="three">
          <SectionHeader
            title="Daily targets"
            icon={{ ios: "target", android: "track_changes", web: "track_changes" }}
          />
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId) => (
              <View key={prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
                <ThemedText type="small" style={styles.rowLabel}>
                  {PRAYER_LABELS[prayerId]}
                </ThemedText>
                <TextInput
                  value={targets[prayerId]}
                  onChangeText={(text) =>
                    setTargets((prev) => ({
                      ...prev,
                      [prayerId]: text.replace(/[^0-9]/g, "").slice(0, 3),
                    }))
                  }
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </Card>

        <Button
          label={saved ? "Plan saved" : "Save plan"}
          icon={
            saved
              ? { ios: "checkmark", android: "check", web: "check" }
              : { ios: "square.and.arrow.down", android: "save", web: "save" }
          }
          fullWidth
          onPress={save}
        />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  etaStat: {
    alignItems: "center",
    gap: Spacing.one,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  etaCaption: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.two + 2,
    paddingLeft: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowLabel: {
    flex: 1,
  },
  input: {
    width: 72,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
});
