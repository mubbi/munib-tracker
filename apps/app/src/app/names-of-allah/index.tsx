import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, type ScrollView, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { allNameTracks, namesCompleteTrack } from "@/lib/audio-tracks";
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
                    isPlaying ? { borderColor: colors.accent, borderWidth: 1 } : null,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
                      <ThemedText type="caption" style={{ color: colors.accent }}>
                        {position + 1}
                      </ThemedText>
                    </View>
                    <ThemedText type="arabic" style={styles.arabic}>
                      {name.arabic}
                    </ThemedText>
                  </View>
                  <View style={styles.nameRow}>
                    <ThemedText type="smallBold" style={{ color: colors.accent }}>
                      {name.transliteration}
                    </ThemedText>
                    {name.audioUri ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t("common.play")}
                        hitSlop={8}
                        onPress={() => (isPlaying ? audio.toggle() : playFrom(position))}
                      >
                        <SymbolView
                          name={
                            isPlaying && audio.isPlaying
                              ? {
                                  ios: "pause.circle.fill",
                                  android: "pause_circle",
                                  web: "pause_circle",
                                }
                              : {
                                  ios: "play.circle.fill",
                                  android: "play_circle",
                                  web: "play_circle",
                                }
                          }
                          size={18}
                          tintColor={colors.accent}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {name.meaning ?? name.translation}
                  </ThemedText>
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
});
