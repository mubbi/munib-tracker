import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { KidsReciteSession } from "@/components/kids/kids-recite-session";
import { KidsSurahPicker } from "@/components/kids/kids-surah-picker";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { UnavailableOnDevice } from "@/components/ui/unavailable-on-device";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { getSurahByNumber } from "@/lib/quran-meta";
import { KIDS_RECITE_SURAHS, parseKidsReciteSurah } from "@/lib/recite-along/kids";
import { wholeSurah } from "@/lib/recite-along/passages";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useCompanionPrefs,
  useCompanionPrefsReady,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import { useEnsureListenerLoaded } from "@/stores/quran-listener-store";

/**
 * Kids recite-along (NF-3.16 + D68): pick one of the curated short surahs (D27),
 * then recite it ayah by ayah with the on-device listener. Lives under `/kids/`
 * so a linked child device stays inside kids mode (`isKidsAllowedPath`). Only
 * surahs from the curated set open — any other `surah` param shows the picker.
 */
export default function KidsReciteScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ surah?: string }>();
  useEnsureCompanionPrefsLoaded();
  const prefsReady = useCompanionPrefsReady();
  const prefs = useCompanionPrefs();
  const available = isPracticeAvailable();
  useEnsureListenerLoaded(prefs.engineChoice, prefsReady && available);

  const surah = parseKidsReciteSurah(params.surah);
  const passage = useMemo(() => (surah != null ? wholeSurah(surah) : null), [surah]);
  const meta = surah != null ? getSurahByNumber(surah) : undefined;
  // "Recite again" remounts the session (fresh marks, fresh listener).
  const [round, setRound] = useState(0);

  const onBack = () => {
    if (passage) router.setParams({ surah: undefined });
    else goBackOrReplace(router, "/kids");
  };

  return (
    <ScreenLayout
      eyebrow={t("kids.eyebrow")}
      title={meta ? meta.nameTransliteration : t("kids.recite.title")}
      subtitle={passage ? undefined : t("kids.recite.subtitle")}
      onBack={onBack}
      maxContentWidth={760}
    >
      <Seo path="/kids/recite" index={false} />
      {!available ? (
        <UnavailableOnDevice description={t("kids.tvUnavailable")} fallbackHref="/kids" />
      ) : passage && prefsReady ? (
        <KidsReciteSession
          key={`${passage.surah}:${round}`}
          passage={passage}
          onAgain={() => setRound((n) => n + 1)}
          onAnother={() => router.setParams({ surah: undefined })}
        />
      ) : passage ? null : (
        <View style={styles.stack}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.recite.intro")}
          </ThemedText>
          <KidsSurahPicker
            surahs={KIDS_RECITE_SURAHS}
            onPick={(n) => router.setParams({ surah: String(n) })}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("kids.recite.privacy")}
          </ThemedText>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids/recite");
