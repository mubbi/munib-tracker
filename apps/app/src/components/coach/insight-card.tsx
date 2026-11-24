import type { CoachInsight } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContentInlineLink } from "@/components/content/content-inline-link";
import { evidenceHref } from "@/components/self-review/evidence-links";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  coachActionHref,
  coachEvidenceRef,
  coachInsightBody,
  coachInsightTitle,
  isCoachActionAvailable,
} from "@/lib/coach/coach-ui";
import { isTV } from "@/lib/platform/is-tv";

const KIND_ICON: Record<CoachInsight["kind"], SymbolViewProps["name"]> = {
  celebrate: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  suggest: { ios: "leaf.fill", android: "eco", web: "eco" },
  plan: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
};

/** Rules the user can't hide (the rest message and the fallback celebration). */
const UNHIDEABLE = new Set<CoachInsight["ruleId"]>(["excused_week", "showed_up"]);

/**
 * One weekly-coach insight: kind, title, gentle body (counts like "4 of 7",
 * never a failure percentage), an optional action, an evidence ref by
 * reference only, and "Hide tips like this". TV is read-only.
 */
export function CoachInsightCard({
  insight,
  values,
  onHide,
}: {
  insight: CoachInsight;
  /** Interpolation values (`coachCopyParams`). */
  values: Record<string, string | number>;
  onHide?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const title = coachInsightTitle(insight, t, values);
  const body = coachInsightBody(insight, t, values);
  const href = isCoachActionAvailable(insight, tv) ? coachActionHref(insight) : null;
  const evidence = insight.evidenceRef ? coachEvidenceRef(insight.evidenceRef) : null;
  const tint = insight.kind === "celebrate" ? colors.accent : tokens.status.info.color;

  return (
    <Card padding="three" accessibilityLabel={`${title}. ${body}`}>
      <View style={styles.row}>
        <IconWell icon={KIND_ICON[insight.kind]} tint={tint} background={tokens.accentSoft} />
        <View style={styles.copy}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(`coach.kind.${insight.kind}`)}
          </ThemedText>
          <ThemedText type="smallBold">{title}</ThemedText>
        </View>
      </View>
      <ThemedText type="small" style={styles.body}>
        {body}
      </ThemedText>
      {evidence ? (
        <ContentInlineLink
          label={t(evidence.labelKey)}
          accessibilityLabel={`${t("coach.evidence")}: ${t(evidence.labelKey)}`}
          onPress={() => router.push(evidenceHref(evidence))}
        />
      ) : null}
      {href || (onHide && !tv && !UNHIDEABLE.has(insight.ruleId)) ? (
        <View style={styles.actions}>
          {href && insight.action ? (
            <Button
              label={t(insight.action.labelKey)}
              size="sm"
              variant="secondary"
              onPress={() => router.push(href)}
            />
          ) : null}
          {onHide && !tv && !UNHIDEABLE.has(insight.ruleId) ? (
            <Button label={t("coach.hideRule")} size="sm" variant="ghost" onPress={onHide} />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  copy: { flex: 1, gap: 2 },
  body: { marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
