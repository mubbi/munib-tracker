import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
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
import {
  ensureQuranGuideContent,
  getQuranGuideApplyChallengeForDate,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import {
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideApplyChallengeCompleted,
  useQuranGuideProgressActions,
} from "@/stores/quran-guide-progress-store";

export default function LearnQuranApplyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
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
      {!contentReady ? (
        <LearnContentLoading />
      ) : !challenge ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.title")}
          onAction={() => router.replace("/learn-quran" as Href)}
        />
      ) : (
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.applyIntro")}</JannahCallout>

          <LearnReadingChrome
            surface="learn_quran"
            listenText={[challenge.verseExcerpt, challenge.challenge, challenge.habit].join("\n\n")}
          >
            <ApplyChallengeCards
              verseLabel={challenge.verseLabel}
              verseExcerpt={challenge.verseExcerpt}
              challenge={challenge.challenge}
              habit={challenge.habit}
              habitLabel={t("learnQuran.habitLabel")}
              challengeTitle={t("learnQuran.todayChallenge")}
              accent={colors.accent}
              accentSoft={tokens.accentSoft}
            />

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

function ApplyChallengeCards({
  verseLabel,
  verseExcerpt,
  challenge,
  habit,
  habitLabel,
  challengeTitle,
  accent,
  accentSoft,
}: {
  verseLabel: string;
  verseExcerpt: string;
  challenge: string;
  habit: string;
  habitLabel: string;
  challengeTitle: string;
  accent: string;
  accentSoft: string;
}) {
  const { sizes } = useReadingTypography();
  const translation = sizes.translation;
  const bodyLineHeight = Math.round(translation * 1.5);
  const challengeLineHeight = Math.round(translation * 1.45);

  return (
    <>
      <Card padding="three" style={styles.card}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {verseLabel}
        </ThemedText>
        <ThemedText
          type="default"
          style={[
            styles.verse,
            {
              fontSize: translation,
              lineHeight: bodyLineHeight,
            },
          ]}
        >
          "{verseExcerpt}"
        </ThemedText>
      </Card>

      <Card padding="three" style={styles.card}>
        <SectionHeader
          title={challengeTitle}
          icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
        />
        <ThemedText
          type="default"
          style={[
            styles.challenge,
            {
              fontSize: translation,
              lineHeight: challengeLineHeight,
            },
          ]}
        >
          {challenge}
        </ThemedText>
        <View style={[styles.habitBox, { backgroundColor: accentSoft }]}>
          <ThemedText type="caption" style={{ color: accent }}>
            {habitLabel}
          </ThemedText>
          <ThemedText
            type="small"
            style={{
              fontSize: Math.max(13, translation - 1),
              lineHeight: Math.round(Math.max(13, translation - 1) * 1.45),
            }}
          >
            {habit}
          </ThemedText>
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    overflow: "visible",
  },
  verse: {
    fontStyle: "italic",
    flexShrink: 1,
    alignSelf: "stretch",
  },
  challenge: {
    fontWeight: "700",
    flexShrink: 1,
    alignSelf: "stretch",
  },
  habitBox: {
    marginTop: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    gap: Spacing.one,
    overflow: "visible",
  },
});
