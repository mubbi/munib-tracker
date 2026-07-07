import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getBattlesGlossary } from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";

export default function BattlesGlossaryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const terms = getBattlesGlossary();

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.glossaryTitle")}
      subtitle={t("battles.glossarySubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
    >
      <Seo path="/battles/glossary" />
      <Stagger>
        <JannahCallout tone="info">{t("battles.glossaryIntro")}</JannahCallout>

        <LearnReadingChrome surface="battles">
          <Card padding="three">
            <SectionHeader
              title={t("battles.glossaryListTitle")}
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

        <JannahDisclaimer textKey="battles.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.four, marginTop: Spacing.three },
  term: { gap: Spacing.half },
  definition: { lineHeight: 22 },
});
