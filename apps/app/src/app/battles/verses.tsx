import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureBattlesContent,
  getBattlesTopic,
  getBattlesVerses,
  isBattlesContentReady,
} from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";

export default function BattlesVersesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const { sizes } = useReadingTypography();
  const verses = getBattlesVerses();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof verses>();
    for (const verse of verses) {
      const list = map.get(verse.battleId) ?? [];
      list.push(verse);
      map.set(verse.battleId, list);
    }
    return map;
  }, [verses]);

  const battleIds = [...grouped.keys()];

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.versesTitle")}
      subtitle={t("battles.versesSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
    >
      <Seo path="/battles/verses" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.versesIntro")}</JannahCallout>

          <LearnReadingChrome surface="battles">
            {battleIds.map((battleId) => {
              const items = grouped.get(battleId) ?? [];
              const battle = getBattlesTopic(battleId);
              const title = battle?.title ?? battleId;
              return (
                <Card key={battleId} padding="three">
                  <SectionHeader
                    title={title}
                    icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
                  />
                  <View style={styles.list}>
                    {items.map((verse, index) => (
                      <PressableScale
                        key={verse.id}
                        haptic="light"
                        accessibilityRole="link"
                        onPress={() =>
                          router.push({
                            pathname: "/quran/[surah]",
                            params: { surah: String(verse.surah), ayah: String(verse.ayahFrom) },
                          })
                        }
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
                          <ReferenceLine reference={verse.label} />
                          <ThemedText
                            type="small"
                            style={{
                              fontSize: sizes.translation,
                              lineHeight: sizes.translation * 1.45,
                            }}
                          >
                            {verse.excerpt}
                          </ThemedText>
                          <ThemedText type="caption" themeColor="mutedForeground">
                            {verse.context}
                          </ThemedText>
                        </View>
                        <QuranAyahBookmarkButton surah={verse.surah} ayah={verse.ayahFrom} />
                      </PressableScale>
                    ))}
                  </View>
                </Card>
              );
            })}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  copy: { flex: 1, gap: Spacing.one },
});
