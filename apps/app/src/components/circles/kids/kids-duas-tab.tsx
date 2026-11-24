import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleLoading } from "@/components/circles/query-state";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { contentAudioTrack } from "@/lib/audio-tracks";
import { pickKidsDuaList } from "@/lib/circles/kids-content";
import { DUA_CORPUS } from "@/lib/content-loaders";
import { resolveTranslationField } from "@/lib/translation-locale";
import { ZIKR_CORPUS } from "@/lib/zikr";
import { useAudioPlayerContext } from "@/providers/audio-player-context";
import { usePreferences } from "@/stores/preferences-store";

/** Kids Duas tab: curated daily duas and adhkar from the bundled datasets (D27), existing audio only. */
export function KidsDuasTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const prefs = usePreferences();
  const { play } = useAudioPlayerContext();
  // A failed load settles empty, so the tab never shows "Loading…" forever.
  const duas = useContentCorpus(DUA_CORPUS);
  const adhkar = useContentCorpus(ZIKR_CORPUS);
  const ready = duas.ready && adhkar.ready;
  const items = useMemo(
    () => (ready ? pickKidsDuaList(duas.items, adhkar.items) : null),
    [ready, duas.items, adhkar.items],
  );

  if (!items) return <CircleLoading />;

  return (
    <View style={styles.stack}>
      {items.map(({ kind, item }) => {
        const track = contentAudioTrack(item);
        return (
          // The open target and "Listen" are siblings: RN Web renders every
          // pressable as a <button>, and a button inside a button breaks clicks.
          <Card key={`${kind}:${item.id}`} padding="three" style={styles.gap}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={item.title}
              scaleTo={0.985}
              haptic="light"
              style={styles.gap}
              onPress={() =>
                router.push(
                  kind === "dua"
                    ? { pathname: "/dua/detail/[id]", params: { id: item.id } }
                    : { pathname: "/zikr/detail/[id]", params: { id: item.id } },
                )
              }
            >
              <ThemedText type="smallBold">{item.title}</ThemedText>
              <ThemedText type="arabic" style={styles.arabic}>
                {item.arabic}
              </ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {resolveTranslationField(item, prefs)}
              </ThemedText>
            </PressableScale>
            {track ? (
              <Button
                label={t("kids.duas.listen")}
                variant="secondary"
                size="sm"
                icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
                onPress={() => play([track])}
              />
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  arabic: { textAlign: "right", writingDirection: "rtl" },
});
