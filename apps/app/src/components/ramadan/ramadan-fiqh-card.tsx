import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { KaffarahTriggers } from "@/components/fidyah/fidyah-fiqh-panel";
import { FoodMeasureRulingView } from "@/components/fidyah/food-measure-ruling";
import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { fitrMeasureFor, forgetfulEatingOutcome, schoolsToShow } from "@/lib/fasting-fiqh";

const ICONS = {
  header: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
  forgetful: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  kaffarah: {
    ios: "exclamationmark.triangle.fill",
    android: "warning",
    web: "warning",
  },
  fitr: { ios: "gift.fill", android: "redeem", web: "redeem" },
  tarawih: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
} as const;

/** "I ate or drank forgetfully" — a one-tap answer for the user's school (or every school). */
function ForgetfulEatingHelper() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { schoolFor } = useMadhhab();
  const school = schoolFor("fasting");
  const [asked, setAsked] = useState(false);

  return (
    <View style={styles.section}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("ramadan.fiqh.forgetful.hint")}
      </ThemedText>
      {asked ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.answer, { backgroundColor: tokens.status.info.soft }]}
        >
          {schoolsToShow(school).map((s) => {
            const outcome = forgetfulEatingOutcome(s);
            return (
              <View
                key={s}
                style={school == null ? [styles.schoolRow, { borderColor: colors.border }] : null}
              >
                {school == null ? (
                  <ThemedText type="label">{t(`fiqh.school.${s}`)}</ThemedText>
                ) : null}
                <ThemedText type="small">
                  {outcome === "valid"
                    ? t("ramadan.fiqh.forgetful.valid")
                    : t("ramadan.fiqh.forgetful.makeUp")}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ) : (
        <Button
          label={t("ramadan.fiqh.forgetful.button")}
          variant="secondary"
          size="sm"
          onPress={() => setAsked(true)}
          style={styles.button}
        />
      )}
      <MadhhabNote id="fasting.forgetfulEating" />
    </View>
  );
}

/**
 * Ramadan-mode fiqh card (NF-3.0a retrofit, plan §4.1.4): forgetful eating,
 * what triggers kaffarah, sadaqat al-fitr per school (cash vs food) and the
 * tarawih note. Reads the "fasting" domain; all-views lists every school.
 */
export function RamadanFiqhCard() {
  const { t } = useTranslation();
  const { resolve } = useMadhhab();
  const { school, customKeys } = resolve("fasting");

  return (
    <Card>
      <SectionHeader title={t("ramadan.fiqh.title")} icon={ICONS.header} />
      <View style={styles.badgeRow}>
        <MadhhabBadge school={school} custom={customKeys.length > 0} />
      </View>

      <View style={styles.stack}>
        <CollapsibleSection title={t("ramadan.fiqh.forgetful.title")} icon={ICONS.forgetful}>
          <ForgetfulEatingHelper />
        </CollapsibleSection>

        <CollapsibleSection title={t("ramadan.fiqh.kaffarah.title")} icon={ICONS.kaffarah}>
          <View style={styles.section}>
            <KaffarahTriggers school={school} />
            <MadhhabNote id="fasting.kaffarah" />
          </View>
        </CollapsibleSection>

        <CollapsibleSection title={t("ramadan.fiqh.fitr.title")} icon={ICONS.fitr}>
          <View style={styles.section}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("ramadan.fiqh.fitr.perPerson")}
            </ThemedText>
            <FoodMeasureRulingView school={school} rulingFor={fitrMeasureFor} />
            <MadhhabNote id="fitr.measure" />
          </View>
        </CollapsibleSection>

        <CollapsibleSection title={t("ramadan.fiqh.tarawih.title")} icon={ICONS.tarawih}>
          <View style={styles.section}>
            <MadhhabNote id="tarawih.rakahs" />
          </View>
        </CollapsibleSection>
      </View>

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
        {t("fiqh.disclaimer")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: "row", marginTop: Spacing.two },
  stack: { gap: Spacing.two, marginTop: Spacing.two },
  section: { gap: Spacing.two, marginTop: Spacing.two },
  answer: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.md },
  schoolRow: { gap: Spacing.half, paddingStart: Spacing.two, borderStartWidth: BorderWidth.thick },
  button: { alignSelf: "flex-start" },
  disclaimer: { marginTop: Spacing.three },
});
