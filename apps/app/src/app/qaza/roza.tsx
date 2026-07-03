import { computeMissedFasts } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useRoza, useTrackerActions } from "@/stores/tracker-store";

export default function QazaRozaScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const roza = useRoza();
  const { setRoza, performRoza } = useTrackerActions();
  const [years, setYears] = useState("");

  const estimate = computeMissedFasts(Number.parseInt(years, 10) || 0);

  return (
    <ScreenLayout
      eyebrow="Qaza"
      title="Fasting (Roza)"
      subtitle="Track and make up missed fasts"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card>
          <View style={styles.summary}>
            <View style={styles.stat}>
              <ThemedText type="display" style={{ color: tokens.status.info.color }}>
                {roza.remaining}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                remaining
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
            <View style={styles.stat}>
              <ThemedText type="display" style={{ color: tokens.status.success.color }}>
                {roza.completed}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                completed
              </ThemedText>
            </View>
          </View>

          <View style={styles.controls}>
            <View style={styles.stepper}>
              <StepButton
                icon={{ ios: "minus", android: "remove", web: "remove" }}
                label="Decrease remaining"
                disabled={roza.remaining === 0}
                onPress={() => setRoza({ ...roza, remaining: Math.max(0, roza.remaining - 1) })}
              />
              <ThemedText type="smallBold" style={styles.count}>
                {roza.remaining}
              </ThemedText>
              <StepButton
                icon={{ ios: "plus", android: "add", web: "add" }}
                label="Increase remaining"
                onPress={() => setRoza({ ...roza, remaining: roza.remaining + 1 })}
              />
            </View>
            <Button
              label="Fasted a qaza"
              variant="secondary"
              icon={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
              disabled={roza.remaining === 0}
              onPress={() => performRoza()}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title="Estimate missed fasts"
            icon={{ ios: "function", android: "calculate", web: "calculate" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.calcHint}>
            Roughly how many years of Ramadan fasts were missed?
          </ThemedText>
          <View style={styles.calcRow}>
            <TextInput
              value={years}
              onChangeText={(text) => setYears(text.replace(/[^0-9]/g, "").slice(0, 2))}
              keyboardType="number-pad"
              placeholder="years"
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
              ≈ {estimate} fasts
            </ThemedText>
          </View>
          <Button
            label="Add to remaining"
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

function StepButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={[styles.step, { backgroundColor: colors.muted, opacity: disabled ? 0.3 : 1 }]}
    >
      <SymbolView name={icon} size={18} tintColor={colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: Spacing.four,
  },
  stat: {
    alignItems: "center",
    gap: Spacing.one,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    minWidth: 32,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
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
