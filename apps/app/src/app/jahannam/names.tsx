import type { JahannamNameEntry } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
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
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureJahannamContent, getJahannamNames, isJahannamContentReady } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

function NameRow({
  entry,
  isLast,
  tiled,
}: {
  entry: JahannamNameEntry;
  isLast: boolean;
  /** Wide grid cell: card chrome instead of a hairline separator. */
  tiled: boolean;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const tileStyle = useLearnTileStyle();

  return (
    <View
      style={[
        styles.row,
        tiled
          ? tileStyle
          : !isLast && {
              borderBottomColor: tokens.hairline,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
      ]}
    >
      <TvReadableBlock>
        <View style={styles.head}>
          <IconWell
            icon={{
              ios: "flame.fill",
              android: "local_fire_department",
              web: "local_fire_department",
            }}
            tint={tokens.status.warning.color}
            well={44}
            size={20}
          />
          <View style={styles.copy}>
            <LearnProseText proseRole="title">
              {entry.name} ({entry.transliteration})
            </LearnProseText>
            <LearnProseText proseRole="caption" themeColor="mutedForeground">
              {entry.meaning}
            </LearnProseText>
          </View>
        </View>
      </TvReadableBlock>
      <View style={[styles.quote, { backgroundColor: tokens.accentSoft }]}>
        <View style={styles.quoteMeta}>
          <ReferenceLine reference={entry.quran.label} />
          <QuranAyahBookmarkButton surah={entry.quran.surah} ayah={entry.quran.ayahFrom} />
        </View>
        <TvReadableBlock>
          <LearnProseText themeColor="mutedForeground">{entry.quran.excerpt}</LearnProseText>
        </TvReadableBlock>
      </View>
      <TvReadableBlock style={styles.notesTv}>
        <LearnProseText>{entry.context}</LearnProseText>
        <LearnProseText proseRole="caption" themeColor="mutedForeground" style={styles.tafsir}>
          {t("jahannam.tafsirNote")}: {entry.tafsirNote}
        </LearnProseText>
        {entry.scholarlyNote ? (
          <LearnProseText proseRole="caption" themeColor="mutedForeground">
            {entry.scholarlyNote}
          </LearnProseText>
        ) : null}
      </TvReadableBlock>
    </View>
  );
}

export default function JahannamNamesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const names = getJahannamNames();
  const wide = useLearnHubLayout();
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 360, max: 3 });

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.namesTitle")}
      subtitle={t("jahannam.namesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/names" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="warning">{t("jahannam.namesLead")}</JannahCallout>
            <Card padding="three">
              <SectionHeader
                title={t("jahannam.namesListTitle")}
                icon={{
                  ios: "flame.fill",
                  android: "local_fire_department",
                  web: "local_fire_department",
                }}
              />
              <LearnColumnsGrid
                columns={columns}
                gap={Spacing.three}
                stackGap={0}
                style={styles.list}
              >
                {names.map((entry, index) => (
                  <NameRow
                    key={entry.id}
                    entry={entry}
                    isLast={index === names.length - 1}
                    tiled={columns > 1}
                  />
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
  row: { paddingVertical: Spacing.three, gap: Spacing.three },
  head: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  copy: { flex: 1, gap: Spacing.one },
  quote: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  quoteMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  tafsir: { fontStyle: "italic" },
  notesTv: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam/names");
