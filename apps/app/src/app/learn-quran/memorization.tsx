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
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getQuranGuideMemorizationPlans } from "@/lib/quran-guide";

export default function LearnQuranMemorizationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const plans = getQuranGuideMemorizationPlans();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.hifzTitle")}
      subtitle={t("learnQuran.hifzSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/learn-quran" as Href))}
    >
      <Seo path="/learn-quran/memorization" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.hifzIntro")}</JannahCallout>

        <LearnReadingChrome surface="learn_quran">
          {plans.map((plan) => (
            <Card key={plan.id} padding="three" style={styles.card}>
              <ThemedText type="title">{plan.title}</ThemedText>
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
            </Card>
          ))}

          <Button
            label={t("learnQuran.openQuranHifz")}
            variant="primary"
            fullWidth
            onPress={() => router.push("/quran")}
          />
        </LearnReadingChrome>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.three, gap: Spacing.two },
  surahs: { gap: Spacing.one, marginTop: Spacing.two },
  tipBox: {
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
