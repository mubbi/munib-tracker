import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahBody, JannahTakeaway } from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { ZAKAT_TOPIC_ICONS } from "@/components/zakat/zakat-guide-icons";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ZakatTopicContentProps = {
  topicId: ZakatGuideSectionKey;
};

const ZAKAT_RECIPIENT_IDS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;

export function ZakatTopicContent({ topicId }: ZakatTopicContentProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const body = t(`zakat.guide.${topicId}.body`);
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <>
      <JannahTakeaway text={t(`zakat.guide.${topicId}.summary`)} />

      <Card padding="three">
        <View style={styles.headerBlock}>
          <SectionHeader
            title={t(`zakat.guide.${topicId}.title`)}
            icon={ZAKAT_TOPIC_ICONS[topicId]}
          />
          {topicId === "basics" ? (
            <Pill
              label={t("zakat.pillarBadge")}
              compact
              color={tokens.status.success.color}
              background={tokens.status.success.soft}
            />
          ) : null}
        </View>
        <JannahBody paragraphs={paragraphs.length > 0 ? paragraphs : [body]} />
      </Card>

      {topicId === "nisab" ? (
        <Card padding="three">
          <SectionHeader
            title={t("zakat.nisabWeightsTitle")}
            icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
          />
          <View style={styles.weightTable}>
            <ThemedText type="small">{t("zakat.nisabWeightGold")}</ThemedText>
            <ThemedText type="small">{t("zakat.nisabWeightSilver")}</ThemedText>
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.weightNote}>
            {t("zakat.nisabWeightNote")}
          </ThemedText>
        </Card>
      ) : null}

      {topicId === "recipients" ? (
        <Card padding="three">
          <SectionHeader
            title={t("zakat.recipientsListTitle")}
            icon={{
              ios: "list.bullet",
              android: "format_list_bulleted",
              web: "format_list_bulleted",
            }}
          />
          <View style={styles.recipientList}>
            {ZAKAT_RECIPIENT_IDS.map((recipientId) => (
              <View
                key={recipientId}
                style={[styles.recipientItem, { borderLeftColor: colors.accent }]}
              >
                <ThemedText type="smallBold">
                  {t(`zakat.recipients.${recipientId}.title`)}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t(`zakat.recipients.${recipientId}.body`)}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: { gap: Spacing.two },
  weightTable: { gap: Spacing.two, marginTop: Spacing.three },
  weightNote: { marginTop: Spacing.two, lineHeight: 18 },
  recipientList: { gap: Spacing.three, marginTop: Spacing.three },
  recipientItem: {
    borderLeftWidth: 3,
    paddingStart: Spacing.three,
    gap: Spacing.half,
  },
});
