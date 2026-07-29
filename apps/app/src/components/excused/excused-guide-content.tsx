import { EXCUSED_GUIDES } from "@munib-tracker/shared/content/excused-guide";
import type { ExcusedReason, JannahHadithRef } from "@munib-tracker/shared/types";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { HadithCitationBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahBody } from "@/components/jannah/primitives";
import { useRegisterLearnListenText } from "@/components/learn-tts-context";
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useDayExcused, useTrackerActions } from "@/stores/tracker-store";

type ExcusedGuideContentProps = {
  reason: ExcusedReason;
};

const EXTRA_SECTION_ICONS: Record<string, SymbolViewProps["name"]> = {
  qasr: { ios: "arrow.down.right.and.arrow.up.left", android: "compress", web: "compress" },
  jam: { ios: "arrow.triangle.merge", android: "merge", web: "merge" },
  when: { ios: "location.circle.fill", android: "my_location", web: "my_location" },
  duration: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  istihada: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  nifas: { ios: "heart.fill", android: "favorite", web: "favorite" },
  purity: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  positions: { ios: "figure.stand", android: "accessibility", web: "accessibility" },
  rukuSujud: { ios: "arrow.down", android: "south", web: "south" },
  unable: { ios: "bed.double.fill", android: "hotel", web: "hotel" },
  fastingQaza: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
};

export function ExcusedGuideContent({ reason }: ExcusedGuideContentProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const config = EXCUSED_GUIDES[reason];
  const ns = config.namespace;
  const excusedReason = useDayExcused();
  const { setDayExcused } = useTrackerActions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isActive = excusedReason === reason;

  const hadithRefs = useMemo((): JannahHadithRef[] => {
    return config.hadith.map((ref, index) => ({
      ...ref,
      excerpt: t(`${ns}.hadith.${index}.excerpt`),
    }));
  }, [config.hadith, ns, t]);

  const obligations = useMemo(
    () =>
      Array.from({ length: config.obligationCount }, (_, index) => t(`${ns}.obligations.${index}`)),
    [config.obligationCount, ns, t],
  );
  const listenExtras = useMemo(
    () => [...hadithRefs.map((ref) => ref.excerpt), ...obligations],
    [hadithRefs, obligations],
  );
  useRegisterLearnListenText(listenExtras);

  const handleMarkExcused = () => {
    void setDayExcused(reason);
    setConfirmOpen(false);
  };

  return (
    <>
      <Stagger>
        {isActive ? (
          <Button
            label={t(`${ns}.clearExcused`)}
            variant="secondary"
            fullWidth
            onPress={() => void setDayExcused(null)}
          />
        ) : (
          <Button label={t(`${ns}.markExcused`)} fullWidth onPress={() => setConfirmOpen(true)} />
        )}

        <Card padding="three">
          <SectionHeader
            title={t(`${ns}.hadithTitle`)}
            icon={{ ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" }}
          />
          <View style={styles.evidenceList}>
            {hadithRefs.map((ref, index) => (
              <View
                key={`${ref.collection}-${ref.citation}`}
                style={[styles.hadithQuote, { backgroundColor: colors.muted }]}
              >
                <View style={styles.hadithMeta}>
                  <ThemedText
                    type="caption"
                    style={{ color: colors.accent, flex: 1, flexShrink: 1, minWidth: 0 }}
                  >
                    {t(`${ns}.hadith.${index}.reference`)}
                  </ThemedText>
                  <View style={styles.hadithMetaActions}>
                    {ref.grade ? (
                      <Pill
                        label={t(`jannah.grade.${ref.grade}`)}
                        compact
                        color={tokens.status.success.color}
                        background={tokens.status.success.soft}
                      />
                    ) : null}
                    <HadithCitationBookmarkButton
                      collection={ref.collection}
                      citation={ref.citation}
                    />
                  </View>
                </View>
                <LearnProseText themeColor="mutedForeground" style={styles.quoteText}>
                  “{ref.excerpt}”
                </LearnProseText>
              </View>
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t(`${ns}.obligationsTitle`)}
            icon={{
              ios: "checklist",
              android: "checklist",
              web: "checklist",
            }}
          />
          <View style={styles.steps}>
            {obligations.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={[styles.stepBadge, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {index + 1}
                  </ThemedText>
                </View>
                <LearnProseText themeColor="mutedForeground" style={styles.stepText}>
                  {step}
                </LearnProseText>
              </View>
            ))}
          </View>
        </Card>

        {config.extraSections?.map((sectionKey) => (
          <Card key={sectionKey} padding="three">
            <SectionHeader
              title={t(`${ns}.${sectionKey}.title`)}
              icon={
                EXTRA_SECTION_ICONS[sectionKey] ?? {
                  ios: "info.circle",
                  android: "info",
                  web: "info",
                }
              }
            />
            <View style={styles.sectionBody}>
              <JannahBody
                uniform
                paragraphs={t(`${ns}.${sectionKey}.body`).split("\n\n").filter(Boolean)}
              />
            </View>
          </Card>
        ))}

        <View style={[styles.disclaimer, { backgroundColor: tokens.status.info.soft }]}>
          <SymbolView
            name={{ ios: "info.circle.fill", android: "info", web: "info" }}
            size={16}
            tintColor={tokens.status.info.color}
          />
          <ThemedText type="caption" style={[styles.disclaimerText, { color: colors.foreground }]}>
            {t(`${ns}.disclaimer`)}
          </ThemedText>
        </View>
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title={t("tracker.excusedConfirmTitle")}
        message={t("tracker.excusedConfirmMsg", {
          reason: t(`tracker.excusedReason.${reason}`),
        })}
        confirmLabel={t("tracker.excusedConfirmAction")}
        onConfirm={handleMarkExcused}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  evidenceList: { gap: Spacing.three, marginTop: Spacing.three },
  hadithQuote: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.two,
    alignSelf: "stretch",
  },
  hadithMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  hadithMetaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  quoteText: { flexShrink: 1, alignSelf: "stretch" },
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { flex: 1, minWidth: 0 },
  sectionBody: { marginTop: Spacing.two, width: "100%", alignSelf: "stretch" },
  disclaimer: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
    padding: Spacing.three,
    borderRadius: 14,
    borderCurve: "continuous",
  },
  disclaimerText: { flex: 1, lineHeight: 18 },
});
