import type { DuaItem, JannahDuaEntry } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReadingCard } from "@/components/content/reading-card";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { DUA_CORPUS } from "@/lib/content-loaders";
import { ensureJannahContent, getJannahDuas, isJannahContentReady } from "@/lib/jannah";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useIsFavoriteDua,
} from "@/stores/dua-favorites-store";

function JannahDuaEntryBlock({
  entry,
  dua,
  index,
}: {
  entry: JannahDuaEntry;
  dua: DuaItem;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const isFavorite = useIsFavoriteDua(dua.id);
  const { toggle } = useDuaFavoritesActions();

  return (
    <View style={styles.block}>
      <Card padding="three">
        <SectionHeader
          title={t("jannah.duaNumber", { number: index + 1 })}
          icon={{
            ios: "hands.and.sparkles.fill",
            android: "volunteer_activism",
            web: "volunteer_activism",
          }}
        />
        <TvReadableBlock>
          <View style={[styles.context, { backgroundColor: tokens.accentSoft }]}>
            <ThemedText type="small" style={{ color: colors.foreground, lineHeight: 22 }}>
              {entry.context}
            </ThemedText>
          </View>
        </TvReadableBlock>
      </Card>
      <ReadingCard
        item={{
          id: dua.id,
          title: dua.title,
          arabic: dua.arabic,
          transliteration: dua.transliteration,
          translation: dua.translation,
          reference: dua.reference,
          audioUri: dua.audioUri,
        }}
        sourceHref="/jannah/duas"
        surface="jannah"
        isFavorite={isFavorite}
        onToggleFavorite={() => toggle(dua.id)}
      />
    </View>
  );
}

export default function JannahDuasScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureJannahContent,
    isJannahContentReady,
  );
  // Settles even if the catalog fails (missing entries skip their rows below).
  const { items: duaItems, ready: duasCatalogReady } = useContentCorpus(DUA_CORPUS);
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when jannah content finishes loading
  const entries = useMemo(() => getJannahDuas(), [contentVersion]);
  const byId = new Map(duaItems.map((item) => [item.id, item]));
  useEnsureDuaFavoritesLoaded();
  const ready = contentReady && duasCatalogReady;
  const wide = useLearnHubLayout();
  // Wide web / tablets: dua blocks sit two per row.
  const columns = learnColumnsFor(wide.contentWidth, { minCell: 420, gap: Spacing.four, max: 2 });

  const duaBlocks = entries.map((entry, index) => {
    const dua = byId.get(entry.duaId);
    if (!dua) return null;
    return <JannahDuaEntryBlock key={entry.id} entry={entry} dua={dua} index={index} />;
  });

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={t("jannah.duasTitle")}
      subtitle={t("jannah.duasSubtitle")}
      onBack={() => goBackOrReplace(router, "/jannah")}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jannah/duas" />
      <LearnContentGate ready={ready}>
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <JannahCallout tone="success">{t("jannah.duasLead")}</JannahCallout>

            {columns > 1 ? (
              <LearnColumnsGrid columns={columns} gap={Spacing.four}>
                {duaBlocks}
              </LearnColumnsGrid>
            ) : (
              duaBlocks
            )}
          </LearnReadingChrome>

          <JannahDisclaimer />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  context: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jannah/duas");
