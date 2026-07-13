import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureJahannamContent, getJahannamReferences } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";

export default function JahannamReferencesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureContent(ensureJahannamContent);
  const references = getJahannamReferences();

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.referencesTitle")}
      subtitle={t("jahannam.referencesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
    >
      <Seo path="/jahannam/references" />
      <Stagger>
        <LearnReadingChrome surface="jahannam">
          <JannahCallout tone="info">{t("jahannam.referencesLead")}</JannahCallout>
          <Card padding="three">
            <SectionHeader
              title={t("jahannam.referencesListTitle")}
              icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
            />
            <View style={styles.list}>
              {references.map((ref, index) => (
                <View
                  key={ref.id}
                  style={[
                    styles.row,
                    index > 0 && {
                      borderTopColor: tokens.hairline,
                      borderTopWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <IconWell
                    icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                    tint={colors.accent}
                    well={36}
                    size={16}
                  />
                  <View style={styles.copy}>
                    <ThemedText type="smallBold">{ref.title}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
                      {ref.note}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </LearnReadingChrome>
        <JannahDisclaimer textKey="jahannam.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two },
  row: {
    flexDirection: "row",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: "flex-start",
  },
  copy: { flex: 1, gap: Spacing.one },
  note: { lineHeight: 18 },
});
