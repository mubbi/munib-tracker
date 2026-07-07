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
import { goBackOrReplace } from "@/lib/navigation";
import { getProphetsTimeline } from "@/lib/prophets";
import { chevronForward } from "@/lib/rtl";

export default function ProphetsTimelineScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const events = getProphetsTimeline();

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.timelineTitle")}
      subtitle={t("prophets.timelineSubtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
    >
      <Seo path="/prophets/timeline" />
      <Stagger>
        <JannahCallout tone="info">{t("prophets.timelineIntro")}</JannahCallout>

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
              disabled={!event.prophetId}
              accessibilityRole={event.prophetId ? "button" : "text"}
              onPress={
                event.prophetId
                  ? () =>
                      router.push({
                        pathname: "/prophets/[topic]",
                        params: { topic: event.prophetId ?? "" },
                      })
                  : undefined
              }
              style={styles.cardPressable}
            >
              <Card padding="three" style={styles.card}>
                <View style={styles.badges}>
                  <Pill
                    label={event.era}
                    compact
                    color={colors.accentText}
                    background={tokens.accentSoft}
                  />
                </View>
                <ThemedText type="smallBold" style={styles.title}>
                  {event.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {event.body}
                </ThemedText>
                {event.prophetId ? (
                  <View style={styles.linkRow}>
                    <ThemedText type="caption" style={{ color: colors.accent }}>
                      {t("prophets.readTopic")}
                    </ThemedText>
                    <SymbolView name={chevronForward} size={12} tintColor={colors.accent} />
                  </View>
                ) : null}
              </Card>
            </PressableScale>
          </View>
        ))}

        <JannahDisclaimer textKey="prophets.disclaimer" />
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
