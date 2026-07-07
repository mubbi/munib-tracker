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
import { getQuranGuideTimeline } from "@/lib/quran-guide";
import { chevronForward } from "@/lib/rtl";

export default function LearnQuranRevelationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const events = getQuranGuideTimeline();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.revelationTitle")}
      subtitle={t("learnQuran.revelationSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/revelation" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.revelationIntro")}</JannahCallout>

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
                  ? () => router.push(`/learn-quran/${event.topicId}` as Href)
                  : undefined
              }
              style={styles.cardPressable}
            >
              <Card padding="three" style={styles.card}>
                <View style={styles.badges}>
                  <Pill
                    label={t("seerah.ceBadge", { year: event.year })}
                    compact
                    color={colors.accentText}
                    background={tokens.accentSoft}
                  />
                  {event.ah != null ? (
                    <Pill
                      label={t("seerah.ahBadge", { ah: event.ah })}
                      compact
                      color={tokens.status.success.color}
                      background={tokens.status.success.soft}
                    />
                  ) : null}
                  {event.location ? (
                    <View style={styles.location}>
                      <SymbolView
                        name={{ ios: "mappin", android: "place", web: "place" }}
                        size={11}
                        tintColor={colors.mutedForeground}
                      />
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {event.location}
                      </ThemedText>
                    </View>
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
                      {t("learnQuran.readArticle")}
                    </ThemedText>
                    <SymbolView name={chevronForward} size={12} tintColor={colors.accent} />
                  </View>
                ) : null}
              </Card>
            </PressableScale>
          </View>
        ))}

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
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
  location: { flexDirection: "row", alignItems: "center", gap: 2 },
  title: { marginBottom: Spacing.one },
  linkRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one, marginTop: Spacing.two },
});
