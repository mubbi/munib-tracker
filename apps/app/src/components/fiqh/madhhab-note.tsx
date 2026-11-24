import { type FiqhDifferenceId, getFiqhDifference, otherSchools } from "@munib-tracker/shared/fiqh";
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
 * difference's domain: that school's position + badge, and a collapsed
 * "Other views (3)" disclosure. In all-views mode: `<RulingCompare>`.
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
        <MadhhabBadge school={null} />
        <RulingCompare id={id} />
      </View>
    );
  }

  const others = otherSchools(school);
  const inMajority = diff.majority?.includes(school) ?? false;

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
      ) : null}
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={
          expanded
            ? t("fiqh.note.hideOtherViews")
            : t("fiqh.note.otherViews", { total: others.length })
        }
        onPress={() => setExpanded((open) => !open)}
        scaleTo={0.98}
        style={styles.toggle}
      >
        <ThemedText type="label" style={{ color: colors.accentText }}>
          {expanded
            ? t("fiqh.note.hideOtherViews")
            : t("fiqh.note.otherViews", { total: others.length })}
        </ThemedText>
        <SymbolView
          name={CHEVRON_DOWN}
          size={14}
          tintColor={colors.accentText}
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        />
      </PressableScale>
      {expanded ? (
        <View style={styles.others}>
          {others.map((other) => {
            const name = t(`fiqh.school.${other}`);
            const position = t(diff.positions[other].summaryKey);
            return (
              <View
                key={other}
                accessible
                accessibilityLabel={t("fiqh.note.positionA11y", { school: name, position })}
                style={[styles.otherRow, { borderColor: colors.border }]}
              >
                <ThemedText type="label">{name}</ThemedText>
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
