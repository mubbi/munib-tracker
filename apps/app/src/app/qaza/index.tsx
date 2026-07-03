import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { StatPair } from "@/components/ui/stat-pair";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { useQazaCounters, useQazaSummary, useTrackerActions } from "@/stores/tracker-store";

export default function QazaHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const counters = useQazaCounters();
  const summary = useQazaSummary();
  const { adjustQaza, performQaza } = useTrackerActions();

  return (
    <ScreenLayout
      eyebrow={t("qaza.eyebrow")}
      title={t("qaza.title")}
      subtitle={t("qaza.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        <Card>
          <StatPair
            divider
            primary={{
              value: summary.remaining,
              label: t("stats.remaining"),
              color: tokens.status.info.color,
            }}
            secondary={{
              value: summary.completed,
              label: t("stats.madeUp"),
              color: tokens.status.success.color,
            }}
          />
        </Card>

        <View style={styles.tools}>
          <Button
            label={t("qaza.calculator")}
            variant="secondary"
            icon={{ ios: "function", android: "calculate", web: "calculate" }}
            onPress={() => router.push("/qaza/calculator")}
            style={styles.tool}
          />
          <Button
            label={t("qaza.planner")}
            variant="secondary"
            icon={{ ios: "calendar.badge.clock", android: "event", web: "event" }}
            onPress={() => router.push("/qaza/planner")}
            style={styles.tool}
          />
          <Button
            label={t("qaza.roza")}
            variant="secondary"
            icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
            onPress={() => router.push("/qaza/roza")}
            style={styles.tool}
          />
        </View>

        <Card padding="three">
          <SectionHeader
            title={t("qaza.perPrayer")}
            icon={{ ios: "list.bullet", android: "list", web: "list" }}
          />
          <View style={styles.rows}>
            {counters.map((counter) => (
              <View key={counter.prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
                <IconWell icon={PRAYER_ICONS[counter.prayerId]} />
                <View style={styles.rowBody}>
                  <ThemedText type="small">{t(`prayers.${counter.prayerId}`)}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("qaza.rowMeta", {
                      remaining: counter.remaining,
                      completed: counter.completed,
                    })}
                  </ThemedText>
                </View>

                <Stepper
                  value={counter.remaining}
                  label={t(`prayers.${counter.prayerId}`)}
                  onDecrement={() =>
                    adjustQaza(counter.prayerId, counter.remaining - 1, counter.completed)
                  }
                  onIncrement={() =>
                    adjustQaza(counter.prayerId, counter.remaining + 1, counter.completed)
                  }
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("qaza.markPerformed", {
                    prayer: t(`prayers.${counter.prayerId}`),
                  })}
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
            {t("qaza.hint")}
          </ThemedText>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
  rowBody: {
    flex: 1,
    gap: 2,
  },
  hint: {
    marginTop: Spacing.three,
  },
});
