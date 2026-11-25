import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LearnContentLoading } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { KIDS_PROPHET_IDS, kidsProphetView } from "@/lib/circles/kids-content";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureProphetsContent, getProphetsTopic, isProphetsContentReady } from "@/lib/prophets";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Prophets for kids (NF-3.16 E12, D27): the bundled prophet biographies vetted
 * for children (`KIDS_PROPHET_IDS`), in the dataset's order. Text comes from
 * the dataset by id; nothing kids-specific is authored.
 */
export default function KidsProphetsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { ready } = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const items = useMemo(() => {
    if (!ready) return null;
    return KIDS_PROPHET_IDS.flatMap((id) => {
      const topic = getProphetsTopic(id);
      const view = topic ? kidsProphetView(topic) : null;
      return view ? [view] : [];
    });
  }, [ready]);

  return (
    <ScreenLayout
      eyebrow={t("kids.eyebrow")}
      title={t("kids.prophets.title")}
      onBack={() => goBackOrReplace(router, "/kids")}
    >
      <Seo path="/kids/prophets" index={false} />
      <View style={styles.stack}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("kids.prophets.intro")}
        </ThemedText>
        {!items ? (
          <LearnContentLoading />
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              style={styles.gap}
              accessibilityLabel={item.title}
              onPress={() =>
                router.push({ pathname: "/kids/prophets/[id]", params: { id: item.id } })
              }
            >
              <ThemedText type="smallBold">{item.title}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {item.summary}
              </ThemedText>
            </Card>
          ))
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids/prophets");
