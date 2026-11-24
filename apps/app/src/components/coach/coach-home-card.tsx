import type { CoachReport } from "@munib-tracker/shared/types";
import { snoozeCoachWeek } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useCoachReport } from "@/hooks/use-coach-report";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { COACH_ROUTE } from "@/lib/coach/constants";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { useToast } from "@/providers/toast-provider";
import { coachHistoryStore, useCoachHistory } from "@/stores/coach-history-store";

export { COACH_HOME_MODULE } from "@/lib/coach/constants";

/**
 * The weekly reflection on home (NF-3.14) — null while nothing was tracked,
 * after "Hide until next week", when hidden in Customize home, or on TV (the
 * Library entry stays read-only there).
 */
export function useCoachHomeCard(enabled: boolean): CoachReport | null {
  const active = enabled && !isTV();
  const { report } = useCoachReport({ enabled: active });
  const history = useCoachHistory();
  if (!active || !report || report.mode === "quiet") return null;
  if (history.snoozedWeek === report.weekStart) return null;
  return report;
}

export function CoachHomeCard({ report }: { report: CoachReport }) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const title = t("coach.home.title");
  const body = t(report.mode === "excused" ? "coach.home.bodyExcused" : "coach.home.body");
  return (
    <Card padding="three">
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${body}`}
        onPress={() => router.push(COACH_ROUTE as Href)}
      >
        <View style={styles.row}>
          <IconWell
            icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            tint={colors.accent}
            background={tokens.accentSoft}
          />
          <View style={styles.copy}>
            <ThemedText type="smallBold">{title}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {body}
            </ThemedText>
          </View>
          <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
        </View>
      </PressableScale>
      <View style={styles.actions}>
        <Button
          label={t("coach.snooze")}
          size="sm"
          variant="ghost"
          onPress={() => {
            void coachHistoryStore
              .getState()
              .apply((h) => snoozeCoachWeek(h, report.weekStart, new Date().toISOString()));
            toast.info(t("coach.snoozedToast"));
          }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  copy: { flex: 1, gap: 2 },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: Spacing.two },
});
