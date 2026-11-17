import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnGrid,
  LearnSplitLayout,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideTadabburPrompts,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LearnQuranTadabburScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const prompts = getQuranGuideTadabburPrompts();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.tadabburTitle")}
      subtitle={t("learnQuran.tadabburSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/tadabbur" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="tadabbur" />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.tadabburIntro")}</JannahCallout>

            <LearnReadingChrome surface="learn_quran">
              <LearnGrid maxColumns={2} gap={Spacing.four} passthrough>
                {prompts.map((prompt) => (
                  <TvReadableBlock key={prompt.id}>
                    <Card padding="three" style={styles.card}>
                      <LearnProseText proseRole="title">{prompt.question}</LearnProseText>
                      <LearnProseText proseRole="caption" themeColor="mutedForeground">
                        {prompt.hint}
                      </LearnProseText>
                    </Card>
                  </TvReadableBlock>
                ))}
              </LearnGrid>

              <Button
                label={t("learnQuran.openJournal")}
                variant="secondary"
                fullWidth
                onPress={() => router.push("/journal" as Href)}
              />
            </LearnReadingChrome>

            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/tadabbur");
