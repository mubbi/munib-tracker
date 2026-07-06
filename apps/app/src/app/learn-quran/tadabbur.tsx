import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getQuranGuideTadabburPrompts } from "@/lib/quran-guide";

export default function LearnQuranTadabburScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prompts = getQuranGuideTadabburPrompts();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.tadabburTitle")}
      subtitle={t("learnQuran.tadabburSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/learn-quran" as Href))}
    >
      <Seo path="/learn-quran/tadabbur" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.tadabburIntro")}</JannahCallout>

        <LearnReadingChrome surface="learn_quran">
          {prompts.map((prompt) => (
            <Card key={prompt.id} padding="three" style={styles.card}>
              <ThemedText type="smallBold">{prompt.question}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
                {prompt.hint}
              </ThemedText>
            </Card>
          ))}

          <Button
            label={t("learnQuran.openJournal")}
            variant="secondary"
            fullWidth
            onPress={() => router.push("/journal" as Href)}
          />
        </LearnReadingChrome>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.three, gap: Spacing.two },
  hint: { lineHeight: 18 },
});
