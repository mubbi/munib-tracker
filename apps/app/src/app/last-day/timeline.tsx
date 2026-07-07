import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getLastDayTimeline } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";
import { chevronForward } from "@/lib/rtl";

export default function LastDayTimelineScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const events = getLastDayTimeline();

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.timelineTitle")}
      subtitle={t("lastDay.timelineSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
    >
      <Seo path="/last-day/timeline" />
      <Stagger>
        <JannahCallout tone="info">{t("lastDay.timelineIntro")}</JannahCallout>

        {events.map((event, index) => (
          <View key={event.id} style={styles.row}>
            <View style={styles.railColumn}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              {index < events.length - 1 ? (
                <View style={[styles.rail, { backgroundColor: tokens.hairline }]} />
              ) : null}
            </View>
            <PressableScale
              haptic="light"
              disabled={!event.topicId}
              accessibilityRole={event.topicId ? "button" : "text"}
              onPress={
                event.topicId
                  ? () =>
                      router.push({
                        pathname: "/last-day/[topic]",
                        params: { topic: event.topicId ?? "" },
                      })
                  : undefined
              }
              style={styles.cardPressable}
            >
              <Card padding="three" style={styles.card}>
                <View style={styles.badges}>
                  <Pill
                    label={t("lastDay.timelineStep", { step: event.order })}
                    compact
                    color={colors.accentText}
                    background={tokens.accentSoft}
                  />
                  {event.signType ? (
                    <Pill
                      label={t(`lastDay.signType.${event.signType}`)}
                      compact
                      color={tokens.status.warning.color}
                      background={tokens.status.warning.soft}
                    />
                  ) : null}
                </View>
                <ThemedText type="smallBold" style={styles.title}>
                  {event.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {event.body}
                </ThemedText>
                {event.topicId ? (
                  <View style={styles.linkRow}>
                    <ThemedText type="caption" style={{ color: colors.accent }}>
                      {t("lastDay.readTopic")}
                    </ThemedText>
                    <SymbolView name={chevronForward()} size={12} tintColor={colors.accent} />
                  </View>
                ) : null}
              </Card>
            </PressableScale>
          </View>
        ))}

        <JannahDisclaimer textKey="lastDay.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.three },
  railColumn: { alignItems: "center", width: 16, paddingTop: Spacing.three },
  dot: { width: 12, height: 12, borderRadius: Radius.pill },
  rail: { width: 2, flex: 1, marginTop: Spacing.one },
  cardPressable: { flex: 1, marginBottom: Spacing.three },
  card: { flex: 1 },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  title: { marginBottom: Spacing.one },
  linkRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one, marginTop: Spacing.two },
});
