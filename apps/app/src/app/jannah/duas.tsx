import { DUA_ITEMS } from "@munib-tracker/shared/content";
import type { DuaItem, JannahDuaEntry } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getJannahDuas } from "@/lib/jannah";
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
        sourceHref="/jannah/duas"
        isFavorite={isFavorite}
        onToggleFavorite={() => toggle(dua.id)}
      />
    </View>
  );
}

export default function JannahDuasScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const entries = getJannahDuas();
  const byId = new Map(DUA_ITEMS.map((item) => [item.id, item]));
  useEnsureDuaFavoritesLoaded();

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={t("jannah.duasTitle")}
      subtitle={t("jannah.duasSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/jannah"))}
    >
      <Seo path="/jannah/duas" />
      <Stagger>
        <JannahCallout tone="success">{t("jannah.duasLead")}</JannahCallout>

        {entries.map((entry, index) => {
          const dua = byId.get(entry.duaId);
          if (!dua) return null;
          return <JannahDuaEntryBlock key={entry.id} entry={entry} dua={dua} index={index} />;
        })}

        <JannahDisclaimer />
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
