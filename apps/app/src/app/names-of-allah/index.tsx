import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, type ScrollView, Share, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { allNameTracks, nameAudioTrack, namesCompleteTrack } from "@/lib/audio-tracks";
import { formatReadingShare } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

const NAMES_HREF = "/names-of-allah";

export default function NamesOfAllahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const scrollRef = useRef<ScrollView>(null);
  const { register: registerCard, onScroll } = useScrollToActive(scrollRef, audio.current?.id);

  const playFrom = (position: number) =>
    audio.play(allNameTracks(NAMES_OF_ALLAH), position, { sourceHref: NAMES_HREF });

  /** Play only the single tapped name (no auto-advance through the list). */
  const playName = (name: (typeof NAMES_OF_ALLAH)[number]) => {
    const track = nameAudioTrack(name);
    if (track) audio.play([track], 0, { sourceHref: NAMES_HREF });
  };

  const shareName = async (name: (typeof NAMES_OF_ALLAH)[number]) => {
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

  return (
    <ScreenLayout
      scrollRef={scrollRef}
      onScroll={onScroll}
      eyebrow={t("names.eyebrow")}
      title={t("names.title")}
      subtitle={t("names.subtitle", { count: NAMES_OF_ALLAH.length })}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
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

        <View style={styles.grid}>
          {NAMES_OF_ALLAH.map((name, position) => {
            const isPlaying = audio.current?.id === name.id;
            return (
              <View key={name.id} ref={registerCard(name.id)} style={styles.cardWrap}>
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
                        {position + 1}
                      </ThemedText>
                    </View>
                    <ThemedText type="arabic" style={styles.arabic}>
                      {name.arabic}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="smallBold"
                    numberOfLines={1}
                    style={{ color: colors.accentText }}
                  >
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
                            ? {
                                ios: "pause.fill",
                                android: "pause",
                                web: "pause",
                              }
                            : {
                                ios: "play.fill",
                                android: "play_arrow",
                                web: "play_arrow",
                              }
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
                        name={{
                          ios: "square.and.arrow.up",
                          android: "share",
                          web: "share",
                        }}
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
          })}
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  playActions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  flex: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  cardWrap: {
    flexGrow: 1,
    flexBasis: "47%",
  },
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
