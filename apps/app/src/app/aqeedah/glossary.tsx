import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureAqeedahContent, getAqeedahGlossary, isAqeedahContentReady } from "@/lib/aqeedah";
import { goBackOrReplace } from "@/lib/navigation";

export default function AqeedahGlossaryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureAqeedahContent, isAqeedahContentReady);
  const terms = getAqeedahGlossary();

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={t("aqeedah.glossaryTitle")}
      subtitle={t("aqeedah.glossarySubtitle")}
      onBack={() => goBackOrReplace(router, "/aqeedah" as Href)}
    >
      <Seo path="/aqeedah/glossary" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("aqeedah.glossaryIntro")}</JannahCallout>

          <LearnReadingChrome surface="aqeedah">
            <Card padding="three">
              <SectionHeader
                title={t("aqeedah.glossaryListTitle")}
                icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
              />
              <View style={styles.list}>
                {terms.map((term) => (
                  <View key={term.id} style={styles.term}>
                    <ThemedText type="smallBold">{term.term}</ThemedText>
                    {term.transliteration ? (
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {term.transliteration}
                      </ThemedText>
                    ) : null}
                    <ThemedText type="small" themeColor="mutedForeground" style={styles.definition}>
                      {term.definition}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </Card>
          </LearnReadingChrome>

          <JannahDisclaimer textKey="aqeedah.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.four, marginTop: Spacing.three },
  term: { gap: Spacing.half },
  definition: { lineHeight: 22 },
});
