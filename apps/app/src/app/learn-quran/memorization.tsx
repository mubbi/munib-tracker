import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { QuranGuideClipPlayButton } from "@/components/quran-guide/ayah-play-button";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideMemorizationPlans,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { QURAN_GUIDE_MEMORIZATION_LISTEN } from "@/lib/quran-guide-audio";

export default function LearnQuranMemorizationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const plans = getQuranGuideMemorizationPlans();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.hifzTitle")}
      subtitle={t("learnQuran.hifzSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/memorization" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.hifzIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran">
            {plans.map((plan) => {
              const listen =
                QURAN_GUIDE_MEMORIZATION_LISTEN[plan.id] ??
                (plan.surahNumbers?.[0] ? { surah: plan.surahNumbers[0], ayah: 1 } : undefined);
              return (
                <Card key={plan.id} padding="three" style={styles.card}>
                  <View style={styles.planHeader}>
                    <ThemedText type="title" style={styles.planTitle}>
                      {plan.title}
                    </ThemedText>
                    {listen ? (
                      <QuranGuideClipPlayButton
                        audio={listen}
                        sourceHref="/learn-quran/memorization"
                        compact
                      />
                    ) : null}
                  </View>
                  <ThemedText type="small" themeColor="mutedForeground">
                    {plan.summary}
                  </ThemedText>
                  <SectionHeader
                    title={t("learnQuran.hifzSurahs")}
                    icon={{
                      ios: "list.bullet",
                      android: "format_list_bulleted",
                      web: "format_list_bulleted",
                    }}
                  />
                  <View style={styles.surahs}>
                    {plan.surahs.map((surah) => (
                      <ThemedText key={surah} type="small">
                        • {surah}
                      </ThemedText>
                    ))}
                  </View>
                  <View style={[styles.tipBox, { backgroundColor: tokens.status.info.soft }]}>
                    <ThemedText type="caption" style={{ color: tokens.status.info.color }}>
                      {plan.tip}
                    </ThemedText>
                  </View>
                  {plan.surahNumbers?.[0] ? (
                    <Button
                      label={t("learnQuran.openInQuran")}
                      variant="secondary"
                      fullWidth
                      onPress={() => {
                        const surah = plan.surahNumbers?.[0];
                        if (surah == null) return;
                        router.push({
                          pathname: "/quran/[surah]",
                          params: { surah: String(surah) },
                        });
                      }}
                    />
                  ) : null}
                </Card>
              );
            })}

            <Button
              label={t("learnQuran.openQuranHifz")}
              variant="primary"
              fullWidth
              onPress={() => router.push("/quran")}
            />
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  planTitle: { flex: 1 },
  surahs: { gap: Spacing.one, marginTop: Spacing.two },
  tipBox: {
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
