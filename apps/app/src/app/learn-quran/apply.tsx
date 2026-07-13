import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureQuranGuideContent, getQuranGuideApplyChallengeForDate } from "@/lib/quran-guide";
import {
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideApplyChallengeCompleted,
  useQuranGuideProgressActions,
} from "@/stores/quran-guide-progress-store";

export default function LearnQuranApplyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureQuranGuideContent);
  const challenge = getQuranGuideApplyChallengeForDate();
  useEnsureQuranGuideProgressLoaded();
  const completed = useQuranGuideApplyChallengeCompleted(challenge?.id ?? "");
  const { toggleApplyChallenge } = useQuranGuideProgressActions();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.applyTitle")}
      subtitle={t("learnQuran.applySubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/apply" />
      {!contentReady ? null : !challenge ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.title")}
          onAction={() => router.replace("/learn-quran" as Href)}
        />
      ) : (
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.applyIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran">
            <Card padding="three">
              <ThemedText type="caption" themeColor="mutedForeground">
                {challenge.verseLabel}
              </ThemedText>
              <ThemedText type="small" style={styles.verse}>
                "{challenge.verseExcerpt}"
              </ThemedText>
            </Card>

            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.todayChallenge")}
                icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
              />
              <ThemedText type="title" style={styles.challenge}>
                {challenge.challenge}
              </ThemedText>
              <View style={[styles.habitBox, { backgroundColor: tokens.accentSoft }]}>
                <ThemedText type="caption" style={{ color: colors.accent }}>
                  {t("learnQuran.habitLabel")}
                </ThemedText>
                <ThemedText type="small">{challenge.habit}</ThemedText>
              </View>
            </Card>

            <Button
              label={
                completed ? t("learnQuran.challengeDone") : t("learnQuran.markChallengeComplete")
              }
              variant={completed ? "secondary" : "primary"}
              fullWidth
              onPress={() => void toggleApplyChallenge(challenge.id)}
            />
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  verse: { lineHeight: 24, marginTop: Spacing.two, fontStyle: "italic" },
  challenge: { marginTop: Spacing.three, lineHeight: 28 },
  habitBox: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
});
