import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { HadithExcerptCard } from "@/components/hadith/hadith-excerpt-card";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { useWitrQaza } from "@/hooks/use-rawatib";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { setWitrQazaPreference } from "@/lib/rawatib";

/** Abu Dawud 1431 — "whoever oversleeps or forgets Witr, let him pray it when he remembers" (graders differ). */
export const WITR_MAKEUP_HADITH_ID = "abudawud:1431";

/**
 * Witr info sheet (§4.1.4 retrofit). The ruling, the form and the make-up rule
 * follow the user's school (`MadhhabNote`: own view + other views, or all four
 * side by side with no school chosen). The qaza toggle defaults to the school
 * (on only for Hanafi) and the user can opt in or out.
 */
export function WitrQazaInfo() {
  const { t } = useTranslation();
  const { tokens, colors } = useThemeTokens();
  const info = tokens.status.info;
  const [open, setOpen] = useState(false);
  const witrQaza = useWitrQaza();
  const tv = isTV();

  return (
    <Card
      padding="three"
      style={{
        backgroundColor: info.soft,
        borderColor: info.border,
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <CollapsibleSection
        open={open}
        onOpenChange={setOpen}
        title={t("qaza.witrNote.title")}
        icon={{ ios: "info.circle.fill", android: "info", web: "info" }}
      >
        <View style={styles.body}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qaza.witrNote.intro")}
          </ThemedText>

          <MadhhabNote id="witr.status" />
          <MadhhabNote id="witr.form" />
          <MadhhabNote id="witr.qaza" />

          <View
            style={[
              styles.toggleRow,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.toggleCopy}>
              <ThemedText type="smallBold">{t("rawatib.witr.qazaToggle")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {witrQaza.schoolDefault
                  ? t("rawatib.witr.qazaDefaultOn")
                  : t("rawatib.witr.qazaDefaultOff")}
              </ThemedText>
            </View>
            {tv ? (
              <ThemedText type="smallBold">
                {witrQaza.enabled ? t("rawatib.witr.on") : t("rawatib.witr.off")}
              </ThemedText>
            ) : (
              <ThemedSwitch
                value={witrQaza.enabled}
                accessibilityLabel={t("rawatib.witr.qazaToggle")}
                onValueChange={(next) =>
                  void setWitrQazaPreference(next === witrQaza.schoolDefault ? null : next)
                }
              />
            )}
          </View>

          <ThemedText type="smallBold">{t("qaza.witrNote.evidenceTitle")}</ThemedText>
          {open ? <HadithExcerptCard hadithId={WITR_MAKEUP_HADITH_ID} /> : null}

          <View style={[styles.footer, { borderColor: info.border }]}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("fiqh.disclaimer")}
            </ThemedText>
          </View>
        </View>
      </CollapsibleSection>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two + 2,
    marginTop: Spacing.two,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  toggleCopy: {
    flex: 1,
    gap: 2,
  },
  footer: {
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
