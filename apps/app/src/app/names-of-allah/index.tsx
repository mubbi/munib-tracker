import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { nameAudioTrack } from "@/lib/audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

export default function NamesOfAllahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();

  return (
    <ScreenLayout
      eyebrow={t("names.eyebrow")}
      title={t("names.title")}
      subtitle={t("names.subtitle", { count: NAMES_OF_ALLAH.length })}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <View style={styles.grid}>
          {NAMES_OF_ALLAH.map((name, position) => (
            <Card key={name.id} padding="three" style={styles.card}>
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
                    onPress={() => {
                      const track = nameAudioTrack(name);
                      if (track) audio.play([track]);
                    }}
                  >
                    <SymbolView
                      name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
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
          ))}
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  card: {
    flexGrow: 1,
    flexBasis: "47%",
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
