import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { SalahGuideTopicContent } from "@/components/salah-guide/topic-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ADHAN_LEARN_STYLES, adhanTrack } from "@/lib/adhan-audio";
import { prefetchAudioUri } from "@/lib/audio-cache";
import { goBackOrReplace } from "@/lib/navigation";
import { getSalahGuideTopic } from "@/lib/salah-guide";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useEnsureSalahGuideProgressLoaded } from "@/stores/salah-guide-progress-store";

const TOPIC = getSalahGuideTopic("adhan");
const SOURCE_HREF = "/salah-guide/adhan";

function AdhanStyleRow({
  styleId,
  name,
  location,
  credit,
  uri,
}: {
  styleId: string;
  name: string;
  location: string;
  credit: string;
  uri?: string;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const trackId = `adhan:${styleId}`;
  const isActive = audio.current?.id === trackId;
  const isPlaying = isActive && audio.isPlaying;

  useEffect(() => {
    if (uri) prefetchAudioUri(uri);
  }, [uri]);

  const onPress = useCallback(() => {
    if (isActive) {
      audio.toggle();
      return;
    }
    audio.play([adhanTrack(styleId)], 0, { sourceHref: SOURCE_HREF });
  }, [audio, isActive, styleId]);

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={
        isPlaying ? t("salahGuide.adhan.pause", { name }) : t("salahGuide.adhan.play", { name })
      }
      onPress={onPress}
      style={[styles.styleRow, { backgroundColor: colors.muted }]}
    >
      <IconWell
        icon={
          isPlaying
            ? { ios: "pause.fill", android: "pause", web: "pause" }
            : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
        }
        tint={isActive ? colors.accent : colors.mutedForeground}
        background={isActive ? tokens.accentSoft : colors.card}
      />
      <View style={styles.styleCopy}>
        <ThemedText type="smallBold">{name}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {location}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.credit}>
          {credit}
        </ThemedText>
      </View>
      {isPlaying ? (
        <SymbolView
          name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          size={18}
          tintColor={colors.accent}
        />
      ) : null}
    </PressableScale>
  );
}

export default function SalahGuideAdhanScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  useEnsureSalahGuideProgressLoaded();

  if (!TOPIC) {
    return null;
  }

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={TOPIC.title}
      subtitle={TOPIC.summary}
      onBack={() => goBackOrReplace(router, "/salah-guide")}
    >
      <Seo path="/salah-guide/adhan" />
      <Stagger>
        <LearnReadingChrome surface="salah_guide">
          <Card padding="three">
            <SectionHeader
              title={t("salahGuide.adhan.listenTitle")}
              icon={{ ios: "speaker.wave.3.fill", android: "campaign", web: "campaign" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.listenHint}>
              {t("salahGuide.adhan.listenHint")}
            </ThemedText>
            <View style={styles.styles}>
              {ADHAN_LEARN_STYLES.map((style) => (
                <AdhanStyleRow
                  key={style.id}
                  styleId={style.id}
                  name={style.name}
                  location={style.location}
                  credit={style.credit}
                  uri={style.uri}
                />
              ))}
            </View>
            <View style={[styles.sourceNote, { backgroundColor: tokens.status.info.soft }]}>
              <ThemedText type="caption" style={styles.sourceText}>
                {t("salahGuide.adhan.sourceNote")}
              </ThemedText>
            </View>
          </Card>

          <SalahGuideTopicContent topic={TOPIC} />
        </LearnReadingChrome>
        <JannahDisclaimer textKey="salahGuide.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listenHint: { marginTop: Spacing.one, lineHeight: 20 },
  styles: { gap: Spacing.two, marginTop: Spacing.three },
  styleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  styleCopy: { flex: 1, gap: 2 },
  credit: { fontStyle: "italic", lineHeight: 16 },
  sourceNote: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  sourceText: { lineHeight: 18 },
});
