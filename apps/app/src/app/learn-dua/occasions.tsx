import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureLearnDuaContent,
  getLearnDuaOccasions,
  isLearnDuaContentReady,
} from "@/lib/learn-dua";
import { goBackOrReplace } from "@/lib/navigation";

const CATEGORY_ORDER = ["daily", "situational", "quranic"] as const;

export default function LearnDuaOccasionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureLearnDuaContent, isLearnDuaContentReady);
  const occasions = getLearnDuaOccasions();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_dua"
      eyebrow={t("learnDua.eyebrow")}
      title={t("learnDua.occasionsTitle")}
      subtitle={t("learnDua.occasionsSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-dua" as Href)}
    >
      <Seo path="/learn-dua/occasions" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnDua.occasionsIntro")}</JannahCallout>

          {CATEGORY_ORDER.map((category) => {
            const items = occasions.filter((occasion) => occasion.category === category);
            if (!items?.length) return null;
            return (
              <Card key={category} padding="three">
                <SectionHeader
                  title={t(`learnDua.occasionsCategory.${category}`)}
                  icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
                />
                <View style={styles.rows}>
                  {items.map((occasion) => (
                    <JannahNavRow
                      key={occasion.id}
                      icon={{
                        ios: occasion.topicId ? "text.book.closed.fill" : "hands.sparkles.fill",
                        android: occasion.topicId ? "auto_stories" : "volunteer_activism",
                        web: occasion.topicId ? "auto_stories" : "volunteer_activism",
                      }}
                      title={occasion.title}
                      subtitle={occasion.summary}
                      onPress={() =>
                        occasion.topicId
                          ? router.push({
                              pathname: "/learn-dua/[topic]",
                              params: { topic: occasion.topicId },
                            })
                          : router.push("/dua")
                      }
                    />
                  ))}
                </View>
              </Card>
            );
          })}

          <JannahDisclaimer textKey="learnDua.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
