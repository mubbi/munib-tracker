import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const MADHHAB_ROWS = ["hanafi", "shafii", "maliki", "hanbali"] as const;

/** Expandable fiqh note — Witr qaza rulings differ by madhhab. */
export function WitrQazaInfo() {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const info = tokens.status.info;
  const [open, setOpen] = useState(false);
  const title = t("qaza.witrNote.title");

  return (
    <Card
      padding="three"
      onPress={() => setOpen((value) => !value)}
      accessibilityLabel={title}
      accessibilityState={{ expanded: open }}
      style={{
        backgroundColor: info.soft,
        borderColor: info.border,
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <CollapsibleSection
        pressableArea="none"
        open={open}
        title={title}
        icon={{ ios: "info.circle.fill", android: "info", web: "info" }}
      >
        <View style={styles.body}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qaza.witrNote.intro")}
          </ThemedText>

          <ThemedText type="smallBold">{t("qaza.witrNote.hanafiTitle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qaza.witrNote.hanafiBody")}
          </ThemedText>

          <ThemedText type="smallBold">{t("qaza.witrNote.othersTitle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qaza.witrNote.othersBody")}
          </ThemedText>

          <ThemedText type="smallBold">{t("qaza.witrNote.evidenceTitle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qaza.witrNote.evidenceBody")}
          </ThemedText>

          <View style={[styles.table, { borderColor: info.border, backgroundColor: info.soft }]}>
            <ThemedText type="caption" style={{ color: info.text }}>
              {t("qaza.witrNote.tableHeader")}
            </ThemedText>
            {MADHHAB_ROWS.map((row) => (
              <ThemedText key={row} type="caption" themeColor="mutedForeground">
                {t(`qaza.witrNote.rows.${row}`)}
              </ThemedText>
            ))}
          </View>

          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qaza.witrNote.footer")}
          </ThemedText>
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
  table: {
    gap: Spacing.one + 2,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
