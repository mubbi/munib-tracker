import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  ContentInlineLink,
  ContentInlineLinkGroup,
} from "@/components/content/content-inline-link";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getBattlesFigures, getBattlesTopic } from "@/lib/battles";

export default function BattlesFiguresScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const figures = getBattlesFigures();

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.figuresTitle")}
      subtitle={t("battles.figuresSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/battles" as Href))}
    >
      <Seo path="/battles/figures" />
      <Stagger>
        <JannahCallout tone="info">{t("battles.figuresIntro")}</JannahCallout>

        <LearnReadingChrome surface="battles">
          {figures.map((figure) => (
            <Card key={figure.id} padding="three" style={styles.card}>
              <SectionHeader
                title={figure.name}
                icon={{ ios: "person.fill", android: "person", web: "person" }}
              />
              {figure.epithet ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {figure.epithet}
                </ThemedText>
              ) : null}
              <ThemedText type="small" style={styles.summary}>
                {figure.summary}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("battles.figureRole", { role: figure.role })}
              </ThemedText>

              <View style={styles.battles}>
                <ThemedText type="smallBold">{t("battles.figureBattles")}</ThemedText>
                <ContentInlineLinkGroup>
                  {figure.battles.map((battleId) => {
                    const battle = getBattlesTopic(battleId);
                    if (!battle) return null;
                    return (
                      <ContentInlineLink
                        key={battleId}
                        label={battle.title}
                        onPress={() =>
                          router.push({
                            pathname: "/battles/[topic]",
                            params: { topic: battleId },
                          })
                        }
                      />
                    );
                  })}
                </ContentInlineLinkGroup>
              </View>

              <View style={styles.lesson}>
                <ThemedText type="smallBold">{t("battles.figureLesson")}</ThemedText>
                <ThemedText type="small" themeColor="mutedForeground">
                  {figure.lesson}
                </ThemedText>
              </View>
            </Card>
          ))}
        </LearnReadingChrome>

        <JannahDisclaimer textKey="battles.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.three },
  summary: { marginTop: Spacing.two, lineHeight: 22 },
  battles: { marginTop: Spacing.three, gap: Spacing.one },
  lesson: { marginTop: Spacing.three, gap: Spacing.one },
});
