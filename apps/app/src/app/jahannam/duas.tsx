import type { DuaItem, JahannamDuaEntry } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReadingCard } from "@/components/content/reading-card";
import { JannahCallout, JannahDisclaimer, JannahDuaBlock } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuaItems } from "@/lib/content-loaders";
import { getJahannamDuas, getJahannamRefugeDua } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useIsFavoriteDua,
} from "@/stores/dua-favorites-store";

function JahannamDuaEntryBlock({
  entry,
  dua,
  index,
}: {
  entry: JahannamDuaEntry;
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
          title={t("jahannam.duaNumber", { number: index + 1 })}
          icon={{
            ios: "hands.and.sparkles.fill",
            android: "volunteer_activism",
            web: "volunteer_activism",
          }}
        />
        <View style={[styles.context, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="small" style={{ color: colors.foreground, lineHeight: 22 }}>
            {entry.context}
          </ThemedText>
        </View>
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
        sourceHref="/jahannam/duas"
        surface="jahannam"
        isFavorite={isFavorite}
        onToggleFavorite={() => toggle(dua.id)}
      />
    </View>
  );
}

export default function JahannamDuasScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const entries = getJahannamDuas();
  const refugeDua = getJahannamRefugeDua();
  const [duaItems, setDuaItems] = useState<DuaItem[]>([]);
  useEffect(() => {
    void loadDuaItems().then(setDuaItems);
  }, []);
  const byId = new Map(duaItems.map((item) => [item.id, item]));
  useEnsureDuaFavoritesLoaded();

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.duasTitle")}
      subtitle={t("jahannam.duasSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
    >
      <Seo path="/jahannam/duas" />
      <Stagger>
        <LearnReadingChrome surface="jahannam">
          <JannahCallout tone="success">{t("jahannam.duasLead")}</JannahCallout>

          {refugeDua ? (
            <JannahDuaBlock
              title={t("jahannam.refugeDuaTitle")}
              arabic={refugeDua.arabic}
              transliteration={refugeDua.transliteration}
              translation={refugeDua.translation}
              reference={refugeDua.reference}
            />
          ) : null}

          {entries.map((entry, index) => {
            const dua = byId.get(entry.duaId);
            if (!dua) return null;
            return <JahannamDuaEntryBlock key={entry.id} entry={entry} dua={dua} index={index} />;
          })}
        </LearnReadingChrome>
        <JannahDisclaimer textKey="jahannam.disclaimer" />
      </Stagger>
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
