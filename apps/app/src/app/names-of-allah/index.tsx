import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItemInfo, Platform, Share, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { allNameTracks, nameAudioTrack, namesCompleteTrack } from "@/lib/audio-tracks";
import { buildNamesActivity } from "@/lib/continue-activity";
import { webPageSchema } from "@/lib/seo/structured-data";
import { formatReadingShare } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";

const NAMES_HREF = "/names-of-allah";
/** Approximate row height (card + column gap) for scroll recovery in the 2-column grid. */
const NAME_ROW_HEIGHT = 196;
/** Play-all header card + bottom margin. */
const NAMES_LIST_HEADER_HEIGHT = 88;

type Name = (typeof NAMES_OF_ALLAH)[number];

export default function NamesOfAllahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const audio = useAudioPlayerContext();
  const listRef = useRef<FlatList<Name>>(null);

  const activeId =
    audio.current?.id && NAMES_OF_ALLAH.some((n) => n.id === audio.current?.id)
      ? audio.current.id
      : undefined;

  const indexForKey = useCallback((id: string) => NAMES_OF_ALLAH.findIndex((n) => n.id === id), []);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(listRef, activeId, indexForKey, {
    viewOffset: Spacing.two,
    itemCount: NAMES_OF_ALLAH.length,
    numColumns: 2,
    listHeaderHeight: NAMES_LIST_HEADER_HEIGHT,
  });

  const getItemLayout = useCallback((_: ArrayLike<Name> | null | undefined, index: number) => {
    const row = Math.floor(index / 2);
    return {
      length: NAME_ROW_HEIGHT,
      offset: NAMES_LIST_HEADER_HEIGHT + row * NAME_ROW_HEIGHT,
      index,
    };
  }, []);

  const playFrom = (position: number) => {
    audio.play(allNameTracks(NAMES_OF_ALLAH), position, { sourceHref: NAMES_HREF });
    const name = NAMES_OF_ALLAH[position];
    if (name) recordContinueActivity(buildNamesActivity(name, { isAudio: true }));
  };

  /** Play only the single tapped name (no auto-advance through the list). */
  const playName = (name: Name) => {
    const track = nameAudioTrack(name);
    if (track) {
      audio.play([track], 0, { sourceHref: NAMES_HREF });
      recordContinueActivity(buildNamesActivity(name, { isAudio: true }));
    }
  };

  const shareName = async (name: Name) => {
    if (Platform.OS === "web") return;
    try {
      await Share.share({
        message: formatReadingShare({
          title: name.transliteration,
          arabic: name.arabic,
          transliteration: name.transliteration,
          translation: name.meaning ?? name.translation,
        }),
      });
    } catch {
      // cancelled
    }
  };

  const header = (
    <Card padding="three" style={styles.headerCard}>
      <View style={styles.playActions}>
        <Button
          label={t("names.playAll")}
          icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
          onPress={() => playFrom(0)}
          style={styles.flex}
        />
        <Button
          label={t("names.playContinuous")}
          variant="secondary"
          icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          onPress={() => audio.play([namesCompleteTrack()], 0, { sourceHref: NAMES_HREF })}
          style={styles.flex}
        />
      </View>
    </Card>
  );

  const renderItem = ({ item: name, index }: ListRenderItemInfo<Name>) => {
    const isPlaying = activeId === name.id;
    return (
      <View style={styles.cell}>
        <Card
          padding="three"
          style={[
            styles.card,
            isPlaying
              ? { borderColor: colors.accent, borderWidth: 1 }
              : { borderColor: tokens.hairline, borderWidth: 1 },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="caption" style={{ color: colors.accentText }}>
                {index + 1}
              </ThemedText>
            </View>
            <ThemedText type="arabic" style={styles.arabic}>
              {name.arabic}
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accentText }}>
            {name.transliteration}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.meaning}>
            {name.meaning ?? name.translation}
          </ThemedText>
          <View style={styles.footer}>
            {name.audioUri ? (
              <IconButton
                name={
                  isPlaying && audio.isPlaying
                    ? { ios: "pause.fill", android: "pause", web: "pause" }
                    : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
                }
                size={18}
                tintColor={colors.accentForeground}
                background={colors.accent}
                hitTarget={40}
                accessibilityLabel={
                  isPlaying && audio.isPlaying ? t("names.pause") : t("names.play")
                }
                accessibilityState={{ selected: isPlaying }}
                onPress={() => (isPlaying ? audio.toggle() : playName(name))}
              />
            ) : (
              <View />
            )}
            {Platform.OS !== "web" ? (
              <IconButton
                name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                size={16}
                tintColor={colors.mutedForeground}
                background={tokens.accentSoft}
                hitTarget={40}
                accessibilityLabel={t("names.share")}
                onPress={() => shareName(name)}
              />
            ) : null}
          </View>
        </Card>
      </View>
    );
  };

  return (
    <ScreenLayout
      scrollable={false}
      eyebrow={t("names.eyebrow")}
      title={t("names.title")}
      subtitle={t("names.subtitle", { count: NAMES_OF_ALLAH.length })}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/names-of-allah"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("names.title"), path: "/names-of-allah" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/names-of-allah",
            name: "99 Names of Allah — Asma ul Husna",
            description:
              "The 99 beautiful names of Allah (Asma ul-Husna) with Arabic, transliteration, and meaning.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("names.title"), path: "/names-of-allah" },
            ],
          }),
        ]}
      />
      <FlatList
        ref={listRef}
        data={NAMES_OF_ALLAH}
        keyExtractor={(name) => name.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={header}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, width: "100%" },
  listContent: { gap: Spacing.two },
  columnWrapper: { gap: Spacing.two },
  cell: { flex: 1 },
  headerCard: { marginBottom: Spacing.two },
  playActions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  flex: { flex: 1 },
  card: {
    flex: 1,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
  },
  number: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    fontSize: 26,
    lineHeight: 44,
  },
  meaning: {
    marginTop: Spacing.half,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginTop: "auto",
    paddingTop: Spacing.two,
  },
});
