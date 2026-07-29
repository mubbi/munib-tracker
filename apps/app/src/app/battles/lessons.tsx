import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureBattlesContent, getBattlesLessonCards, isBattlesContentReady } from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";

export default function BattlesLessonsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const cards = getBattlesLessonCards();

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.lessonsTitle")}
      subtitle={t("battles.lessonsSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
    >
      <Seo path="/battles/lessons" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.lessonsIntro")}</JannahCallout>

          <LearnReadingChrome surface="battles">
            {cards.map((card) => (
              <PressableScale
                key={card.id}
                haptic="light"
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: "/battles/[topic]",
                    params: { topic: card.battleId },
                  })
                }
              >
                <Card padding="three" style={styles.card}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {card.battleTitle}
                  </ThemedText>
                  <LearnProseText proseRole="title">{card.lesson}</LearnProseText>
                  <LearnProseText themeColor="mutedForeground">{card.detail}</LearnProseText>
                  <View style={[styles.chip, { backgroundColor: tokens.accentSoft }]}>
                    <ThemedText type="caption" style={{ color: colors.accent }}>
                      {t("battles.readBattle")}
                    </ThemedText>
                  </View>
                </Card>
              </PressableScale>
            ))}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});
