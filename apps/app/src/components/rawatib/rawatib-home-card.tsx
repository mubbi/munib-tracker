import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useRawatibConfig, useTodayRawatibProgress } from "@/hooks/use-rawatib";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { useChevronForward } from "@/lib/rtl";
import { useDayExcused } from "@/stores/tracker-store";

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
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const { done, target } = useTodayRawatibProgress();
  const complete = done >= target;
  const label = t("rawatib.card.progress", { done, total: target });

  return (
    <Card
      accessibilityLabel={`${t("rawatib.card.title")}, ${label}`}
      onPress={() => router.push(TRACKER_HREF)}
    >
      <SectionHeader
        title={t("rawatib.card.title")}
        icon={{ ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" }}
        badge={<SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />}
      />
      <View style={styles.body}>
        <ThemedText
          type="smallBold"
          style={complete ? { color: tokens.status.success.text } : undefined}
        >
          {label}
        </ThemedText>
        <ProgressBar
          value={Math.min(1, done / target)}
          accessibilityLabel={t("rawatib.card.title")}
          color={tokens.status.success.color}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {tTv(t, "rawatib.home.hint", "rawatib.card.hintTv")}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
