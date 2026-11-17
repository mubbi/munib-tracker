import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
  useLearnTileStyle,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureJahannamContent,
  getJahannamReferences,
  isJahannamContentReady,
} from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";

export default function JahannamReferencesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const references = getJahannamReferences();
  const wide = useLearnHubLayout();
  const tileStyle = useLearnTileStyle();
  // Wide web / tablets: reference cards flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 300, max: 3 });

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.referencesTitle")}
      subtitle={t("jahannam.referencesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/references" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="info">{t("jahannam.referencesLead")}</JannahCallout>
            <Card padding="three">
              <SectionHeader
                title={t("jahannam.referencesListTitle")}
                icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
              />
              <LearnColumnsGrid
                columns={columns}
                gap={Spacing.three}
                stackGap={0}
                style={styles.list}
              >
                {references.map((ref, index) => (
                  <TvReadableBlock key={ref.id}>
                    <View
                      style={[
                        styles.row,
                        columns > 1
                          ? tileStyle
                          : index > 0 && {
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
                        <LearnProseText proseRole="title">{ref.title}</LearnProseText>
                        <LearnProseText proseRole="caption" themeColor="mutedForeground">
                          {ref.note}
                        </LearnProseText>
                      </View>
                    </View>
                  </TvReadableBlock>
                ))}
              </LearnColumnsGrid>
            </Card>
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      </LearnContentGate>
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
});
