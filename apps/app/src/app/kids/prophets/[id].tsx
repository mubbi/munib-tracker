import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahBody, JannahTakeaway } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { ProphetsProfileCard } from "@/components/prophets/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { KIDS_PROPHET_IDS, kidsProphetView } from "@/lib/circles/kids-content";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureProphetsContent, getProphetsTopic, isProphetsContentReady } from "@/lib/prophets";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams(): Array<{ id: string }> {
  return KIDS_PROPHET_IDS.map((id) => ({ id }));
}

/**
 * One vetted prophet biography for kids (E12, D27): the dataset's summary,
 * body and profile only — no hadith excerpts and no links out of kids mode.
 * Ids outside `KIDS_PROPHET_IDS` render "not found".
 */
export default function KidsProphetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready } = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const view = useMemo(() => {
    const topic = ready ? getProphetsTopic(id) : undefined;
    return topic ? kidsProphetView(topic) : null;
  }, [ready, id]);

  return (
    <ScreenLayout
      eyebrow={t("kids.prophets.title")}
      title={view?.title ?? t("kids.prophets.title")}
      onBack={() => goBackOrReplace(router, "/kids/prophets")}
    >
      <Seo path={`/kids/prophets/${id ?? ""}`} index={false} />
      {!ready ? (
        <LearnContentLoading />
      ) : !view ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("kids.prophets.notFound")}
          actionLabel={t("kids.prophets.title")}
          onAction={() => router.replace("/kids/prophets")}
        />
      ) : (
        <LearnReadingChrome surface="prophets">
          <View style={styles.stack}>
            <JannahTakeaway text={view.summary} />
            <JannahBody paragraphs={view.body} />
            {view.profile ? <ProphetsProfileCard profile={view.profile} /> : null}
          </View>
        </LearnReadingChrome>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids/prophets/[id]");
