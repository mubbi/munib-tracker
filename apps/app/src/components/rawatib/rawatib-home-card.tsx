import { RAWATIB_PRAYERS } from "@munib-tracker/shared/constants";
import { rakahsForLog } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useRawatibConfig } from "@/hooks/use-rawatib";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useDayExcused, usePrayerRakahsMap, useTodayPrayers } from "@/stores/tracker-store";

const TRACKER_HREF = "/tracker?focus=rawatib" as Href;

/** Whether the optional home module (`rawatib-progress`) has anything to show. */
export function useRawatibHomeVisible(): boolean {
  const config = useRawatibConfig();
  const excused = useDayExcused();
  return config.enabled && excused !== "hayd" && (excused as string | null) !== "nifas";
}

/** Home module `rawatib-progress` (NF-3.1): today's rakahs toward 12 / 10. */
export function RawatibHomeCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const config = useRawatibConfig();
  const { status } = useTodayPrayers();
  const rakahs = usePrayerRakahsMap();
  const done = RAWATIB_PRAYERS.reduce(
    (sum, id) =>
      status[id] === "completed"
        ? sum + rakahsForLog({ rakahs: rakahs[id] }, id, config.preset)
        : sum,
    0,
  );
  const target = config.preset;
  const label = t("rawatib.card.progress", { done, total: target });

  return (
    <PressableScale
      haptic="light"
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={`${t("rawatib.card.title")}, ${label}`}
      onPress={() => router.push(TRACKER_HREF)}
    >
      <Card padding="three">
        <SectionHeader
          title={t("rawatib.card.title")}
          icon={{ ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" }}
        />
        <View style={styles.body}>
          <ThemedText type="smallBold">{label}</ThemedText>
          <ProgressBar value={Math.min(1, done / target)} color={tokens.status.success.color} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("rawatib.home.hint")}
          </ThemedText>
        </View>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
