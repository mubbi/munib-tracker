import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  ContentInlineLink,
  ContentInlineLinkGroup,
} from "@/components/content/content-inline-link";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureBattlesContent,
  getBattlesFigures,
  getBattlesTopic,
  isBattlesContentReady,
} from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";

export default function BattlesFiguresScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { ready: contentReady } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const figures = getBattlesFigures();

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.figuresTitle")}
      subtitle={t("battles.figuresSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
    >
      <Seo path="/battles/figures" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.figuresIntro")}</JannahCallout>

          <LearnReadingChrome surface="battles">
            {figures.map((figure) => {
              const isFocused = focus === figure.id;
              return (
                <Card
                  key={figure.id}
                  padding="three"
                  style={isFocused ? { borderColor: colors.accent, borderWidth: 1 } : undefined}
                >
                  <SectionHeader
                    title={figure.name}
                    icon={{ ios: "person.fill", android: "person", web: "person" }}
                  />
                  {figure.epithet ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {figure.epithet}
                    </ThemedText>
                  ) : null}
                  <LearnProseText style={styles.summary}>{figure.summary}</LearnProseText>
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
                    <LearnProseText themeColor="mutedForeground">{figure.lesson}</LearnProseText>
                  </View>
                </Card>
              );
            })}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summary: { marginTop: Spacing.two },
  battles: { marginTop: Spacing.three, gap: Spacing.one },
  lesson: { marginTop: Spacing.three, gap: Spacing.one },
});
