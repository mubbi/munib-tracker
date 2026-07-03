import { PRAYER_LABELS } from "@munib-tracker/shared/constants";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { useQazaCounters, useQazaSummary, useTrackerActions } from "@/stores/tracker-store";

export default function QazaHomeScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const counters = useQazaCounters();
  const summary = useQazaSummary();
  const { adjustQaza, performQaza } = useTrackerActions();

  return (
    <ScreenLayout
      eyebrow="Make-up worship"
      title="Qaza"
      subtitle="Track and clear missed prayers"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card>
          <View style={styles.summary}>
            <View style={styles.summaryStat}>
              <ThemedText type="display" style={{ color: tokens.status.info.color }}>
                {summary.remaining}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                remaining
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
            <View style={styles.summaryStat}>
              <ThemedText type="display" style={{ color: tokens.status.success.color }}>
                {summary.completed}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                made up
              </ThemedText>
            </View>
          </View>
        </Card>

        <View style={styles.tools}>
          <Button
            label="Calculator"
            variant="secondary"
            icon={{ ios: "function", android: "calculate", web: "calculate" }}
            onPress={() => router.push("/qaza/calculator")}
            style={styles.tool}
          />
          <Button
            label="Planner"
            variant="secondary"
            icon={{ ios: "calendar.badge.clock", android: "event", web: "event" }}
            onPress={() => router.push("/qaza/planner")}
            style={styles.tool}
          />
          <Button
            label="Roza"
            variant="secondary"
            icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
            onPress={() => router.push("/qaza/roza")}
            style={styles.tool}
          />
        </View>

        <Card padding="three">
          <SectionHeader
            title="Per prayer"
            icon={{ ios: "list.bullet", android: "list", web: "list" }}
          />
          <View style={styles.rows}>
            {counters.map((counter) => (
              <View key={counter.prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
                <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
                  <SymbolView
                    name={PRAYER_ICONS[counter.prayerId]}
                    size={18}
                    tintColor={colors.accent}
                  />
                </View>
                <View style={styles.rowBody}>
                  <ThemedText type="small">{PRAYER_LABELS[counter.prayerId]}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {counter.remaining} left · {counter.completed} done
                  </ThemedText>
                </View>

                <View style={styles.stepper}>
                  <StepButton
                    icon={{ ios: "minus", android: "remove", web: "remove" }}
                    label={`Decrease ${counter.prayerId}`}
                    disabled={counter.remaining === 0}
                    onPress={() =>
                      adjustQaza(counter.prayerId, counter.remaining - 1, counter.completed)
                    }
                  />
                  <ThemedText type="smallBold" style={styles.count}>
                    {counter.remaining}
                  </ThemedText>
                  <StepButton
                    icon={{ ios: "plus", android: "add", web: "add" }}
                    label={`Increase ${counter.prayerId}`}
                    onPress={() =>
                      adjustQaza(counter.prayerId, counter.remaining + 1, counter.completed)
                    }
                  />
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Mark ${counter.prayerId} qaza performed`}
                  disabled={counter.remaining === 0}
                  hitSlop={6}
                  onPress={() => performQaza(counter.prayerId)}
                  style={{ opacity: counter.remaining === 0 ? 0.3 : 1 }}
                >
                  <SymbolView
                    name={{
                      ios: "checkmark.circle.fill",
                      android: "check_circle",
                      web: "check_circle",
                    }}
                    size={26}
                    tintColor={tokens.status.success.color}
                  />
                </Pressable>
              </View>
            ))}
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            Tap the check to record a made-up prayer. Missing a prayer in the tracker adds to these
            counts automatically.
          </ThemedText>
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
      style={[styles.step, { backgroundColor: colors.card, opacity: disabled ? 0.3 : 1 }]}
    >
      <SymbolView name={icon} size={16} tintColor={colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryStat: {
    alignItems: "center",
    gap: Spacing.one,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  tools: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  tool: {
    flex: 1,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    minWidth: 28,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  hint: {
    marginTop: Spacing.three,
  },
});
