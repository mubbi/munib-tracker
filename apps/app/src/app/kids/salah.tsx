import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { GuideMadhhabNotes } from "@/components/fiqh/guide-madhhab-notes";
import { JannahTakeaway } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { RECITE_ALONG_ICON } from "@/components/quran/recite-along-button";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { SalahGuideSteps } from "@/components/salah-guide/topic-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import {
  isKidsSalahTopicId,
  KIDS_SALAH_TOPIC_IDS,
  type KidsSalahTopicId,
  kidsSalahTopicView,
} from "@/lib/circles/kids-content";
import { goBackOrReplace } from "@/lib/navigation";
import { FATIHAH_PASSAGE } from "@/lib/recite-along/passages";
import {
  ensureSalahGuideContent,
  getSalahGuideTopic,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

const STEP_LABEL_KEY: Record<KidsSalahTopicId, string> = {
  wudu: "kids.salahPath.step.wudu",
  "prayer-times": "kids.salahPath.step.fivePrayers",
  "how-to-pray": "kids.salahPath.step.howToPray",
};

/**
 * Kids salah path (NF-3.16 E12, D27): wudu basics → the five daily Salah → how
 * to pray. Renders a curated subset of the bundled Salah guide BY ID — the
 * summary, the procedural steps and the madhhab notes — never the adult
 * guide's purity rulings (no hayd / nifas / janabah, A2). No new text authored.
 */
export default function KidsSalahPathScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ topic?: string }>();
  const { ready } = useEnsureContent(ensureSalahGuideContent, isSalahGuideContentReady);
  const current: KidsSalahTopicId = isKidsSalahTopicId(params.topic)
    ? params.topic
    : KIDS_SALAH_TOPIC_IDS[0];
  const topic = ready ? getSalahGuideTopic(current) : undefined;
  const view = useMemo(() => (topic ? kidsSalahTopicView(topic) : null), [topic]);
  const reciteAvailable = useReciteAlongAvailable();

  return (
    <ScreenLayout
      eyebrow={t("kids.eyebrow")}
      title={t("kids.salahPath.title")}
      onBack={() => goBackOrReplace(router, "/kids")}
    >
      <Seo path="/kids/salah" index={false} />
      <View style={styles.stack}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("kids.salahPath.intro")}
        </ThemedText>
        <SegmentedControl<KidsSalahTopicId>
          options={KIDS_SALAH_TOPIC_IDS.map((id) => ({ id, label: t(STEP_LABEL_KEY[id]) }))}
          value={current}
          onChange={(id) => router.setParams({ topic: id })}
        />
        {!view ? (
          <LearnContentLoading />
        ) : (
          <LearnReadingChrome surface="salah_guide">
            <View style={styles.stack}>
              <ThemedText type="subtitle">{view.title}</ThemedText>
              <JannahTakeaway text={view.summary} />
              {view.steps.length ? <SalahGuideSteps steps={view.steps} /> : null}
              {/* D27 + D68: practise the al-Fatihah of every rakah in kids recite-along. */}
              {current === "how-to-pray" && reciteAvailable ? (
                <Button
                  label={t("kids.salahPath.reciteFatihah")}
                  icon={RECITE_ALONG_ICON}
                  variant="secondary"
                  fullWidth
                  accessibilityHint={t("kids.salahPath.reciteFatihahHint")}
                  onPress={() =>
                    router.push({
                      pathname: "/kids/recite",
                      params: { surah: String(FATIHAH_PASSAGE.surah) },
                    })
                  }
                />
              ) : null}
              <GuideMadhhabNotes ids={view.differenceIds} />
            </View>
          </LearnReadingChrome>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids/salah");
