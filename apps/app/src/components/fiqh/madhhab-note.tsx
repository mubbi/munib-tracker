import { type FiqhDifferenceId, getFiqhDifference } from "@munib-tracker/shared/fiqh";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { RulingCompare } from "@/components/fiqh/ruling-compare";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { otherPositions } from "@/lib/fiqh/position-groups";

const CHEVRON_DOWN = {
  ios: "chevron.down",
  android: "keyboard_arrow_down",
  web: "keyboard_arrow_down",
} as const;

type MadhhabNoteProps = {
  id: FiqhDifferenceId;
  /** Start with the "Other views" disclosure open. */
  defaultExpanded?: boolean;
};

/**
 * One labelled fiqh difference (NF-3.0a). With a school selected for the
 * difference's domain: that school's position + badge, which schools share
 * it, and a collapsed "Other views" disclosure listing only the positions that
 * differ (schools that agree grouped). In all-views mode: `<RulingCompare>`.
 * The selected view is never presented as the only valid one.
 */
export function MadhhabNote({ id, defaultExpanded = false }: MadhhabNoteProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { schoolFor } = useMadhhab();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const diff = getFiqhDifference(id);
  const school = schoolFor(diff.domain);

  if (school == null) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.header}>
          <ThemedText type="smallBold" heading={4} style={styles.title}>
            {t(diff.titleKey)}
          </ThemedText>
          <MadhhabBadge school={null} />
        </View>
        <RulingCompare id={id} hideTitle />
      </View>
    );
  }

  const { sameView, differing } = otherPositions(diff, school);
  const inMajority = diff.majority?.includes(school) ?? false;
  const schoolNames = (ids: readonly string[]) =>
    ids.map((other) => t(`fiqh.school.${other}`)).join(" · ");
  const otherViewsLabel = t("fiqh.note.otherViews", { total: differing.length });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.header}>
        <ThemedText type="smallBold" heading={4} style={styles.title}>
          {t(diff.titleKey)}
        </ThemedText>
        <MadhhabBadge school={school} />
      </View>
      <ThemedText type="small">{t(diff.positions[school].summaryKey)}</ThemedText>
      {inMajority ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fiqh.note.majority")}
        </ThemedText>
      ) : sameView.length > 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fiqh.note.sameView", { schools: schoolNames(sameView) })}
        </ThemedText>
      ) : null}
      {differing.length > 0 ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={expanded ? t("fiqh.note.hideOtherViews") : otherViewsLabel}
          onPress={() => setExpanded((open) => !open)}
          scaleTo={0.98}
          style={styles.toggle}
        >
          <ThemedText type="label" style={{ color: colors.accentText }}>
            {expanded ? t("fiqh.note.hideOtherViews") : otherViewsLabel}
          </ThemedText>
          <SymbolView
            name={CHEVRON_DOWN}
            size={14}
            tintColor={colors.accentText}
            style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
          />
        </PressableScale>
      ) : null}
      {expanded && differing.length > 0 ? (
        <View style={styles.others}>
          {differing.map((group) => {
            const names = schoolNames(group.schools);
            const position = t(group.summaryKey);
            return (
              <View
                key={group.summaryKey}
                accessible
                accessibilityLabel={t("fiqh.note.positionA11y", { school: names, position })}
                style={[styles.otherRow, { borderColor: colors.border }]}
              >
                <ThemedText type="label">{names}</ThemedText>
                <ThemedText type="small" themeColor="mutedForeground">
                  {position}
                </ThemedText>
              </View>
            );
          })}
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("fiqh.note.validViews")}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  header: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  title: { flexShrink: 1, flexGrow: 1 },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one,
    paddingVertical: Spacing.one,
  },
  others: { gap: Spacing.two },
  otherRow: { gap: Spacing.half, paddingStart: Spacing.three, borderStartWidth: 2 },
});
