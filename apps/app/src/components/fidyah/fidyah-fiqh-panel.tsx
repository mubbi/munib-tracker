import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FoodMeasureRulingView } from "@/components/fidyah/food-measure-ruling";
import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { fidyahMeasureFor, kaffarahTriggerKey, schoolsToShow } from "@/lib/fasting-fiqh";
import type { FidyahScenario } from "@/lib/fidyah";

type FidyahFiqhPanelProps = {
  scenario: FidyahScenario;
  /** Poor people to feed (fidyah: one per day; kaffarah: 60 per unit). 0 = no input yet. */
  people: number;
};

/** "What does each school say?" for the kaffarah helper: what triggers kaffarah. */
export function KaffarahTriggers({ school }: { school: MadhhabId | null }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={styles.triggers}>
      {schoolsToShow(school).map((s) => (
        <View
          key={s}
          style={school == null ? [styles.schoolRow, { borderColor: colors.border }] : undefined}
        >
          {school == null ? <ThemedText type="label">{t(`fiqh.school.${s}`)}</ThemedText> : null}
          <ThemedText type="small">{t(`fidyah.fiqh.trigger.${kaffarahTriggerKey(s)}`)}</ThemedText>
        </View>
      ))}
    </View>
  );
}

/**
 * School-aware part of the fidyah / kaffarah helper (NF-3.0a retrofit): the
 * food measure per poor person, cash vs food only, and — for kaffarah — what
 * triggers it. All-views mode lists every school; nothing is picked silently.
 */
export function FidyahFiqhPanel({ scenario, people }: FidyahFiqhPanelProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { resolve } = useMadhhab();
  const { school, customKeys } = resolve("fasting");

  return (
    <View style={[styles.root, { borderTopColor: colors.border }]}>
      <View style={styles.header}>
        <ThemedText type="smallBold" heading={4} style={styles.title}>
          {t("fidyah.fiqh.perPersonTitle")}
        </ThemedText>
        <MadhhabBadge school={school} custom={customKeys.length > 0} />
      </View>
      {people > 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fidyah.fiqh.perPerson", { people })}
        </ThemedText>
      ) : null}
      {school == null ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fidyah.fiqh.allViewsHint")}
        </ThemedText>
      ) : null}
      <FoodMeasureRulingView
        school={school}
        rulingFor={fidyahMeasureFor}
        noteFor={(s) =>
          scenario === "fidyah" && fidyahMeasureFor(s).elderlyFidyahRecommendedOnly
            ? t("fidyah.fiqh.malikiElderly")
            : null
        }
      />
      {scenario === "kaffarah" ? (
        <View style={styles.section}>
          <ThemedText type="smallBold" heading={4}>
            {t("fidyah.fiqh.kaffarahTitle")}
          </ThemedText>
          <KaffarahTriggers school={school} />
          <MadhhabNote id="fasting.kaffarah" />
        </View>
      ) : (
        <MadhhabNote id="fidyah.measure" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  title: { flexShrink: 1, flexGrow: 1 },
  section: { gap: Spacing.two, marginTop: Spacing.two },
  triggers: { gap: Spacing.two },
  schoolRow: { gap: Spacing.half, paddingStart: Spacing.two, borderStartWidth: 2 },
});
